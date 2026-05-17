"use client";

import Link from "next/link";
import { X } from "lucide-react";
import {
  Inbox,
  FileText,
  Cpu,
  Workflow,
  Wand2,
  ClipboardList,
  type LucideIcon,
} from "lucide-react";

type Section = {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string;
  count?: number;
};

const SECTIONS: Section[] = [
  { id: "overview", label: "Overview", href: "/overview", icon: FileText },
  { id: "scenarios", label: "Scenarios", href: "/", icon: Inbox, count: 5 },
  { id: "memory", label: "Memory Management", href: "/memory", icon: Cpu },
  { id: "threading", label: "Threading", href: "/threading", icon: Workflow },
  {
    id: "micro-optimizations",
    label: "Micro-optimizations",
    href: "/micro-optimizations",
    icon: Wand2,
  },
  {
    id: "audit",
    label: "Technical Audit",
    href: "/audit",
    icon: ClipboardList,
  },
];

type Props = {
  activeId: string;
  onClose?: () => void;
};

export function NavigationDrawer({ activeId, onClose }: Props) {
  return (
    <nav
      aria-label="Report sections"
      className="flex h-full w-72 flex-col overflow-y-auto border-r border-proton-separator bg-proton-surface"
    >
      {/* Drawer header */}
      <div className="flex items-center justify-between px-4 pb-3 pt-5">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-proton-text-tertiary">
            App Report 4
          </p>
          <p className="mt-0.5 text-sm text-proton-text-secondary">
            Proton Mail iOS · Static audit
          </p>
        </div>
        {/* Close button — visible on mobile when drawer is an overlay */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-proton-text-tertiary transition-colors touch-manipulation hover:bg-proton-surface-elevated active:bg-proton-surface-elevated hover:text-proton-text"
          >
            <X size={18} strokeWidth={2} />
          </button>
        )}
      </div>

      {/* Section links */}
      <ul className="flex-1 px-2 pb-4 pt-1">
        {SECTIONS.map((section) => {
          const Icon = section.icon;
          const isActive = section.id === activeId;
          return (
            <li key={section.id}>
              <Link
                href={section.href}
                onClick={onClose}
                aria-current={isActive ? "page" : undefined}
                className={[
                  "flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm transition-colors touch-manipulation",
                  isActive
                    ? "bg-proton-violet/15 text-proton-text"
                    : "text-proton-text-secondary hover:bg-proton-surface-elevated active:bg-proton-surface-elevated hover:text-proton-text",
                ].join(" ")}
              >
                <Icon
                  size={18}
                  strokeWidth={1.75}
                  className={
                    isActive
                      ? "text-proton-violet"
                      : "text-proton-text-tertiary"
                  }
                />
                <span className="flex-1 truncate">{section.label}</span>
                {section.count !== undefined && (
                  <span className="text-xs text-proton-text-tertiary">
                    {section.count}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Footer */}
      <div className="border-t border-proton-separator px-4 py-3 text-[11px] text-proton-text-tertiary">
        Group 13 · ISIS-3510 · 2025-2
      </div>
    </nav>
  );
}
