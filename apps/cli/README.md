# Tuhnr CLI

The command-line interface for Tuhnr - track your AI coding sessions.

## Development

### Prerequisites

- Node.js 18+
- pnpm 8+

### Building

```bash
# From repo root
pnpm build --filter=tuhnr

# Or from this directory
pnpm build
```

This runs two build steps:
1. `tsc` - Compiles TypeScript to `dist/`
2. `vite build` - Bundles the Studio frontend to `dist/studio/`

### Running Locally

```bash
# Run CLI directly
node dist/index.js --help

# Or use pnpm dev from repo root
pnpm dev --filter=tuhnr
```

### Testing the Studio Dashboard

```bash
# Import some data first
node dist/index.js import

# Start the dashboard
node dist/index.js dashboard
```

## Architecture

```
src/
├── index.ts              # CLI entry point
├── commands/             # Command modules (Commander.js)
│   ├── parse.ts          # parse, list, info commands
│   ├── init.ts           # init command
│   ├── watch.ts          # watch, stop, status, capture
│   ├── studio.ts         # dashboard command
│   ├── import.ts         # import command
│   ├── auth.ts           # login, logout, whoami
│   ├── sync.ts           # push, pull, sync
│   └── config.ts         # config, analytics
├── parser/               # JSONL log parsing
├── storage/              # SQLite database
│   ├── db.ts             # Database wrapper
│   ├── schema.ts         # Schema & migrations
│   └── repositories/     # Data access layer
├── sync/                 # Cloud sync (push/pull)
├── studio/               # Local dashboard (React + Hono)
│   ├── server.ts         # Hono API server
│   └── frontend/         # React app (bundled by Vite)
├── daemon/               # Background watcher
├── config/               # Configuration paths
├── models/               # Type definitions
└── utils/                # Utility functions (title generation, etc.)
```

## Database API

Uses the repository pattern for data access:

```typescript
const db = new TuhnrDB(projectPath);

// Commits
db.commits.get(id);
db.commits.getAll();
db.commits.insert(commit);
db.commits.update(id, { title: "New title" });
db.commits.delete(id);

// Sessions & Turns
db.sessions.getForCommit(commitId);
db.turns.getForSession(sessionId);

// Visuals
db.visuals.create(commitId, "screenshot", filePath);
db.visuals.getForCommit(commitId);

// Daemon State
db.daemonState.getLastActivity();
db.daemonState.getCurrentCommitId();
db.daemonState.setFilePosition(filePath, position);
```

## Cloud Sync Commands

### Free Tier Limits

Cloud sync has usage limits:
- **250 commits** synced to cloud
- **50 MB storage**

Local usage is unlimited. When pushing, only the most recent commits sync up to the limit.

**What's automatically filtered:**
- Warmup sessions (Claude Code internal)
- Commits with no turns (empty)

These don't count against your limit and aren't synced to cloud.

### Push Options

The `push` command now automatically imports from Claude Code before pushing to cloud:

```bash
# Import from Claude and push to cloud (default behavior)
tuhnr push

# Verbose mode (shows each commit, disables progress bar)
tuhnr push --verbose

# Preview what would be pushed
tuhnr push --dry-run

# Force re-push all commits (resets sync status)
tuhnr push --force

# Retry previously failed commits
tuhnr push --retry

# Skip import step (push existing commits only)
tuhnr push --skip-import
```

### Cloud Management

```bash
# Delete all your cloud data (requires confirmation)
tuhnr cloud clear

# Skip confirmation (for scripts)
tuhnr cloud clear --yes
```

## Import Command

The import command reads Claude Code session logs and converts them to cognitive commits in the local database.

Use `tuhnr push` to both import and push to cloud, or `tuhnr import` for local-only import.

### Smart Project Detection

Commits are automatically assigned to projects based on where file operations actually occurred, not just where the Claude session was started. This handles the common case of starting a session in one directory but working on files in another project.

**How it works:**
- File reads: 1 point each
- File edits/writes: 3 points each
- Highest-scoring project wins
- Falls back to Claude session directory if no file operations

**Example:** A session started in `claudeverse` but with most edits in `tuhnr` will be correctly tagged as a `tuhnr` commit.

### Import Options

```bash
tuhnr import                   # Import all Claude Code projects (default)
tuhnr import --project         # Import current project only (requires init)
tuhnr import --clear           # Clear existing commits before importing
tuhnr import --redetect        # Re-run project detection on existing commits
```

### Re-detecting Projects

If you have existing commits with incorrect project assignments, use `--redetect` to re-run the smart detection algorithm:

```bash
tuhnr import --redetect
```

This scans all existing commits and updates their project assignments based on the file operations recorded in each commit.

---

## Data Management Commands

### Statistics

```bash
tuhnr stats                    # Overall statistics
tuhnr stats --project myproj   # Project-specific stats
tuhnr stats --json             # JSON output
```

### Export

```bash
tuhnr export                           # JSON to stdout
tuhnr export -o backup.json            # Save to file
tuhnr export --format=markdown         # Markdown format
tuhnr export --project myproj --limit 10
```

### Search

```bash
tuhnr search "keyword"                 # Search all content
tuhnr search "error" --project myproj  # Filter by project
tuhnr search "API" --limit 50          # Limit results
```

### Prune

```bash
tuhnr prune --before 30d --dry-run     # Preview deletions
tuhnr prune --before 2024-01-01        # Delete before date
tuhnr prune --before 7d --project old  # Project-specific
tuhnr prune --before 90d --yes         # Skip confirmation
```

## Publishing

```bash
# Build and publish to npm
pnpm build
npm publish
```

The package is published as `tuhnr` on npm.
