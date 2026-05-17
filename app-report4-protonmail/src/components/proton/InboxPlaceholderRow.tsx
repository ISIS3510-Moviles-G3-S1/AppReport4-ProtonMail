type Props = {
  sender: string;
  subject: string;
  timestamp: string;
};

export function InboxPlaceholderRow({ sender, subject, timestamp }: Props) {
  return (
    <article className="flex cursor-default items-start gap-3 border-b border-proton-separator px-4 py-3 hover:bg-proton-surface-elevated">
      <div
        aria-hidden
        className="mt-0.5 h-9 w-9 shrink-0 rounded-full bg-proton-surface-elevated"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <p className="truncate text-sm font-semibold text-proton-text">
            {sender}
          </p>
          <span className="ml-auto shrink-0 text-xs text-proton-text-tertiary">
            {timestamp}
          </span>
        </div>
        <p className="mt-0.5 truncate text-sm text-proton-text-secondary">
          {subject}
        </p>
        <div
          aria-hidden
          className="mt-2 flex gap-1.5"
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <span
              key={i}
              className="h-4 w-7 rounded-sm bg-proton-surface-elevated"
            />
          ))}
        </div>
      </div>
    </article>
  );
}
