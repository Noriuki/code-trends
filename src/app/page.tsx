import type { GitHubRepo } from "@/types";
import type { NpmPackageWithStats } from "@/types";
import { fetchTrendingRepos } from "@/lib/github";
import { fetchTrendingNpmPackages } from "@/lib/npm";
import { RepoCard } from "@/components/RepoCard";
import { NpmCard } from "@/components/NpmCard";
import { StatsBarAnimated } from "@/components/StatsBarAnimated";
import { EcosystemActivity } from "@/components/EcosystemActivity";
import { HeaderActions } from "@/components/HeaderActions";
import { DashboardFooter } from "@/components/DashboardFooter";

const GITHUB_LIMIT = 9;
const NPM_LIMIT = 12;

export const revalidate = 1800; // Revalidate page every 30 min (SSR + ISR)

async function loadData(): Promise<{
  repos: GitHubRepo[];
  packages: NpmPackageWithStats[];
  errors: string[];
}> {
  const errors: string[] = [];
  let repos: GitHubRepo[] = [];
  let packages: NpmPackageWithStats[] = [];

  try {
    repos = await fetchTrendingRepos(GITHUB_LIMIT);
  } catch (e) {
    errors.push("GitHub: " + (e instanceof Error ? e.message : "Failed to load trending repos"));
  }

  try {
    packages = await fetchTrendingNpmPackages(NPM_LIMIT);
  } catch (e) {
    errors.push("npm: " + (e instanceof Error ? e.message : "Failed to load packages"));
  }

  return { repos, packages, errors };
}

export default async function Home() {
  const { repos, packages, errors } = await loadData();
  const timestamp = Date.now();

  const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0);
  const totalDownloads = packages.reduce((s, p) => s + p.weeklyDownloads, 0);

  const statsItems = [
    { label: "Trending repos", value: repos.length },
    { label: "Total stars", value: totalStars.toLocaleString() },
    { label: "Top packages", value: packages.length },
    { label: "Weekly downloads", value: totalDownloads.toLocaleString(), sub: "npm" },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-6xl flex-col px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              CodeTrends
            </h1>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Trending repositories, popular npm packages, and developer ecosystem highlights.
            </p>
          </div>
          <HeaderActions timestamp={timestamp} />
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
        {errors.length > 0 && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
            <strong>Alguns dados não carregaram:</strong>{" "}
            {errors.join(" · ")}. Verifique sua conexão ou tente novamente em instantes.
          </div>
        )}
        <StatsBarAnimated items={statsItems} />

        <section>
          <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Trending Repositories
          </h2>
          <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-400">
            Top GitHub repositories created in the last 30 days, sorted by stars.
          </p>
          {repos.length === 0 ? (
            <p className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 py-8 text-center text-sm text-zinc-500 dark:border-zinc-600 dark:bg-zinc-800/30 dark:text-zinc-400">
              Nenhum repositório carregado. Verifique sua conexão ou a API do GitHub.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 animate-in-stagger">
              {repos.map((repo) => (
                <RepoCard key={repo.id} repo={repo} />
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Top NPM Packages
          </h2>
          <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-400">
            Popular packages by weekly downloads from the npm registry.
          </p>
          {packages.length === 0 ? (
            <p className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 py-8 text-center text-sm text-zinc-500 dark:border-zinc-600 dark:bg-zinc-800/30 dark:text-zinc-400">
              Nenhum pacote carregado. Verifique sua conexão ou a API do npm.
            </p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 animate-in-stagger">
              {packages.map((pkg, i) => (
                <NpmCard key={pkg.name} pkg={pkg} rank={i + 1} />
              ))}
            </div>
          )}
        </section>

        {(repos.length > 0 || packages.length > 0) && (
          <section className="animate-in-stagger">
            <EcosystemActivity repos={repos} packages={packages} />
          </section>
        )}
      </main>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <DashboardFooter />
      </div>
    </div>
  );
}
