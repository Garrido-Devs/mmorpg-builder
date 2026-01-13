-- Migration 003: Create team_members table
-- Relacionamento entre usuários e times

CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

-- Index para buscar membros de um time
CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON team_members(team_id);

-- Index para buscar times de um usuário
CREATE INDEX IF NOT EXISTS idx_team_members_user_id ON team_members(user_id);
