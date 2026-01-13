import { useState, useEffect } from 'react'
import type { ProjectWithData } from '../../types/project'

// Build timestamp - atualizado em cada deploy (Campo Grande MS - AMT UTC-4)
const BUILD_TIME = '13/01/2025 18:45 AMT'

interface EditorStatusBarProps {
  project?: ProjectWithData | null
  isConnected?: boolean
  pendingChanges?: number
}

/**
 * EditorStatusBar - Barra de status inferior
 */
export function EditorStatusBar({ project, isConnected, pendingChanges = 0 }: EditorStatusBarProps) {
  const [fps, setFps] = useState(60)

  // Debug: log quando isConnected muda
  useEffect(() => {
    console.log('[EditorStatusBar] isConnected:', isConnected, '| project:', project?.id)
  }, [isConnected, project])

  // Atualiza FPS
  useEffect(() => {
    let frameCount = 0
    let lastTime = performance.now()

    const updateFps = () => {
      frameCount++
      const currentTime = performance.now()

      if (currentTime - lastTime >= 1000) {
        setFps(frameCount)
        frameCount = 0
        lastTime = currentTime
      }

      requestAnimationFrame(updateFps)
    }

    const rafId = requestAnimationFrame(updateFps)
    return () => cancelAnimationFrame(rafId)
  }, [])

  return (
    <footer className="editor-statusbar">
      <div className="editor-statusbar-item">
        <span>FPS:</span>
        <span style={{ color: fps >= 30 ? 'var(--editor-success)' : 'var(--editor-warning)' }}>
          {fps}
        </span>
      </div>

      <div className="editor-statusbar-divider" />

      <div className="editor-statusbar-item">
        <span>Grid:</span>
        <span>1.0</span>
      </div>

      {project && (
        <>
          <div className="editor-statusbar-divider" />
          <div className="editor-statusbar-item">
            <span
              className="editor-statusbar-dot"
              style={{ background: isConnected ? 'var(--editor-success)' : 'var(--editor-error)' }}
            />
            <span>{isConnected ? 'Online' : 'Offline'}</span>
          </div>
          {pendingChanges > 0 && (
            <div className="editor-statusbar-item">
              <span style={{ color: 'var(--editor-warning)' }}>
                {pendingChanges} alteracoes pendentes
              </span>
            </div>
          )}
        </>
      )}

      <div style={{ flex: 1 }} />

      <div className="editor-statusbar-item">
        <span>v0.1.0</span>
      </div>
      <div className="editor-statusbar-divider" />
      <div className="editor-statusbar-item">
        <span style={{ color: 'var(--editor-muted)', fontSize: '11px' }}>Build: {BUILD_TIME}</span>
      </div>
    </footer>
  )
}
