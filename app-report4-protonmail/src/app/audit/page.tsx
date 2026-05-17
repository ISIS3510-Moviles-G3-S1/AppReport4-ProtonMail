import { AppShell } from "@/components/proton/AppShell";
import { InlineMarkdownBlock } from "@/components/ui/InlineMarkdown";

export default function AuditPage() {
  return (
    <AppShell activeSection="audit">
      <main className="mx-auto max-w-4xl px-4 py-8 text-proton-text">
        <article className="overflow-hidden rounded-2xl border border-proton-separator bg-proton-surface shadow-[0_1px_0_rgba(255,255,255,0.02)]">
          <header className="border-b border-proton-separator bg-proton-surface-elevated px-5 py-4 sm:px-6">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-proton-text-tertiary">
              Technical Audit
            </p>
            <h1 className="mt-1 text-xl font-semibold text-proton-text sm:text-2xl">
              Technical Audit summary
            </h1>
          </header>

          <div className="space-y-8 px-5 py-6 sm:px-6">
            <section className="rounded-xl border border-proton-separator bg-proton-bg/60 p-4">
              <InlineMarkdownBlock
                className="text-sm leading-relaxed text-proton-text-secondary"
                text="In this app report I write a technical audit of the Proton Mail iOS application. The app shows good architectural use of pagination, async operations, bounded image caching, and WebKit cleanup."
              />
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-proton-text">Strengths observed</h2>
              <div className="grid gap-3 md:grid-cols-2">
                {[
                  "Pagination keeps the working set bounded in mailbox and search flows.",
                  "Async operations separate network, SDK, and rendering work from the main interaction path.",
                  "The sender image cache is bounded, which keeps RAM from growing without control.",
                  "WebKit cleanup removes script handlers and avoids the most obvious retain-cycle paths.",
                ].map((item) => (
                  <div key={item} className="rounded-xl border border-proton-separator bg-proton-bg/60 p-4 text-sm leading-relaxed text-proton-text-secondary">
                    {item}
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-proton-text">Main performance risks</h2>
              <div className="rounded-xl border border-proton-separator bg-proton-bg/60 p-4 text-sm leading-relaxed text-proton-text-secondary space-y-3">
                <p>Animated loading skeletons create visible GPU and power pressure during cold start.</p>
                <p>Rich email rendering through <code className="rounded bg-[#1b1f2b] px-1.5 py-0.5 text-[0.85em] text-[#c8d0ff]">WKWebView</code> increases CPU, GPU, memory, and threading cost.</p>
                <p>Synchronous attachment file copying can block the main actor when attachments are large.</p>
                <p>Heavy main-actor UI updates and cache synchronization issues can produce short bursts of thread contention.</p>
              </div>
            </section>
          </div>
        </article>
      </main>
    </AppShell>
  );
}
