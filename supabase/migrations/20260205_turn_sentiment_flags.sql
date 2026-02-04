-- Turn-level sentiment flags for navigation and analytics

-- Add sentiment columns to turns table
ALTER TABLE turns ADD COLUMN IF NOT EXISTS has_rejection BOOLEAN DEFAULT FALSE;
ALTER TABLE turns ADD COLUMN IF NOT EXISTS has_approval BOOLEAN DEFAULT FALSE;
ALTER TABLE turns ADD COLUMN IF NOT EXISTS is_question BOOLEAN DEFAULT FALSE;
ALTER TABLE turns ADD COLUMN IF NOT EXISTS has_code_block BOOLEAN DEFAULT FALSE;
ALTER TABLE turns ADD COLUMN IF NOT EXISTS char_count INTEGER DEFAULT 0;

-- Partial indexes for efficient querying of rejection/approval turns
CREATE INDEX IF NOT EXISTS idx_turns_has_rejection ON turns(has_rejection) WHERE has_rejection = TRUE;
CREATE INDEX IF NOT EXISTS idx_turns_has_approval ON turns(has_approval) WHERE has_approval = TRUE;
