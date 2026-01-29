# Shipchronicle

> The chronicle of shipping. Explore how products evolve through human-AI collaboration.

Parse Claude Code session logs to extract **Cognitive Commits** - the work that happens between git commits, including the conversation that shaped it.

## Installation

```bash
npm install
```

## Usage

```bash
# List discovered Claude projects
npx ts-node src/index.ts list

# Parse a project
npx ts-node src/index.ts parse ~/.claude/projects/-Users-you-YourProject/

# Parse specific session
npx ts-node src/index.ts parse <path> -s <session-id>

# Output formats: pretty (default), json, summary
npx ts-node src/index.ts parse <path> -o json
```

## What is a Cognitive Commit?

The **Cognitive Commit** is the new unit of work. It captures everything between git commits:

| Git | Cognitive Commit |
|-----|------------------|
| Many file changes → one commit | Many turns → one cognitive commit |
| Commit message = summary | First prompt = intent |
| `git diff` shows what changed | Turns show how it evolved |

**What closes a Cognitive Commit:**
1. **Git commit** - links directly to a hash
2. **Session end** - work done but not committed
3. **Explicit close** - user manually marks boundary

## Example Output

```
╔════════════════════════════════════════════════════════════╗
║  SHIPCHRONICLE: myproject                                  ║
╚════════════════════════════════════════════════════════════╝

📊 Summary
   Cognitive Commits: 3
   Sessions Parsed: 1
   Total Turns: 305

📝 Cognitive Commits

   1. [5ab1b76]
      Closed by: git_commit
      Time: 03:01 AM → 03:38 AM
      Sessions: 1 (152 turns)
      Files changed: 11
```

## Roadmap

- **Phase 1:** Parser CLI (current) ✓
- **Phase 2:** Watch daemon + auto-capture screenshots
- **Phase 3:** Web studio for curation
- **Phase 4:** Public viewer at shipchronicle.com

See [docs/vision.md](docs/vision.md) for the full vision.

## License

MIT
