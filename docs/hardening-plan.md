# CogCommit Hardening Plan

**Objective**: Clean up technical debt, consolidate shared code, and improve documentation.

---

## Phase 0: Save Plan to Project

- [x] **Copy this plan to `docs/hardening-plan.md`**
  - Enables tracking progress across multiple sessions
  - Provides reference for the full scope of work

---

## Phase 1: Quick Wins (~1 hour) ✓ COMPLETE

### 1.1 Remove Dead Code
- [x] **Delete `apps/web/components/DashboardView.tsx`** (254 lines)
  - Not imported anywhere, superseded by `DashboardClient.tsx`

### 1.2 Remove Duplicate Types from CLI Frontend
- [x] **Refactor `apps/cli/src/studio/frontend/api.ts`**
  - Remove duplicate types: `ConversationSource`, `Turn`, `Session`, `CognitiveCommit` (lines 7-53)
  - Import from `@cogcommit/types` instead
  - Keep only the API fetch functions

### 1.3 Remove Duplicate Types from Web Detail Page
- [x] **Refactor `apps/web/app/(dashboard)/dashboard/commits/[id]/page.tsx`**
  - Remove inline `DbTurn`, `DbSession`, `DbCommit` types (lines 8-37)
  - Remove duplicate `transformTurn` function (lines 42-68)
  - Import `DbCommitWithRelations`, `transformCommitWithRelations` from `@cogcommit/supabase`

---

## Phase 2: CLI Modularization (~2-3 hours) ✓ COMPLETE

### 2.1 Split `apps/cli/src/index.ts` (1,070 lines) into command modules

Created structure:
```
apps/cli/src/
├── index.ts              # ~36 lines: just program setup + command imports
├── commands/
│   ├── index.ts          # Re-exports all command registrars
│   ├── parse.ts          # parse, list, info commands
│   ├── init.ts           # init command
│   ├── watch.ts          # watch, stop, status, capture commands
│   ├── studio.ts         # dashboard command
│   ├── import.ts         # import command
│   ├── auth.ts           # login, logout, whoami commands
│   ├── sync.ts           # push, pull, sync commands
│   └── config.ts         # config, analytics commands
```

Each command file exports a function that registers with Commander.

---

## Phase 3: Database Repository Pattern (~2-3 hours) ✓ COMPLETE

### 3.1 Split `apps/cli/src/storage/db.ts` (879 lines)

Created structure:
```
apps/cli/src/storage/
├── db.ts                 # ~121 lines: connection management + repository accessors
├── repositories/
│   ├── index.ts          # Re-exports all repositories
│   ├── types.ts          # Shared row types and interfaces
│   ├── commits.ts        # CommitsRepository
│   ├── sessions.ts       # SessionsRepository
│   ├── turns.ts          # TurnsRepository
│   ├── visuals.ts        # VisualsRepository
│   └── daemon-state.ts   # DaemonStateRepository
├── schema.ts             # Keep as-is (migrations)
```

### 3.2 Removed Backwards Compatibility Layer
All consumers now use the repository pattern directly:
- `db.commits.get(id)` instead of `db.getCommit(id)`
- `db.commits.insert(commit)` instead of `db.insertCommit(commit)`
- `db.daemonState.getLastActivity()` instead of `db.getLastActivity()`
- etc.

This reduced `db.ts` from 345 lines (with legacy facade) to 121 lines.

---

## Phase 4: Documentation Sprint (~2 hours) ✓ COMPLETE

### 4.1 Development Setup Guide
- [x] Add to root `README.md`:
  - Prerequisites (Node 18+, pnpm)
  - Installation steps
  - How to run CLI locally (`pnpm dev --filter=cli`)
  - How to run web locally (`pnpm dev --filter=web`)
  - How to run both dashboards

### 4.2 App READMEs
- [x] Create `apps/cli/README.md`
  - Development commands
  - Testing locally
  - Publishing to npm

- [x] Create `apps/web/README.md`
  - Environment variables needed
  - Supabase setup
  - Deployment to Vercel

### 4.3 Package READMEs
- [x] Create `packages/types/README.md` - Type definitions overview
- [x] Create `packages/supabase/README.md` - Query functions and transforms
- [x] Create `packages/ui/README.md` - Component list with props

### 4.4 Update CLAUDE.md
- [x] Add missing key files:
  - `apps/cli/src/sync/pull.ts`
  - `packages/supabase/src/transforms.ts`
  - `packages/ui/src/` components

---

## Phase 5: Additional Cleanup (Optional, if time permits) ✓ COMPLETE

### 5.1 Extract Constants
- [x] Created `apps/cli/src/constants.ts` with:
  - `SYNC_BATCH_SIZE` - Batch size for uploading turns
  - `COGCOMMIT_UUID_NAMESPACE` - UUID namespace for deterministic IDs
  - `OAUTH_CALLBACK_PORT` / `OAUTH_CALLBACK_URL` - OAuth settings
  - `STUDIO_DEFAULT_PORT` - Default studio port
  - `COMMON_DEV_PORTS` - Dev server detection ports

### 5.2 Consolidate File Path Extraction
- [x] Added generic `extractFilePathFromTool(toolUse, toolName)` function
- [x] Deprecated individual extract functions (kept for backwards compatibility)

---

## Files to Modify

| File | Action |
|------|--------|
| `apps/web/components/DashboardView.tsx` | Delete |
| `apps/cli/src/studio/frontend/api.ts` | Remove duplicate types |
| `apps/web/app/(dashboard)/dashboard/commits/[id]/page.tsx` | Use shared transforms |
| `apps/cli/src/index.ts` | Split into command modules |
| `apps/cli/src/storage/db.ts` | Split into repositories |
| `README.md` | Add development setup |
| `apps/cli/README.md` | Create |
| `apps/web/README.md` | Create |
| `packages/*/README.md` | Create (3 files) |
| `CLAUDE.md` | Update key files section |

---

## Verification

After each phase:
1. Run `pnpm build` to ensure no type errors
2. Test CLI: `pnpm dev --filter=cli` then `cogcommit --help`
3. Test CLI studio: `cogcommit studio --global`
4. Test web: `pnpm dev --filter=web` then visit `http://localhost:3000/dashboard`
5. Verify both dashboards render commits correctly

---

## Notes

- `ConversationView.tsx` is NOT dead code - it's a simplified viewer for the standalone detail page
- Skeleton components (CommitListSkeleton, Shimmer) are web-only by design - CLI loads data synchronously
- Consider adding tests after this cleanup (separate effort)
