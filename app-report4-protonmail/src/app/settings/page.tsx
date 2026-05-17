import { AppShell } from "@/components/proton/AppShell";
import { InlineMarkdownBlock } from "@/components/ui/InlineMarkdown";

const metadata = [
  ["Course", "ISIS-3510 Construcción de Aplicaciones Móviles"],
  ["Institution", "Universidad de los Andes"],
  ["Professor", "Vivian Natalia Gomez Cubillos"],
  ["Group", "13"],
  ["Team", "Mariana Pineda Miranda, Joseph Steven Linares, Felipe A. Mesa N."],
  ["App under analysis", "Proton Mail iOS"],
  ["Repository", "https://github.com/ProtonMail/ios-mail"],
  ["Term", "2025-2"],
  ["Deliverable", "App Report 4 (this companion + the accompanying PDF)"],
  ["Methodology note", "Static code review only — see Overview / Disclaimer."],
] as const;

export default function SettingsPage() {
  return (
    <AppShell activeSection="settings">
      <main className="mx-auto max-w-4xl px-4 py-8 text-proton-text">
        <article className="overflow-hidden rounded-2xl border border-proton-separator bg-proton-surface shadow-[0_1px_0_rgba(255,255,255,0.02)]">
          <header className="border-b border-proton-separator bg-proton-surface-elevated px-5 py-4 sm:px-6">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-proton-text-tertiary">
              Settings / About
            </p>
            <h1 className="mt-1 text-xl font-semibold text-proton-text sm:text-2xl">
              Project metadata and disclaimer
            </h1>
          </header>

          <div className="space-y-8 px-5 py-6 sm:px-6">
            <section className="rounded-xl border border-[#4A1B0C] bg-[#26140f] p-4">
              <h2 className="text-lg font-semibold text-[#F5C4B3]">Static-analysis disclaimer</h2>
              <InlineMarkdownBlock
                className="mt-3 text-sm leading-relaxed text-[#F5C4B3]"
                text="App Report 4 was conducted entirely through static code review of the public Proton Mail iOS repository. The application could not be built or launched from the checkout, so Instruments/Xcode profiler metrics were not collected. The risk scores presented in this companion are 1–5 relative risk estimates, not measured CPU, GPU, thread, or energy values."
              />
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-proton-text">Project metadata</h2>
              <div className="overflow-hidden rounded-xl border border-proton-separator bg-proton-bg/60">
                <dl className="divide-y divide-proton-separator text-sm">
                  {metadata.map(([label, value]) => (
                    <div key={label} className="grid gap-1 px-4 py-3 sm:grid-cols-[220px,1fr] sm:gap-4">
                      <dt className="font-medium text-proton-text-tertiary">{label}</dt>
                      <dd className="text-proton-text-secondary">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-proton-text">Companion scope</h2>
              <div className="rounded-xl border border-proton-separator bg-proton-bg/60 p-4 text-sm leading-relaxed text-proton-text-secondary space-y-3">
                <p>
                  This Next.js app is a supplementary tool created to accompany the formal PDF submission of App Report 4.
                </p>
                <p>
                  The PDF is the graded deliverable; this companion enables interactive exploration of findings.
                </p>
                <p>
                  Both resources are linked and referenced together.
                </p>
              </div>
            </section>
          </div>
        </article>
      </main>
    </AppShell>
  );
}