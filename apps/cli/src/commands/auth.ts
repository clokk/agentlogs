/**
 * Auth commands - login, logout, whoami
 */

import { Command } from "commander";
import {
  login,
  logout,
  isAuthenticated,
  getCurrentUser,
  isCloudAvailable,
} from "../sync";

export function registerAuthCommands(program: Command): void {
  program
    .command("login")
    .description("Login with GitHub to enable cloud sync")
    .action(async () => {
      try {
        if (!isCloudAvailable()) {
          console.error("Cloud sync is not configured.");
          console.error("Set COGCOMMIT_SUPABASE_URL and COGCOMMIT_SUPABASE_ANON_KEY environment variables.");
          process.exit(1);
        }

        if (isAuthenticated()) {
          const user = getCurrentUser();
          console.log(`Already logged in as ${user?.githubUsername}`);
          console.log("Use 'cogcommit logout' to switch accounts.");
          return;
        }

        console.log("Starting GitHub authentication...");
        const user = await login();
        console.log(`\nLogged in as ${user.githubUsername}`);
        console.log("\nYou can now sync your conversations:");
        console.log("  cogcommit push    # Push local commits to cloud");
        console.log("  cogcommit pull    # Pull commits from cloud");
        console.log("  cogcommit sync    # Bidirectional sync");
      } catch (error) {
        console.error(`Login failed: ${(error as Error).message}`);
        process.exit(1);
      }
    });

  program
    .command("logout")
    .description("Logout and clear stored credentials")
    .action(async () => {
      try {
        if (!isAuthenticated()) {
          console.log("Not logged in.");
          return;
        }

        const user = getCurrentUser();
        await logout();
        console.log(`Logged out from ${user?.githubUsername}`);
      } catch (error) {
        console.error(`Logout failed: ${(error as Error).message}`);
        process.exit(1);
      }
    });

  program
    .command("whoami")
    .description("Show current logged-in user")
    .action(() => {
      if (!isAuthenticated()) {
        console.log("Not logged in.");
        console.log("Run 'cogcommit login' to authenticate with GitHub.");
        return;
      }

      const user = getCurrentUser();
      console.log(`Logged in as: ${user?.githubUsername}`);
      console.log(`User ID: ${user?.id}`);
    });
}
