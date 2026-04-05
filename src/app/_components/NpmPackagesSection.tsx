import { NpmCard } from "@/components/NpmCard";
import { SectionHeading } from "@/components/SectionHeading";
import { getTrendingNpmPackagesCached } from "@/lib/server-data";

export async function NpmPackagesSection() {
  let packages: Awaited<ReturnType<typeof getTrendingNpmPackagesCached>> = [];
  let error: string | null = null;

  try {
    packages = await getTrendingNpmPackagesCached();
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load packages";
  }

  return (
    <section aria-labelledby="heading-npm">
      <SectionHeading
        id="heading-npm"
        title="Top npm packages"
        description="Curated popular packages ranked by weekly download counts from the public npm registry."
      />
      {error && (
        <div
          className="mb-6 rounded-xl border border-amber-200/90 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-800/80 dark:bg-amber-950/40 dark:text-amber-200"
          role="alert"
        >
          <strong>npm:</strong> {error}
        </div>
      )}
      {!error && packages.length === 0 && (
        <p className="rounded-2xl border border-dashed border-zinc-300/90 bg-white/50 py-12 text-center text-sm text-zinc-500 dark:border-zinc-600 dark:bg-zinc-900/30 dark:text-zinc-400">
          Nenhum pacote carregado. Verifique sua conexão ou a API do npm.
        </p>
      )}
      {packages.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 animate-in-stagger">
          {packages.map((pkg, i) => (
            <NpmCard key={pkg.name} pkg={pkg} rank={i + 1} />
          ))}
        </div>
      )}
    </section>
  );
}
