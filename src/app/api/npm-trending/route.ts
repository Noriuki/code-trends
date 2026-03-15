import { NextResponse } from "next/server";
import { fetchTrendingNpmPackages } from "@/lib/npm";

export const dynamic = "force-dynamic";
export const revalidate = 3600; // 1 hour

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(Number(searchParams.get("limit")) || 12, 30);
    const packages = await fetchTrendingNpmPackages(limit);
    return NextResponse.json({ packages });
  } catch (error) {
    console.error("[api/npm-trending]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch npm trending" },
      { status: 500 }
    );
  }
}
