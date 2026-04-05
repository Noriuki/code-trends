export function DashboardFooter() {
  return (
    <footer className="mt-16 border-t border-zinc-200 py-8 dark:border-zinc-800">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
        <p className="max-w-xl text-center text-sm text-zinc-500 dark:text-zinc-400 sm:text-left">
          Dados agregados a partir da{" "}
          <a
            href="https://docs.github.com/en/rest/search/search#search-repositories"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-zinc-700 underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:text-zinc-300 dark:decoration-zinc-500 dark:hover:decoration-zinc-400"
          >
            API de pesquisa do GitHub
          </a>{" "}
          e do{" "}
          <a
            href="https://github.com/npm/registry/blob/main/docs/REGISTRY-API.md"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-zinc-700 underline decoration-zinc-400 underline-offset-2 hover:decoration-zinc-600 dark:text-zinc-300 dark:decoration-zinc-500 dark:hover:decoration-zinc-400"
          >
            registro público npm
          </a>
          . Consulte os termos de uso de cada serviço antes de reutilizar os dados em produção.
        </p>
        <div className="shrink-0 text-xs text-zinc-500 dark:text-zinc-400">
          CodeTrends
        </div>
      </div>
    </footer>
  );
}
