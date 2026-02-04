"use client";

import { motion } from "framer-motion";
import { StreakIndicator } from "./StreakIndicator";

function Sparkle({ color, delay }: { color: string; delay: number }) {
  return (
    <motion.div
      className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: [0, 1, 1, 0] }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, times: [0, 0.1, 0.7, 1] }}
    >
      {/* Multiple sparkle particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{ backgroundColor: color }}
          initial={{ scale: 0, x: 0, y: 0 }}
          whileInView={{
            scale: [0, 1, 0],
            x: [0, (Math.random() - 0.5) * 40],
            y: [0, (Math.random() - 0.5) * 40],
          }}
          viewport={{ once: true }}
          transition={{
            duration: 0.6,
            delay: delay + i * 0.05,
            ease: "easeOut",
          }}
        />
      ))}
      {/* Center star */}
      <motion.svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        className="absolute -translate-x-1/2 -translate-y-1/2"
        initial={{ scale: 0, rotate: 0 }}
        whileInView={{ scale: [0, 1.5, 0], rotate: [0, 180] }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
      >
        <path
          d="M8 0L9.5 6.5L16 8L9.5 9.5L8 16L6.5 9.5L0 8L6.5 6.5L8 0Z"
          fill={color}
        />
      </motion.svg>
    </motion.div>
  );
}

function ProgressBar({
  label,
  value,
  percentage,
  color,
  delay = 0,
}: {
  label: string;
  value: string;
  percentage: number;
  color: "green" | "amber";
  delay?: number;
}) {
  const colorClasses = {
    green: "bg-chronicle-green",
    amber: "bg-chronicle-amber",
  };
  const textClasses = {
    green: "text-chronicle-green",
    amber: "text-chronicle-amber",
  };
  const sparkleColor = {
    green: "#5a9a7a",
    amber: "#b8923a",
  };

  const barDelay = 0.4 + delay;
  const sparkleDelay = barDelay + 0.8; // After bar finishes

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
    >
      <div className="flex justify-between text-sm mb-2">
        <span className="text-muted">{label}</span>
        <span className={`${textClasses[color]} font-medium`}>{value}</span>
      </div>
      <div className="h-3 bg-bg rounded-full overflow-visible relative">
        <motion.div
          className={`h-full ${colorClasses[color]} rounded-full relative`}
          initial={{ width: 0 }}
          whileInView={{ width: `${percentage}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut", delay: barDelay }}
        >
          <Sparkle color={sparkleColor[color]} delay={sparkleDelay} />
        </motion.div>
      </div>
    </motion.div>
  );
}

export function YourStatsSection() {
  return (
    <section className="py-20 px-6 overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left: Visual preview */}
          <div className="bg-panel rounded-xl border border-border p-8 overflow-visible">
            {/* Streak display */}
            <div className="mb-8">
              <StreakIndicator days={7} />
            </div>

            {/* Progress bars */}
            <div className="space-y-5">
              <ProgressBar
                label="This week"
                value="12 commits"
                percentage={75}
                color="green"
                delay={0}
              />
              <ProgressBar
                label="Monthly goal"
                value="68%"
                percentage={68}
                color="amber"
                delay={0.2}
              />
            </div>
          </div>

          {/* Right: Copy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold text-primary mb-4">
              Level up your shipping
            </h2>
            <p className="text-lg text-muted mb-6">
              Track your AI coding sessions like a pro. Build streaks, hit
              goals, and see your progress over time.
            </p>
            <ul className="space-y-3 text-muted">
              <li className="flex items-center gap-3">
                <span className="text-chronicle-green">—</span>
                Daily streak tracking
              </li>
              <li className="flex items-center gap-3">
                <span className="text-chronicle-green">—</span>
                Weekly and monthly summaries
              </li>
              <li className="flex items-center gap-3">
                <span className="text-chronicle-green">—</span>
                Personal analytics dashboard
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
