/**
 * Sessions Repository
 */

import type Database from "better-sqlite3";
import type { Session, Turn } from "../../models/types";
import type { SessionRow, RepositoryContext } from "./types";
import { TurnsRepository } from "./turns";

export class SessionsRepository {
  private db: Database.Database;
  private turnsRepo: TurnsRepository;

  constructor(context: RepositoryContext) {
    this.db = context.db;
    this.turnsRepo = new TurnsRepository(context);
  }

  /**
   * Insert a session with its turns
   */
  insert(session: Session, commitId: string): void {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO sessions
      (id, commit_id, started_at, ended_at)
      VALUES (?, ?, ?, ?)
    `);

    stmt.run(session.id, commitId, session.startedAt, session.endedAt);

    // Insert turns
    for (const turn of session.turns) {
      this.turnsRepo.insert(turn, session.id);
    }
  }

  /**
   * Get sessions for a commit
   */
  getForCommit(commitId: string): Session[] {
    const rows = this.db
      .prepare("SELECT * FROM sessions WHERE commit_id = ? ORDER BY started_at")
      .all(commitId) as SessionRow[];

    return rows.map((row) => this.rowToSession(row));
  }

  /**
   * Upsert a session (for pull sync)
   */
  upsert(
    commitId: string,
    session: { id: string; startedAt: string; endedAt: string }
  ): void {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO sessions
      (id, commit_id, started_at, ended_at)
      VALUES (?, ?, ?, ?)
    `);

    stmt.run(session.id, commitId, session.startedAt, session.endedAt);
  }

  /**
   * Delete all sessions for a commit
   */
  deleteForCommit(commitId: string): void {
    // First delete turns for each session
    const sessions = this.getForCommit(commitId);
    for (const session of sessions) {
      this.db.prepare("DELETE FROM turns WHERE session_id = ?").run(session.id);
    }
    // Then delete sessions
    this.db.prepare("DELETE FROM sessions WHERE commit_id = ?").run(commitId);
  }

  private rowToSession(row: SessionRow): Session {
    const turns = this.turnsRepo.getForSession(row.id);

    return {
      id: row.id,
      startedAt: row.started_at,
      endedAt: row.ended_at,
      turns,
    };
  }
}
