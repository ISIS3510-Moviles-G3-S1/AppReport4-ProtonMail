"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

type Props = {
  title: string;
  estimate: string;
  estimateScore: 1 | 2 | 3 | 4 | 5;
  defaultOpen?: boolean;
  icon: ReactNode;
  children: ReactNode;
};

export function AnalysisMessage({
  title,
  estimate,
  estimateScore,
  defaultOpen = false,
  icon,
  children,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const Chevron = open ? ChevronDown : ChevronRight;

  return (
    <article className="border-b border-proton-separator last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-proton-surface-elevated"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-proton-surface-elevated text-proton-text-tertiary">
          {icon}
        </span>

        <span className="flex-1 truncate text-sm font-medium text-proton-text">
          {title}
        </span>

        <span
          className="shrink-0 rounded px-2 py-0.5 text-xs font-medium"
          style={{
            backgroundColor: `var(--color-risk-${estimateScore}-bg)`,
            color: `var(--color-risk-${estimateScore}-fg)`,
          }}
        >
          {estimate}
        </span>

        <Chevron
          size={15}
          strokeWidth={2}
          className="shrink-0 text-proton-text-tertiary"
        />
      </button>

      {open && (
        <div className="space-y-5 px-4 pb-5 pt-1 pl-[3.75rem]">
          {children}
        </div>
      )}
    </article>
  );
}

export function AnalysisSection({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <section>
      <p className="mb-2 text-[0.6875rem] font-semibold uppercase tracking-wider text-proton-text-tertiary">
        {label}
      </p>
      {children}
    </section>
  );
}
