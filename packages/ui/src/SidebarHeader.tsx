"use client";

import React from "react";

interface SidebarHeaderProps {
  title: string;
  count: number;
  collapsed: boolean;
  onToggle: () => void;
}

export function SidebarHeader({
  title,
  count,
  collapsed,
  onToggle,
}: SidebarHeaderProps) {
  if (collapsed) {
    return (
      <button
        onClick={onToggle}
        className="p-3 text-muted hover:text-primary hover:bg-panel transition-colors"
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
    );
  }

  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-border min-w-0">
      <span className="text-sm font-medium text-muted truncate">
        {title} ({count})
      </span>
      <button
        onClick={onToggle}
        className="p-1 text-muted hover:text-primary hover:bg-panel rounded transition-colors flex-shrink-0"
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
  );
}

export default SidebarHeader;
