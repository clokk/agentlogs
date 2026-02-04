"use client";

import { motion } from "framer-motion";
import { StreakIndicator } from "./StreakIndicator";

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

  const barDelay = 0.4 + delay;

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
      <div className="h-3 bg-bg rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${colorClasses[color]} rounded-full`}
          initial={{ width: 0 }}
          whileInView={{ width: `${percentage}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut", delay: barDelay }}
        />
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
