/**
 * Types para times e membros
 */

export type TeamRole = 'owner' | 'admin' | 'member'

export interface Team {
  id: string
  name: string
  description: string | null
  avatarUrl: string | null
  inviteCode: string | null
  ownerId?: string
  createdAt: string
  currentUserRole?: TeamRole
  memberCount?: number
  projectCount?: number
}

export interface TeamMember {
  id: string
  name: string
  email: string
  avatarUrl: string | null
  role: TeamRole
  joinedAt: string
}

export interface TeamWithDetails extends Team {
  members: TeamMember[]
  projects: TeamProject[]
}

export interface TeamProject {
  id: string
  name: string
  description: string | null
  thumbnailUrl: string | null
  createdAt: string
}

export interface CreateTeamData {
  name: string
  description?: string
}

export interface InviteInfo {
  inviteCode: string
  inviteLink: string
}

export interface TeamPreview {
  id: string
  name: string
  description: string | null
  avatarUrl: string | null
  memberCount: number
  ownerName: string
}
