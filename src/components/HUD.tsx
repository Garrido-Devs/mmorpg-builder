import { useCallback } from 'react'
import type { GameMode } from '../types'
import { getEngine } from '../engine'
import { downloadMap, loadMapFromFile } from '../utils'

interface HUDProps {
  mode: GameMode
  onModeChange: (mode: GameMode) => void
}

/**
 * HUD - Interface de heads-up display
 *
 * Responsabilidades:
 * - Mostrar modo atual (play/editor)
 * - Botão para alternar modos
 * - Ações de salvar/carregar mapa
 *
 * Decisão: Componente stateless, recebe dados via props
 */
export function HUD({ mode, onModeChange }: HUDProps) {
  const handleToggleMode = useCallback(() => {
    const newMode = mode === 'play' ? 'editor' : 'play'
    onModeChange(newMode)
  }, [mode, onModeChange])

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

  return (
    <div className="hud">
      <button
        className={`hud-button ${mode === 'editor' ? 'active' : ''}`}
        onClick={handleToggleMode}
      >
        {mode === 'play' ? 'Modo Editor' : 'Modo Jogo'}
      </button>

      {mode === 'editor' && (
        <>
          <button className="hud-button" onClick={handleSaveMap}>
            Salvar Mapa
          </button>
          <button className="hud-button" onClick={handleLoadMap}>
            Carregar Mapa
          </button>
        </>
      )}

      <div className="mode-indicator">
        {mode === 'play' ? 'WASD para mover' : 'Clique para selecionar/posicionar'}
      </div>
    </div>
  )
}
