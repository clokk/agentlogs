/**
 * Visuals Repository
 */

import type Database from "better-sqlite3";
import { v4 as uuidv4 } from "uuid";
import type { Visual } from "../../models/types";
import type { VisualRow, RepositoryContext } from "./types";

export class VisualsRepository {
  private db: Database.Database;

  constructor(context: RepositoryContext) {
    this.db = context.db;
  }

  /**
   * Insert a visual
   */
  insert(visual: Visual): void {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO visuals
      (id, commit_id, type, path, captured_at, caption)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      visual.id,
      visual.commitId,
      visual.type,
      visual.path,
      visual.capturedAt,
      visual.caption || null
    );
  }

  /**
   * Get visuals for a commit
   */
  getForCommit(commitId: string): Visual[] {
    const rows = this.db
      .prepare("SELECT * FROM visuals WHERE commit_id = ? ORDER BY captured_at")
      .all(commitId) as VisualRow[];

    return rows.map((row) => this.rowToVisual(row));
  }

  /**
   * Get a visual by ID
   */
  get(id: string): Visual | null {
    const row = this.db
      .prepare("SELECT * FROM visuals WHERE id = ?")
      .get(id) as VisualRow | undefined;

    if (!row) return null;

    return this.rowToVisual(row);
  }

  /**
   * Create a visual record
   */
  create(
    commitId: string,
    type: Visual["type"],
    filePath: string,
    caption?: string
  ): Visual {
    const visual: Visual = {
      id: uuidv4(),
      commitId,
      type,
      path: filePath,
      capturedAt: new Date().toISOString(),
      caption,
    };

    this.insert(visual);
    return visual;
  }

  /**
   * Update a visual (for caption editing)
   */
  update(id: string, updates: { caption?: string }): boolean {
    const fields: string[] = [];
    const values: (string | null)[] = [];

    if (updates.caption !== undefined) {
      fields.push("caption = ?");
      values.push(updates.caption || null);
    }

    if (fields.length === 0) return false;

    values.push(id);
    const stmt = this.db.prepare(
      `UPDATE visuals SET ${fields.join(", ")} WHERE id = ?`
    );
    const result = stmt.run(...values);
    return result.changes > 0;
  }

  /**
   * Delete a visual
   */
  delete(id: string): boolean {
    const result = this.db.prepare("DELETE FROM visuals WHERE id = ?").run(id);
    return result.changes > 0;
  }

  /**
   * Delete all visuals for a commit
   */
  deleteForCommit(commitId: string): void {
    this.db.prepare("DELETE FROM visuals WHERE commit_id = ?").run(commitId);
  }

  /**
   * Get visuals with cloud URL info
   */
  getWithCloudInfo(commitId: string): Array<{
    id: string;
    commitId: string;
    type: string;
    path: string;
    cloudUrl: string | null;
    capturedAt: string;
    caption: string | null;
  }> {
    const rows = this.db
      .prepare("SELECT * FROM visuals WHERE commit_id = ? ORDER BY captured_at")
      .all(commitId) as VisualRow[];

    return rows.map((row) => ({
      id: row.id,
      commitId: row.commit_id,
      type: row.type,
      path: row.path,
      cloudUrl: row.cloud_url || null,
      capturedAt: row.captured_at,
      caption: row.caption,
    }));
  }

  /**
   * Update visual cloud URL
   */
  updateCloudUrl(id: string, cloudUrl: string): boolean {
    const stmt = this.db.prepare(
      "UPDATE visuals SET cloud_url = ?, sync_status = 'synced' WHERE id = ?"
    );
    const result = stmt.run(cloudUrl, id);
    return result.changes > 0;
  }

  private rowToVisual(row: VisualRow): Visual {
    return {
      id: row.id,
      commitId: row.commit_id,
      type: row.type as Visual["type"],
      path: row.path,
      capturedAt: row.captured_at,
      caption: row.caption || undefined,
      cloudUrl: row.cloud_url || undefined,
    };
  }
}
