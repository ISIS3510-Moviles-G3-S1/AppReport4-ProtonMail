import { AppShell } from "@/components/proton/AppShell";
import { ScenarioRow } from "@/components/proton/ScenarioRow";
import { scenarios } from "@/content/scenarios";

export default function Page() {
  return (
    <AppShell activeSection="scenarios">
      <div className="mx-auto max-w-3xl">
        <div className="border-b border-proton-separator px-4 py-2">
          <p className="text-xs text-proton-text-tertiary">
            {scenarios.length} scenarios · static analysis · 1–5 risk scale
          </p>
        </div>
        {scenarios.map((scenario) => (
          <ScenarioRow key={scenario.id} scenario={scenario} />
        ))}
      </div>
    </AppShell>
  );
}
