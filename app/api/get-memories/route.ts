import { NextRequest, NextResponse } from "next/server";
import { getUserMemories } from "../../../lib/memwal";

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const results = await getUserMemories(userId, "all takes and opinions");

    // Enrich each memory with display data
   const enriched = results.map((m: any, i: number) => ({
  ...m,
  index: i + 1,
  displayId: m.blob_id || m.id || m.job_id || `mem_${String(i).padStart(4, '0')}`,
  explorerUrl: m.blob_id ? `https://walruscan.com/mainnet/blob/${m.blob_id}` : null,
}))

    return NextResponse.json({ memories: enriched });
  } catch (error: any) {
    console.error("get-memories error:", error);
    return NextResponse.json(
      { error: error.message ?? "Failed to fetch memories" },
      { status: 500 }
    );
  }
}