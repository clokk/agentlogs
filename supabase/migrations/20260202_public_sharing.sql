-- Public Sharing Feature Migration
-- Enables users to publish cognitive commits with shareable links

-- Add public sharing columns
ALTER TABLE cognitive_commits ADD COLUMN IF NOT EXISTS public_slug TEXT UNIQUE;
ALTER TABLE cognitive_commits ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ;

-- Index for fast lookup by public slug (only for published commits)
CREATE INDEX IF NOT EXISTS idx_commits_public_slug
  ON cognitive_commits(public_slug)
  WHERE public_slug IS NOT NULL;

-- RLS policy for public read access to published commits
-- Anyone can view commits where published=true and public_slug is set
CREATE POLICY "public_read_published_commits"
  ON cognitive_commits FOR SELECT
  USING (published = true AND public_slug IS NOT NULL);

-- RLS policy for public read access to sessions of published commits
CREATE POLICY "public_read_published_sessions"
  ON sessions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM cognitive_commits
      WHERE cognitive_commits.id = sessions.commit_id
        AND cognitive_commits.published = true
    )
  );

-- RLS policy for public read access to turns of published commits
CREATE POLICY "public_read_published_turns"
  ON turns FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM sessions
      JOIN cognitive_commits ON cognitive_commits.id = sessions.commit_id
      WHERE sessions.id = turns.session_id
        AND cognitive_commits.published = true
    )
  );
