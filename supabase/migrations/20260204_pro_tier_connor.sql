-- Upgrade Connor to Pro tier for testing

-- Create user_quotas table if it doesn't exist
CREATE TABLE IF NOT EXISTS user_quotas (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tier TEXT NOT NULL DEFAULT 'free',
  commit_limit INTEGER NOT NULL DEFAULT 250,
  storage_limit_bytes BIGINT NOT NULL DEFAULT 52428800,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_quotas ENABLE ROW LEVEL SECURITY;

-- Users can read their own quota (drop first to avoid conflict)
DROP POLICY IF EXISTS "users_read_own_quota" ON user_quotas;
CREATE POLICY "users_read_own_quota" ON user_quotas
  FOR SELECT USING (auth.uid() = user_id);

-- Insert pro tier for Connor (lookup by github username)
INSERT INTO user_quotas (user_id, tier, commit_limit, storage_limit_bytes)
SELECT id, 'pro', 999999, 5368709120
FROM user_profiles
WHERE github_username = 'clokk'
ON CONFLICT (user_id) DO UPDATE SET
  tier = 'pro',
  commit_limit = 999999,
  storage_limit_bytes = 5368709120,
  updated_at = NOW();
