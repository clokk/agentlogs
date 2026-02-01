/**
 * API client for CogCommit Studio
 */

import type { CognitiveCommit } from "@cogcommit/types";

// Re-export CognitiveCommit for consumers
export type { CognitiveCommit };

const API_BASE = "/api";

export interface ProjectInfo {
  project: {
    name: string;
    path: string;
    global?: boolean;
  };
  stats: {
    commitCount: number;
    totalTurns: number;
    firstDate: string | null;
    lastDate: string | null;
  };
}

export interface ProjectListItem {
  name: string;
  count: number;
}

// Project
export async function fetchProject(): Promise<ProjectInfo> {
  const res = await fetch(`${API_BASE}/project`);
  if (!res.ok) throw new Error("Failed to fetch project");
  return res.json();
}

// Projects list (for global mode)
export async function fetchProjects(): Promise<{ projects: ProjectListItem[]; totalCount: number }> {
  const res = await fetch(`${API_BASE}/project/projects`);
  if (!res.ok) throw new Error("Failed to fetch projects");
  return res.json();
}

// Commits
export async function fetchCommits(project?: string): Promise<{ commits: CognitiveCommit[] }> {
  const url = project
    ? `${API_BASE}/commits?project=${encodeURIComponent(project)}`
    : `${API_BASE}/commits`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch commits");
  return res.json();
}

export async function fetchCommit(id: string): Promise<{ commit: CognitiveCommit }> {
  const res = await fetch(`${API_BASE}/commits/${id}`);
  if (!res.ok) throw new Error("Failed to fetch commit");
  return res.json();
}

export async function updateCommit(
  id: string,
  updates: Partial<Pick<CognitiveCommit, "title" | "hidden" | "displayOrder">>
): Promise<{ commit: CognitiveCommit }> {
  const res = await fetch(`${API_BASE}/commits/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update commit");
  return res.json();
}

export async function deleteCommit(id: string): Promise<{ success: boolean }> {
  const res = await fetch(`${API_BASE}/commits/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete commit");
  return res.json();
}

