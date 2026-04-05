import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import type { NpmPackageWithStats } from "@/types";

vi.mock("@/lib/npm", () => ({
  fetchTrendingNpmPackages: vi.fn(),
}));

describe("GET /api/npm-trending", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns { packages } with 200", async () => {
    const { fetchTrendingNpmPackages } = await import("@/lib/npm");
    const pkg: NpmPackageWithStats = {
      name: "demo-pkg",
      description: "desc",
      version: "1.0.0",
      weeklyDownloads: 42,
    };
    vi.mocked(fetchTrendingNpmPackages).mockResolvedValue([pkg]);

    const { GET } = await import("@/app/api/npm-trending/route");
    const res = await GET(new NextRequest("http://localhost/api/npm-trending?limit=12"));

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ packages: [pkg] });
    expect(fetchTrendingNpmPackages).toHaveBeenCalledWith(12);
  });

  it("returns 500 on failure", async () => {
    const { fetchTrendingNpmPackages } = await import("@/lib/npm");
    vi.mocked(fetchTrendingNpmPackages).mockRejectedValue(new Error("npm error"));

    const { GET } = await import("@/app/api/npm-trending/route");
    const res = await GET(new NextRequest("http://localhost/api/npm-trending"));

    expect(res.status).toBe(500);
    expect((await res.json()).error).toContain("npm error");
  });
});
