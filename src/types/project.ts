/**
 * Types para projetos
 */

import type { TeamRole } from './team'

export interface Project {
  id: string
  name: string
  description: string | null
  thumbnailUrl: string | null
  gameTitle: string | null
  gameSubtitle: string | null
  gameVersion: string
  gameGenre: string[]
  isPublic: boolean
  isPublished: boolean
  createdAt: string
  updatedAt: string
  teamId: string
  teamName: string
  currentUserRole?: TeamRole
  dataCount?: number
}

export interface CreateProjectData {
  teamId: string
  name: string
  description?: string
  gameTitle?: string
}

export interface UpdateProjectData {
  name?: string
  description?: string
  thumbnailUrl?: string
  gameTitle?: string
  gameSubtitle?: string
  gameVersion?: string
  gameGenre?: string[]
  isPublic?: boolean
  isPublished?: boolean
}

export type ProjectDataType =
  | 'map'
  | 'entity'
  | 'menu'
  | 'config'
  | 'screen'
  | 'character'
  | 'npc'
  | 'item'
  | 'quest'
  | 'dialogue'
  | 'skill'
  | 'recipe'
  | 'asset_ref'

export interface ProjectDataItem<T = unknown> {
  id: string
  type: ProjectDataType
  key: string
  data: T
  version: number
  updatedAt: string
}

export interface ProjectData {
  [type: string]: {
    [key: string]: {
      id: string
      data: unknown
      version: number
      updatedAt: string
    }
  }
}

export interface ProjectWithData extends Project {
  data: ProjectData
  activeUsers: ActiveUser[]
}

export interface ActiveUser {
  id: string
  name: string
  avatarUrl: string | null
  cursorPosition: { x: number; y: number; z: number }
  selectedElement: string | null
  isCurrentUser?: boolean
}
