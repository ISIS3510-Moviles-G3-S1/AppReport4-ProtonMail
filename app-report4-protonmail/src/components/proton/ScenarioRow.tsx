import Link from "next/link";
import type { Scenario, RiskScore, RiskProfile } from "@/lib/types";
import { RiskChipStrip } from "@/components/ui/RiskChip";

const SCENARIO_ICONS: Record<Scenario["id"], string> = {
  "cold-launch": "CL",
  "scroll-mailbox": "SM",
  "rich-email": "RE",
  search: "SR",
  compose: "CP",
};

function compositeLabel(risks: RiskProfile): string {
  const avg =
    (Object.values(risks) as RiskScore[]).reduce((s, v) => s + v, 0) / 6;
  if (avg <= 1.5) return "Low";
  if (avg <= 2.5) return "Low–med";
  if (avg < 3.5) return "Medium";
  if (avg < 4.2) return "Med–high";
  return "High";
}

type Props = { scenario: Scenario };

export function ScenarioRow({ scenario }: Props) {
  const initials = SCENARIO_ICONS[scenario.id];
  const composite = compositeLabel(scenario.risks);

  return (
    <Link
      href={`/scenario/${scenario.id}`}
      className="group flex items-start gap-3 border-b border-proton-separator px-4 py-3 hover:bg-proton-surface-elevated focus-visible:bg-proton-surface-elevated"
    >
      <div
        aria-hidden
        className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-proton-violet/20 text-[0.625rem] font-bold text-proton-violet"
      >
        {initials}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <p className="truncate text-sm font-semibold text-proton-text">
            {scenario.title}
          </p>
          <span className="ml-auto shrink-0 text-xs text-proton-text-tertiary">
            {composite}
          </span>
        </div>

        <p className="mt-0.5 truncate text-sm text-proton-text-secondary">
          {scenario.description}
        </p>

        <div className="mt-1.5">
          <RiskChipStrip risks={scenario.risks} size="sm" />
        </div>
      </div>
    </Link>
  );
}
