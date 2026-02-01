"use client";

import React, { useState, useCallback } from "react";
import {
  Header,
  CommitList,
  useResizable,
  TurnView,
  ToolOnlyGroup,
  formatGap,
  getGapMinutes,
  getSourceStyle,
  getProjectColor,
  formatCommitAsMarkdown,
  formatCommitAsPlainText,
  downloadFile,
  copyToClipboard,
  escapeRegex,
} from "@cogcommit/ui";
import type { CognitiveCommit, Turn } from "@cogcommit/types";

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

/**
 * Check if a turn is tool-only (no text content, only tool calls)
 */
function isToolOnlyTurn(turn: Turn): boolean {
  return (
    turn.role === "assistant" &&
    (!turn.content || turn.content.trim() === "") &&
    !!turn.toolCalls &&
    turn.toolCalls.length > 0
  );
}

type RenderItem =
  | { type: "turn"; turn: Turn; gapMinutes: number | null }
  | { type: "tool-group"; turns: Turn[]; gapMinutes: number | null };

function buildRenderItems(commit: CognitiveCommit): RenderItem[] {
  const items: RenderItem[] = [];
  let prevTimestamp: string | null = null;
  let currentToolGroup: Turn[] = [];
  let toolGroupGap: number | null = null;

  const flushToolGroup = () => {
    if (currentToolGroup.length > 0) {
      items.push({
        type: "tool-group",
        turns: currentToolGroup,
        gapMinutes: toolGroupGap,
      });
      currentToolGroup = [];
      toolGroupGap = null;
    }
  };

  for (const session of commit.sessions) {
    for (const turn of session.turns) {
      const gapMinutes = prevTimestamp
        ? getGapMinutes(prevTimestamp, turn.timestamp)
        : null;

      if (isToolOnlyTurn(turn)) {
        if (currentToolGroup.length === 0) {
          toolGroupGap = gapMinutes;
        }
        currentToolGroup.push(turn);
      } else {
        flushToolGroup();
        items.push({ type: "turn", turn, gapMinutes });
      }

      prevTimestamp = turn.timestamp;
    }
  }

  flushToolGroup();
  return items;
}

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

  // Search state
  const [searchTerm, setSearchTerm] = useState("");

  // Export state
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [exportCopied, setExportCopied] = useState(false);

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
  const renderItems = selectedCommit ? buildRenderItems(selectedCommit) : [];
  const turnCount = selectedCommit?.sessions.reduce((sum, s) => sum + s.turns.length, 0) || 0;
  const sourceStyle = selectedCommit ? getSourceStyle(selectedCommit.source) : null;
  const projectColor = selectedCommit?.projectName
    ? getProjectColor(selectedCommit.projectName)
    : null;

  // Export handlers
  const handleExportMarkdown = useCallback(() => {
    if (!selectedCommit) return;
    const content = formatCommitAsMarkdown(selectedCommit);
    const filename = `${selectedCommit.title || "conversation"}-${selectedCommit.id.slice(0, 8)}.md`;
    downloadFile(content, filename, "text/markdown");
    setShowExportMenu(false);
  }, [selectedCommit]);

  const handleExportPlainText = useCallback(() => {
    if (!selectedCommit) return;
    const content = formatCommitAsPlainText(selectedCommit);
    const filename = `${selectedCommit.title || "conversation"}-${selectedCommit.id.slice(0, 8)}.txt`;
    downloadFile(content, filename, "text/plain");
    setShowExportMenu(false);
  }, [selectedCommit]);

  const handleCopyConversation = useCallback(async () => {
    if (!selectedCommit) return;
    const content = formatCommitAsMarkdown(selectedCommit);
    const success = await copyToClipboard(content);
    if (success) {
      setExportCopied(true);
      setTimeout(() => setExportCopied(false), 1500);
    }
    setShowExportMenu(false);
  }, [selectedCommit]);

  // Search matches
  const searchMatchIndices = searchTerm
    ? renderItems
        .map((item, idx) =>
          item.type === "turn" &&
          new RegExp(escapeRegex(searchTerm), "i").test(item.turn.content)
            ? idx
            : -1
        )
        .filter((idx) => idx !== -1)
    : [];

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
            <>
              {/* Detail Header */}
              <div className="flex-shrink-0 p-4 border-b border-zinc-800">
                <div className="flex items-center gap-3 text-sm">
                  {/* Source badge */}
                  {sourceStyle && (
                    <span className={`px-2 py-0.5 text-xs font-medium rounded ${sourceStyle.bg} ${sourceStyle.text}`}>
                      {sourceStyle.label}
                    </span>
                  )}

                  {/* Project badge */}
                  {selectedCommit.projectName && projectColor && (
                    <span className={`px-2 py-0.5 text-xs font-medium rounded ${projectColor.bg} ${projectColor.text}`}>
                      {selectedCommit.projectName}
                    </span>
                  )}

                  {/* Git hash */}
                  {selectedCommit.gitHash ? (
                    <span className="font-mono text-chronicle-green text-xs">
                      [{selectedCommit.gitHash}]
                    </span>
                  ) : (
                    <span className="font-mono text-chronicle-amber text-xs">
                      [uncommitted]
                    </span>
                  )}

                  <span className="text-zinc-600">·</span>
                  <span className="text-zinc-500">{turnCount} turns</span>
                  <span className="text-zinc-600">·</span>
                  <span className="text-zinc-500">
                    {selectedCommit.filesChanged.length} files
                  </span>

                  <div className="flex-1" />

                  {/* Search input */}
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="/ search"
                    className="w-36 bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs text-white placeholder-zinc-500 focus:border-chronicle-blue focus:outline-none focus:w-48 transition-all"
                  />

                  {/* Export dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setShowExportMenu(!showExportMenu)}
                      className="px-2 py-1 text-xs text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors flex items-center gap-1"
                    >
                      {exportCopied ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-chronicle-green">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                      )}
                      Export
                    </button>
                    {showExportMenu && (
                      <div className="absolute right-0 mt-1 bg-zinc-800 border border-zinc-700 rounded shadow-lg z-10 py-1 min-w-[160px]">
                        <button
                          onClick={handleExportMarkdown}
                          className="block w-full text-left px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-700 transition-colors"
                        >
                          Download as Markdown
                        </button>
                        <button
                          onClick={handleExportPlainText}
                          className="block w-full text-left px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-700 transition-colors"
                        >
                          Download as Plain Text
                        </button>
                        <button
                          onClick={handleCopyConversation}
                          className="block w-full text-left px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-700 transition-colors"
                        >
                          Copy to Clipboard
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <h2 className="text-base font-medium text-white mt-2">
                  {selectedCommit.title || "Untitled conversation"}
                </h2>
              </div>

              {/* Conversation */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-4">
                  {renderItems.map((item, idx) => {
                    const isMatch =
                      searchTerm &&
                      item.type === "turn" &&
                      new RegExp(escapeRegex(searchTerm), "i").test(item.turn.content);

                    if (item.type === "tool-group") {
                      const groupKey = item.turns.map((t) => t.id).join("-");
                      return (
                        <React.Fragment key={groupKey}>
                          {item.gapMinutes !== null && item.gapMinutes > 60 && (
                            <div className="flex items-center gap-4 py-2 text-zinc-600 text-xs">
                              <div className="flex-1 h-px bg-zinc-800" />
                              <span>{formatGap(item.gapMinutes)} later</span>
                              <div className="flex-1 h-px bg-zinc-800" />
                            </div>
                          )}
                          <ToolOnlyGroup turns={item.turns} searchTerm={searchTerm} />
                        </React.Fragment>
                      );
                    }

                    const { turn, gapMinutes } = item;
                    return (
                      <React.Fragment key={turn.id}>
                        {gapMinutes !== null && gapMinutes > 60 && (
                          <div className="flex items-center gap-4 py-2 text-zinc-600 text-xs">
                            <div className="flex-1 h-px bg-zinc-800" />
                            <span>{formatGap(gapMinutes)} later</span>
                            <div className="flex-1 h-px bg-zinc-800" />
                          </div>
                        )}
                        <TurnView
                          turn={turn}
                          searchTerm={searchTerm}
                          isMatch={!!isMatch}
                        />
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

              {/* Footer with keyboard shortcuts */}
              <div className="flex-shrink-0 px-6 py-3 border-t border-zinc-800 flex items-center justify-between">
                <span className="text-xs text-zinc-500">
                  {userName}
                </span>
                <span className="text-xs text-zinc-600">
                  j/k: navigate · /: search
                </span>
              </div>
            </>
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
