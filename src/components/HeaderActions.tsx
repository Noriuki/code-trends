"use client";

import { useEffect, useState, useCallback } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { RefreshButton } from "./RefreshButton";
import { LastUpdated } from "./LastUpdated";

export function HeaderActions() {
  const [lastRefresh, setLastRefresh] = useState(() => Date.now());

  const handleRefreshComplete = useCallback(() => {
    setLastRefresh(Date.now());
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.key === "r" || e.key === "R") && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const target = e.target as HTMLElement;
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) return;
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("codetrends-refresh"));
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="mt-4 flex flex-wrap items-center gap-3 sm:mt-0 sm:ml-auto sm:gap-4">
      <LastUpdated timestamp={lastRefresh} />
      <div className="flex items-center gap-2">
        <RefreshButton onRefreshComplete={handleRefreshComplete} />
        <ThemeToggle />
      </div>
      <span className="hidden text-xs text-zinc-400 sm:inline" title="Atalho de teclado">
        <kbd className="rounded border border-zinc-300 bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px] dark:border-zinc-600 dark:bg-zinc-700">R</kbd> atualizar
      </span>
    </div>
  );
}
