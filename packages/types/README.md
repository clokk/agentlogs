# @cogcommit/types

Shared TypeScript types for CogCommit.

## Installation

```bash
pnpm add @cogcommit/types
```

## Usage

```typescript
import type { CognitiveCommit, Turn, Session } from "@cogcommit/types";
```

## Core Types

### CognitiveCommit

The main data type representing a unit of AI-assisted work.

```typescript
interface CognitiveCommit {
  id: string;
  gitHash: string | null;        // Links to git commit
  startedAt: string;
  closedAt: string;
  closedBy: ClosedBy;            // "git_commit" | "session_end" | "explicit"
  sessions: Session[];
  parallel: boolean;             // True if sessions overlapped
  filesRead: string[];
  filesChanged: string[];
  title?: string;
  projectName?: string;
  source?: ConversationSource;   // "claude_code" | "cursor" | etc.
  // Sync metadata
  cloudId?: string;
  syncStatus?: SyncStatus;
}
```

### Session

A Claude Code session within a commit.

```typescript
interface Session {
  id: string;
  label?: string;
  startedAt: string;
  endedAt: string;
  turns: Turn[];
}
```

### Turn

A single turn in a conversation (user message or assistant response).

```typescript
interface Turn {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  model?: string;
  toolCalls?: ToolCall[];
}
```

### ToolCall

A tool invocation by the assistant.

```typescript
interface ToolCall {
  id: string;
  name: string;
  input: Record<string, unknown>;
  result?: string;
  isError?: boolean;
}
```

## Database Types

For Supabase integration, we provide snake_case database row types:

- `DbCommit` - Raw commit row
- `DbSession` - Raw session row
- `DbTurn` - Raw turn row

Use `@cogcommit/supabase` for transform functions between DB and frontend types.

## Cloud/Sync Types

Types for cloud synchronization:

- `CloudCommit`, `CloudSession`, `CloudTurn` - Cloud API formats
- `SyncMetadata` - Local sync tracking
- `AuthTokens` - GitHub OAuth tokens
- `UserProfile` - User profile data
