-- Migration 004: Create projects table
-- Projetos de jogos

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  thumbnail_url TEXT,

  -- Metadata do jogo
  game_title VARCHAR(255),
  game_subtitle VARCHAR(255),
  game_version VARCHAR(50) DEFAULT '0.1.0',
  game_genre TEXT[] DEFAULT '{}',

  -- Status
  is_public BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index para buscar projetos de um time
CREATE INDEX IF NOT EXISTS idx_projects_team_id ON projects(team_id);

-- Index para projetos públicos
CREATE INDEX IF NOT EXISTS idx_projects_public ON projects(is_public) WHERE is_public = true;

-- Trigger para updated_at
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
