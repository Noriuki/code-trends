import { NextResponse } from "next/server";
import { fetchTrendingRepos } from "@/lib/github";

export const dynamic = "force-dynamic";
export const revalidate = 1800; // 30 min

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(Number(searchParams.get("limit")) || 10, 30);
    const repos = await fetchTrendingRepos(limit);
    return NextResponse.json({ repos });
  } catch (error) {
    console.error("[api/github-trending]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch GitHub trending" },
      { status: 500 }
    );
  }
}
