import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

interface DbCommitMinimal {
  id: string;
  project_name: string | null;
  prompt_count: number | null;
  closed_at: string;
}

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch id, project_name, prompt_count, and closed_at for counting and weekly stats
    const { data: rawCommits, error } = await supabase
      .from("cognitive_commits")
      .select(`id, project_name, prompt_count, closed_at`)
      .eq("user_id", user.id)
      .is("deleted_at", null)
      .eq("hidden", false);

    if (error) {
      console.error("Failed to fetch projects:", error);
      return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
    }

    // Build project counts and weekly stats, filtering out 0-turn commits
    const projectCounts = new Map<string, number>();
    let totalCount = 0;

    // Calculate weekly stats
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const weekStartISO = oneWeekAgo.toISOString();
    let weeklyCommitCount = 0;
    let weeklyPromptCount = 0;

    for (const commit of (rawCommits as DbCommitMinimal[]) || []) {
      // Filter out 0-turn commits using stored prompt_count
      if (!commit.prompt_count || commit.prompt_count === 0) continue;

      totalCount++;
      if (commit.project_name) {
        projectCounts.set(commit.project_name, (projectCounts.get(commit.project_name) || 0) + 1);
      }

      // Count weekly stats
      if (commit.closed_at >= weekStartISO) {
        weeklyCommitCount++;
        weeklyPromptCount += commit.prompt_count;
      }
    }

    const weeklySummary = {
      weeklyCommitCount,
      weeklyPromptCount,
      avgPromptsPerCommit: weeklyCommitCount > 0
        ? weeklyPromptCount / weeklyCommitCount
        : 0,
    };

    // Convert to array and sort by count descending
    const projects = Array.from(projectCounts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    return NextResponse.json(
      { projects, totalCount, weeklySummary },
      {
        headers: {
          "Cache-Control": "private, max-age=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}
