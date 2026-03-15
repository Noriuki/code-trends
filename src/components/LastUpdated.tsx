"use client";

import { useEffect, useState } from "react";

interface LastUpdatedProps {
  timestamp: number;
}

function formatRelative(ms: number): string {
  const sec = Math.floor(ms / 1000);
  if (sec < 60) return "agora";
  const min = Math.floor(sec / 60);
  if (min === 1) return "há 1 min";
  if (min < 60) return `há ${min} min`;
  const h = Math.floor(min / 60);
  if (h === 1) return "há 1 h";
  if (h < 24) return `há ${h} h`;
  const d = Math.floor(h / 24);
  return d === 1 ? "há 1 dia" : `há ${d} dias`;
}

export function LastUpdated({ timestamp }: LastUpdatedProps) {
  const [text, setText] = useState(() => formatRelative(Date.now() - timestamp));

  useEffect(() => {
    const update = () => setText(formatRelative(Date.now() - timestamp));
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, [timestamp]);

  return (
    <span className="text-xs text-zinc-500 dark:text-zinc-400" title={new Date(timestamp).toLocaleString()}>
      Atualizado {text}
    </span>
  );
}
