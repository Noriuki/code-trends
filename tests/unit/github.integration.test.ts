import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { clearAllCaches } from "@/lib/cache";
import type { GitHubRepo } from "@/types";

function mockRepo(overrides: Partial<GitHubRepo> = {}): GitHubRepo {
  return {
    id: 1,
    name: "demo",
    full_name: "org/demo",
    description: "Test repo",
    html_url: "https://github.com/org/demo",
    stargazers_count: 500,
    forks_count: 10,
    language: "TypeScript",
    open_issues_count: 2,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-02T00:00:00Z",
    pushed_at: "2024-01-02T00:00:00Z",
    owner: {
      login: "org",
      avatar_url: "https://avatars.githubusercontent.com/u/1",
      html_url: "https://github.com/org",
    },
    ...overrides,
  };
}

describe("fetchTrendingRepos (GitHub integration)", () => {
  beforeEach(() => {
    clearAllCaches();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ total_count: 1, items: [mockRepo()] }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        })
      )
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    clearAllCaches();
  });

  it("calls GitHub Search API with expected host and query shape", async () => {
    const { fetchTrendingRepos } = await import("@/lib/github");
    await fetchTrendingRepos(5);

    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    const url = String(vi.mocked(globalThis.fetch).mock.calls[0][0]);
    expect(url).toContain("api.github.com/search/repositories");
    expect(url).toContain("sort=stars");
    expect(url).toContain("order=desc");
    expect(url).toMatch(/created%3A%3E\d{4}-\d{2}-\d{2}/);
  });

  it("passes Authorization when GITHUB_TOKEN is set", async () => {
    const prev = process.env.GITHUB_TOKEN;
    process.env.GITHUB_TOKEN = "test-token";
    try {
      const { fetchTrendingRepos } = await import("@/lib/github");
      await fetchTrendingRepos(3);
      const init = vi.mocked(globalThis.fetch).mock.calls[0][1] as RequestInit;
      expect(init.headers).toMatchObject(
        expect.objectContaining({
          Authorization: "Bearer test-token",
        })
      );
    } finally {
      if (prev === undefined) delete process.env.GITHUB_TOKEN;
      else process.env.GITHUB_TOKEN = prev;
    }
  });

  it("returns repos and respects limit", async () => {
    const items = [mockRepo({ id: 1 }), mockRepo({ id: 2, name: "b" }), mockRepo({ id: 3, name: "c" })];
    vi.mocked(globalThis.fetch).mockResolvedValueOnce(
      new Response(JSON.stringify({ total_count: 3, items }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    );

    const { fetchTrendingRepos } = await import("@/lib/github");
    const repos = await fetchTrendingRepos(2);
    expect(repos).toHaveLength(2);
    expect(repos[0].full_name).toBe("org/demo");
  });

  it("throws on non-OK response", async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce(
      new Response("rate limit", { status: 403 })
    );

    const { fetchTrendingRepos } = await import("@/lib/github");
    await expect(fetchTrendingRepos(5)).rejects.toThrow(/GitHub API error: 403/);
  });

  it("uses cache on second call without extra fetch", async () => {
    const { fetchTrendingRepos } = await import("@/lib/github");
    await fetchTrendingRepos(10);
    await fetchTrendingRepos(10);
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });
});
