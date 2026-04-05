import type { GitHubRepo } from "@/types";
import Image from "next/image";

interface RepoCardProps {
  repo: GitHubRepo;
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

export function RepoCard({ repo }: RepoCardProps) {
  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block rounded-2xl border border-zinc-200/90 bg-white/90 p-5 shadow-sm outline-none backdrop-blur-sm transition duration-200 hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 dark:border-zinc-700/90 dark:bg-zinc-900/50 dark:hover:border-zinc-600 dark:focus-visible:ring-sky-400 dark:focus-visible:ring-offset-zinc-950"
    >
      <span className="absolute right-4 top-4 text-zinc-300 opacity-0 transition group-hover:opacity-100 dark:text-zinc-600" aria-hidden>
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </span>
      <div className="flex items-start gap-4 pr-6">
        <Image
          src={repo.owner.avatar_url}
          alt=""
          width={48}
          height={48}
          className="rounded-xl ring-1 ring-zinc-200/80 dark:ring-zinc-600/80"
        />
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-sky-600 dark:group-hover:text-sky-400">
            {repo.full_name}
          </h3>
          {repo.description && (
            <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {repo.description}
            </p>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <span className="inline-flex items-center gap-1 rounded-lg bg-amber-500/10 px-2 py-1 font-medium text-amber-800 dark:text-amber-300">
              <span aria-hidden>★</span>
              {formatNumber(repo.stargazers_count)}
            </span>
            <span className="rounded-lg bg-zinc-100 px-2 py-1 dark:bg-zinc-800">
              {formatNumber(repo.forks_count)} forks
            </span>
            {repo.language && (
              <span className="rounded-lg border border-zinc-200/80 bg-zinc-50 px-2 py-1 font-medium dark:border-zinc-600 dark:bg-zinc-800/80">
                {repo.language}
              </span>
            )}
          </div>
        </div>
      </div>
    </a>
  );
}
