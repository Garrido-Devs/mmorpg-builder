import { useRef, useEffect } from 'react'

interface MinimapProps {
  playerPosition: { x: number; z: number }
  size?: number
  scale?: number
}

/**
 * Minimap - Mapa em miniatura no canto da tela
 */
export function Minimap({ playerPosition, size = 150, scale = 5 }: MinimapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Limpa canvas
    ctx.fillStyle = 'rgba(0, 20, 0, 0.8)'
    ctx.fillRect(0, 0, size, size)

    // Desenha grid
    ctx.strokeStyle = 'rgba(0, 100, 0, 0.3)'
    ctx.lineWidth = 1
    const gridSize = 20
    for (let i = 0; i <= size; i += gridSize) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, size)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(size, i)
      ctx.stroke()
    }

    // Centro do minimap
    const centerX = size / 2
    const centerY = size / 2

    // Desenha borda do mapa (circulo)
    ctx.beginPath()
    ctx.arc(centerX, centerY, size / 2 - 2, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(100, 200, 100, 0.5)'
    ctx.lineWidth = 2
    ctx.stroke()

    // Desenha indicador de direcao (Norte)
    ctx.fillStyle = '#4ade80'
    ctx.font = 'bold 12px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('N', centerX, 15)

    // Desenha player no centro (sempre fixo, mapa move ao redor)
    ctx.beginPath()
    ctx.arc(centerX, centerY, 6, 0, Math.PI * 2)
    ctx.fillStyle = '#22c55e'
    ctx.fill()
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 2
    ctx.stroke()

    // Desenha seta de direcao do player
    ctx.beginPath()
    ctx.moveTo(centerX, centerY - 10)
    ctx.lineTo(centerX - 4, centerY - 4)
    ctx.lineTo(centerX + 4, centerY - 4)
    ctx.closePath()
    ctx.fillStyle = '#fff'
    ctx.fill()

    // Coordenadas do player
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
    ctx.font = '10px monospace'
    ctx.textAlign = 'center'
    ctx.fillText(
      `${Math.round(playerPosition.x)}, ${Math.round(playerPosition.z)}`,
      centerX,
      size - 8
    )
  }, [playerPosition, size, scale])

  return (
    <div className="minimap-container">
      <div className="minimap-header">
        <span>Mapa</span>
        <button className="minimap-expand" title="Expandir mapa">
          ⛶
        </button>
      </div>
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="minimap-canvas"
      />
    </div>
  )
}
