"use client";

import React, { useState, useCallback } from "react";
import {
  Header,
  CommitList,
  useResizable,
  ConversationViewer,
} from "@cogcommit/ui";
import type { CognitiveCommit } from "@cogcommit/types";

interface DashboardViewProps {
  commits: CognitiveCommit[];
  userName: string;
}

// localStorage keys
const SIDEBAR_WIDTH_KEY = "cogcommit-sidebar-width";
const SIDEBAR_COLLAPSED_KEY = "cogcommit-sidebar-collapsed";

// Default and constraint values
const DEFAULT_SIDEBAR_WIDTH = 384;
const MIN_SIDEBAR_WIDTH = 200;
const MAX_SIDEBAR_WIDTH = 600;
const COLLAPSED_WIDTH = 48;

export default function DashboardView({ commits, userName }: DashboardViewProps) {
  const [selectedCommitId, setSelectedCommitId] = useState<string | null>(
    commits[0]?.id || null
  );

  // Sidebar collapse state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "true";
  });

  // Resizable sidebar
  const { width: sidebarWidth, isDragging, handleMouseDown } = useResizable(
    DEFAULT_SIDEBAR_WIDTH,
    MIN_SIDEBAR_WIDTH,
    MAX_SIDEBAR_WIDTH,
    SIDEBAR_WIDTH_KEY
  );

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        localStorage.setItem(SIDEBAR_COLLAPSED_KEY, next.toString());
      }
      return next;
    });
  }, []);

  const selectedCommit = commits.find((c) => c.id === selectedCommitId);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-bg">
      {/* Header */}
      <Header
        projectName="CogCommit Cloud"
        stats={{ commitCount: commits.length, totalTurns: commits.reduce((sum, c) => sum + (c.turnCount || 0), 0) }}
      />

      <div className="flex flex-1 overflow-hidden" style={{ minHeight: 0 }}>
        {/* Left Panel - Commit List */}
        <div
          className="bg-panel border-r border-zinc-800 flex flex-col transition-[width] duration-200"
          style={{ width: sidebarCollapsed ? COLLAPSED_WIDTH : sidebarWidth }}
        >
          {sidebarCollapsed ? (
            // Collapsed mini view
            <div className="flex flex-col h-full">
              <button
                onClick={toggleSidebar}
                className="p-3 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                title="Expand sidebar"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
              <div className="flex-1 flex flex-col items-center pt-2 gap-1 overflow-y-auto">
                {commits.slice(0, 20).map((commit) => (
                  <button
                    key={commit.id}
                    onClick={() => setSelectedCommitId(commit.id)}
                    className={`w-8 h-8 rounded flex items-center justify-center text-xs font-mono transition-colors ${
                      selectedCommitId === commit.id
                        ? "bg-chronicle-blue text-black"
                        : commit.gitHash
                        ? "bg-chronicle-green/20 text-chronicle-green hover:bg-chronicle-green/30"
                        : "bg-chronicle-amber/20 text-chronicle-amber hover:bg-chronicle-amber/30"
                    }`}
                    title={commit.title || commit.gitHash || "Uncommitted"}
                  >
                    {commit.gitHash ? commit.gitHash.slice(0, 2) : "?"}
                  </button>
                ))}
                {commits.length > 20 && (
                  <span className="text-xs text-zinc-500 mt-1">+{commits.length - 20}</span>
                )}
              </div>
            </div>
          ) : (
            // Expanded view with collapse button
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800">
                <span className="text-sm font-medium text-zinc-400">
                  Commits ({commits.length})
                </span>
                <button
                  onClick={toggleSidebar}
                  className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
                  title="Collapse sidebar"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <CommitList
                  commits={commits}
                  selectedCommitId={selectedCommitId}
                  onSelectCommit={setSelectedCommitId}
                  showProjectBadges={true}
                />
              </div>
            </div>
          )}
        </div>

        {/* Resizer */}
        {!sidebarCollapsed && (
          <div
            onMouseDown={handleMouseDown}
            className={`w-1 cursor-col-resize transition-colors flex-shrink-0 ${
              isDragging ? "bg-chronicle-blue" : "bg-zinc-800 hover:bg-chronicle-blue"
            }`}
          />
        )}

        {/* Right Panel - Commit Detail */}
        <div className="flex-1 bg-panel-alt overflow-hidden flex flex-col">
          {selectedCommit ? (
            <ConversationViewer commit={selectedCommit} />
          ) : (
            <div className="flex items-center justify-center h-full text-zinc-500">
              {commits.length === 0 ? (
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-800 flex items-center justify-center">
                    <svg className="w-8 h-8 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-medium text-white mb-2">No commits yet</h2>
                  <p className="text-zinc-400 max-w-md mx-auto mb-6">
                    Install the CogCommit CLI and sync your Claude Code conversations to see them here.
                  </p>
                  <a href="/docs" className="inline-flex px-4 py-2 bg-chronicle-blue text-black rounded-lg font-medium hover:bg-chronicle-blue/90 transition-colors">
                    Get Started
                  </a>
                </div>
              ) : (
                "Select a commit to view details"
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
