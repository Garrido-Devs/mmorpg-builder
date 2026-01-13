import { useCallback } from 'react'
import type { GameMode } from '../../types'
import { getEngine } from '../../engine'
import { downloadMap, loadMapFromFile } from '../../utils'

interface EditorTopBarProps {
  mode: GameMode
  onModeChange: (mode: GameMode) => void
}

/**
 * EditorTopBar - Barra superior do editor
 */
export function EditorTopBar({ mode, onModeChange }: EditorTopBarProps) {
  const handleSaveMap = useCallback(() => {
    const engine = getEngine()
    const mapData = engine.getMapData()
    downloadMap(mapData, `map_${Date.now()}.json`)
  }, [])

  const handleLoadMap = useCallback(async () => {
    try {
      const mapData = await loadMapFromFile()
      const engine = getEngine()
      engine.loadMap(mapData)
    } catch (error) {
      console.error('Erro ao carregar mapa:', error)
    }
  }, [])

  const handleSetTool = useCallback((tool: 'translate' | 'rotate' | 'scale') => {
    const engine = getEngine()
    engine.editorSystem.setTransformMode(tool)
  }, [])

  return (
    <header className="editor-topbar">
      {/* Logo */}
      <div className="editor-topbar-logo">
        <span>🎮</span>
        <span>MMORPG Editor</span>
      </div>

      <div className="editor-topbar-divider" />

      {/* Ferramentas de transformação */}
      {mode === 'editor' && (
        <div className="editor-topbar-tools">
          <div className="editor-btn-group">
            <button
              className="editor-btn editor-btn-icon"
              title="Selecionar (Q)"
              onClick={() => {}}
            >
              ◇
            </button>
            <button
              className="editor-btn editor-btn-icon"
              title="Mover (W)"
              onClick={() => handleSetTool('translate')}
            >
              ↔
            </button>
            <button
              className="editor-btn editor-btn-icon"
              title="Rotacionar (E)"
              onClick={() => handleSetTool('rotate')}
            >
              ⟳
            </button>
            <button
              className="editor-btn editor-btn-icon"
              title="Escalar (R)"
              onClick={() => handleSetTool('scale')}
            >
              ⤢
            </button>
          </div>

          <div className="editor-topbar-divider" />

          {/* Ações de grid */}
          <button className="editor-btn editor-btn-icon" title="Toggle Grid (G)">
            ⊞
          </button>
          <button className="editor-btn editor-btn-icon" title="Snap to Grid">
            ⌗
          </button>
        </div>
      )}

      {/* Ações */}
      <div className="editor-topbar-actions">
        {mode === 'editor' && (
          <>
            <button className="editor-btn" onClick={handleLoadMap}>
              📂 Abrir
            </button>
            <button className="editor-btn" onClick={handleSaveMap}>
              💾 Salvar
            </button>
            <div className="editor-topbar-divider" />
          </>
        )}

        {/* Toggle modo */}
        <button
          className={`editor-btn ${mode === 'editor' ? 'editor-btn-primary' : ''}`}
          onClick={() => onModeChange(mode === 'play' ? 'editor' : 'play')}
        >
          {mode === 'play' ? '🔧 Editor' : '▶ Jogar'}
        </button>
      </div>
    </header>
  )
}
