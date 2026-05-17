import { AppShell } from "@/components/proton/AppShell";
import { threadingFindings } from "@/content/threading";
import { InlineMarkdownBlock } from "@/components/ui/InlineMarkdown";

const categoryTone: Record<string, string> = {
  "thread-creation": "bg-[#173404] text-[#C0DD97]",
  "main-thread-stall": "bg-[#4A1B0C] text-[#F5C4B3]",
  "effect-analysis": "bg-[#3D3220] text-[#FAC775]",
};

export default function ThreadingPage() {
  return (
    <AppShell activeSection="threading">
      <main className="mx-auto max-w-4xl px-4 py-8 text-proton-text">
        <article className="overflow-hidden rounded-2xl border border-proton-separator bg-proton-surface shadow-[0_1px_0_rgba(255,255,255,0.02)]">
          <header className="border-b border-proton-separator bg-proton-surface-elevated px-5 py-4 sm:px-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-proton-text-tertiary">
                  Threading
                </p>
                <h1 className="mt-1 text-xl font-semibold text-proton-text sm:text-2xl">
                  Global Threading Analysis
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
              <span>Async usage, main-thread stalls, and performance effects</span>
            </div>
          </header>

          <div className="space-y-8 px-5 py-6 sm:px-6">
            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-proton-text">1. Where threads or async features are used</h2>
              {threadingFindings.map((finding) => {
                if (finding.category !== "thread-creation") return null;

                return (
                  <div key={finding.id} className="rounded-xl border border-proton-separator bg-proton-bg/60 p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-2.5 py-1 text-[0.6875rem] font-semibold uppercase tracking-wider ${categoryTone[finding.category]}`}>
                        {finding.category.replace("-", " ")}
                      </span>
                      <h3 className="text-base font-medium text-proton-text">{finding.title}</h3>
                    </div>
                    {finding.references && finding.references.length > 0 && (
                      <p className="mt-2 text-xs uppercase tracking-wide text-proton-text-tertiary">
                        References: {finding.references.join(" · ")}
                      </p>
                    )}
                    <InlineMarkdownBlock className="mt-3 text-sm leading-relaxed text-proton-text-secondary" text={finding.body} />
                  </div>
                );
              })}
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-proton-text">2. Possible main-thread locks or stalls</h2>
              {threadingFindings.map((finding) => {
                if (finding.category !== "main-thread-stall") return null;

                return (
                  <div key={finding.id} className="rounded-xl border border-proton-separator bg-proton-bg/60 p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-2.5 py-1 text-[0.6875rem] font-semibold uppercase tracking-wider ${categoryTone[finding.category]}`}>
                        {finding.category.replace("-", " ")}
                      </span>
                      <h3 className="text-base font-medium text-proton-text">{finding.title}</h3>
                    </div>
                    {finding.references && finding.references.length > 0 && (
                      <p className="mt-2 text-xs uppercase tracking-wide text-proton-text-tertiary">
                        References: {finding.references.join(" · ")}
                      </p>
                    )}
                    <InlineMarkdownBlock className="mt-3 text-sm leading-relaxed text-proton-text-secondary" text={finding.body} />
                  </div>
                );
              })}
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-proton-text">3. Effect of async and multithreading on performance</h2>
              {threadingFindings.map((finding) => {
                if (finding.category !== "effect-analysis") return null;

                return (
                  <div key={finding.id} className="rounded-xl border border-proton-separator bg-proton-bg/60 p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-2.5 py-1 text-[0.6875rem] font-semibold uppercase tracking-wider ${categoryTone[finding.category]}`}>
                        {finding.category.replace("-", " ")}
                      </span>
                      <h3 className="text-base font-medium text-proton-text">{finding.title}</h3>
                    </div>
                    {finding.references && finding.references.length > 0 && (
                      <p className="mt-2 text-xs uppercase tracking-wide text-proton-text-tertiary">
                        References: {finding.references.join(" · ")}
                      </p>
                    )}
                    <InlineMarkdownBlock className="mt-3 text-sm leading-relaxed text-proton-text-secondary" text={finding.body} />
                  </div>
                );
              })}
            </section>
          </div>
        </article>
      </main>
    </AppShell>
  );
}
