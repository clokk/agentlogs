"use client";

import React from "react";

interface CommitCardSkeletonProps {
  showProjectBadge?: boolean;
}

export default function CommitCardSkeleton({
  showProjectBadge = false,
}: CommitCardSkeletonProps) {
  return (
    <div className="relative rounded-lg p-3 border-l-2 border-subtle bg-bg/50 animate-pulse">
      <div className="flex-1 min-w-0">
        {/* Project badge placeholder */}
        {showProjectBadge && (
          <div className="mb-1">
            <div className="h-5 w-20 bg-subtle/30 rounded" />
          </div>
        )}

        {/* Git hash placeholder */}
        <div className="flex items-center gap-2">
          <div className="h-5 w-24 bg-subtle/30 rounded" />
        </div>

        {/* Title placeholder */}
        <div className="mt-1">
          <div className="h-5 w-3/4 bg-subtle/30 rounded" />
        </div>

        {/* Stats placeholder */}
        <div className="flex items-center gap-3 mt-1">
          <div className="h-4 w-16 bg-subtle/30 rounded" />
          <div className="h-4 w-20 bg-subtle/30 rounded" />
        </div>

        {/* Time placeholder */}
        <div className="mt-1">
          <div className="h-4 w-28 bg-subtle/30 rounded" />
        </div>
      </div>
    </div>
  );
}
