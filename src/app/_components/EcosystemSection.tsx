import { EcosystemActivity } from "@/components/EcosystemActivity";
import { getTrendingReposCached, getTrendingNpmPackagesCached } from "@/lib/server-data";

export async function EcosystemSection() {
  const [reposRes, pkgRes] = await Promise.allSettled([
    getTrendingReposCached(),
    getTrendingNpmPackagesCached(),
  ]);
  const repos = reposRes.status === "fulfilled" ? reposRes.value : [];
  const packages = pkgRes.status === "fulfilled" ? pkgRes.value : [];

  if (repos.length === 0 && packages.length === 0) return null;

  return <EcosystemActivity repos={repos} packages={packages} />;
}
