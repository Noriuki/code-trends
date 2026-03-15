import type { GitHubRepo } from "@/types";
import type { NpmPackageWithStats } from "@/types";

interface EcosystemActivityProps {
  repos: GitHubRepo[];
  packages: NpmPackageWithStats[];
}

export function EcosystemActivity({ repos, packages }: EcosystemActivityProps) {
  const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0);
  const totalDownloads = packages.reduce((s, p) => s + p.weeklyDownloads, 0);
  const topRepo = repos[0];
  const topPkg = packages[0];

  const highlights = [
    {
      id: "stars",
      title: "Total stars (trending repos)",
      value: totalStars.toLocaleString(),
      icon: "★",
    },
    {
      id: "downloads",
      title: "Weekly npm downloads (top packages)",
      value: totalDownloads.toLocaleString(),
      icon: "↓",
    },
    topRepo && {
      id: "top-repo",
      title: "Top repo this period",
      value: topRepo.full_name,
      icon: "📦",
      link: topRepo.html_url,
    },
    topPkg && {
      id: "top-pkg",
      title: "Most downloaded package",
      value: topPkg.name,
      icon: "📦",
      link: `https://www.npmjs.com/package/${topPkg.name}`,
    },
  ].filter(Boolean) as Array<{
    id: string;
    title: string;
    value: string;
    icon: string;
    link?: string;
  }>;

  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800/50">
      <h2 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        Developer Ecosystem Activity
      </h2>
      <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-400">
        Weekly snapshot of GitHub and npm activity across the trending set.
      </p>
      <ul className="space-y-4">
        {highlights.map((h) => (
          <li
            key={h.id}
            className="flex items-center justify-between gap-4 rounded-lg border border-zinc-100 bg-zinc-50/50 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-800/30"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl" aria-hidden>{h.icon}</span>
              <div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">{h.title}</p>
                <p className="font-medium text-zinc-900 dark:text-zinc-100">{h.value}</p>
              </div>
            </div>
            {h.link && (
              <a
                href={h.link}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                View →
              </a>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
