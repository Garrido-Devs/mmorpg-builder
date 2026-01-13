import { useEffect, useState, useRef, useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Game } from '@/components'
import { InteractionPrompt } from '@/components/InteractionPrompt'
import { EditorLayout } from '@/components/editor'
import { useGameEngine } from '@/hooks'
import { useProject } from '@/hooks/useProject'
import { useCollaboration } from '@/hooks/useCollaboration'
import { SEO } from '@/components/shared'
import { getEngine } from '@/engine'

const MIN_SCREEN_WIDTH = 1024
const AUTO_SAVE_INTERVAL = 30000 // 30 segundos

export function Editor() {
  const { projectId } = useParams<{ projectId: string }>()
  const { mode, changeMode } = useGameEngine()
  const { currentProject, fetchProject, updateProjectData, isLoading: projectLoading } = useProject()
  const collaboration = useCollaboration()
  const [isMobile, setIsMobile] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null)
  const hasChangesRef = useRef(false)

  // Auto-save function
  const saveToCloud = useCallback(async () => {
    if (!currentProject || !hasChangesRef.current) return

    setIsSaving(true)
    try {
      const engine = getEngine()
      const mapData = engine.getMapData()
      await updateProjectData('scene', 'main', mapData)
      setLastSaved(new Date())
      hasChangesRef.current = false
    } catch (error) {
      console.error('Auto-save failed:', error)
    } finally {
      setIsSaving(false)
    }
  }, [currentProject, updateProjectData])

  // Debug: log estado de colaboração
  useEffect(() => {
    console.log('[Editor] collaboration state:', {
      isConnected: collaboration.isConnected,
      projectId: collaboration.projectId,
      activeUsers: collaboration.activeUsers?.length || 0,
    })
  }, [collaboration.isConnected, collaboration.projectId, collaboration.activeUsers])

  // Sincroniza colaboradores com o engine 3D
  useEffect(() => {
    if (collaboration.activeUsers && collaboration.activeUsers.length > 0) {
      const engine = getEngine()
      engine.collaboratorSystem.syncCollaborators(collaboration.activeUsers)
    }
  }, [collaboration.activeUsers])

  // Envia posição do player para colaboração
  useEffect(() => {
    const engine = getEngine()
    const unsubscribe = engine.onPlayerMove((pos) => {
      collaboration.updateCursor(pos)
    })
    return unsubscribe
  }, [collaboration.updateCursor])

  // Load project and connect collaboration
  const disconnectRef = useRef(collaboration.disconnect)
  disconnectRef.current = collaboration.disconnect

  useEffect(() => {
    if (projectId) {
      fetchProject(projectId)
      collaboration.connect(projectId)
    }
    return () => {
      // Usa ref para evitar re-execução do efeito quando disconnect muda
      disconnectRef.current()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId])

  // Listen for local scene changes (mark as dirty for auto-save)
  useEffect(() => {
    const handleSceneChange = () => {
      hasChangesRef.current = true
    }

    window.addEventListener('scene-changed', handleSceneChange)
    return () => window.removeEventListener('scene-changed', handleSceneChange)
  }, [])

  // Listen for remote scene changes (from other collaborators)
  useEffect(() => {
    const handleRemoteSceneChange = (event: CustomEvent<{
      userId: string
      changeType: 'add' | 'remove' | 'update'
      object: unknown
    }>) => {
      const { changeType, object } = event.detail
      const engine = getEngine()

      console.log('[Editor] Recebendo scene-change remoto:', changeType, object)

      if (changeType === 'add' && object) {
        engine.addObjectFromData(object as Parameters<typeof engine.addObjectFromData>[0])
      } else if (changeType === 'remove' && object && typeof object === 'object' && 'id' in object) {
        engine.removeObject((object as { id: string }).id)
      } else if (changeType === 'update' && object) {
        engine.updateObjectFromData(object as Parameters<typeof engine.updateObjectFromData>[0])
      }

      hasChangesRef.current = true
    }

    window.addEventListener('collaboration-scene-change', handleRemoteSceneChange as EventListener)
    return () => window.removeEventListener('collaboration-scene-change', handleRemoteSceneChange as EventListener)
  }, [])

  // Broadcast local scene changes to collaborators
  useEffect(() => {
    const handleLocalSceneChange = (event: CustomEvent<{
      type: 'add' | 'remove' | 'update'
      object: unknown
    }>) => {
      if (collaboration.isConnected) {
        collaboration.broadcastSceneChange(event.detail.type, event.detail.object)
      }
    }

    window.addEventListener('local-scene-change', handleLocalSceneChange as EventListener)
    return () => window.removeEventListener('local-scene-change', handleLocalSceneChange as EventListener)
  }, [collaboration.isConnected, collaboration.broadcastSceneChange])

  // Auto-save timer
  useEffect(() => {
    if (currentProject && mode === 'editor') {
      autoSaveTimerRef.current = setInterval(() => {
        saveToCloud()
      }, AUTO_SAVE_INTERVAL)
    }

    return () => {
      if (autoSaveTimerRef.current) {
        clearInterval(autoSaveTimerRef.current)
      }
    }
  }, [currentProject, mode, saveToCloud])

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
      <EditorLayout
        mode={mode}
        onModeChange={changeMode}
        project={currentProject}
        collaboration={collaboration}
        isSaving={isSaving}
        lastSaved={lastSaved}
        projectLoading={projectLoading}
      >
        <Game />
        {mode === 'play' && <InteractionPrompt />}
      </EditorLayout>
    </>
  )
}
