"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import Fuse from "fuse.js";
import { Search } from "lucide-react";
import { searchIndex, type SearchResult } from "@/content/searchIndex";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function SearchDropdown({ open, onClose }: Props) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const fuse = useMemo(
    () =>
      new Fuse(searchIndex, {
        keys: ["title", "subtitle", "category", "keywords"],
        threshold: 0.35,
        ignoreLocation: true,
        minMatchCharLength: 2,
      }),
    []
  );

  useEffect(() => {
    if (open) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  if (!open) return null;

  const results: SearchResult[] = query.trim()
    ? fuse.search(query).slice(0, 8).map((result) => result.item)
    : searchIndex.slice(0, 8);

  return (
    <>
      <div
        aria-hidden
        onClick={onClose}
        className="fixed inset-0 z-30 bg-black/20"
      />
      <div className="fixed top-14 left-0 right-0 z-40 border-b border-proton-separator bg-proton-bg shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6">
          <div className="rounded-2xl border border-proton-separator bg-proton-surface overflow-hidden">
            <div className="flex items-center gap-3 border-b border-proton-separator bg-proton-surface-elevated px-4 py-3">
              <Search size={18} className="shrink-0 text-proton-text-tertiary" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search scenarios, findings, and micro-optimizations"
                className="w-full bg-transparent text-sm text-proton-text outline-none placeholder:text-proton-text-tertiary"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="rounded px-2 py-1 text-xs text-proton-text-tertiary hover:bg-proton-bg hover:text-proton-text"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="max-h-[60vh] overflow-auto">
              {results.length === 0 ? (
                <div className="px-4 py-6 text-sm text-proton-text-tertiary">No results found.</div>
              ) : (
                <ul className="divide-y divide-proton-separator">
                  {results.map((result) => (
                    <li key={result.id}>
                      <Link
                        href={result.href}
                        onClick={onClose}
                        className="flex items-start gap-3 px-4 py-3 transition-colors touch-manipulation hover:bg-proton-bg/70 active:bg-proton-bg/70"
                      >
                        <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-proton-separator text-xs font-semibold text-proton-text-tertiary">
                          {result.category.slice(0, 1).toUpperCase()}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm font-medium text-proton-text">{result.title}</p>
                            <span className="rounded-full bg-proton-violet/15 px-2 py-0.5 text-[0.6875rem] font-semibold uppercase tracking-wider text-proton-violet">
                              {result.category}
                            </span>
                          </div>
                          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-proton-text-secondary">
                            {result.subtitle}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
