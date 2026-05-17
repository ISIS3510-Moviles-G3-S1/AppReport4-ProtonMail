"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import type { Scenario, RiskDimension, RiskScore, RiskProfile } from "@/lib/types";

/* ── per-scenario display metadata ── */
type ScenarioMeta = {
  sender: string;
  initials: string;
  avatarGradient: string;
  timestamp: string;
  isUnread: boolean;
};

const SCENARIO_META: Record<Scenario["id"], ScenarioMeta> = {
  "cold-launch": {
    sender: "Instruments Profiler",
    initials: "IP",
    avatarGradient: "linear-gradient(135deg,#6D4AFF 0%,#4F2BD9 100%)",
    timestamp: "2:14 PM",
    isUnread: true,
  },
  "scroll-mailbox": {
    sender: "Code Review",
    initials: "CR",
    avatarGradient: "linear-gradient(135deg,#1EA885 0%,#0F7A5F 100%)",
    timestamp: "1:02 PM",
    isUnread: false,
  },
  "rich-email": {
    sender: "Memory Analysis",
    initials: "MA",
    avatarGradient: "linear-gradient(135deg,#E04A5F 0%,#9C2538 100%)",
    timestamp: "11:48 AM",
    isUnread: true,
  },
  search: {
    sender: "Threading Audit",
    initials: "TA",
    avatarGradient: "linear-gradient(135deg,#E0A75E 0%,#B07530 100%)",
    timestamp: "10:15 AM",
    isUnread: true,
  },
  compose: {
    sender: "Static Review",
    initials: "SR",
    avatarGradient: "linear-gradient(135deg,#1EA885 0%,#0F7A5F 100%)",
    timestamp: "Yesterday",
    isUnread: false,
  },
};

/* ── derive the two highest-risk dimensions for tags ── */
const DIM_LABEL: Record<RiskDimension, string> = {
  cpu: "CPU",
  gpu: "GPU",
  overdraw: "Overdraw",
  memory: "Memory",
  threading: "Threading",
  power: "Power",
};

type DimTag = { label: string; style: React.CSSProperties };

function topTags(risks: RiskProfile): DimTag[] {
  const entries = (Object.entries(risks) as [RiskDimension, RiskScore][])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .filter(([, score]) => score >= 3);

  return entries.map(([dim, score]) => {
    let bg: string;
    let color: string;
    if (score >= 5) { bg = "rgba(224,74,95,0.15)"; color = "#E04A5F"; }
    else if (score === 4) { bg = "rgba(224,167,94,0.15)"; color = "#E0A75E"; }
    else { bg = "rgba(109,74,255,0.15)"; color = "#8A7CFF"; }
    return { label: DIM_LABEL[dim], style: { background: bg, color } };
  });
}

function compositeLabel(risks: RiskProfile): string {
  const avg = (Object.values(risks) as RiskScore[]).reduce((s, v) => s + v, 0) / 6;
  if (avg <= 1.5) return "Low";
  if (avg <= 2.5) return "Low–med";
  if (avg < 3.5) return "Medium";
  if (avg < 4.2) return "Med–high";
  return "High";
}

/* ── component ── */
type Props = {
  scenario: Scenario;
  starred: boolean;
  onToggleStar: () => void;
};

export function ScenarioRow({ scenario, starred, onToggleStar }: Props) {
  const meta = SCENARIO_META[scenario.id];
  const tags = topTags(scenario.risks);
  const composite = compositeLabel(scenario.risks);
  const preview = scenario.analyses.gpuRendering.body;

  return (
    <div className="relative border-b border-proton-separator transition-colors hover:bg-proton-surface">
      {/* Unread dot — pointer-events-none so it can never block a tap */}
      {meta.isUnread && (
        <span
          aria-hidden
          className="pointer-events-none absolute left-[7px] top-[22px] h-[7px] w-[7px] rounded-full bg-proton-violet"
        />
      )}

      {/* Link wraps the actual row content — no empty overlay link */}
      <Link
        href={`/scenario/${scenario.id}`}
        aria-label={`Open scenario: ${scenario.title}`}
        className="flex gap-3 px-4 py-3.5 touch-manipulation"
      >
        {/* Avatar */}
        <div
          aria-hidden
          className="mt-0.5 flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full text-[13px] font-semibold text-white"
          style={{ background: meta.avatarGradient }}
        >
          {meta.initials}
        </div>

        {/* Body */}
        <div className="min-w-0 flex-1">
          {/* Row 1: sender + timestamp */}
          <div className="flex items-baseline justify-between gap-2">
            <span
              className={[
                "truncate text-[15px]",
                meta.isUnread
                  ? "font-semibold text-proton-text"
                  : "font-medium text-proton-text-secondary",
              ].join(" ")}
            >
              {meta.sender}
            </span>
            <span className="shrink-0 text-[12px] text-proton-text-tertiary">
              {meta.timestamp}
            </span>
          </div>

          {/* Row 2: subject */}
          <p
            className={[
              "mt-0.5 truncate text-[14px]",
              meta.isUnread
                ? "font-medium text-proton-text"
                : "text-proton-text-secondary",
            ].join(" ")}
          >
            {scenario.title} — {scenario.description}
          </p>

          {/* Row 3: preview */}
          <p className="mt-0.5 line-clamp-2 text-[13px] leading-snug text-proton-text-secondary">
            {preview}
          </p>

          {/* Row 4: tags + composite. The star button sits outside the link to its right. */}
          <div className="mt-2 flex items-center gap-2 pr-10">
            {tags.map((tag) => (
              <span
                key={tag.label}
                className="rounded px-2 py-0.5 text-[11px] font-medium"
                style={tag.style}
              >
                {tag.label}
              </span>
            ))}
            <span className="rounded bg-proton-surface-tertiary px-2 py-0.5 text-[11px] font-medium text-proton-text-secondary">
              {composite}
            </span>
          </div>
        </div>
      </Link>

      {/* Star button — sibling of Link, absolutely positioned bottom-right */}
      <button
        type="button"
        aria-label={starred ? "Unstar scenario" : "Star scenario"}
        onClick={onToggleStar}
        className="absolute bottom-[10px] right-2 flex h-10 w-10 items-center justify-center rounded-md text-proton-text-tertiary transition-colors touch-manipulation hover:text-proton-text"
      >
        <Star
          size={17}
          strokeWidth={1.75}
          className={starred ? "fill-proton-warning text-proton-warning" : ""}
        />
      </button>
    </div>
  );
}
