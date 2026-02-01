/**
 * Init command - Initialize CogCommit for a project
 */

import { Command } from "commander";
import {
  initializeProject,
  loadConfig,
  isInitialized,
  detectClaudeProjectPath,
  getStorageDir,
} from "../config";

export function registerInitCommand(program: Command): void {
  program
    .command("init")
    .description("Initialize CogCommit for this project")
    .option("-n, --name <name>", "Project name (defaults to directory name)")
    .option("-c, --claude-path <path>", "Claude project path (auto-detected if not specified)")
    .option("-p, --port <port>", "Dev server port", parseInt)
    .option("--no-capture", "Disable screenshot capture")
    .action(async (options) => {
      try {
        const projectPath = process.cwd();

        if (isInitialized(projectPath)) {
          console.log("Project already initialized.");
          const config = loadConfig(projectPath);
          console.log(`\nCurrent config:`);
          console.log(`  Project: ${config.projectName}`);
          console.log(`  Claude path: ${config.claudeProjectPath}`);
          console.log(`  Dev server port: ${config.devServerPort || "auto-detect"}`);
          console.log(`  Capture enabled: ${config.captureEnabled}`);
          return;
        }

        // Validate Claude project path
        const claudePath = options.claudePath || detectClaudeProjectPath(projectPath);
        if (!claudePath) {
          console.error("Could not detect Claude project path.");
          console.error("Please specify with --claude-path option.");
          console.error("\nHint: Claude projects are stored at ~/.claude/projects/");
          process.exit(1);
        }

        const config = initializeProject(projectPath, {
          projectName: options.name,
          claudeProjectPath: claudePath,
          devServerPort: options.port,
          captureEnabled: options.capture !== false,
        });

        console.log(`Initialized CogCommit for: ${config.projectName}`);
        console.log(`\nConfig created at: .cogcommit/config.json`);
        console.log(`\nSettings:`);
        console.log(`  Claude path: ${config.claudeProjectPath}`);
        console.log(`  Dev server port: ${config.devServerPort || "auto-detect"}`);
        console.log(`  Capture enabled: ${config.captureEnabled}`);
        console.log(`\nStorage directory: ${getStorageDir(projectPath)}`);
        console.log(`\nNext steps:`);
        console.log(`  1. Start your dev server`);
        console.log(`  2. Run: cogcommit watch`);
      } catch (error) {
        console.error(`Error: ${(error as Error).message}`);
        process.exit(1);
      }
    });
}
