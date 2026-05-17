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
  ["Proposed PR", "https://github.com/ProtonMail/ios-mail/pull/112"],
  ["Term", "2025-2"],
  ["Deliverable", "App Report 4 (this companion + the accompanying PDF)"],
  ["Methodology note", "Static code review only — see Overview / Disclaimer."],
] as const;

export default function SettingsPage() {
  return (
    <AppShell activeSection="settings">
      <main className="mx-auto max-w-4xl px-4 py-8 text-proton-text">
        <div className="mb-6 grid gap-6 sm:grid-cols-[220px,1fr]">
          {/* Profile card */}
          <aside className="rounded-2xl border border-proton-separator bg-proton-surface p-4">
            <div className="flex flex-col items-center gap-3 text-center">
              <div
                className="flex h-20 w-20 items-center justify-center rounded-full text-2xl font-semibold text-white"
                style={{
                  background: "linear-gradient(135deg, #6D4AFF 0%, #4F2BD9 100%)",
                }}
              >
                G13
              </div>
              <div>
                <p className="text-sm font-semibold text-proton-text">Group 13</p>
                <p className="mt-1 text-xs text-proton-text-secondary">ISIS-3510 · App Report 4</p>
              </div>
              <div className="mt-2 w-full text-sm text-proton-text-secondary">
                <p className="font-medium text-proton-text-tertiary">Team</p>
                <p className="mt-1">Mariana Pineda Miranda<br/>Joseph Steven Linares<br/>Felipe A. Mesa N.</p>
              </div>
            </div>
          </aside>

          {/* Main content */}
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
                        <dd className="text-proton-text-secondary">
                          {value.startsWith("http") ? (
                            <a
                              href={value}
                              target="_blank"
                              rel="noreferrer"
                              className="text-proton-violet underline"
                            >
                              {value}
                            </a>
                          ) : (
                            value
                          )}
                        </dd>
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
        </div>
      </main>
    </AppShell>
  );
}