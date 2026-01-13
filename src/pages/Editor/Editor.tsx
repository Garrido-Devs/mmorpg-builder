import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Game } from '@/components'
import { InteractionPrompt } from '@/components/InteractionPrompt'
import { EditorLayout } from '@/components/editor'
import { useGameEngine } from '@/hooks'
import { SEO } from '@/components/shared'

const MIN_SCREEN_WIDTH = 1024

export function Editor() {
  const { mode, changeMode } = useGameEngine()
  const [isMobile, setIsMobile] = useState(false)

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < MIN_SCREEN_WIDTH)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // Start in editor mode by default
  useEffect(() => {
    if (!isMobile) {
      changeMode('editor')
    }
  }, [isMobile])

  if (isMobile) {
    return (
      <>
        <SEO
          title="Editor"
          description="Editor visual do MMORPG Builder. Crie e edite mundos 3D com ferramentas profissionais."
        />
        <div className="editor-mobile-warning">
          <div className="editor-mobile-warning-content">
            <div className="editor-mobile-warning-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
            </div>
            <h1>Tela Maior Necessaria</h1>
            <p>
              O Editor do MMORPG Builder requer uma tela maior para funcionar corretamente.
              Por favor, acesse pelo computador ou tablet em modo paisagem.
            </p>
            <div className="editor-mobile-warning-specs">
              <span>Largura minima: {MIN_SCREEN_WIDTH}px</span>
              <span>Sua tela: {typeof window !== 'undefined' ? window.innerWidth : 0}px</span>
            </div>
            <Link to="/" className="btn-primary">
              Voltar para Home
            </Link>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <SEO
        title="Editor"
        description="Editor visual do MMORPG Builder. Crie e edite mundos 3D com ferramentas profissionais."
      />
      <EditorLayout mode={mode} onModeChange={changeMode}>
        <Game />
        {mode === 'play' && <InteractionPrompt />}
      </EditorLayout>
    </>
  )
}
