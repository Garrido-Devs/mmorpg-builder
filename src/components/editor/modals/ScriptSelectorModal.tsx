import { useState, useMemo } from 'react'

// Scripts disponíveis (placeholder - futuramente virá de um registro)
const AVAILABLE_SCRIPTS = [
  { id: 'on_interact_dialog', name: 'Mostrar Diálogo', category: 'Interação', description: 'Abre diálogo ao interagir' },
  { id: 'on_interact_shop', name: 'Abrir Loja', category: 'Interação', description: 'Abre interface de loja' },
  { id: 'on_interact_quest', name: 'Iniciar Quest', category: 'Interação', description: 'Inicia ou avança quest' },
  { id: 'on_trigger_teleport', name: 'Teleportar Player', category: 'Trigger', description: 'Move player para posição' },
  { id: 'on_trigger_spawn', name: 'Spawnar Inimigos', category: 'Trigger', description: 'Cria inimigos na área' },
  { id: 'on_trigger_cutscene', name: 'Iniciar Cutscene', category: 'Trigger', description: 'Inicia sequência cinematográfica' },
  { id: 'on_death_loot', name: 'Dropar Loot', category: 'Morte', description: 'Dropa itens ao morrer' },
  { id: 'on_death_respawn', name: 'Respawnar', category: 'Morte', description: 'Respawna após tempo' },
  { id: 'on_timer_patrol', name: 'Patrulhar', category: 'Timer', description: 'Move entre waypoints' },
  { id: 'on_timer_heal', name: 'Regenerar HP', category: 'Timer', description: 'Recupera vida com tempo' },
  { id: 'on_damage_aggro', name: 'Entrar em Combate', category: 'Combate', description: 'Ativa AI de combate' },
  { id: 'on_damage_flee', name: 'Fugir', category: 'Combate', description: 'Foge quando HP baixo' },
  { id: 'custom_script', name: 'Script Customizado', category: 'Custom', description: 'Código personalizado' },
]

interface ScriptSelectorModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (scriptId: string) => void
  title?: string
}

/**
 * ScriptSelectorModal - Modal para selecionar scripts/eventos
 */
export function ScriptSelectorModal({
  isOpen,
  onClose,
  onSelect,
  title = 'Selecionar Script',
}: ScriptSelectorModalProps) {
  const [search, setSearch] = useState('')

  const filteredScripts = useMemo(() => {
    if (!search) return AVAILABLE_SCRIPTS
    const lower = search.toLowerCase()
    return AVAILABLE_SCRIPTS.filter(
      s => s.name.toLowerCase().includes(lower) ||
           s.category.toLowerCase().includes(lower) ||
           s.description.toLowerCase().includes(lower)
    )
  }, [search])

  // Agrupa por categoria
  const groupedScripts = useMemo(() => {
    const grouped: Record<string, typeof AVAILABLE_SCRIPTS> = {}
    filteredScripts.forEach(script => {
      if (!grouped[script.category]) {
        grouped[script.category] = []
      }
      grouped[script.category].push(script)
    })
    return grouped
  }, [filteredScripts])

  if (!isOpen) return null

  return (
    <div className="editor-modal-overlay" onClick={onClose}>
      <div className="editor-modal" onClick={e => e.stopPropagation()}>
        <div className="editor-modal-header">
          <span className="editor-modal-title">{title}</span>
          <button className="editor-btn editor-btn-icon" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="editor-modal-body">
          {/* Busca */}
          <div className="editor-search" style={{ marginBottom: '16px' }}>
            <span className="editor-search-icon">🔍</span>
            <input
              type="text"
              className="editor-input editor-search-input"
              placeholder="Buscar script..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              autoFocus
            />
          </div>

          {/* Lista de scripts */}
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {Object.entries(groupedScripts).map(([category, scripts]) => (
              <div key={category} style={{ marginBottom: '16px' }}>
                <div className="editor-dropdown-category">{category}</div>
                {scripts.map(script => (
                  <button
                    key={script.id}
                    className="editor-dropdown-item"
                    style={{ width: '100%', textAlign: 'left', border: 'none', background: 'transparent' }}
                    onClick={() => {
                      onSelect(script.id)
                      onClose()
                    }}
                  >
                    <span className="editor-dropdown-item-icon">📜</span>
                    <div style={{ flex: 1 }}>
                      <div className="editor-dropdown-item-name">{script.name}</div>
                      <div className="editor-dropdown-item-desc">{script.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            ))}

            {filteredScripts.length === 0 && (
              <div className="editor-empty">
                <div className="editor-empty-text">Nenhum script encontrado</div>
              </div>
            )}
          </div>
        </div>

        <div className="editor-modal-footer">
          <button className="editor-btn" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}
