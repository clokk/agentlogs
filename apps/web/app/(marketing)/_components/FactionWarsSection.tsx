"use client";

import { motion, Variants } from "framer-motion";
import { LeaderboardRow } from "./LeaderboardRow";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const rowVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  },
};

const leaderboardData = [
  { rank: 1, tool: "claude_code" as const, commits: 4832, weeklyChange: 12 },
  { rank: 2, tool: "cursor" as const, commits: 3941, weeklyChange: 8 },
  { rank: 3, tool: "codex" as const, commits: 2156, weeklyChange: -3 },
  { rank: 4, tool: "opencode" as const, commits: 1918, weeklyChange: 15 },
];

export function FactionWarsSection() {
  return (
    <section className="py-20 px-6 bg-panel-alt border-y border-border overflow-hidden">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-xs text-subtle uppercase tracking-wide mb-2">Preview</p>
          <h2 className="text-3xl font-bold text-primary mb-2">Faction Wars</h2>
          <p className="text-muted">Which tool ships the most?</p>
        </div>

        {/* Leaderboard */}
        <div className="bg-bg rounded-xl border border-border overflow-hidden">
          {/* Header row */}
          <div className="grid grid-cols-3 md:grid-cols-4 px-4 py-2 text-xs text-muted uppercase tracking-wide border-b border-border">
            <span>Rank</span>
            <span>Tool</span>
            <span className="text-right">Commits</span>
            <span className="hidden md:block text-right">This Week</span>
          </div>

          {/* Tool rows with stagger animation */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {leaderboardData.map((item) => (
              <motion.div key={item.tool} variants={rowVariants}>
                <LeaderboardRow
                  rank={item.rank}
                  tool={item.tool}
                  commits={item.commits}
                  weeklyChange={item.weeklyChange}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* CTA */}
        <p className="text-center mt-6 text-muted">
          <span className="text-accent font-medium">Rep your tool.</span> Start
          tracking to join the count.
        </p>
      </div>
    </section>
  );
}
