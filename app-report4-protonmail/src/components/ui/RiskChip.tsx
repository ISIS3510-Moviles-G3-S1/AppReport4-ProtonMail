import type { RiskDimension, RiskProfile, RiskScore } from "@/lib/types";

const DIMENSION_LABELS: Record<RiskDimension, string> = {
  cpu: "CPU",
  gpu: "GPU",
  overdraw: "Overdraw",
  memory: "Memory",
  threading: "Threading",
  power: "Power",
};

type Props = {
  dimension: RiskDimension;
  score: RiskScore;
  size?: "sm" | "md";
};

export function RiskChip({ dimension, score, size = "sm" }: Props) {
  const label = DIMENSION_LABELS[dimension];

  return (
    <span
      className={[
        "relative inline-flex items-center justify-center rounded font-semibold tabular-nums",
        size === "sm"
          ? "h-[1.125rem] min-w-[1.5rem] px-1 text-[0.6875rem]"
          : "h-6 min-w-8 px-1.5 text-xs",
      ].join(" ")}
      style={{
        backgroundColor: `var(--color-risk-${score}-bg)`,
        color: `var(--color-risk-${score}-fg)`,
      }}
      title={`${label}: ${score}/5`}
      aria-label={`${label} risk score ${score} out of 5`}
    >
      {score}
    </span>
  );
}

export function RiskChipStrip({
  risks,
  size = "sm",
}: {
  risks: Record<RiskDimension, RiskScore>;
  size?: "sm" | "md";
}) {
  const ORDERED: RiskDimension[] = [
    "cpu",
    "gpu",
    "overdraw",
    "memory",
    "threading",
    "power",
  ];

  return (
    <span className="inline-flex items-center gap-1" aria-label="Risk scores">
      {ORDERED.map((dim) => (
        <RiskChip key={dim} dimension={dim} score={risks[dim]} size={size} />
      ))}
    </span>
  );
}

const ORDERED_DIMS: RiskDimension[] = [
  "cpu",
  "gpu",
  "overdraw",
  "memory",
  "threading",
  "power",
];

export function RiskChipWithLabel({
  dimension,
  score,
}: {
  dimension: RiskDimension;
  score: RiskScore;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className="text-[0.625rem] font-medium uppercase tracking-wider text-proton-text-tertiary">
        {DIMENSION_LABELS[dimension]}
      </span>
      <span
        className="flex h-8 w-10 items-center justify-center rounded text-sm font-bold tabular-nums"
        style={{
          backgroundColor: `var(--color-risk-${score}-bg)`,
          color: `var(--color-risk-${score}-fg)`,
        }}
        aria-label={`${DIMENSION_LABELS[dimension]} risk score ${score} out of 5`}
      >
        {score}
      </span>
    </div>
  );
}

export function RiskProfileGrid({ risks }: { risks: RiskProfile }) {
  return (
    <div
      className="flex flex-wrap gap-x-5 gap-y-3"
      role="list"
      aria-label="Risk profile"
    >
      {ORDERED_DIMS.map((dim) => (
        <div key={dim} role="listitem">
          <RiskChipWithLabel dimension={dim} score={risks[dim]} />
        </div>
      ))}
    </div>
  );
}
