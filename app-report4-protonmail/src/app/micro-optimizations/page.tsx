import { AppShell } from "@/components/proton/AppShell";
import Link from "next/link";
import { microOptimizationFolders } from "@/content/microOptimizations";
import { InlineMarkdown } from "@/components/ui/InlineMarkdown";

function formatFolderLabel(key: string) {
  if (key === "existing") return "Existing";
  if (key === "tier1") return "Tier 1";
  if (key === "tier2") return "Tier 2";
  return "Out of scope";
}

const folderStyles: Record<string, string> = {
  existing: "bg-[#173404] text-[#C0DD97]",
  tier1: "bg-[#3D3220] text-[#FAC775]",
  tier2: "bg-[#4A1B0C] text-[#F5C4B3]",
  outOfScope: "bg-[#1f2230] text-[#9ca3af]",
};

export default function MicroOptimizationsPage() {
  return (
    <AppShell activeSection="micro-optimizations">
      <main className="mx-auto max-w-5xl px-4 py-8 text-proton-text">
        <article className="overflow-hidden rounded-2xl border border-proton-separator bg-proton-surface">
          <header className="border-b border-proton-separator bg-proton-surface-elevated px-5 py-4 sm:px-6">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-proton-text-tertiary">
              Micro-optimizations
            </p>
            <h1 className="mt-1 text-xl font-semibold text-proton-text sm:text-2xl">
              Existing and proposed micro-optimizations
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-proton-text-secondary">
              Small, localized changes from the report, grouped into the same four folders used in the audit: Existing, Tier 1, Tier 2, and Out of scope.
            </p>
          </header>

          <div className="space-y-6 px-5 py-6 sm:px-6">
            {([
              ["existing", "Existing", microOptimizationFolders.existing, "Already present in the codebase."],
              ["tier1", "Tier 1", microOptimizationFolders.tier1, "Allocation hot spots."],
              ["tier2", "Tier 2", microOptimizationFolders.tier2, "Collection idioms."],
              ["outOfScope", "Out of scope", microOptimizationFolders.outOfScope, "Identified but not treated as micro-optimizations."],
            ] as const).map(([key, label, items, description]) => (
              <section key={key} className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-proton-text">{formatFolderLabel(key)}</h2>
                    <p className="text-sm text-proton-text-tertiary">{description}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${folderStyles[key]}`}>
                    {Array.isArray(items) ? items.length : 0}
                  </span>
                </div>

                <div className="grid gap-3">
                  {key === "outOfScope"
                    ? (items as typeof microOptimizationFolders.outOfScope).map((folder, index) => (
                        <div key={index} className="rounded-xl border border-proton-separator bg-proton-bg/60 p-4">
                          <p className="text-sm font-medium text-proton-text">{folder.title}</p>
                          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-proton-text-secondary list-disc pl-5">
                            {folder.body.map((line) => (
                              <li key={line}>{line}</li>
                            ))}
                          </ul>
                        </div>
                      ))
                    : (items as typeof microOptimizationFolders.existing).map((item) => (
                        <Link
                          key={item.id}
                          href={`/micro-optimizations/${item.id}`}
                          className="rounded-xl border border-proton-separator bg-proton-bg/60 p-4 transition-colors touch-manipulation hover:bg-proton-surface-elevated active:bg-proton-surface-elevated"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-medium text-proton-text wrap-break-word">
                                <InlineMarkdown text={item.title} />
                              </p>
                              <p className="mt-1 text-xs uppercase tracking-wide text-proton-text-tertiary wrap-break-word">
                                <InlineMarkdown text={item.location.file} />
                              </p>
                            </div>
                            <span className={`rounded-full px-2.5 py-1 text-[0.6875rem] font-semibold uppercase tracking-wider ${folderStyles[key]}`}>
                              {formatFolderLabel(key)}
                            </span>
                          </div>
                          <p className="mt-3 text-sm leading-relaxed text-proton-text-secondary wrap-break-word">
                            <InlineMarkdown text={item.purpose} />
                          </p>
                        </Link>
                      ))}
                </div>
              </section>
            ))}
          </div>
        </article>
      </main>
    </AppShell>
  );
}
