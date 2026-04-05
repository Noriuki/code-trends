import type { ReactNode } from "react";
import type { GitHubRepo } from "@/types";
import type { NpmPackageWithStats } from "@/types";
import { SectionHeading } from "@/components/SectionHeading";

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
      title: "Combined stars",
      value: totalStars.toLocaleString(),
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ),
    },
    {
      id: "downloads",
      title: "Combined weekly npm downloads",
      value: totalDownloads.toLocaleString(),
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
      ),
    },
    topRepo && {
      id: "top-repo",
      title: "Leading repository",
      value: topRepo.full_name,
      link: topRepo.html_url,
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22 12m0 0l-4.75 5.25M22 12H3" />
        </svg>
      ),
    },
    topPkg && {
      id: "top-pkg",
      title: "Leading package",
      value: topPkg.name,
      link: `https://www.npmjs.com/package/${topPkg.name}`,
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
      ),
    },
  ].filter(Boolean) as Array<{
    id: string;
    title: string;
    value: string;
    icon: ReactNode;
    link?: string;
  }>;

  return (
    <section
      className="animate-in-stagger rounded-2xl border border-zinc-200/90 bg-white/90 p-6 shadow-sm backdrop-blur-sm dark:border-zinc-700/90 dark:bg-zinc-900/60 sm:p-8"
      aria-labelledby="heading-ecosystem"
    >
      <SectionHeading
        id="heading-ecosystem"
        title="Ecosystem snapshot"
        description="Aggregates for the current dataset shown above — useful for a quick read on scale."
      />
      <ul className="mt-2 space-y-3">
        {highlights.map((h) => (
          <li
            key={h.id}
            className="flex items-center justify-between gap-4 rounded-xl border border-zinc-100 bg-zinc-50/80 px-4 py-3.5 dark:border-zinc-700/80 dark:bg-zinc-800/40"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex shrink-0 text-amber-600 dark:text-amber-400">{h.icon}</span>
              <div className="min-w-0">
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{h.title}</p>
                <p className="truncate font-medium text-zinc-900 dark:text-zinc-100">{h.value}</p>
              </div>
            </div>
            {h.link && (
              <a
                href={h.link}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 rounded-lg px-2 py-1 text-sm font-medium text-sky-600 transition hover:bg-sky-500/10 hover:text-sky-700 dark:text-sky-400 dark:hover:bg-sky-500/15 dark:hover:text-sky-300"
              >
                Open
              </a>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
