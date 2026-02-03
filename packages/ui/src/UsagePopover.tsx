"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { UsageData } from "@cogcommit/types";
import { Shimmer } from "./Shimmer";

interface UsagePopoverProps {
  usage: UsageData | null;
  loading?: boolean;
  upgradeHref?: string;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getBarColor(pct: number): string {
  if (pct >= 90) return "bg-red-500";
  if (pct >= 75) return "bg-chronicle-amber";
  return "bg-chronicle-blue";
}

/**
 * UsagePopover - Clickable trigger that opens a popover with usage breakdown
 *
 * Shows a minimal vertical bar with percentage as trigger, expands to show
 * full commit and storage usage bars on click.
 */
export function UsagePopover({ usage, loading, upgradeHref }: UsagePopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Close popover when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const commitPct = usage ? Math.min((usage.commitCount / usage.commitLimit) * 100, 100) : 0;
  const storagePct = usage ? Math.min((usage.storageUsedBytes / usage.storageLimitBytes) * 100, 100) : 0;
  const higherPct = Math.max(commitPct, storagePct);

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="relative flex items-center gap-2 px-2 py-1"
          >
            <Shimmer />
            <div className="w-4 h-4 bg-subtle/40 rounded" />
            <div className="h-4 w-8 bg-subtle/40 rounded" />
          </motion.div>
        ) : usage ? (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {/* Trigger button */}
            <button
              ref={triggerRef}
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 px-2 py-1 text-sm text-muted hover:text-primary transition-colors rounded hover:bg-panel"
            >
              {/* Vertical bar indicator */}
              <div className="w-4 h-4 bg-subtle/30 rounded overflow-hidden flex items-end">
                <div
                  className={`w-full ${getBarColor(higherPct)}`}
                  style={{ height: `${higherPct}%` }}
                />
              </div>
              <span className="text-xs">{Math.round(higherPct)}%</span>
              {/* Chevron */}
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Popover */}
      <AnimatePresence>
        {isOpen && usage && (
          <motion.div
            ref={popoverRef}
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-1 bg-panel border border-border rounded-lg shadow-lg z-50 w-[220px]"
          >
          {/* Commits section */}
          <div className="p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted uppercase tracking-wide">
                Commits
              </span>
              <span className="text-xs text-muted">{Math.round(commitPct)}%</span>
            </div>
            <div className="w-full h-1.5 bg-subtle/30 rounded-full overflow-hidden mb-1">
              <div
                className={`h-full ${getBarColor(commitPct)} transition-all`}
                style={{ width: `${commitPct}%` }}
              />
            </div>
            <div className="text-xs text-muted">
              {usage.commitCount} / {usage.commitLimit}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border" />

          {/* Storage section */}
          <div className="p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted uppercase tracking-wide">
                Storage
              </span>
              <span className="text-xs text-muted">{Math.round(storagePct)}%</span>
            </div>
            <div className="w-full h-1.5 bg-subtle/30 rounded-full overflow-hidden mb-1">
              <div
                className={`h-full ${getBarColor(storagePct)} transition-all`}
                style={{ width: `${storagePct}%` }}
              />
            </div>
            <div className="text-xs text-muted">
              {formatBytes(usage.storageUsedBytes)} / {formatBytes(usage.storageLimitBytes)}
            </div>
          </div>

          {/* Upgrade link */}
          {upgradeHref && (
            <>
              <div className="border-t border-border" />
              <div className="p-3">
                <a
                  href={upgradeHref}
                  className="text-sm text-chronicle-blue hover:underline flex items-center gap-1"
                >
                  Upgrade
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
              </div>
            </>
          )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default UsagePopover;
