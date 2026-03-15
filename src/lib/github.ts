import type { GitHubRepo, GitHubSearchResponse } from "@/types";
import { getCached, setCache, CACHE_KEYS, CACHE_TTL } from "./cache";

const GITHUB_API = "https://api.github.com";

/**
 * Fetches trending repositories using GitHub Search API.
 * Uses "recently created + many stars" as a proxy for "trending" since
 * GitHub has no official trending endpoint.
 */
export async function fetchTrendingRepos(limit = 10): Promise<GitHubRepo[]> {
  const cached = getCached<GitHubRepo[]>(CACHE_KEYS.GITHUB_TRENDING);
  if (cached) return cached.slice(0, limit);

  const since = new Date();
  since.setDate(since.getDate() - 30);
  const dateStr = since.toISOString().split("T")[0];

  const q = `created:>${dateStr} stars:>100`;
  const url = `${GITHUB_API}/search/repositories?q=${encodeURIComponent(q)}&sort=stars&order=desc&per_page=${Math.min(limit, 30)}`;

  const res = await fetch(url, {
    headers: {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "CodeTrends-Dashboard",
      ...(process.env.GITHUB_TOKEN && {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      }),
    },
    next: { revalidate: 1800 }, // Next.js fetch cache: 30 min
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub API error: ${res.status} ${text}`);
  }

  const json: GitHubSearchResponse = await res.json();
  const items = json.items ?? [];

  setCache(CACHE_KEYS.GITHUB_TRENDING, items, CACHE_TTL.GITHUB);
  return items.slice(0, limit);
}
