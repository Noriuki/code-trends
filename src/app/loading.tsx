export default function Loading() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="h-8 w-48 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
          <div className="mt-2 h-4 w-64 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
        </div>
      </header>
      <main className="mx-auto max-w-6xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
        <section>
          <div className="mb-4 h-6 w-56 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-32 animate-pulse rounded-xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800/50"
                style={{ animationDelay: `${i * 100}ms` }}
              />
            ))}
          </div>
        </section>
        <section>
          <div className="mb-4 h-6 w-40 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-20 animate-pulse rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800/50"
                style={{ animationDelay: `${i * 80}ms` }}
              />
            ))}
          </div>
        </section>
        <section>
          <div className="h-48 animate-pulse rounded-xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800/50" />
        </section>
      </main>
    </div>
  );
}
