import { AppShell } from "@/components/proton/AppShell";

export default function MemoryPage() {
  return (
    <AppShell activeSection="memory">
      <main className="mx-auto max-w-3xl px-4 py-8 text-proton-text">
        <h1 className="text-2xl font-semibold mb-4">Memory Management</h1>
        <p className="text-proton-text-secondary">Memory Management findings — coming soon</p>
      </main>
    </AppShell>
  );
}
