# @cogcommit/ui

Shared React UI components for CogCommit dashboards.

## Installation

```bash
pnpm add @cogcommit/ui
```

## Usage

```tsx
import {
  Header,
  CommitList,
  ConversationViewer,
  useResizable
} from "@cogcommit/ui";
```

## Components

### Header

Top navigation bar with project info, stats, and project filter.

```tsx
<Header
  projectName="My Project"
  isGlobal={true}
  stats={{ commitCount: 42, totalTurns: 1234 }}
  projects={[{ name: "project-a", count: 10 }]}
  selectedProject={null}
  onSelectProject={(name) => {}}
  homeHref="/"
  user={{ userName: "alice", avatarUrl: "..." }}
/>
```

### CommitList

Scrollable list of commit cards with selection support.

```tsx
<CommitList
  commits={commits}
  selectedCommitId={selectedId}
  onSelectCommit={(id) => setSelectedId(id)}
  showProjectBadges={true}
/>
```

### CommitCard

Individual commit card showing hash, title, metadata.

```tsx
<CommitCard
  commit={commit}
  isSelected={selected}
  onClick={() => {}}
  showProjectBadge={true}
/>
```

### ConversationViewer

Full conversation viewer with title editing and turn navigation.

```tsx
<ConversationViewer
  commit={commit}
  onTitleChange={async (title) => {}}
  onDelete={async () => {}}
/>
```

### TurnView

Single turn (user message or assistant response) with tool calls.

```tsx
<TurnView turn={turn} index={0} />
```

### SidebarHeader

Header for collapsible sidebar panels.

```tsx
<SidebarHeader
  title="Commits"
  count={42}
  collapsed={false}
  onToggle={() => {}}
/>
```

### Skeletons

Loading placeholders:

```tsx
<CommitListSkeleton count={8} showProjectBadges={true} />
<CommitCardSkeleton showProjectBadge={false} />
<Shimmer className="w-32 h-4" />
```

## Hooks

### useResizable

Hook for resizable panels with localStorage persistence.

```tsx
const { width, isDragging, handleMouseDown } = useResizable(
  defaultWidth,   // 384
  minWidth,       // 200
  maxWidth,       // 600
  storageKey      // "cogcommit-sidebar-width"
);
```

## Utilities

### getSourceStyle

Get badge styles for conversation sources.

```tsx
const style = getSourceStyle("claude_code");
// { label: "Claude Code", bg: "bg-blue-500/20", text: "text-blue-400" }
```

### getProjectColor

Get consistent colors for project names.

```tsx
const color = getProjectColor("my-project");
// { bg: "bg-emerald-500/20", text: "text-emerald-400" }
```

### formatRelativeTime / formatAbsoluteTime

Date formatting utilities.

```tsx
formatRelativeTime("2024-01-15T10:00:00Z"); // "2 hours ago"
formatAbsoluteTime("2024-01-15T10:00:00Z"); // "Jan 15 at 10:00 AM"
```

## Styling

Components use Tailwind CSS with these custom color tokens:

| Token | Usage |
|-------|-------|
| `--chronicle-blue` | Primary action, links, selection |
| `--chronicle-green` | Git hashes, success states |
| `--chronicle-amber` | Uncommitted work, warnings |
| `--chronicle-purple` | Parallel session indicators |

Background tokens:
- `bg-bg` - Main background
- `bg-panel` - Panel background
- `bg-panel-alt` - Alternate panel background
