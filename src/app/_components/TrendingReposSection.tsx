import { RepoCard } from "@/components/RepoCard";
import { SectionHeading } from "@/components/SectionHeading";
import { getTrendingReposCached } from "@/lib/server-data";

export async function TrendingReposSection() {
  let repos: Awaited<ReturnType<typeof getTrendingReposCached>> = [];
  let error: string | null = null;

  try {
    repos = await getTrendingReposCached();
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load trending repos";
  }

  return (
    <section aria-labelledby="heading-repos">
      <SectionHeading
        id="heading-repos"
        title="Trending repositories"
        description="GitHub repositories created in the last 30 days, sorted by stars. This approximates “trending” because GitHub does not offer an official trending API."
      />
      {error && (
        <div
          className="mb-6 rounded-xl border border-amber-200/90 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-800/80 dark:bg-amber-950/40 dark:text-amber-200"
          role="alert"
        >
          <strong>GitHub:</strong> {error}
        </div>
      )}
      {!error && repos.length === 0 && (
        <p className="rounded-2xl border border-dashed border-zinc-300/90 bg-white/50 py-12 text-center text-sm text-zinc-500 dark:border-zinc-600 dark:bg-zinc-900/30 dark:text-zinc-400">
          Nenhum repositório carregado. Verifique sua conexão ou a API do GitHub.
        </p>
      )}
      {repos.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 animate-in-stagger">
          {repos.map((repo) => (
            <RepoCard key={repo.id} repo={repo} />
          ))}
        </div>
      )}
    </section>
  );
}
