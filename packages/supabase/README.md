# @cogcommit/supabase

Supabase client and query functions for CogCommit.

## Installation

```bash
pnpm add @cogcommit/supabase
```

## Usage

### Client Setup

```typescript
import { createSupabaseBrowserClient, createSupabaseServerClient } from "@cogcommit/supabase";

// Browser client (React components)
const supabase = createSupabaseBrowserClient();

// Server client (Next.js Server Components)
const supabase = await createSupabaseServerClient(cookies);
```

### Query Functions

```typescript
import { getCommits, getCommit, updateCommit } from "@cogcommit/supabase";

// Get all commits for a user
const commits = await getCommits(supabase, { limit: 50 });

// Get commits filtered by project
const commits = await getCommits(supabase, { project: "my-project" });

// Get a single commit with sessions and turns
const commit = await getCommit(supabase, commitId);

// Update commit title
await updateCommit(supabase, commitId, { title: "New title" });
```

### Transform Functions

Convert between database (snake_case) and frontend (camelCase) formats:

```typescript
import {
  transformCommitWithRelations,
  transformTurn,
  toDbCommit,
  type DbCommitWithRelations
} from "@cogcommit/supabase";

// Transform from DB format to frontend format
const commit = transformCommitWithRelations(dbRow as DbCommitWithRelations);

// Transform to DB format for inserts
const dbData = toDbCommit(frontendCommit, userId);
```

## API

### Client Factories

| Function | Usage |
|----------|-------|
| `createSupabaseBrowserClient()` | Client-side React components |
| `createSupabaseServerClient(cookies)` | Next.js Server Components |
| `createBasicSupabaseClient()` | Simple client (no auth) |
| `createSupabaseClientWithToken(token)` | Client with JWT token |

### Query Functions

| Function | Description |
|----------|-------------|
| `getCommits(supabase, options)` | List commits with optional filters |
| `getCommit(supabase, id)` | Get single commit with relations |
| `getCommitsCount(supabase, options)` | Count matching commits |
| `getProjectNames(supabase)` | List distinct project names |
| `updateCommit(supabase, id, data)` | Update commit fields |
| `deleteCommit(supabase, id)` | Soft delete commit |
| `getUserProfile(supabase)` | Get current user profile |

### Transform Functions

| Function | Description |
|----------|-------------|
| `transformCommit(db, sessions?)` | DB commit → frontend |
| `transformSession(db, turns?)` | DB session → frontend |
| `transformTurn(db)` | DB turn → frontend |
| `transformCommitWithRelations(db)` | Full nested transform |
| `toDbCommit(commit, userId)` | Frontend → DB format |
| `toDbSession(session, commitId)` | Frontend → DB format |
| `toDbTurn(turn, sessionId)` | Frontend → DB format |

## Database Tables

The package expects these Supabase tables:

- `cognitive_commits` - Main commit data
- `sessions` - Sessions within commits
- `turns` - Turns within sessions
- `user_profiles` - User profile data

**Important:** Table names are `sessions` and `turns`, not `cognitive_sessions`/`cognitive_turns`.
