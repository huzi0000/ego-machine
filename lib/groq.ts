import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function getEgoResponse(
  memories: string[],
  newTake: string,
  userName: string
): Promise<string> {
  const memoriesContext =
    memories.length > 0
      ? `Here are ${userName}'s past football takes stored in memory:\n\n${memories.map((m, i) => `${i + 1}. "${m}"`).join("\n")}\n\n`
      : `This is ${userName}'s very first take. No history yet.\n\n`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content:
          "You are the Ego Machine — a brutally honest AI football psychologist with a sharp tongue. You have the user's full history of football takes stored in your memory. Your job is to analyse their patterns, call out contradictions, expose their biases, and respond to their new take with wit and specific references to what they said before. Be entertaining, direct, and savage but fun. Always reference exact past statements when you have them. Keep responses under 150 words.",
      },
      {
        role: "user",
        content: `${memoriesContext}New take from ${userName}: "${newTake}"\n\nRespond as the Ego Machine.`,
      },
    ],
    temperature: 0.9,
    max_tokens: 300,
  });

  return response.choices[0]?.message?.content ?? "The Ego Machine is speechless. Somehow.";
}

export async function getProfileAnalysis(
  memories: string[],
  userName: string
): Promise<string> {
  const memoriesContext = memories
    .map((m, i) => `${i + 1}. "${m}"`)
    .join("\n");

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content:
          "You are a football psychology analyst. Analyze the user's takes and return ONLY a valid JSON object. No markdown, no backticks, no explanation. Just raw JSON.",
      },
      {
        role: "user",
        content: `Analyze these football takes from ${userName} and return a JSON object with exactly these fields:
- archetype: one of "Revisionist", "Recency Addict", "Trauma Carrier", "Stats Shield", "Contrarian", "Fairweather"
- archetypeEmoji: one relevant emoji
- roastLine: one savage funny line about their football psychology (max 20 words)
- biases: array of exactly 3 objects with {name: string, percentage: number}
- contradictionCount: number (how many contradictions you spotted)
- takesCount: number (total takes)
- confidenceScore: number between 0 and 100

Their takes:
${memoriesContext}

Return ONLY the JSON object, nothing else.`,
      },
    ],
    temperature: 0.7,
    max_tokens: 500,
  });

  return response.choices[0]?.message?.content ?? "{}";
}