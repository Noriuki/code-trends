interface StatItem {
  label: string;
  value: string | number;
  sub?: string;
}

interface StatsBarProps {
  items: StatItem[];
}

export function StatsBar({ items }: StatsBarProps) {
  return (
    <div className="flex flex-wrap gap-6 rounded-lg border border-zinc-200 bg-zinc-50/80 px-6 py-4 dark:border-zinc-700 dark:bg-zinc-800/50">
      {items.map((item, i) => (
        <div key={i} className="flex flex-col">
          <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {item.value}
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
