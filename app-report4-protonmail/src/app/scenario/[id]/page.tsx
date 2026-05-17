import { scenarios } from "@/content/scenarios";
import { AppShell } from "@/components/proton/AppShell";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return scenarios.map((s) => ({ id: s.id }));
}

export default async function ScenarioPage(
  props: PageProps<"/scenario/[id]">
) {
  const { id } = await props.params;
  const scenario = scenarios.find((s) => s.id === id);
  if (!scenario) notFound();

  return (
    <AppShell activeSection="scenarios">
      <div className="mx-auto max-w-3xl px-4 py-8 text-proton-text">
        <p className="mb-2 text-xs text-proton-text-tertiary">Scenario detail view — coming soon</p>
        <h1 className="text-2xl font-semibold">{scenario.title}</h1>
        <p className="mt-2 text-proton-text-secondary">{scenario.description}</p>
      </div>
    </AppShell>
  );
}
