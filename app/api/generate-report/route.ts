import { NextRequest, NextResponse } from "next/server";
import { getUserMemories } from "../../../lib/memwal";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    // Get all memories
    const memoriesResult = await getUserMemories(userId, "all takes opinions predictions");
    const memories = memoriesResult.map((m: any) => m.text).filter(Boolean);

    // Get profile analysis
    const memoriesContext = memories.map((m: string, i: number) => `${i + 1}. "${m}"`).join("\n");

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are a football psychology analyst. Generate a detailed report. Return ONLY valid JSON, no markdown.",
        },
        {
          role: "user",
          content: `Generate a detailed football psychology report for ${userId} based on these takes:\n\n${memoriesContext}\n\nReturn JSON with: archetype, archetypeEmoji, roastLine, biases (array of {name, percentage}), contradictionCount, takesCount, confidenceScore, summary (2-3 sentence analysis), topTake (their most revealing take), recommendation (one piece of advice)`,
        },
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    const raw = response.choices[0]?.message?.content ?? "{}";
    const cleaned = raw.replace(/```json/g, "").replace(/```/g, "").trim();
    const profile = JSON.parse(cleaned);

    // Store report on Walrus blob storage directly
    const reportData = {
      userId,
      generatedAt: new Date().toISOString(),
      profile,
      memories: memories.length,
    };

    const reportJson = JSON.stringify(reportData);

    // Upload to Walrus publisher
    const walrusResponse = await fetch('https://publisher.walrus-testnet.walrus.space/v1/store?epochs=5', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: reportJson,
    });

    let blobId = null
    if (walrusResponse.ok) {
      const walrusData = await walrusResponse.json()
      blobId = walrusData?.newlyCreated?.blobObject?.blobId ||
               walrusData?.alreadyCertified?.blobId ||
               null
    }

    return NextResponse.json({
      success: true,
      profile,
      blobId,
      walrusUrl: blobId ? `https://aggregator.walrus-testnet.walrus.space/v1/${blobId}` : null,
      explorerUrl: blobId ? `https://walruscan.com/testnet/blob/${blobId}` : null,
    });

  } catch (error: any) {
    console.error("generate-report error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}