/**
 * Types para colaboração em tempo real
 */

export interface CollaborationState {
  isConnected: boolean
  projectId: string | null
  activeUsers: CollaboratorInfo[]
  pendingChanges: number
  lastSyncAt: string | null
}

export interface CollaboratorInfo {
  id: string
  name: string
  avatarUrl: string | null
  color: string
  cursorPosition: { x: number; y: number; z: number } | null
  selectedElement: string | null
  isCurrentUser: boolean
  lastSeen: string
}

export interface CursorUpdate {
  userId: string
  position: { x: number; y: number; z: number }
}

export interface SelectionUpdate {
  userId: string
  elementId: string | null
}

export interface DataUpdate {
  type: string
  key: string
  data: unknown
  version: number
  updatedAt: string
  updatedBy: string
}

// Eventos Pusher
export type PusherEventType =
  | 'user-joined'
  | 'user-left'
  | 'user-update'
  | 'data-update'
  | 'cursor-move'
  | 'selection-change'

export interface PusherUserJoinedEvent {
  userId: string
  name: string
  avatarUrl: string | null
  cursorPosition?: { x: number; y: number; z: number }
}

export interface PusherUserLeftEvent {
  userId: string
}

export interface PusherUserUpdateEvent {
  userId: string
  cursorPosition?: { x: number; y: number; z: number }
  selectedElement?: string
}

export interface PusherDataUpdateEvent {
  type: string
  key: string
  data: unknown
  version: number
  updatedAt: string
  updatedBy: string
}

// Context
export interface CollaborationContextValue extends CollaborationState {
  connect: (projectId: string) => Promise<void>
  disconnect: () => void
  updateCursor: (position: { x: number; y: number; z: number }) => void
  updateSelection: (elementId: string | null) => void
  syncData: (type: string, key: string, data: unknown, version?: number) => Promise<boolean>
}
