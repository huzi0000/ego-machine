import { NextRequest, NextResponse } from "next/server";
import { getUserMemories } from "../../../lib/memwal";
import { getProfileAnalysis } from "../../../lib/groq";
export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const memoriesResult = await getUserMemories(
      userId,
      "psychology patterns contradictions biases predictions"
    );

    if (!memoriesResult || memoriesResult.length < 2) {
      return NextResponse.json({ insufficientData: true });
    }

    const memories = memoriesResult.map((m: any) => m.text).filter(Boolean);

    const rawJson = await getProfileAnalysis(memories, userId);

    // Clean the response in case AI adds backticks
    const cleaned = rawJson
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const profile = JSON.parse(cleaned);

    return NextResponse.json(profile);
  } catch (error: any) {
    console.error("get-profile error:", error);
    return NextResponse.json(
      { error: error.message ?? "Failed to build profile" },
      { status: 500 }
    );
  }
}