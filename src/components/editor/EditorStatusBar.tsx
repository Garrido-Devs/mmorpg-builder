import { useState, useEffect } from 'react'

/**
 * EditorStatusBar - Barra de status inferior
 */
export function EditorStatusBar() {
  const [fps, setFps] = useState(60)

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

      <div style={{ flex: 1 }} />

      <div className="editor-statusbar-item">
        <span>MMORPG Editor v0.1.0</span>
      </div>
    </footer>
  )
}
