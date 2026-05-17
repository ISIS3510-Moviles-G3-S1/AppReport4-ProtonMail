import { scenarios } from "@/content/scenarios";
import { memoryLeakFindings, memoryRamRows } from "@/content/memory";
import { threadingFindings } from "@/content/threading";
import { microOptimizations } from "@/content/microOptimizations";

export type SearchResult = {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  category: string;
  kind: "scenario" | "memory" | "threading" | "micro-opt";
  keywords: string[];
};

export const searchIndex: SearchResult[] = [
  ...scenarios.map((scenario) => ({
    id: scenario.id,
    title: scenario.title,
    subtitle: scenario.description,
    href: `/scenario/${scenario.id}`,
    category: "Scenario",
    kind: "scenario" as const,
    keywords: [
      scenario.title,
      scenario.description,
      scenario.id,
      ...Object.values(scenario.risks).map(String),
      ...Object.values(scenario.analyses).flatMap((analysis) => [analysis.body, analysis.problemsAndStrengths]),
    ],
  })),
  ...memoryLeakFindings.map((finding) => ({
    id: finding.id,
    title: finding.title,
    subtitle: finding.body,
    href: "/memory",
    category: "Memory",
    kind: "memory" as const,
    keywords: [finding.title, finding.body, finding.category, ...(finding.references ?? [])],
  })),
  ...memoryRamRows.map((row) => ({
    id: `ram-${row.scenario}`,
    title: row.scenario,
    subtitle: row.detail,
    href: "/memory",
    category: "Memory",
    kind: "memory" as const,
    keywords: [row.scenario, row.estimate, row.detail],
  })),
  ...threadingFindings.map((finding) => ({
    id: finding.id,
    title: finding.title,
    subtitle: finding.body,
    href: "/threading",
    category: "Threading",
    kind: "threading" as const,
    keywords: [finding.title, finding.body, finding.category, ...(finding.references ?? [])],
  })),
  ...microOptimizations.map((item) => ({
    id: item.id,
    title: item.title,
    subtitle: item.purpose,
    href: `/micro-optimizations/${item.id}`,
    category: item.category.replace("-", " "),
    kind: "micro-opt" as const,
    keywords: [item.title, item.what, item.why, item.purpose, item.location.file, item.category],
  })),
];
