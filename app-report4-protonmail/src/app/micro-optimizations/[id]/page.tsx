import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/proton/AppShell";
import { tokenizeSwiftLines } from "@/lib/highlight";
import { microOptimizations } from "@/content/microOptimizations";
import { InlineMarkdown, InlineMarkdownBlock } from "@/components/ui/InlineMarkdown";

function formatCategoryLabel(category: string) {
  if (category === "existing") return "Existing";
  if (category === "tier-1-allocation") return "Tier 1";
  if (category === "tier-2-collection") return "Tier 2";
  return "Out of scope";
}

async function SwiftCodeBlock({ code }: { code: string }) {
  const lines = await tokenizeSwiftLines(code);

  return (
    <pre className="overflow-auto rounded-xl border border-proton-separator bg-[#0f1118] p-4 text-sm leading-6 text-proton-text-secondary">
      <code className="block font-mono whitespace-pre">
        {lines.map((line, lineIndex) => (
          <div key={lineIndex} className="whitespace-pre">
            {line.length > 0 ? (
              line.map((token, index) => (
                <span key={index} style={{ color: token.color }}>
                  {token.content}
                </span>
              ))
            ) : (
              <span>&nbsp;</span>
            )}
          </div>
        ))}
      </code>
    </pre>
  );
}

export default async function MicroOptimizationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = microOptimizations.find((entry) => entry.id === id);

  if (!item) {
    notFound();
  }

  return (
    <AppShell activeSection="micro-optimizations">
      <main className="mx-auto max-w-5xl px-4 py-8 text-proton-text">
        <article className="overflow-hidden rounded-2xl border border-proton-separator bg-proton-surface">
          <header className="border-b border-proton-separator bg-proton-surface-elevated px-5 py-4 sm:px-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-proton-text-tertiary">
                  {formatCategoryLabel(item.category)}
                </p>
                <h1 className="mt-1 text-xl font-semibold text-proton-text sm:text-2xl wrap-break-word">
                  <InlineMarkdown text={item.title} />
                </h1>
              </div>
              <Link href="/micro-optimizations" className="text-sm text-proton-violet hover:underline">
                Back to folders
              </Link>
            </div>
          </header>

          <div className="space-y-8 px-5 py-6 sm:px-6">
            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-proton-text">File location</h2>
              <p className="rounded-xl border border-proton-separator bg-proton-bg/60 px-4 py-3 text-sm text-proton-text-secondary wrap-break-word whitespace-normal">
                {item.location.file}
                {item.location.lines ? `:${item.location.lines[0]}-${item.location.lines[1]}` : ""}
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-proton-text">What / Where / Why / Purpose</h2>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {[
                  ["What", item.what],
                  ["Where", item.location.file],
                  ["Why", item.why],
                  ["Purpose", item.purpose],
                ].map(([label, value]) => (
                  <section key={label} className="rounded-xl border border-proton-separator bg-proton-bg/60 p-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-proton-text-tertiary">{label}</p>
                    <InlineMarkdownBlock className="text-sm leading-relaxed text-proton-text-secondary wrap-break-word whitespace-normal" text={String(value)} />
                  </section>
                ))}
              </div>
            </section>

            {item.before && item.after && (
              <section className="space-y-4">
                <h2 className="text-lg font-semibold text-proton-text">Before / After</h2>
                <div className="grid gap-4">
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-proton-text-tertiary">Before</p>
                    <SwiftCodeBlock code={item.before.code} />
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-proton-text-tertiary">After</p>
                    <SwiftCodeBlock code={item.after.code} />
                  </div>
                </div>
              </section>
            )}
          </div>
        </article>
      </main>
    </AppShell>
  );
}