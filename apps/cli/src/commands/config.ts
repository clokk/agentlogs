/**
 * Config and analytics commands
 */

import { Command } from "commander";
import * as path from "path";
import { ensureGlobalStorageDir } from "../config";
import { CogCommitDB } from "../storage/db";

export function registerConfigCommands(program: Command): void {
  program
    .command("config")
    .description("View or update configuration")
    .argument("[key]", "Configuration key to get/set")
    .argument("[value]", "Value to set")
    .option("--list", "List all configuration values")
    .action(async (key: string | undefined, value: string | undefined, options) => {
      try {
        const home = process.env.HOME || "";
        const configPath = path.join(home, ".cogcommit", "settings.json");
        const fs = require("fs");

        // Load existing settings
        let settings: Record<string, unknown> = {};
        if (fs.existsSync(configPath)) {
          settings = JSON.parse(fs.readFileSync(configPath, "utf-8"));
        }

        if (options.list || (!key && !value)) {
          console.log("\nCogCommit Configuration:");
          console.log(`  storage: ${settings.storage || "local"}`);
          console.log(`  continuous-sync: ${settings.continuousSync || false}`);
          console.log(`  analytics-opt-in: ${settings.analyticsOptIn || false}`);
          return;
        }

        if (key && value) {
          // Set value
          const validKeys = ["storage", "continuous-sync", "analytics-opt-in"];
          if (!validKeys.includes(key)) {
            console.error(`Unknown configuration key: ${key}`);
            console.error(`Valid keys: ${validKeys.join(", ")}`);
            process.exit(1);
          }

          // Convert key to camelCase for storage
          const storageKey = key.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

          // Parse boolean values
          let parsedValue: unknown = value;
          if (value === "true") parsedValue = true;
          else if (value === "false") parsedValue = false;

          settings[storageKey] = parsedValue;

          // Ensure directory exists
          const configDir = path.dirname(configPath);
          if (!fs.existsSync(configDir)) {
            fs.mkdirSync(configDir, { recursive: true });
          }

          fs.writeFileSync(configPath, JSON.stringify(settings, null, 2));
          console.log(`Set ${key} = ${value}`);
        } else if (key) {
          // Get value
          const storageKey = key.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
          console.log(settings[storageKey] ?? "(not set)");
        }
      } catch (error) {
        console.error(`Config error: ${(error as Error).message}`);
        process.exit(1);
      }
    });

  program
    .command("analytics")
    .description("View analytics and manage opt-in")
    .option("--opt-in", "Opt in to aggregate analytics")
    .option("--opt-out", "Opt out of aggregate analytics")
    .action(async (options) => {
      try {
        const storagePath = ensureGlobalStorageDir();
        const db = new CogCommitDB(storagePath, { rawStoragePath: true });

        if (options.optIn || options.optOut) {
          const home = process.env.HOME || "";
          const configPath = path.join(home, ".cogcommit", "settings.json");
          const fs = require("fs");

          let settings: Record<string, unknown> = {};
          if (fs.existsSync(configPath)) {
            settings = JSON.parse(fs.readFileSync(configPath, "utf-8"));
          }

          settings.analyticsOptIn = options.optIn ? true : false;
          fs.writeFileSync(configPath, JSON.stringify(settings, null, 2));

          console.log(options.optIn
            ? "Opted in to aggregate analytics."
            : "Opted out of aggregate analytics."
          );
          db.close();
          return;
        }

        // Show local analytics
        const commitCount = db.commits.getCount();
        const projects = db.commits.getDistinctProjects();
        const recentCommits = db.commits.getRecent(100);

        // Calculate stats
        let totalTurns = 0;
        let totalSessions = 0;
        const toolUsage: Record<string, number> = {};

        for (const commit of recentCommits) {
          totalSessions += commit.sessions.length;
          for (const session of commit.sessions) {
            totalTurns += session.turns.length;
            for (const turn of session.turns) {
              if (turn.toolCalls) {
                for (const call of turn.toolCalls) {
                  toolUsage[call.name] = (toolUsage[call.name] || 0) + 1;
                }
              }
            }
          }
        }

        db.close();

        console.log("\nCogCommit Analytics (Local)\n");
        console.log(`Total Commits: ${commitCount}`);
        console.log(`Projects: ${projects.length}`);
        console.log(`\nRecent Activity (last 100 commits):`);
        console.log(`  Sessions: ${totalSessions}`);
        console.log(`  Turns: ${totalTurns}`);
        console.log(`  Avg turns/commit: ${(totalTurns / Math.max(recentCommits.length, 1)).toFixed(1)}`);

        if (Object.keys(toolUsage).length > 0) {
          console.log(`\nTop Tools Used:`);
          const sortedTools = Object.entries(toolUsage)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
          for (const [tool, count] of sortedTools) {
            console.log(`  ${tool}: ${count}`);
          }
        }

        console.log("\n---");
        console.log("Analytics are computed locally. No data is uploaded.");
        console.log("Run 'cogcommit analytics --opt-in' to help improve CogCommit.");
      } catch (error) {
        console.error(`Analytics error: ${(error as Error).message}`);
        process.exit(1);
      }
    });
}
