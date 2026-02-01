/**
 * Studio command - Start the local dashboard
 */

import { Command } from "commander";
import {
  isInitialized,
  ensureGlobalStorageDir,
} from "../config";
import { startStudio } from "../studio";

export function registerStudioCommand(program: Command): void {
  program
    .command("dashboard")
    .description("Start the local dashboard to browse cognitive commits")
    .option("-P, --project", "View only current project (requires init)")
    .option("-p, --port <port>", "Port to run on", parseInt)
    .option("--no-open", "Don't auto-open browser")
    .option("-g, --global", "View all Claude Code history (default)")
    .action(async (options) => {
      try {
        let storagePath: string;

        if (options.project) {
          // Project mode - require initialization
          const projectPath = process.cwd();

          if (!isInitialized(projectPath)) {
            console.error("Project not initialized. Run 'cogcommit init' first.");
            console.error("\nTip: Run without --project to see all your cognitive commits.");
            process.exit(1);
          }

          storagePath = projectPath;
        } else {
          // Global mode (default) - use global storage directory
          storagePath = ensureGlobalStorageDir();
          console.log("Starting dashboard...");
        }

        await startStudio(storagePath, {
          port: options.port,
          open: options.open !== false,
          global: !options.project,
        });
      } catch (error) {
        console.error(`Error: ${(error as Error).message}`);
        process.exit(1);
      }
    });
}
