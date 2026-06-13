import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

export async function POST(req: NextRequest) {
  try {
    const { userId, memories } = await req.json();
    const memoriesContext = memories.map((m: string, i: number) => `${i + 1}. "${m}"`).join("\n")

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are a savage but hilarious football roast comedian. You have someone's complete history of football takes stored on Walrus Memory. Write one brutal, funny, specific roast paragraph referencing their ACTUAL takes. Call out contradictions. Expose their biases. Be savage but entertaining. 150-200 words max. No bullet points.",
        },
        {
          role: "user",
          content: `Roast this football fan (username: ${userId}) based on their Walrus Memory takes:\n\n${memoriesContext}\n\nWrite a brutal funny specific roast. Reference their actual takes by name.`,
        },
      ],
      temperature: 1.0,
      max_tokens: 400,
    })

    const roast = response.choices[0]?.message?.content ?? "You're too boring to roast."
    return NextResponse.json({ roast })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}