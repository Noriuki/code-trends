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
      className="flex items-center gap-4 rounded-lg border border-zinc-200 bg-white px-4 py-3 transition hover:border-amber-300 hover:bg-amber-50/50 dark:border-zinc-700 dark:bg-zinc-800/50 dark:hover:border-amber-600/50 dark:hover:bg-amber-950/20"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-amber-100 text-sm font-bold text-amber-700 dark:bg-amber-900/50 dark:text-amber-400">
        {rank}
      </span>
      <div className="min-w-0 flex-1">
        <span className="font-semibold text-zinc-900 dark:text-zinc-100">{pkg.name}</span>
        <span className="text-zinc-500 dark:text-zinc-400">@{pkg.version}</span>
        {pkg.description && (
          <p className="mt-0.5 line-clamp-1 text-xs text-zinc-500 dark:text-zinc-400">
            {pkg.description}
          </p>
        )}
      </div>
      <div className="shrink-0 text-right">
        <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {formatDownloads(pkg.weeklyDownloads)}/wk
        </div>
        <div className="text-xs text-zinc-500 dark:text-zinc-400">downloads</div>
      </div>
    </a>
  );
}
