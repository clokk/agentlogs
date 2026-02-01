"use client";

import React from "react";
import CommitCardSkeleton from "./CommitCardSkeleton";

interface CommitListSkeletonProps {
  count?: number;
  showProjectBadges?: boolean;
}

export default function CommitListSkeleton({
  count = 8,
  showProjectBadges = false,
}: CommitListSkeletonProps) {
  return (
    <div className="p-2 space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <CommitCardSkeleton
          key={i}
          showProjectBadge={showProjectBadges}
        />
      ))}
    </div>
  );
}
