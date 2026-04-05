import { Suspense } from "react";
import { HeaderActions } from "@/components/HeaderActions";
import { DashboardFooter } from "@/components/DashboardFooter";
import { SectionHeading } from "@/components/SectionHeading";
import {
  StatsBarSkeleton,
  RepoGridSkeleton,
  NpmGridSkeleton,
  EcosystemSkeleton,
} from "@/components/dashboard/skeletons";
import { DashboardStatsSection } from "./_components/DashboardStatsSection";
import { TrendingReposSection } from "./_components/TrendingReposSection";
import { NpmPackagesSection } from "./_components/NpmPackagesSection";
import { EcosystemSection } from "./_components/EcosystemSection";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-48 left-[10%] h-96 w-96 rounded-full bg-sky-400/15 blur-3xl dark:bg-sky-500/10" />
        <div className="absolute top-32 right-[5%] h-80 w-80 rounded-full bg-violet-400/12 blur-3xl dark:bg-violet-500/10" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl dark:bg-emerald-500/5" />
      </div>

      <div className="relative z-10">
        <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/80">
          <div className="mx-auto flex max-w-6xl flex-col px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">
                Live data
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                CodeTrends
              </h1>
              <p className="mt-1.5 max-w-lg text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                GitHub discovery and npm download trends in one place.
              </p>
            </div>
            <HeaderActions />
          </div>
        </header>

        <main className="mx-auto max-w-6xl space-y-14 px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <Suspense fallback={<StatsBarSkeleton />}>
            <DashboardStatsSection />
          </Suspense>

          <Suspense fallback={<RepoSectionFallback />}>
            <TrendingReposSection />
          </Suspense>

          <Suspense fallback={<NpmSectionFallback />}>
            <NpmPackagesSection />
          </Suspense>

          <Suspense fallback={<EcosystemSkeleton />}>
            <EcosystemSection />
          </Suspense>
        </main>

        <div className="mx-auto max-w-6xl px-4 pb-10 sm:px-6 lg:px-8">
          <DashboardFooter />
        </div>
      </div>
    </div>
  );
}

function RepoSectionFallback() {
  return (
    <section>
      <SectionHeading
        title="Trending repositories"
        description="GitHub repositories created in the last 30 days, sorted by stars."
      />
      <RepoGridSkeleton />
    </section>
  );
}

function NpmSectionFallback() {
  return (
    <section>
      <SectionHeading
        title="Top npm packages"
        description="Curated popular packages ranked by weekly download counts from the public npm registry."
      />
      <NpmGridSkeleton />
    </section>
  );
}
