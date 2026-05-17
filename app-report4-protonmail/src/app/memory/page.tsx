import { AppShell } from "@/components/proton/AppShell";
import { memoryLeakFindings, memoryRamRows } from "@/content/memory";
import { InlineMarkdownBlock } from "@/components/ui/InlineMarkdown";

const sectionTone: Record<string, string> = {
  "leak-risk": "bg-[#4A1B0C] text-[#F5C4B3]",
  "ram-consumption": "bg-[#3D3220] text-[#FAC775]",
  "tooling-recommendation": "bg-[#173404] text-[#C0DD97]",
};

export default function MemoryPage() {
  return (
    <AppShell activeSection="memory">
      <main className="mx-auto max-w-4xl px-4 py-8 text-proton-text">
        <article className="overflow-hidden rounded-2xl border border-proton-separator bg-proton-surface shadow-[0_1px_0_rgba(255,255,255,0.02)]">
          <header className="border-b border-proton-separator bg-proton-surface-elevated px-5 py-4 sm:px-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-proton-text-tertiary">
                  Memory Management
                </p>
                <h1 className="mt-1 text-xl font-semibold text-proton-text sm:text-2xl">
                  Memory Management in the app
                </h1>
              </div>
              <div className="rounded-full border border-proton-separator bg-[#11131a] px-3 py-1 text-xs text-proton-text-tertiary">
                Static analysis email
              </div>
            </div>
            <div className="mt-4 grid gap-2 text-sm text-proton-text-secondary sm:grid-cols-[auto,1fr] sm:gap-x-4">
              <span className="text-proton-text-tertiary">To</span>
              <span>App Report 4 reviewers</span>
              <span className="text-proton-text-tertiary">Subject</span>
              <span>Memory risks, RAM pressure, and leak tooling</span>
            </div>
          </header>

          <div className="space-y-8 px-5 py-6 sm:px-6">
            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-proton-text">a) Does the app have memory leaks? Which? Where?</h2>
              {memoryLeakFindings.map((finding) => (
                <div
                  key={finding.id}
                  className="rounded-xl border border-proton-separator bg-proton-bg/60 p-4"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-2.5 py-1 text-[0.6875rem] font-semibold uppercase tracking-wider ${sectionTone[finding.category]}`}>
                      {finding.category.replace("-", " ")}
                    </span>
                    <h3 className="text-base font-medium text-proton-text">{finding.title}</h3>
                  </div>
                  {finding.references && finding.references.length > 0 && (
                    <p className="mt-2 text-xs uppercase tracking-wide text-proton-text-tertiary">
                      References: {finding.references.join(" · ")}
                    </p>
                  )}
                  <div className="mt-3 space-y-3 text-sm leading-relaxed text-proton-text-secondary">
                    {finding.body.split("\n\n").map((paragraph, index) => (
                      <InlineMarkdownBlock key={`${finding.id}-${index}`} text={paragraph} />
                    ))}
                  </div>
                </div>
              ))}
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-proton-text">b) RAM consumption</h2>
              <div className="overflow-hidden rounded-xl border border-proton-separator bg-[#0f1118]">
                <table className="min-w-full divide-y divide-proton-separator text-left text-sm">
                  <thead className="bg-proton-surface-elevated/80 text-xs uppercase tracking-[0.14em] text-proton-text-tertiary">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">Scenario</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Estimated RAM behavior</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Detail</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-proton-separator">
                    {memoryRamRows.map((row) => (
                      <tr key={row.scenario} className="align-top text-proton-text-secondary">
                        <td className="px-4 py-3 font-medium text-proton-text">{row.scenario}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-proton-text-secondary">{row.estimate}</td>
                        <td className="px-4 py-3 leading-relaxed">{row.detail}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-proton-text">c) Libraries and tools for leak management</h2>
              <div className="rounded-xl border border-proton-separator bg-proton-bg/60 p-4 space-y-4 text-sm leading-relaxed text-proton-text-secondary">
                <InlineMarkdownBlock
                  className="leading-relaxed"
                  text="The recommended native tools are `Xcode Memory Graph`, `Instruments Allocations`, and `Instruments Leaks`. Memory Graph snapshots help inspect object reference chains, while Allocations tracks heap and virtual-memory growth over time. Apple also documents command-line tools such as `vmmap` and `leaks` for deeper investigation."
                />
                <InlineMarkdownBlock
                  className="leading-relaxed"
                  text="Possible debug-only helpers include `FBRetainCycleDetector`, `LifetimeTracker`, and `LeakDetector`. These tools should not replace Instruments, but they can catch regressions earlier during development."
                />
              </div>
            </section>
          </div>
        </article>
      </main>
    </AppShell>
  );
}
