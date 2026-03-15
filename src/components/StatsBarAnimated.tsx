"use client";

import { useEffect, useRef, useState } from "react";

interface StatItem {
  label: string;
  value: string | number;
  sub?: string;
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
          const start = 0;
          const current = Math.round(start + (target - start) * eased);
          return formatDisplay(target, current);
        })
      );

      if (progress < 1) requestAnimationFrame(step);
    };

    const id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [items]);

  return (
    <div className="flex flex-wrap gap-6 rounded-lg border border-zinc-200 bg-zinc-50/80 px-6 py-4 dark:border-zinc-700 dark:bg-zinc-800/50">
      {items.map((item, i) => (
        <div key={i} className="flex flex-col">
          <span className="text-2xl font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
            {displayValues[i]}
          </span>
          <span className="text-sm text-zinc-600 dark:text-zinc-400">{item.label}</span>
          {item.sub && (
            <span className="text-xs text-zinc-500 dark:text-zinc-500">{item.sub}</span>
          )}
        </div>
      ))}
    </div>
  );
}
