"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export function RefreshButton() {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const doRefresh = () => {
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  useEffect(() => {
    const handler = () => doRefresh();
    window.addEventListener("codetrends-refresh", handler);
    return () => window.removeEventListener("codetrends-refresh", handler);
  }, []);

  const handleRefresh = () => doRefresh();

  return (
    <button
      type="button"
      onClick={handleRefresh}
      disabled={isRefreshing}
      aria-label="Atualizar dados"
      title="Atualizar dados (R)"
      className="flex h-9 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-60 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
    >
      <svg
        className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      {isRefreshing ? "Atualizando…" : "Atualizar"}
    </button>
  );
}
