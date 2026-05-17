"use client";

import Link from "next/link";
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
  { id: "micro-optimizations", label: "Micro-optimizations", href: "/micro-optimizations", icon: Wand2 },
  { id: "audit", label: "Technical Audit", href: "/audit", icon: ClipboardList },
];

type Props = {
  activeId: string;
  onClose?: () => void;
};

export function NavigationDrawer({ activeId, onClose }: Props) {
  return (
    <nav
      aria-label="Report sections"
      className="flex h-screen w-72 flex-col border-r border-proton-separator bg-proton-surface overflow-y-auto"
    >
      <div className="px-4 pt-6 pb-4">
        <p className="text-xs font-medium uppercase tracking-wider text-proton-text-tertiary">
          App Report 4
        </p>
        <p className="mt-1 text-sm text-proton-text-secondary">
          Proton Mail iOS · Static audit
        </p>
      </div>
      <ul className="flex-1 px-2 pb-4">
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
                  "group flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors",
                  isActive
                    ? "bg-proton-violet/15 text-proton-text"
                    : "text-proton-text-secondary hover:bg-proton-surface-elevated hover:text-proton-text",
                ].join(" ")}
              >
                <Icon
                  size={18}
                  strokeWidth={1.75}
                  className={
                    isActive ? "text-proton-violet" : "text-proton-text-tertiary"
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
      <div className="border-t border-proton-separator px-4 py-3 text-xs text-proton-text-tertiary">
        Group 13 · ISIS-3510 · 2025-2
      </div>
    </nav>
  );
}
