import { NextRequest, NextResponse } from "next/server";
import { saveTake, getUserMemories } from "../../../lib/memwal";
import { getEgoResponse } from "../../../lib/groq";

export async function POST(req: NextRequest) {
  try {
    const { userId, takeText, matchContext } = await req.json();

    if (!userId || !takeText) {
      return NextResponse.json(
        { success: false, error: "userId and takeText are required" },
        { status: 400 }
      );
    }

    const fullText = `${takeText} [Match: ${matchContext ?? "General"}] [Date: ${new Date().toISOString().split("T")[0]}]`

    // Save to Walrus Memory and get job ID
    const job = await saveTake(userId, fullText)

    // Recall past memories
    const memoriesResult = await getUserMemories(
      userId,
      "all past football takes opinions and predictions"
    );

    const memories = memoriesResult.map((m: any) => m.text).filter(Boolean);

    // Get Ego Machine response
    const egoResponse = await getEgoResponse(memories, takeText, userId);

    return NextResponse.json({
      success: true,
      egoResponse,
      memoriesCount: memories.length,
      jobId: job.job_id,
    });
  } catch (error: any) {
    console.error("submit-take error:", error);
    return NextResponse.json(
      { success: false, error: error.message ?? "Something went wrong" },
      { status: 500 }
    );
  }
}