"use client";

import { useEffect, useRef, useState } from "react";

export type StatIcon = "stars" | "packages" | "downloads";

interface StatItem {
  label: string;
  value: string | number;
  icon: StatIcon;
}

interface StatsBarAnimatedProps {
  items: StatItem[];
}

function parseValue(v: string | number): number {
  if (typeof v === "number") return v;
  const n = parseInt(String(v).replace(/\D/g, ""), 10);
  return Number.isNaN(n) ? 0 : n;
}

function formatDisplay(target: number, current: number): string {
  if (target >= 1_000_000) return (current / 1_000_000).toFixed(1) + "M";
  if (target >= 1_000) return (current / 1_000).toFixed(1) + "k";
  return current.toLocaleString();
}

function StatIconSvg({ type }: { type: StatIcon }) {
  const common = "h-5 w-5";
  if (type === "stars") {
    return (
      <svg className={common} fill="currentColor" viewBox="0 0 20 20" aria-hidden>
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    );
  }
  if (type === "packages") {
    return (
      <svg className={common} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    );
  }
  return (
    <svg className={common} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
  );
}

const accentStyles: Record<StatIcon, string> = {
  stars: "text-amber-600 dark:text-amber-400 bg-amber-500/10 dark:bg-amber-400/10",
  packages: "text-violet-600 dark:text-violet-400 bg-violet-500/10 dark:bg-violet-400/10",
  downloads: "text-sky-600 dark:text-sky-400 bg-sky-500/10 dark:bg-sky-400/10",
};

export function StatsBarAnimated({ items }: StatsBarAnimatedProps) {
  const [displayValues, setDisplayValues] = useState<(string | number)[]>(items.map((i) => i.value));
  const targets = useRef(items.map((i) => parseValue(i.value)));
  const duration = 1200;
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    targets.current = items.map((i) => parseValue(i.value));
    startRef.current = null;

    const step = (timestamp: number) => {
      if (startRef.current === null) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) ** 2;

      setDisplayValues(
        items.map((_item, i) => {
          const target = targets.current[i];
          const current = Math.round(target * eased);
          return formatDisplay(target, current);
        })
      );

      if (progress < 1) requestAnimationFrame(step);
    };

    const id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [items]);

  return (
    <div className="grid gap-4 sm:grid-cols-3" role="region" aria-label="Resumo dos dados">
      {items.map((item, i) => (
        <div
          key={`${item.label}-${i}`}
          className="relative overflow-hidden rounded-2xl border border-zinc-200/90 bg-white/90 p-5 shadow-sm backdrop-blur-sm dark:border-zinc-700/90 dark:bg-zinc-900/60"
        >
          <div
            className={`mb-4 inline-flex rounded-xl p-2.5 ${accentStyles[item.icon]}`}
            aria-hidden
          >
            <StatIconSvg type={item.icon} />
          </div>
          <p className="text-2xl font-bold tabular-nums tracking-tight text-zinc-900 dark:text-zinc-50">
            {displayValues[i]}
          </p>
          <p className="mt-1 text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            {item.label}
          </p>
        </div>
      ))}
    </div>
  );
}
