import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Monitor, Layers, MemoryStick, GitBranch } from "lucide-react";

import { AppShell } from "@/components/proton/AppShell";
import { AnalysisMessage, AnalysisSection } from "@/components/proton/AnalysisMessage";
import { ProseBody } from "@/components/ui/ProseBody";
import { RiskProfileGrid } from "@/components/ui/RiskChip";
import { scenarios } from "@/content/scenarios";
import type { AnalysisBlock } from "@/lib/types";

export function generateStaticParams() {
  return scenarios.map((s) => ({ id: s.id }));
}

const ESTIMATE_SCORE: Record<AnalysisBlock["estimate"], 1 | 2 | 3 | 4 | 5> = {
  low: 1,
  "low-medium": 2,
  medium: 3,
  "medium-high": 4,
  high: 5,
};

const ESTIMATE_LABEL: Record<AnalysisBlock["estimate"], string> = {
  low: "Low",
  "low-medium": "Low–medium",
  medium: "Medium",
  "medium-high": "Medium–high",
  high: "High",
};

export default async function ScenarioPage(
  props: PageProps<"/scenario/[id]">
) {
  const { id } = await props.params;
  const scenario = scenarios.find((s) => s.id === id);
  if (!scenario) notFound();

  const { analyses } = scenario;

  const messages = [
    {
      key: "gpu",
      title: "GPU Rendering",
      icon: <Monitor size={16} strokeWidth={1.75} />,
      analysis: analyses.gpuRendering,
    },
    {
      key: "overdraw",
      title: "Overdrawing",
      icon: <Layers size={16} strokeWidth={1.75} />,
      analysis: analyses.overdrawing,
    },
    {
      key: "memory",
      title: "Memory Management",
      icon: <MemoryStick size={16} strokeWidth={1.75} />,
      analysis: analyses.memoryManagement,
    },
    {
      key: "threading",
      title: "Threading",
      icon: <GitBranch size={16} strokeWidth={1.75} />,
      analysis: analyses.threading,
    },
  ] as const;

  return (
    <AppShell activeSection="scenarios">
      <div className="mx-auto max-w-3xl px-3 py-6 sm:px-4">
        {/* breadcrumb */}
        <Link
          href="/"
          className="mb-5 inline-flex items-center gap-1.5 py-2 text-sm text-proton-text-tertiary touch-manipulation hover:text-proton-text active:text-proton-text"
        >
          <ArrowLeft size={14} strokeWidth={2} />
          Scenarios
        </Link>

        {/* scenario header */}
        <div className="mb-6 px-1">
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-proton-text-tertiary">
            Scenario
          </p>
          <h1 className="text-xl font-semibold text-proton-text break-words">
            {scenario.title}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-proton-text-secondary break-words">
            {scenario.description}
          </p>
        </div>

        {/* six labeled risk chips */}
        <div className="mb-6 rounded-xl border border-proton-separator bg-proton-surface px-4 py-4 sm:px-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-proton-text-tertiary">
            Risk profile · 1 = low, 5 = high
          </p>
          <RiskProfileGrid risks={scenario.risks} />
        </div>

        {/* thread of four analysis messages */}
        <div className="overflow-hidden rounded-xl border border-proton-separator bg-proton-surface">
          <div className="border-b border-proton-separator bg-proton-surface-elevated px-4 py-2">
            <p className="text-xs text-proton-text-tertiary">
              4 analyses · §4.2 estimate + §4.3 problems & strengths
            </p>
          </div>

          {messages.map(({ key, title, icon, analysis }, i) => (
            <AnalysisMessage
              key={key}
              title={title}
              estimate={ESTIMATE_LABEL[analysis.estimate]}
              estimateScore={ESTIMATE_SCORE[analysis.estimate]}
              defaultOpen={i === 0}
              icon={icon}
            >
              <AnalysisSection label="§ 4.2 Analysis">
                <ProseBody text={analysis.body} />
              </AnalysisSection>
              <AnalysisSection label="§ 4.3 Problems & Strengths">
                <ProseBody text={analysis.problemsAndStrengths} />
              </AnalysisSection>
            </AnalysisMessage>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
