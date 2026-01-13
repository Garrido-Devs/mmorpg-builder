import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Game } from '@/components'
import { InteractionPrompt } from '@/components/InteractionPrompt'
import { useGameEngine } from '@/hooks'
import { SEO } from '@/components/shared'
import '@/styles/play.css'

export function Play() {
  const { changeMode } = useGameEngine()

  // Always start in play mode
  useEffect(() => {
    changeMode('play')
  }, [])

  return (
    <>
      <SEO
        title="Demo Village - MMORPG Builder"
        description="Jogue a demo do MMORPG Builder. Explore a vila, interaja com NPCs e teste o sistema de combate."
      />
      <div className="play-container">
        <div className="play-header">
          <Link to="/" className="play-logo">
            <div className="play-logo-icon">M</div>
            <span>MMORPG Builder</span>
          </Link>
          <div className="play-actions">
            <Link to="/showcase" className="play-btn">
              Voltar ao Showcase
            </Link>
            <Link to="/editor" className="play-btn play-btn-primary">
              Abrir no Editor
            </Link>
          </div>
        </div>
        <div className="play-game">
          <Game />
          {/* HUD removido temporariamente - sistemas de jogo ainda nao implementados */}
          <InteractionPrompt />
        </div>
        <div className="play-controls-hint">
          <span>WASD - Mover</span>
          <span>Mouse - Camera</span>
          <span>E - Interagir</span>
          <span>Espaco - Atacar</span>
        </div>
      </div>
    </>
  )
}
