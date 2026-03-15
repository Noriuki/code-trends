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
      className="group block rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-zinc-300 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800/50 dark:hover:border-zinc-600"
    >
      <div className="flex items-start gap-4">
        <Image
          src={repo.owner.avatar_url}
          alt={repo.owner.login}
          width={44}
          height={44}
          className="rounded-lg"
        />
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
            {repo.full_name}
          </h3>
          {repo.description && (
            <p className="mt-1 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
              {repo.description}
            </p>
          )}
          <div className="mt-3 flex flex-wrap gap-4 text-xs text-zinc-500 dark:text-zinc-400">
            <span className="flex items-center gap-1">
              <span className="font-medium text-amber-600 dark:text-amber-400">★</span>
              {formatNumber(repo.stargazers_count)}
            </span>
            <span>Forks: {formatNumber(repo.forks_count)}</span>
            {repo.language && (
              <span className="rounded bg-zinc-100 px-1.5 py-0.5 dark:bg-zinc-700">
                {repo.language}
              </span>
            )}
          </div>
        </div>
      </div>
    </a>
  );
}
