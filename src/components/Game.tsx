import { useEffect, useRef } from 'react'
import { getEngine, destroyEngine } from '../engine'

/**
 * Game - Container principal do canvas Three.js
 *
 * Responsabilidades:
 * - Criar e gerenciar o canvas
 * - Inicializar o engine quando montado
 * - Limpar recursos quando desmontado
 *
 * Decisão: Canvas é gerenciado diretamente pelo Three.js
 * React apenas monta/desmonta, não controla o render loop
 */
export function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    // Inicializa o engine com o canvas
    const engine = getEngine()
    engine.init(canvasRef.current)

    // Verifica se deve iniciar no modo editor
    const params = new URLSearchParams(window.location.search)
    if (params.get('mode') === 'editor') {
      engine.setMode('editor')
    }

    // Listener para colocar objetos
    const handlePlaceObject = (event: Event) => {
      const customEvent = event as CustomEvent
      const { asset, position } = customEvent.detail
      engine.placeObject(asset, position)
    }

    window.addEventListener('editor:placeObject', handlePlaceObject)

    // Cleanup
    return () => {
      window.removeEventListener('editor:placeObject', handlePlaceObject)
      destroyEngine()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="game-canvas"
    />
  )
}
