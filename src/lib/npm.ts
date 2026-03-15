import type { NpmPackageInfo, NpmPackageWithStats } from "@/types";
import { getCached, setCache, CACHE_KEYS, CACHE_TTL } from "./cache";

const NPM_REGISTRY = "https://registry.npmjs.org";
const NPM_DOWNLOADS = "https://api.npmjs.org";

// Curated list of popular packages to show as "trending"
const POPULAR_PACKAGES = [
  "react",
  "vue",
  "express",
  "lodash",
  "axios",
  "typescript",
  "next",
  "vite",
  "tailwindcss",
  "eslint",
  "prettier",
  "jest",
  "webpack",
  "dayjs",
  "zustand",
];

async function fetchPackageInfo(name: string): Promise<NpmPackageInfo | null> {
  const res = await fetch(`${NPM_REGISTRY}/${encodeURIComponent(name)}`, {
    next: { revalidate: 3600 },
    // Don't cache full response in Next.js (some packages are >2MB)
  });
  if (!res.ok) return null;
  const data: NpmPackageInfo = await res.json();
  return data;
}

async function fetchWeeklyDownloads(name: string): Promise<number> {
  const res = await fetch(
    `${NPM_DOWNLOADS}/downloads/point/last-week/${encodeURIComponent(name)}`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) return 0;
  const data = await res.json();
  return typeof data.downloads === "number" ? data.downloads : 0;
}

export async function fetchTrendingNpmPackages(
  limit = 12
): Promise<NpmPackageWithStats[]> {
  const cached = getCached<NpmPackageWithStats[]>(CACHE_KEYS.NPM_TRENDING);
  if (cached) return cached.slice(0, limit);

  const names = POPULAR_PACKAGES.slice(0, limit * 2); // fetch extra in case some fail
  const results = await Promise.all(
    names.map(async (name) => {
      const [info, downloads] = await Promise.all([
        fetchPackageInfo(name),
        fetchWeeklyDownloads(name),
      ]);
      if (!info) return null;
      const latest = info["dist-tags"]?.latest ?? Object.keys(info.versions ?? {})[0] ?? "?";
      let repo: string | undefined;
      if (info.repository?.url) {
        repo = info.repository.url
          .replace(/^git\+/, "")
          .replace(/\.git$/, "");
      }
      return {
        name: info.name,
        description: info.description ?? "",
        version: latest,
        weeklyDownloads: downloads,
        repository: repo,
        homepage: info.homepage,
        license: typeof info.license === "string" ? info.license : undefined,
      } satisfies NpmPackageWithStats;
    })
  );

  const packages = results
    .filter((p): p is NonNullable<typeof p> => p !== null)
    .sort((a, b) => b.weeklyDownloads - a.weeklyDownloads)
    .slice(0, limit) as NpmPackageWithStats[];

  setCache(CACHE_KEYS.NPM_TRENDING, packages, CACHE_TTL.NPM);
  return packages;
}
