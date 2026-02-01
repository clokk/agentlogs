/**
 * SQLite database wrapper for CogCommit
 * Uses repository pattern for organized data access
 */

import Database from "better-sqlite3";
import * as path from "path";
import { CREATE_TABLES, SCHEMA_VERSION, getMigrationSql } from "./schema";
import { ensureStorageDir } from "../config";
import {
  CommitsRepository,
  SessionsRepository,
  TurnsRepository,
  VisualsRepository,
  DaemonStateRepository,
} from "./repositories";

const DB_FILE = "data.db";

export interface DBOptions {
  /** If true, use the path directly as storage dir (don't hash it) */
  rawStoragePath?: boolean;
}

export class CogCommitDB {
  private db: Database.Database;
  private projectPath: string;

  // Repositories
  private _commits: CommitsRepository;
  private _sessions: SessionsRepository;
  private _turns: TurnsRepository;
  private _visuals: VisualsRepository;
  private _daemonState: DaemonStateRepository;

  constructor(projectPath: string, options: DBOptions = {}) {
    this.projectPath = projectPath;

    // For global mode, the path is already the storage directory
    let storageDir: string;
    if (options.rawStoragePath) {
      storageDir = projectPath;
      if (!require("fs").existsSync(storageDir)) {
        require("fs").mkdirSync(storageDir, { recursive: true });
      }
    } else {
      storageDir = ensureStorageDir(projectPath);
    }

    const dbPath = path.join(storageDir, DB_FILE);

    this.db = new Database(dbPath);
    this.db.pragma("journal_mode = WAL");
    this.initialize();

    // Initialize repositories
    const context = { db: this.db };
    this._commits = new CommitsRepository(context);
    this._sessions = new SessionsRepository(context);
    this._turns = new TurnsRepository(context);
    this._visuals = new VisualsRepository(context);
    this._daemonState = new DaemonStateRepository(context);
  }

  private initialize(): void {
    // Create tables
    this.db.exec(CREATE_TABLES);

    // Check schema version
    const versionRow = this.db
      .prepare("SELECT version FROM schema_version LIMIT 1")
      .get() as { version: number } | undefined;

    const currentVersion = versionRow?.version || 0;

    if (currentVersion < SCHEMA_VERSION) {
      // Run migrations
      const migrations = getMigrationSql(currentVersion, SCHEMA_VERSION);
      for (const sql of migrations) {
        this.db.exec(sql);
      }

      // Update version
      this.db
        .prepare(
          "INSERT OR REPLACE INTO schema_version (version) VALUES (?)"
        )
        .run(SCHEMA_VERSION);
    }
  }

  /**
   * Close the database connection
   */
  close(): void {
    this.db.close();
  }

  // Repository Accessors

  get commits(): CommitsRepository {
    return this._commits;
  }

  get sessions(): SessionsRepository {
    return this._sessions;
  }

  get turns(): TurnsRepository {
    return this._turns;
  }

  get visuals(): VisualsRepository {
    return this._visuals;
  }

  get daemonState(): DaemonStateRepository {
    return this._daemonState;
  }
}
