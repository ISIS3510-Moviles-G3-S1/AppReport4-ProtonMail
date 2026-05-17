import { scenarios } from "@/content/scenarios";
import { AppShell } from "@/components/proton/AppShell";
import { notFound } from "next/navigation";
import { RiskChip } from "@/components/ui/RiskChip";
import { InlineMarkdownBlock } from "@/components/ui/InlineMarkdown";
import Link from "next/link";

type PageProps<T extends string> = {
  params: Promise<Record<string, string>>;
};

export function generateStaticParams() {
  return scenarios.map((s) => ({ id: s.id }));
}

export default async function ScenarioPage(
  props: PageProps<"/scenario/[id]">
) {
  const { id } = await props.params;
  const scenario = scenarios.find((s) => s.id === id);
  if (!scenario) notFound();

  const riskDimensions: Array<[keyof typeof scenario.risks, string]> = [
    ["cpu", "CPU"],
    ["gpu", "GPU"],
    ["overdraw", "Overdraw"],
    ["memory", "Memory"],
    ["threading", "Threading"],
    ["power", "Power"],
  ];

  return (
    <AppShell activeSection="scenarios">
      <main className="mx-auto max-w-4xl px-4 py-8 text-proton-text">
        <article className="overflow-hidden rounded-2xl border border-proton-separator bg-proton-surface">
          <header className="border-b border-proton-separator bg-proton-surface-elevated px-5 py-4 sm:px-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-proton-text-tertiary">Scenario</p>
                <h1 className="mt-1 text-xl font-semibold text-proton-text sm:text-2xl">{scenario.title}</h1>
                <p className="mt-2 text-sm leading-relaxed text-proton-text-secondary">{scenario.description}</p>
              </div>
              <Link href="/" className="text-sm text-proton-violet hover:underline">
                Back to inbox
              </Link>
            </div>
          </header>

          <div className="space-y-8 px-5 py-6 sm:px-6">
            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-proton-text">Risk profile</h2>
              <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                {riskDimensions.map(([key, label]) => (
                  <div key={key}>
                    <RiskChip score={scenario.risks[key]} dimension={key as any} />
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-proton-text">GPU Rendering</h2>
              <div className="rounded-xl border border-proton-separator bg-proton-bg/60 p-4 space-y-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-proton-text-tertiary">Analysis (§4.2)</p>
                  <InlineMarkdownBlock className="mt-2 text-sm leading-relaxed text-proton-text-secondary" text={scenario.analyses.gpuRendering.body} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-proton-text-tertiary">Problems & Strengths (§4.3)</p>
                  <InlineMarkdownBlock className="mt-2 text-sm leading-relaxed text-proton-text-secondary" text={scenario.analyses.gpuRendering.problemsAndStrengths} />
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-proton-text">Overdrawing</h2>
              <div className="rounded-xl border border-proton-separator bg-proton-bg/60 p-4 space-y-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-proton-text-tertiary">Analysis (§4.2)</p>
                  <InlineMarkdownBlock className="mt-2 text-sm leading-relaxed text-proton-text-secondary" text={scenario.analyses.overdrawing.body} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-proton-text-tertiary">Problems & Strengths (§4.3)</p>
                  <InlineMarkdownBlock className="mt-2 text-sm leading-relaxed text-proton-text-secondary" text={scenario.analyses.overdrawing.problemsAndStrengths} />
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-proton-text">Memory Management</h2>
              <div className="rounded-xl border border-proton-separator bg-proton-bg/60 p-4 space-y-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-proton-text-tertiary">Analysis (§4.2)</p>
                  <InlineMarkdownBlock className="mt-2 text-sm leading-relaxed text-proton-text-secondary" text={scenario.analyses.memoryManagement.body} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-proton-text-tertiary">Problems & Strengths (§4.3)</p>
                  <InlineMarkdownBlock className="mt-2 text-sm leading-relaxed text-proton-text-secondary" text={scenario.analyses.memoryManagement.problemsAndStrengths} />
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-proton-text">Threading</h2>
              <div className="rounded-xl border border-proton-separator bg-proton-bg/60 p-4 space-y-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-proton-text-tertiary">Analysis (§4.2)</p>
                  <InlineMarkdownBlock className="mt-2 text-sm leading-relaxed text-proton-text-secondary" text={scenario.analyses.threading.body} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-proton-text-tertiary">Problems & Strengths (§4.3)</p>
                  <InlineMarkdownBlock className="mt-2 text-sm leading-relaxed text-proton-text-secondary" text={scenario.analyses.threading.problemsAndStrengths} />
                </div>
              </div>
            </section>
          </div>
        </article>
      </main>
    </AppShell>
  );
}
