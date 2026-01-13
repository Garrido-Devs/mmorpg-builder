-- Migration 007: Add scene data type
-- Permite salvar cenas completas do jogo

-- Remover o constraint antigo e adicionar novo com 'scene'
ALTER TABLE project_data
  DROP CONSTRAINT IF EXISTS project_data_data_type_check;

ALTER TABLE project_data
  ADD CONSTRAINT project_data_data_type_check CHECK (data_type IN (
    'map', 'entity', 'menu', 'config', 'screen',
    'character', 'npc', 'item', 'quest', 'dialogue',
    'skill', 'recipe', 'asset_ref', 'scene'
  ));
