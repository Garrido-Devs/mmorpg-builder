import { useState } from 'react'
import type { GameMode } from '../../types'
import { EditorTopBar } from './EditorTopBar'
import { EditorSidebar } from './EditorSidebar'
import { EditorStatusBar } from './EditorStatusBar'
import '../../styles/editor.css'
import '../../styles/game-editor.css'

interface EditorLayoutProps {
  mode: GameMode
  onModeChange: (mode: GameMode) => void
  children: React.ReactNode
}

/**
 * EditorLayout - Layout principal do editor
 *
 * Estrutura:
 * - TopBar: ferramentas, ações, modo
 * - Main: viewport (children) + sidebar direita
 * - StatusBar: informações de estado
 */
export function EditorLayout({ mode, onModeChange, children }: EditorLayoutProps) {
  const [sidebarWidth, setSidebarWidth] = useState(320)

  return (
    <div className="editor-root">
      <div className="editor-layout">
        {/* Barra superior */}
        <EditorTopBar mode={mode} onModeChange={onModeChange} />

        {/* Área principal */}
        <div className="editor-main">
          {/* Viewport do jogo */}
          <div className="editor-viewport">
            {children}
          </div>

          {/* Painel lateral direito (apenas no modo editor) */}
          {mode === 'editor' && (
            <EditorSidebar width={sidebarWidth} onResize={setSidebarWidth} />
          )}
        </div>

        {/* Barra de status */}
        {mode === 'editor' && <EditorStatusBar />}
      </div>
    </div>
  )
}
