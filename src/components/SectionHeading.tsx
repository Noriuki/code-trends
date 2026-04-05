interface SectionHeadingProps {
  id?: string;
  title: string;
  description: string;
}

export function SectionHeading({ id, title, description }: SectionHeadingProps) {
  return (
    <header className="mb-8">
      <div className="flex flex-wrap items-center gap-3">
        <span
          className="h-1 w-10 shrink-0 rounded-full bg-gradient-to-r from-sky-500 to-violet-500 dark:from-sky-400 dark:to-violet-400"
          aria-hidden
        />
        <h2
          id={id}
          className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100"
        >
          {title}
        </h2>
      </div>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        {description}
      </p>
    </header>
  );
}
