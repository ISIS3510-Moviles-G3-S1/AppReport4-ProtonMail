"use client";

import Link from "next/link";
import { Menu, Search, UserCircle2 } from "lucide-react";

type Props = {
  title: string;
  onToggleDrawer: () => void;
  onToggleSearch: () => void;
};

export function HeaderBar({ title, onToggleDrawer, onToggleSearch }: Props) {
  const handleToggleDrawer = () => {
    console.log('[HeaderBar] Hamburger clicked, calling onToggleDrawer');
    onToggleDrawer();
  };

  const handleToggleSearch = () => {
    console.log('[HeaderBar] Search clicked, calling onToggleSearch');
    onToggleSearch();
  };

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-proton-separator bg-proton-bg/95 px-3 backdrop-blur supports-backdrop-filter:bg-proton-bg/80">
      <button
        type="button"
        onClick={handleToggleDrawer}
        aria-label="Toggle navigation"
        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-proton-text-secondary hover:bg-proton-surface-elevated hover:text-proton-text"
      >
        <Menu size={20} strokeWidth={1.75} />
      </button>
      <h1 className="flex-1 truncate text-base font-semibold text-proton-text">
        {title}
      </h1>
      <button
        type="button"
        aria-label="Search"
        onClick={handleToggleSearch}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-proton-text-secondary hover:bg-proton-surface-elevated hover:text-proton-text"
      >
        <Search size={18} strokeWidth={1.75} />
      </button>
      <Link
        href="/settings"
        aria-label="Project metadata and disclaimer"
        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-proton-text-secondary hover:bg-proton-surface-elevated hover:text-proton-text"
      >
        <UserCircle2 size={20} strokeWidth={1.5} />
      </Link>
    </header>
  );
}
