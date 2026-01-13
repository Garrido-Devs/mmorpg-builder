import { useState, useEffect } from 'react'
import type { GameMode } from '../../types'
import type { ProjectWithData } from '../../types/project'
import type { CollaborationState } from '../../types/collaboration'
import { EditorTopBar } from './EditorTopBar'
import { EditorSidebar } from './EditorSidebar'
import { EditorStatusBar } from './EditorStatusBar'
import '../../styles/editor.css'
import '../../styles/game-editor.css'

interface CollaborationHook extends CollaborationState {
  connect: (projectId: string) => Promise<void>
  disconnect: () => void
  updateCursor: (position: { x: number; y: number; z: number }) => void
  updateSelection: (elementId: string | null) => void
}

interface EditorLayoutProps {
  mode: GameMode
  onModeChange: (mode: GameMode) => void
  children: React.ReactNode
  project?: ProjectWithData | null
  collaboration?: CollaborationHook
  isSaving?: boolean
  lastSaved?: Date | null
  projectLoading?: boolean
}

/**
 * EditorLayout - Layout principal do editor
 *
 * Estrutura:
 * - TopBar: ferramentas, ações, modo
 * - Main: viewport (children) + sidebar direita
 * - StatusBar: informações de estado
 */
export function EditorLayout({
  mode,
  onModeChange,
  children,
  project,
  collaboration,
  isSaving,
  lastSaved,
}: EditorLayoutProps) {
  const [sidebarWidth, setSidebarWidth] = useState(320)
  const activeUsers = collaboration?.activeUsers || []

  // Debug: log quando collaboration muda
  useEffect(() => {
    console.log('[EditorLayout] collaboration.isConnected:', collaboration?.isConnected)
  }, [collaboration?.isConnected])

  return (
    <div className="editor-root">
      <div className="editor-layout">
        {/* Barra superior */}
        <EditorTopBar
          mode={mode}
          onModeChange={onModeChange}
          project={project}
          activeUsers={activeUsers}
          isSaving={isSaving}
          lastSaved={lastSaved}
        />

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
        {mode === 'editor' && (
          <EditorStatusBar
            project={project}
            isConnected={collaboration?.isConnected}
            pendingChanges={collaboration?.pendingChanges || 0}
          />
        )}
      </div>
    </div>
  )
}
