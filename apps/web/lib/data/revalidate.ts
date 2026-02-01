"use server";

import { revalidateTag } from "next/cache";

/**
 * Invalidate the server-side cache for a user's commits.
 * Call this after mutations (title updates, deletions, etc.)
 */
export async function revalidateUserCommits(userId: string) {
  revalidateTag(`user-commits-${userId}`);
}

/**
 * Invalidate all commits cache (admin use, deployment, etc.)
 */
export async function revalidateAllCommits() {
  revalidateTag("commits");
}
