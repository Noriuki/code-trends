export function StatsBarSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-3" aria-hidden>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-2xl border border-zinc-200/90 bg-white/80 p-5 dark:border-zinc-700/90 dark:bg-zinc-900/50"
        >
          <div className="mb-4 h-10 w-10 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-700" />
          <div className="h-8 w-28 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
          <div className="mt-2 h-3 w-24 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
        </div>
      ))}
    </div>
  );
}

export function RepoGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="h-40 animate-pulse rounded-2xl border border-zinc-200/80 bg-white/80 dark:border-zinc-700/80 dark:bg-zinc-900/40"
        />
      ))}
    </div>
  );
}

export function NpmGridSkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="h-[4.5rem] animate-pulse rounded-xl border border-zinc-200/80 bg-white/80 dark:border-zinc-700/80 dark:bg-zinc-900/40"
        />
      ))}
    </div>
  );
}

export function EcosystemSkeleton() {
  return (
    <div className="h-52 animate-pulse rounded-2xl border border-zinc-200/80 bg-white/80 dark:border-zinc-700/80 dark:bg-zinc-900/40" />
  );
}
