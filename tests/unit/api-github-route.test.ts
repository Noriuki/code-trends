import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import type { GitHubRepo } from "@/types";

vi.mock("@/lib/github", () => ({
  fetchTrendingRepos: vi.fn(),
}));

describe("GET /api/github-trending", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns { repos } with 200", async () => {
    const { fetchTrendingRepos } = await import("@/lib/github");
    const mockRepo: GitHubRepo = {
      id: 99,
      name: "x",
      full_name: "a/x",
      description: null,
      html_url: "https://github.com/a/x",
      stargazers_count: 1,
      forks_count: 0,
      language: null,
      open_issues_count: 0,
      created_at: "",
      updated_at: "",
      pushed_at: "",
      owner: { login: "a", avatar_url: "", html_url: "" },
    };
    vi.mocked(fetchTrendingRepos).mockResolvedValue([mockRepo]);

    const { GET } = await import("@/app/api/github-trending/route");
    const req = new NextRequest("http://localhost/api/github-trending?limit=5");
    const res = await GET(req);

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.repos).toEqual([mockRepo]);
    expect(fetchTrendingRepos).toHaveBeenCalledWith(5);
  });

  it("caps limit at 30", async () => {
    const { fetchTrendingRepos } = await import("@/lib/github");
    vi.mocked(fetchTrendingRepos).mockResolvedValue([]);

    const { GET } = await import("@/app/api/github-trending/route");
    const req = new NextRequest("http://localhost/api/github-trending?limit=999");
    await GET(req);

    expect(fetchTrendingRepos).toHaveBeenCalledWith(30);
  });

  it("returns 500 when fetchTrendingRepos throws", async () => {
    const { fetchTrendingRepos } = await import("@/lib/github");
    vi.mocked(fetchTrendingRepos).mockRejectedValue(new Error("network down"));

    const { GET } = await import("@/app/api/github-trending/route");
    const res = await GET(new NextRequest("http://localhost/api/github-trending"));

    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.error).toContain("network down");
  });
});
