export default function Loading() {
  return (
    <div className="relative min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-48 left-[10%] h-96 w-96 rounded-full bg-sky-400/15 blur-3xl dark:bg-sky-500/10" />
      </div>
      <div className="relative z-10">
        <header className="border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/80">
          <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
            <div className="h-3 w-16 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
            <div className="mt-2 h-8 w-40 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
            <div className="mt-2 h-4 max-w-md animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
          </div>
        </header>
        <main className="mx-auto max-w-6xl space-y-14 px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-32 animate-pulse rounded-2xl border border-zinc-200/90 bg-white/80 dark:border-zinc-700 dark:bg-zinc-900/50"
              />
            ))}
          </div>
          <section>
            <div className="mb-8 h-6 w-56 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-40 animate-pulse rounded-2xl border border-zinc-200/90 bg-white/80 dark:border-zinc-700 dark:bg-zinc-900/40"
                />
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
