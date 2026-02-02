/**
 * Usage API routes for cloud sync limits
 */

import { Hono } from "hono";
import { loadAuthTokens, getAuthenticatedClient } from "../../sync/client";
import { getUserUsage } from "@cogcommit/supabase";

export function createUsageRoutes(): Hono {
  const app = new Hono();

  // GET /api/usage - Get cloud usage data
  app.get("/", async (c) => {
    const tokens = loadAuthTokens();

    if (!tokens) {
      // Not authenticated - return null usage
      return c.json({ usage: null });
    }

    try {
      const supabase = getAuthenticatedClient();
      const usage = await getUserUsage(supabase, tokens.user.id);
      return c.json({ usage });
    } catch (error) {
      console.error("Failed to fetch usage:", error);
      return c.json({ usage: null });
    }
  });

  return app;
}
