/**
 * Daemon State Repository
 * Key-value store for daemon runtime state
 */

import type Database from "better-sqlite3";
import type { RepositoryContext } from "./types";

export class DaemonStateRepository {
  private db: Database.Database;

  constructor(context: RepositoryContext) {
    this.db = context.db;
  }

  /**
   * Get a state value
   */
  get(key: string): string | null {
    const row = this.db
      .prepare("SELECT value FROM daemon_state WHERE key = ?")
      .get(key) as { value: string } | undefined;

    return row?.value || null;
  }

  /**
   * Set a state value
   */
  set(key: string, value: string): void {
    this.db
      .prepare("INSERT OR REPLACE INTO daemon_state (key, value) VALUES (?, ?)")
      .run(key, value);
  }

  /**
   * Delete a state value
   */
  delete(key: string): void {
    this.db.prepare("DELETE FROM daemon_state WHERE key = ?").run(key);
  }

  /**
   * Get last activity timestamp
   */
  getLastActivity(): string | null {
    return this.get("last_activity");
  }

  /**
   * Update last activity timestamp
   */
  updateLastActivity(): void {
    this.set("last_activity", new Date().toISOString());
  }

  /**
   * Get file position for incremental reading
   */
  getFilePosition(filePath: string): number {
    const value = this.get(`file_pos:${filePath}`);
    return value ? parseInt(value, 10) : 0;
  }

  /**
   * Set file position for incremental reading
   */
  setFilePosition(filePath: string, position: number): void {
    this.set(`file_pos:${filePath}`, position.toString());
  }

  /**
   * Get current commit ID (the one being worked on)
   */
  getCurrentCommitId(): string | null {
    return this.get("current_commit_id");
  }

  /**
   * Set current commit ID
   */
  setCurrentCommitId(commitId: string | null): void {
    if (commitId) {
      this.set("current_commit_id", commitId);
    } else {
      this.delete("current_commit_id");
    }
  }

  /**
   * Get last sync time
   */
  getLastSyncTime(): string | null {
    return this.get("last_sync_time");
  }

  /**
   * Set last sync time
   */
  setLastSyncTime(time: string): void {
    this.set("last_sync_time", time);
  }
}
