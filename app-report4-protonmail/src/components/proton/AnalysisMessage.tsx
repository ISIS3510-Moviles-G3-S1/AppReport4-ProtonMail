import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

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
  return (
    <details
      className="analysis-details border-b border-proton-separator last:border-b-0"
      open={defaultOpen}
    >
      <summary className="analysis-summary flex w-full cursor-pointer list-none items-center gap-3 px-3 py-3 text-left transition-colors touch-manipulation select-none hover:bg-proton-surface-elevated active:bg-proton-surface-elevated sm:px-4">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-proton-surface-elevated text-proton-text-tertiary">
          {icon}
        </span>

        <span className="min-w-0 flex-1 truncate text-sm font-medium text-proton-text">
          {title}
        </span>

        <span
          className="shrink-0 rounded px-2 py-0.5 text-[11px] font-medium whitespace-nowrap"
          style={{
            backgroundColor: `var(--color-risk-${estimateScore}-bg)`,
            color: `var(--color-risk-${estimateScore}-fg)`,
          }}
        >
          {estimate}
        </span>

        <ChevronDown
          size={15}
          strokeWidth={2}
          className="analysis-chevron shrink-0 text-proton-text-tertiary transition-transform duration-200"
        />
      </summary>

      <div className="space-y-5 px-3 pb-5 pt-1 sm:px-4 sm:pl-[3.75rem]">
        {children}
      </div>
    </details>
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
