/**
 * @cogcommit/supabase
 * Shared Supabase client and queries for CogCommit
 */

// Client factories
export {
  createSupabaseBrowserClient,
  createSupabaseServerClient,
  createBasicSupabaseClient,
  createSupabaseClientWithToken,
  isSupabaseConfigured,
  getSupabaseUrl,
  getSupabaseAnonKey,
  type CookieStore,
} from "./client";

// Query functions
export {
  getCommits,
  getCommit,
  getCommitsCount,
  getProjectNames,
  updateCommit,
  deleteCommit,
  getUserProfile,
  getUserUsage,
  type GetCommitsOptions,
} from "./queries";

// Transform functions
export {
  transformCommit,
  transformSession,
  transformTurn,
  transformCommitWithRelations,
  toDbCommit,
  toDbSession,
  toDbTurn,
  type DbCommitWithRelations,
} from "./transforms";

// Re-export types from @cogcommit/types for convenience
export type {
  CognitiveCommit,
  Session,
  Turn,
  ToolCall,
  DbCommit,
  DbSession,
  DbTurn,
  UserProfile,
  SyncStatus,
  ClosedBy,
  ConversationSource,
  UsageData,
  QuotaTier,
} from "@cogcommit/types";

export { FREE_TIER_LIMITS } from "@cogcommit/types";
