"use client";

import Link from "next/link";
import { Menu, Search } from "lucide-react";

type Props = {
  title: string;
  onToggleDrawer: () => void;
  onToggleSearch: () => void;
};

export function HeaderBar({ title, onToggleDrawer, onToggleSearch }: Props) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between bg-proton-bg px-2 pb-3 pt-2">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleDrawer}
          aria-label="Open navigation"
          className="header-btn flex h-11 w-11 items-center justify-center rounded-[10px] text-proton-text"
        >
          <Menu size={22} strokeWidth={2} />
        </button>
        <h1 className="text-[22px] font-bold tracking-tight text-proton-text pl-1">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label="Search"
          onClick={onToggleSearch}
          className="header-btn flex h-11 w-11 items-center justify-center rounded-[10px] text-proton-text"
        >
          <Search size={20} strokeWidth={2} />
        </button>
        <Link
          href="/settings"
          aria-label="Project metadata and disclaimer"
          className="header-btn flex h-11 w-11 items-center justify-center rounded-full"
        >
          <span
            aria-hidden
            className="flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-semibold text-white"
            style={{
              background: "linear-gradient(135deg, #6D4AFF 0%, #4F2BD9 100%)",
            }}
          >
            G8
          </span>
        </Link>
      </div>
    </header>
  );
}
