-- Migration 005: Create project_data table
-- Dados do projeto (mapas, entidades, menus, etc.)

CREATE TABLE IF NOT EXISTS project_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,

  -- Tipo e identificador do dado
  data_type VARCHAR(50) NOT NULL CHECK (data_type IN (
    'map', 'entity', 'menu', 'config', 'screen',
    'character', 'npc', 'item', 'quest', 'dialogue',
    'skill', 'recipe', 'asset_ref'
  )),
  data_key VARCHAR(255) NOT NULL,

  -- Dados em JSONB para flexibilidade
  data JSONB NOT NULL DEFAULT '{}',

  -- Versionamento para conflitos
  version INT DEFAULT 1,

  -- Quem atualizou por último
  updated_by UUID REFERENCES users(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Constraint de unicidade
  UNIQUE(project_id, data_type, data_key)
);

-- Index para buscar dados de um projeto
CREATE INDEX IF NOT EXISTS idx_project_data_project_id ON project_data(project_id);

-- Index para buscar por tipo
CREATE INDEX IF NOT EXISTS idx_project_data_type ON project_data(project_id, data_type);

-- Index GIN para busca em JSONB
CREATE INDEX IF NOT EXISTS idx_project_data_data ON project_data USING GIN (data);
