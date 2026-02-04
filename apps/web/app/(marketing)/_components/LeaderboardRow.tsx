type Tool = "claude_code" | "cursor" | "codex" | "opencode";

interface LeaderboardRowProps {
  rank: number;
  tool: Tool;
  commits: number;
  weeklyChange: number;
}

const toolConfig: Record<Tool, { name: string; bgClass: string; textClass: string }> = {
  claude_code: {
    name: "Claude Code",
    bgClass: "bg-[#5a8a9a]/20",
    textClass: "text-[#6a9aaa]",
  },
  cursor: {
    name: "Cursor",
    bgClass: "bg-[#8a7aab]/20",
    textClass: "text-[#a090c0]",
  },
  codex: {
    name: "Codex",
    bgClass: "bg-[#5a9a7a]/20",
    textClass: "text-[#6aaa8a]",
  },
  opencode: {
    name: "OpenCode",
    bgClass: "bg-[#b8923a]/20",
    textClass: "text-[#c8a24a]",
  },
};

const rankColors: Record<number, string> = {
  1: "text-[#c8a24a]", // gold
  2: "text-[#9a9a9a]", // silver
  3: "text-[#a07860]", // bronze
};

export function LeaderboardRow({
  rank,
  tool,
  commits,
  weeklyChange,
}: LeaderboardRowProps) {
  const config = toolConfig[tool];
  const rankColor = rankColors[rank] || "text-muted";

  return (
    <div className="grid grid-cols-3 md:grid-cols-4 px-4 py-3 border-b border-border last:border-b-0 items-center">
      {/* Rank */}
      <span className={`font-mono font-bold ${rankColor}`}>#{rank}</span>

      {/* Tool badge */}
      <div className="flex items-center gap-2">
        <span
          className={`px-2 py-1 rounded text-sm font-medium ${config.bgClass} ${config.textClass}`}
        >
          {config.name}
        </span>
      </div>

      {/* Commits */}
      <span className="text-right font-mono text-primary">
        {commits.toLocaleString()}
      </span>

      {/* Weekly change - hidden on mobile */}
      <span
        className={`hidden md:block text-right font-mono ${
          weeklyChange >= 0 ? "text-chronicle-green" : "text-chronicle-red"
        }`}
      >
        {weeklyChange >= 0 ? "+" : ""}
        {weeklyChange}%
      </span>
    </div>
  );
}
