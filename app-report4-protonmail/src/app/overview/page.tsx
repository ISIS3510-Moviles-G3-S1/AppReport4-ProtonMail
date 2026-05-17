import { AppShell } from "@/components/proton/AppShell";

export default function OverviewPage() {
  return (
    <AppShell activeSection="overview">
      <main className="mx-auto max-w-3xl px-4 py-8 text-proton-text">
        <h1 className="text-2xl font-semibold mb-4">Overview & Disclaimer</h1>
        <div className="prose prose-invert max-w-none space-y-4 text-proton-text-secondary">
          <p>
            This companion app presents findings from <strong>App Report 4</strong>, a static-analysis audit of Proton Mail iOS conducted for ISIS-3510 at Universidad de los Andes.
          </p>
          <h2 className="text-lg font-semibold text-proton-text mt-6">Static Analysis Only</h2>
          <p>
            Because the application could not be built or launched from the public checkout, Instruments/Xcode profiler metrics were <strong>not collected</strong>. The risk scores presented here use a <strong>1–5 relative risk scale</strong> based on static code review evidence such as Lottie skeleton rows, WKWebView usage, cache bounds, async patterns, and threading complexity.
          </p>
          <p>
            <strong>Scale:</strong> 1 = low risk, 3 = medium, 5 = high risk. A higher score indicates the code path is more likely to create performance pressure in that dimension.
          </p>
          <h2 className="text-lg font-semibold text-proton-text mt-6">Methodology</h2>
          <p>
            Analysis focused on five key user scenarios: Cold Launch, Scroll Mailbox, Rich Email Body, Search, and Compose. For each scenario, six dimensions were assessed: GPU Rendering, Overdrawing, Memory Management, Threading, CPU, and Power.
          </p>
          <p>
            Findings include identification of existing micro-optimizations already in the codebase and nine proposed improvements organized into Tier 1 (allocation hot spots) and Tier 2 (collection idioms).
          </p>
          <h2 className="text-lg font-semibold text-proton-text mt-6">How to Use This App</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Scenarios:</strong> Five key user journeys with risk profiles and detailed analysis.</li>
            <li><strong>Memory Management:</strong> Leak risks, RAM consumption patterns, and recommended tools.</li>
            <li><strong>Threading:</strong> Async usage, main-thread stalls, and performance effects.</li>
            <li><strong>Micro-optimizations:</strong> Existing and proposed code improvements with before/after diffs.</li>
            <li><strong>Technical Audit:</strong> Summary of architecture, strengths, and performance risks.</li>
          </ul>
          <h2 className="text-lg font-semibold text-proton-text mt-6">About This Companion</h2>
          <p>
            This Next.js app is a supplementary tool created to accompany the formal PDF submission of App Report 4. The PDF is the graded deliverable; this companion enables interactive exploration of findings. Both resources are linked and referenced together.
          </p>
        </div>
      </main>
    </AppShell>
  );
}
