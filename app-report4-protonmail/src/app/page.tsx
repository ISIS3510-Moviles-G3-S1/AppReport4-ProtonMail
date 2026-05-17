"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { AppShell } from "@/components/proton/AppShell";
import { ScenarioRow } from "@/components/proton/ScenarioRow";
import { scenarios } from "@/content/scenarios";
import type { Scenario, RiskScore } from "@/lib/types";

type Filter = "all" | "high-risk" | "starred";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "high-risk", label: "High Risk" },
  { id: "starred", label: "Starred" },
];

function hasHighRisk(scenario: Scenario): boolean {
  return (Object.values(scenario.risks) as RiskScore[]).some((v) => v >= 4);
}

export default function Page() {
  const [filter, setFilter] = useState<Filter>("all");
  const [starred, setStarred] = useState<Set<string>>(new Set());

  const filtered = scenarios.filter((s) => {
    if (filter === "high-risk") return hasHighRisk(s);
    if (filter === "starred") return starred.has(s.id);
    return true;
  });

  function toggleStar(id: string) {
    setStarred((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <AppShell activeSection="scenarios">
      <div className="relative mx-auto max-w-3xl pb-24">
        {/* Filter strip */}
        <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-3 pt-2">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={[
                "shrink-0 rounded-2xl border px-3.5 py-2 text-[13px] font-medium whitespace-nowrap transition-colors touch-manipulation",
                filter === f.id
                  ? "border-transparent bg-proton-violet/15 text-proton-violet-soft"
                  : "border-proton-separator text-proton-text-secondary hover:border-proton-violet/40 hover:text-proton-text active:border-proton-violet/40",
              ].join(" ")}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Audit attestation banner */}
        <div className="mx-4 mb-3 rounded-[10px] border-l-[3px] border-proton-violet bg-proton-violet/8 px-4 py-3 text-[12.5px] leading-relaxed text-proton-text-secondary">
          <span className="font-semibold text-proton-violet-soft">
            App Report 4 — Proton Mail iOS.
          </span>{" "}
          In this app report I write a technical audit of the Proton Mail iOS application, identifying and reporting technical issues related to the course topics in a detailed way.
        </div>

        {/* Scenario list */}
        {filtered.length === 0 ? (
          <div className="px-4 py-16 text-center text-sm text-proton-text-tertiary">
            No scenarios match this filter.
          </div>
        ) : (
          filtered.map((scenario) => (
            <ScenarioRow
              key={scenario.id}
              scenario={scenario}
              starred={starred.has(scenario.id)}
              onToggleStar={() => toggleStar(scenario.id)}
            />
          ))
        )}
      </div>

      {/* FAB — navigates to micro-optimizations (compose metaphor) */}
      <Link
        href="/micro-optimizations"
        aria-label="View micro-optimizations"
        style={{
          bottom: "calc(env(safe-area-inset-bottom, 0px) + 1.5rem)",
          right: "calc(env(safe-area-inset-right, 0px) + 1.5rem)",
        }}
        className="fixed z-20 flex h-14 w-14 items-center justify-center rounded-[18px] bg-proton-violet shadow-[0_8px_24px_rgba(109,74,255,0.4)] transition-all touch-manipulation hover:-translate-y-0.5 hover:bg-proton-violet-hover active:bg-proton-violet-hover"
      >
        <Plus size={24} strokeWidth={2} className="text-white" />
      </Link>
    </AppShell>
  );
}
