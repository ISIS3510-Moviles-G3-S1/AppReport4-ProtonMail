"use client";

import { useState, type ReactNode } from "react";
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
  // Extract section from pathname
  // /overview -> overview
  // /memory -> memory
  // /scenario/cold-launch -> scenarios
  // / -> scenarios
  if (pathname === "/") return "scenarios";
  if (pathname.startsWith("/scenario")) return "scenarios";
  
  const segments = pathname.split("/").filter(Boolean);
  return segments[0] || "scenarios";
}

type Props = {
  children: ReactNode;
  activeSection?: string;
};

export function AppShell({ children, activeSection }: Props) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  
  const currentSection = activeSection || getSectionFromPath(pathname);

  const handleToggleDrawer = () => {
    console.log('[AppShell] Toggle drawer called, current mobileOpen:', mobileOpen);
    setMobileOpen((v) => !v);
  };

  const handleToggleSearch = () => {
    console.log('[AppShell] Toggle search called, current searchOpen:', searchOpen);
    setSearchOpen((v) => !v);
  };

  return (
    <div className="flex min-h-screen bg-proton-bg text-proton-text">
      <aside className="hidden lg:block">
        <NavigationDrawer activeId={currentSection} />
      </aside>

      {mobileOpen && (
        <>
          <div
            aria-hidden
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          />
          <aside className="fixed inset-y-0 left-0 z-40 lg:hidden">
            <NavigationDrawer
              activeId={currentSection}
              onClose={() => setMobileOpen(false)}
            />
          </aside>
        </>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <HeaderBar
          title={SECTION_TITLES[currentSection] ?? "Inbox"}
          onToggleDrawer={handleToggleDrawer}
          onToggleSearch={handleToggleSearch}
        />
        <SearchDropdown open={searchOpen} onClose={() => setSearchOpen(false)} />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
