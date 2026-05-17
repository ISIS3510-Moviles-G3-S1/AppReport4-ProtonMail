"use client";

import { X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function ComposeInfoModal({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div
        aria-hidden
        onClick={onClose}
        className="absolute inset-0 bg-black/60"
      />

      <div className="relative m-4 w-full max-w-lg rounded-xl bg-proton-surface p-5 shadow-2xl">
        <div className="flex items-start justify-between">
          <h2 className="text-lg font-semibold text-proton-text">About this mockup</h2>
          <button
            aria-label="Close"
            onClick={onClose}
            className="text-proton-text-tertiary hover:text-proton-text"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-3 space-y-3 text-sm text-proton-text-secondary">
          <p>
            This companion is a static UI mockup inspired by the Proton Mail iOS
            app. It surfaces the contents of the App Report as an interactive
            interface; the data (risk scores, findings, and proposed
            micro-optimizations) come from the report and are not runtime
            measurements.
          </p>

          <ul className="list-disc pl-5">
            <li>
              <strong>Plus button:</strong> opens this explanatory message.
            </li>
            <li>
              <strong>Hamburger / Drawer:</strong> top-level report sections
              (Overview, Scenarios, Memory, Threading, Micro-optimizations,
              Technical Audit).
            </li>
            <li>
              <strong>Inbox rows / Scenarios:</strong> each row represents a
              scenario from the report; the small colored chips are the six
              risk-dimension scores (CPU · GPU · Overdraw · Memory · Threading · Power).
            </li>
            <li>
              <strong>Thread view:</strong> tapping a scenario opens four
              analysis messages (GPU Rendering, Overdraw, Memory, Threading)
              showing the report prose for §4.2 and §4.3.
            </li>
          </ul>

          <p className="text-xs text-proton-text-tertiary">
            This is a companion for the PDF report. It does not collect or
            display runtime profiling data.
          </p>
        </div>
      </div>
    </div>
  );
}
