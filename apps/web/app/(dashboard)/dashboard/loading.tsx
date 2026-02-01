import { CommitListSkeleton } from "@cogcommit/ui";

export default function DashboardLoading() {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-bg">
      {/* Header skeleton */}
      <div className="h-14 border-b border-border bg-panel flex items-center justify-between px-4 animate-pulse">
        <div className="flex items-center gap-4">
          <div className="h-6 w-6 bg-subtle/30 rounded" />
          <div className="h-5 w-32 bg-subtle/30 rounded" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-8 w-24 bg-subtle/30 rounded" />
          <div className="h-8 w-8 bg-subtle/30 rounded-full" />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden" style={{ minHeight: 0 }}>
        {/* Left Panel - Commit List skeleton */}
        <div
          className="bg-panel border-r border-border flex flex-col"
          style={{ width: 384 }}
        >
          {/* Sidebar header skeleton */}
          <div className="h-10 border-b border-border flex items-center justify-between px-3 animate-pulse">
            <div className="flex items-center gap-2">
              <div className="h-4 w-16 bg-subtle/30 rounded" />
              <div className="h-5 w-8 bg-subtle/30 rounded-full" />
            </div>
            <div className="h-6 w-6 bg-subtle/30 rounded" />
          </div>

          {/* Commit list skeleton */}
          <div className="flex-1 overflow-y-auto" style={{ scrollbarGutter: "stable" }}>
            <CommitListSkeleton count={8} showProjectBadges={true} />
          </div>
        </div>

        {/* Resizer placeholder */}
        <div className="w-1 bg-panel flex-shrink-0" />

        {/* Right Panel - Detail skeleton */}
        <div className="flex-1 bg-panel-alt overflow-hidden flex flex-col">
          {/* Detail header skeleton */}
          <div className="h-16 border-b border-border flex items-center justify-between px-6 animate-pulse">
            <div className="flex-1">
              <div className="h-6 w-64 bg-subtle/30 rounded mb-2" />
              <div className="h-4 w-48 bg-subtle/30 rounded" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-subtle/30 rounded" />
              <div className="h-8 w-8 bg-subtle/30 rounded" />
            </div>
          </div>

          {/* Conversation skeleton */}
          <div className="flex-1 p-6 space-y-4 animate-pulse overflow-auto">
            {/* User message skeleton */}
            <div className="flex gap-3">
              <div className="h-8 w-8 bg-subtle/30 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-24 bg-subtle/30 rounded" />
                <div className="h-20 w-full bg-subtle/30 rounded-lg" />
              </div>
            </div>

            {/* Assistant message skeleton */}
            <div className="flex gap-3">
              <div className="h-8 w-8 bg-chronicle-blue/30 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-20 bg-subtle/30 rounded" />
                <div className="h-32 w-full bg-subtle/30 rounded-lg" />
              </div>
            </div>

            {/* Another user message skeleton */}
            <div className="flex gap-3">
              <div className="h-8 w-8 bg-subtle/30 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-24 bg-subtle/30 rounded" />
                <div className="h-16 w-3/4 bg-subtle/30 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
