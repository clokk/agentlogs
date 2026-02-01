/**
 * Turns Repository
 */

import type Database from "better-sqlite3";
import type { Turn } from "../../models/types";
import type { TurnRow, RepositoryContext } from "./types";

export class TurnsRepository {
  private db: Database.Database;

  constructor(context: RepositoryContext) {
    this.db = context.db;
  }

  /**
   * Insert a turn
   */
  insert(turn: Turn, sessionId: string): void {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO turns
      (id, session_id, role, content, timestamp, tool_calls, triggers_visual, model)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      turn.id,
      sessionId,
      turn.role,
      turn.content,
      turn.timestamp,
      turn.toolCalls ? JSON.stringify(turn.toolCalls) : null,
      turn.triggersVisualUpdate ? 1 : 0,
      turn.model || null
    );
  }

  /**
   * Get turns for a session
   */
  getForSession(sessionId: string): Turn[] {
    const rows = this.db
      .prepare("SELECT * FROM turns WHERE session_id = ? ORDER BY timestamp")
      .all(sessionId) as TurnRow[];

    return rows.map((row) => this.rowToTurn(row));
  }

  /**
   * Upsert a turn (for pull sync)
   */
  upsert(
    sessionId: string,
    turn: {
      id: string;
      role: string;
      content: string | null;
      timestamp: string;
      toolCalls?: unknown;
      triggersVisual?: boolean;
      model?: string | null;
    }
  ): void {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO turns
      (id, session_id, role, content, timestamp, tool_calls, triggers_visual, model)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      turn.id,
      sessionId,
      turn.role,
      turn.content,
      turn.timestamp,
      turn.toolCalls ? JSON.stringify(turn.toolCalls) : null,
      turn.triggersVisual ? 1 : 0,
      turn.model || null
    );
  }

  private rowToTurn(row: TurnRow): Turn {
    return {
      id: row.id,
      role: row.role as "user" | "assistant",
      content: row.content || "",
      timestamp: row.timestamp,
      model: row.model || undefined,
      toolCalls: row.tool_calls ? JSON.parse(row.tool_calls) : undefined,
      triggersVisualUpdate: row.triggers_visual === 1 ? true : undefined,
    };
  }
}
