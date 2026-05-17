"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { HeaderBar } from "./HeaderBar";
import { NavigationDrawer } from "./NavigationDrawer";
import { SearchDropdown } from "./SearchDropdown";

const SECTION_TITLES: Record<string, string> = {
  overview: "Overview",
  scenarios: "Inbox",
  memory: "Memory Management",
  threading: "Threading",
  "micro-optimizations": "Micro-optimizations",
  audit: "Technical Audit",
  settings: "Settings",
};

function getSectionFromPath(pathname: string): string {
  if (pathname === "/") return "scenarios";
  if (pathname.startsWith("/scenario")) return "scenarios";
  const first = pathname.split("/").filter(Boolean)[0];
  return first ?? "scenarios";
}

type Props = {
  children: ReactNode;
  activeSection?: string;
};

export function AppShell({ children, activeSection }: Props) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const currentSection = activeSection ?? getSectionFromPath(pathname);

  // Close the drawer whenever the route changes.
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-proton-bg text-proton-text">
      <HeaderBar
        title={SECTION_TITLES[currentSection] ?? "Inbox"}
        onToggleDrawer={() => setDrawerOpen((v) => !v)}
        onToggleSearch={() => setSearchOpen((v) => !v)}
      />
      <SearchDropdown open={searchOpen} onClose={() => setSearchOpen(false)} />
      <main>{children}</main>

      {/* Drawer — conditionally rendered. No transforms, no transitions.
          When closed it does NOT exist in the DOM, so it cannot intercept
          any pointer events anywhere on the page. */}
      {drawerOpen && (
        <>
          <div
            aria-hidden="true"
            onClick={() => setDrawerOpen(false)}
            className="fixed inset-0 z-40 bg-black/60"
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-72 shadow-2xl">
            <NavigationDrawer
              activeId={currentSection}
              onClose={() => setDrawerOpen(false)}
            />
          </aside>
        </>
      )}
    </div>
  );
}
