"use client";

import { Menu, Search, UserCircle2 } from "lucide-react";

type Props = {
  title: string;
  onToggleDrawer: () => void;
};

export function HeaderBar({ title, onToggleDrawer }: Props) {
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-proton-separator bg-proton-bg/95 px-3 backdrop-blur supports-[backdrop-filter]:bg-proton-bg/80">
      <button
        type="button"
        onClick={onToggleDrawer}
        aria-label="Toggle navigation"
        className="-ml-1 inline-flex h-9 w-9 items-center justify-center rounded-md text-proton-text-secondary hover:bg-proton-surface-elevated hover:text-proton-text lg:hidden"
      >
        <Menu size={20} strokeWidth={1.75} />
      </button>
      <h1 className="flex-1 truncate text-base font-semibold text-proton-text">
        {title}
      </h1>
      <button
        type="button"
        aria-label="Search"
        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-proton-text-secondary hover:bg-proton-surface-elevated hover:text-proton-text"
      >
        <Search size={18} strokeWidth={1.75} />
      </button>
      <button
        type="button"
        aria-label="Project metadata and disclaimer"
        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-proton-text-secondary hover:bg-proton-surface-elevated hover:text-proton-text"
      >
        <UserCircle2 size={20} strokeWidth={1.5} />
      </button>
    </header>
  );
}
