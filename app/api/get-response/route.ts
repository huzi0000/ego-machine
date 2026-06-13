import { NextRequest, NextResponse } from "next/server";
import { getUserMemories } from "../../../lib/memwal";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");
    const match = req.nextUrl.searchParams.get("match") || "upcoming match";

    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    const memoriesResult = await getUserMemories(userId, "all past takes predictions opinions patterns");
    const memories = memoriesResult.map((m: any) => m.text).filter(Boolean);

    if (memories.length < 2) {
      return NextResponse.json({ error: "Not enough memories for a duel" }, { status: 400 });
    }

    const memoriesContext = memories.map((m: string, i: number) => `${i + 1}. "${m}"`).join("\n");

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are a football psychology AI. Analyze the user's past takes and predict their next one. Return ONLY valid JSON, no markdown.",
        },
        {
          role: "user",
          content: `Based on these past takes, predict what this user will say about: ${match}

Past takes:
${memoriesContext}

Return ONLY a JSON object with:
- prediction: string (what you think they'll say, 1-2 sentences)
- confidence: number (0-100, how sure you are)
- reasoning: string (why you think this, referencing their patterns, 1-2 sentences)`,
        },
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    const raw = response.choices[0]?.message?.content ?? "{}";
    const cleaned = raw.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error("get-response error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}