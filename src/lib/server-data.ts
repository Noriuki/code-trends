import { unstable_cache } from "next/cache";
import { fetchTrendingRepos } from "@/lib/github";
import { fetchTrendingNpmPackages } from "@/lib/npm";
import { CACHE_TAGS } from "@/lib/cache-tags";

const GITHUB_LIMIT = 9;
const NPM_LIMIT = 12;

/**
 * Data layer with Next.js Data Cache + tags for `revalidateTag` (Server Actions).
 * In-memory cache in lib/cache is cleared when the refresh action runs.
 */
export const getTrendingReposCached = unstable_cache(
  async () => fetchTrendingRepos(GITHUB_LIMIT),
  ["dashboard-trending-repos", String(GITHUB_LIMIT)],
  { tags: [CACHE_TAGS.githubTrending], revalidate: 1800 }
);

export const getTrendingNpmPackagesCached = unstable_cache(
  async () => fetchTrendingNpmPackages(NPM_LIMIT),
  ["dashboard-trending-npm", String(NPM_LIMIT)],
  { tags: [CACHE_TAGS.npmTrending], revalidate: 3600 }
);
