import { useState, useEffect, useCallback, useRef } from 'react'
import Pusher from 'pusher-js'
import type {
  CollaborationState,
  CollaboratorInfo,
  PusherUserJoinedEvent,
  PusherUserLeftEvent,
  PusherUserUpdateEvent,
  PusherDataUpdateEvent,
} from '../types/collaboration'
import { realtimeApi } from '../utils/api'

// Cores para colaboradores
const COLLABORATOR_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
  '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
]

/**
 * Hook para colaboração em tempo real
 */
export function useCollaboration() {
  const [state, setState] = useState<CollaborationState>({
    isConnected: false,
    projectId: null,
    activeUsers: [],
    pendingChanges: 0,
    lastSyncAt: null,
  })

  const pusherRef = useRef<Pusher | null>(null)
  const channelRef = useRef<ReturnType<Pusher['subscribe']> | null>(null)
  const currentUserIdRef = useRef<string | null>(null)
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Obter cor para colaborador
  const getColorForUser = useCallback((userId: string, index: number): string => {
    // Usar hash do userId para consistência
    const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return COLLABORATOR_COLORS[hash % COLLABORATOR_COLORS.length] || COLLABORATOR_COLORS[index % COLLABORATOR_COLORS.length]
  }, [])

  // Conectar ao projeto
  const connect = useCallback(async (projectId: string) => {
    // Desconectar se já estiver conectado
    if (pusherRef.current) {
      pusherRef.current.disconnect()
    }

    // Buscar current user ID
    const userStr = localStorage.getItem('auth_user')
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        currentUserIdRef.current = user.id
      } catch {}
    }

    // Inicializar Pusher
    const pusherKey = import.meta.env.VITE_PUSHER_KEY
    if (!pusherKey) {
      console.warn('Pusher key not configured - collaboration disabled')
      return
    }

    pusherRef.current = new Pusher(pusherKey, {
      cluster: import.meta.env.VITE_PUSHER_CLUSTER || 'us2',
      authEndpoint: '/api/realtime/auth',
      auth: {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
      },
    })

    // Inscrever no canal do projeto
    channelRef.current = pusherRef.current.subscribe(`project-${projectId}`)

    // Handlers de eventos
    channelRef.current.bind('user-joined', (data: PusherUserJoinedEvent) => {
      setState((prev) => {
        // Ignorar se já existe
        if (prev.activeUsers.some((u) => u.id === data.userId)) return prev

        const newUser: CollaboratorInfo = {
          id: data.userId,
          name: data.name,
          avatarUrl: data.avatarUrl,
          color: getColorForUser(data.userId, prev.activeUsers.length),
          cursorPosition: data.cursorPosition || null,
          selectedElement: null,
          isCurrentUser: data.userId === currentUserIdRef.current,
          lastSeen: new Date().toISOString(),
        }

        return {
          ...prev,
          activeUsers: [...prev.activeUsers, newUser],
        }
      })
    })

    channelRef.current.bind('user-left', (data: PusherUserLeftEvent) => {
      setState((prev) => ({
        ...prev,
        activeUsers: prev.activeUsers.filter((u) => u.id !== data.userId),
      }))
    })

    channelRef.current.bind('user-update', (data: PusherUserUpdateEvent) => {
      setState((prev) => ({
        ...prev,
        activeUsers: prev.activeUsers.map((u) =>
          u.id === data.userId
            ? {
                ...u,
                cursorPosition: data.cursorPosition || u.cursorPosition,
                selectedElement: data.selectedElement !== undefined ? data.selectedElement : u.selectedElement,
                lastSeen: new Date().toISOString(),
              }
            : u
        ),
      }))
    })

    channelRef.current.bind('data-update', (data: PusherDataUpdateEvent) => {
      setState((prev) => ({
        ...prev,
        lastSyncAt: data.updatedAt,
      }))
      // Emitir evento customizado para outros hooks lidarem
      window.dispatchEvent(
        new CustomEvent('project-data-update', { detail: data })
      )
    })

    // Notificar servidor que entrou
    await realtimeApi.sync({ projectId, action: 'join' })

    // Buscar usuários ativos
    const presence = await realtimeApi.presence(projectId)
    const users = (presence.users as Array<{
      id: string
      name: string
      avatarUrl: string | null
      cursorPosition: { x: number; y: number; z: number }
      selectedElement: string | null
      isCurrentUser: boolean
    }>).map((u, index) => ({
      ...u,
      color: getColorForUser(u.id, index),
      lastSeen: new Date().toISOString(),
    }))

    setState({
      isConnected: true,
      projectId,
      activeUsers: users,
      pendingChanges: 0,
      lastSyncAt: new Date().toISOString(),
    })

    // Ping periódico para manter sessão ativa
    pingIntervalRef.current = setInterval(() => {
      realtimeApi.sync({ projectId, action: 'update' }).catch(() => {})
    }, 30000) // A cada 30 segundos
  }, [getColorForUser])

  // Desconectar
  const disconnect = useCallback(() => {
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current)
      pingIntervalRef.current = null
    }

    if (state.projectId) {
      realtimeApi.sync({ projectId: state.projectId, action: 'leave' }).catch(() => {})
    }

    if (channelRef.current) {
      channelRef.current.unbind_all()
      channelRef.current = null
    }

    if (pusherRef.current) {
      pusherRef.current.disconnect()
      pusherRef.current = null
    }

    setState({
      isConnected: false,
      projectId: null,
      activeUsers: [],
      pendingChanges: 0,
      lastSyncAt: null,
    })
  }, [state.projectId])

  // Atualizar posição do cursor
  const updateCursor = useCallback(
    (position: { x: number; y: number; z: number }) => {
      if (!state.projectId) return

      realtimeApi.sync({
        projectId: state.projectId,
        cursorPosition: position,
        action: 'update',
      }).catch(() => {})
    },
    [state.projectId]
  )

  // Atualizar seleção
  const updateSelection = useCallback(
    (elementId: string | null) => {
      if (!state.projectId) return

      realtimeApi.sync({
        projectId: state.projectId,
        selectedElement: elementId || undefined,
        action: 'update',
      }).catch(() => {})
    },
    [state.projectId]
  )

  // Sincronizar dados (usado pelo hook useProject)
  const syncData = useCallback(
    async (_type: string, _key: string, _data: unknown, _version?: number): Promise<boolean> => {
      if (!state.projectId) return false

      setState((prev) => ({ ...prev, pendingChanges: prev.pendingChanges + 1 }))

      try {
        // O syncData real é feito pelo projectsApi.updateData
        // Aqui apenas marcamos como pendente e depois como sincronizado
        setState((prev) => ({
          ...prev,
          pendingChanges: Math.max(0, prev.pendingChanges - 1),
          lastSyncAt: new Date().toISOString(),
        }))
        return true
      } catch {
        setState((prev) => ({
          ...prev,
          pendingChanges: Math.max(0, prev.pendingChanges - 1),
        }))
        return false
      }
    },
    [state.projectId]
  )

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      disconnect()
    }
  }, [disconnect])

  return {
    ...state,
    connect,
    disconnect,
    updateCursor,
    updateSelection,
    syncData,
  }
}
