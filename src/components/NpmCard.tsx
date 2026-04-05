import type { NpmPackageWithStats } from "@/types";

interface NpmCardProps {
  pkg: NpmPackageWithStats;
  rank: number;
}

function formatDownloads(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

export function NpmCard({ pkg, rank }: NpmCardProps) {
  const npmUrl = `https://www.npmjs.com/package/${pkg.name}`;
  return (
    <a
      href={npmUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group grid min-h-[4.5rem] grid-cols-[auto_1fr_auto_auto] items-center gap-3 rounded-xl border border-zinc-200/90 bg-white/90 px-4 py-3 outline-none backdrop-blur-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#CB3837]/40 hover:shadow-md focus-visible:ring-2 focus-visible:ring-[#CB3837] focus-visible:ring-offset-2 dark:border-zinc-700/90 dark:bg-zinc-900/50 dark:hover:border-[#CB3837]/50 dark:focus-visible:ring-offset-zinc-950 sm:gap-4"
    >
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#CB3837]/10 text-sm font-bold tabular-nums text-[#CB3837] dark:bg-[#CB3837]/20 dark:text-[#ff6b6b]"
        aria-label={`Posição ${rank}`}
      >
        {rank}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0">
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">{pkg.name}</span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">v{pkg.version}</span>
        </div>
        {pkg.description && (
          <p className="mt-0.5 line-clamp-1 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
            {pkg.description}
          </p>
        )}
      </div>
      <div className="shrink-0 text-right">
        <div className="text-sm font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
          {formatDownloads(pkg.weeklyDownloads)}
        </div>
        <div className="text-[10px] font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          / semana
        </div>
      </div>
      <span className="text-zinc-300 opacity-0 transition group-hover:opacity-100 dark:text-zinc-600" aria-hidden>
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </span>
    </a>
  );
}
