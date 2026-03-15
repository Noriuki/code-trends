export function DashboardFooter() {
  return (
    <footer className="mt-16 border-t border-zinc-200 py-8 dark:border-zinc-800">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
        <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
          Built with{" "}
          <a
            href="https://nextjs.org"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-zinc-700 underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:text-zinc-300 dark:decoration-zinc-500 dark:hover:decoration-zinc-400"
          >
            Next.js
          </a>
          ,{" "}
          <a
            href="https://www.typescriptlang.org"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-zinc-700 underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:text-zinc-300 dark:decoration-zinc-500 dark:hover:decoration-zinc-400"
          >
            TypeScript
          </a>
          ,{" "}
          <a
            href="https://tailwindcss.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-zinc-700 underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:text-zinc-300 dark:decoration-zinc-500 dark:hover:decoration-zinc-400"
          >
            Tailwind CSS
          </a>
          {" "}· SSR & API Routes
        </p>
        <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
          <span>GitHub API</span>
          <span aria-hidden>·</span>
          <span>npm registry</span>
        </div>
      </div>
    </footer>
  );
}
