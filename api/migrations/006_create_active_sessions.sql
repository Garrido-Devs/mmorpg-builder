-- Migration 006: Create active_sessions table
-- Sessões ativas para colaboração em tempo real

CREATE TABLE IF NOT EXISTS active_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,

  -- Posição do cursor no editor (para mostrar outros usuários)
  cursor_position JSONB DEFAULT '{"x": 0, "y": 0, "z": 0}',

  -- Elemento selecionado atualmente
  selected_element VARCHAR(255),

  -- Status da conexão
  is_active BOOLEAN DEFAULT true,
  last_ping TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Metadata da sessão
  user_agent TEXT,
  ip_address VARCHAR(45),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Um usuário só pode ter uma sessão ativa por projeto
  UNIQUE(user_id, project_id)
);

-- Index para buscar sessões ativas de um projeto
CREATE INDEX IF NOT EXISTS idx_active_sessions_project ON active_sessions(project_id) WHERE is_active = true;

-- Index para limpar sessões antigas
CREATE INDEX IF NOT EXISTS idx_active_sessions_last_ping ON active_sessions(last_ping);

-- Função para limpar sessões inativas (mais de 5 minutos sem ping)
CREATE OR REPLACE FUNCTION cleanup_inactive_sessions()
RETURNS void AS $$
BEGIN
  UPDATE active_sessions
  SET is_active = false
  WHERE last_ping < NOW() - INTERVAL '5 minutes' AND is_active = true;
END;
$$ LANGUAGE plpgsql;
