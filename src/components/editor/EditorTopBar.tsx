import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import type { GameMode } from '../../types'
import type { ProjectWithData } from '../../types/project'
import type { CollaboratorInfo } from '../../types/collaboration'
import { getEngine } from '../../engine'

function formatLastSaved(date: Date | null | undefined): string {
  if (!date) return ''
  const now = new Date()
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000)
  if (diff < 60) return 'agora'
  if (diff < 3600) return `${Math.floor(diff / 60)}min atras`
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

interface EditorTopBarProps {
  mode: GameMode
  onModeChange: (mode: GameMode) => void
  project?: ProjectWithData | null
  activeUsers?: CollaboratorInfo[]
  isSaving?: boolean
  lastSaved?: Date | null
}

/**
 * EditorTopBar - Barra superior do editor
 */
export function EditorTopBar({
  mode,
  onModeChange,
  project,
  activeUsers = [],
  isSaving,
  lastSaved,
}: EditorTopBarProps) {
  const handleSetTool = useCallback((tool: 'translate' | 'rotate' | 'scale') => {
    const engine = getEngine()
    engine.editorSystem.setTransformMode(tool)
  }, [])

  const otherUsers = activeUsers.filter(u => !u.isCurrentUser)

  return (
    <header className="editor-topbar">
      {/* Logo com link para dashboard */}
      <Link to="/dashboard" className="editor-topbar-logo" title="Voltar ao Painel">
        <span>🎮</span>
        <span>MMORPG Editor</span>
      </Link>

      {/* Nome do projeto */}
      {project && (
        <>
          <div className="editor-topbar-divider" />
          <div className="editor-topbar-project">
            <span className="editor-topbar-project-name">{project.name}</span>
            {isSaving && <span className="editor-topbar-saving">Salvando...</span>}
            {!isSaving && lastSaved && (
              <span className="editor-topbar-saved">Salvo {formatLastSaved(lastSaved)}</span>
            )}
          </div>
        </>
      )}

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

          </div>
      )}

      {/* Usuários online */}
      {otherUsers.length > 0 && (
        <>
          <div className="editor-topbar-divider" />
          <div className="editor-topbar-users">
            {otherUsers.slice(0, 4).map((user) => (
              <div
                key={user.id}
                className="editor-topbar-user"
                title={user.name}
                style={{ borderColor: user.color }}
              >
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} />
                ) : (
                  <span>{user.name.charAt(0).toUpperCase()}</span>
                )}
              </div>
            ))}
            {otherUsers.length > 4 && (
              <div className="editor-topbar-user editor-topbar-user-more">
                +{otherUsers.length - 4}
              </div>
            )}
          </div>
        </>
      )}

      {/* Ações */}
      <div className="editor-topbar-actions">
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
