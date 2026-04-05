import { StatsBarAnimated } from "@/components/StatsBarAnimated";
import { getTrendingReposCached, getTrendingNpmPackagesCached } from "@/lib/server-data";

export async function DashboardStatsSection() {
  const [reposRes, pkgRes] = await Promise.allSettled([
    getTrendingReposCached(),
    getTrendingNpmPackagesCached(),
  ]);
  const repos = reposRes.status === "fulfilled" ? reposRes.value : [];
  const packages = pkgRes.status === "fulfilled" ? pkgRes.value : [];

  const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0);
  const totalDownloads = packages.reduce((s, p) => s + p.weeklyDownloads, 0);

  const statsItems = [
    { label: "Total stars", value: totalStars.toLocaleString(), icon: "stars" as const },
    { label: "Packages tracked", value: packages.length, icon: "packages" as const },
    {
      label: "Weekly npm downloads",
      value: totalDownloads.toLocaleString(),
      icon: "downloads" as const,
    },
  ];

  return <StatsBarAnimated items={statsItems} />;
}
