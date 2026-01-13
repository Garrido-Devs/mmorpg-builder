import { useState, useCallback } from 'react'
import type { Team, TeamWithDetails, CreateTeamData, InviteInfo, TeamPreview } from '../types/team'
import { teamsApi, ApiError } from '../utils/api'

/**
 * Hook para gerenciar times
 */
export function useTeam() {
  const [teams, setTeams] = useState<Team[]>([])
  const [currentTeam, setCurrentTeam] = useState<TeamWithDetails | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Listar times do usuário
  const fetchTeams = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await teamsApi.list()
      setTeams(response.teams as Team[])
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load teams')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Obter detalhes de um time
  const fetchTeam = useCallback(async (id: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await teamsApi.get(id)
      const team: TeamWithDetails = {
        ...(response.team as Team),
        members: response.members as TeamWithDetails['members'],
        projects: response.projects as TeamWithDetails['projects'],
      }
      setCurrentTeam(team)
      return team
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load team')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Criar novo time
  const createTeam = useCallback(async (data: CreateTeamData): Promise<Team | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await teamsApi.create(data)
      const team = response.team as Team
      setTeams((prev) => [team, ...prev])
      return team
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to create team')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Atualizar time
  const updateTeam = useCallback(
    async (id: string, data: Partial<CreateTeamData & { avatarUrl: string }>) => {
      setIsLoading(true)
      setError(null)

      try {
        await teamsApi.update(id, data)

        // Atualizar lista local
        setTeams((prev) => prev.map((t) => (t.id === id ? { ...t, ...data } : t)))

        // Atualizar time atual se for o mesmo
        if (currentTeam?.id === id) {
          setCurrentTeam((prev) => (prev ? { ...prev, ...data } : prev))
        }

        return true
      } catch (err) {
        setError(err instanceof ApiError ? err.message : 'Failed to update team')
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [currentTeam?.id]
  )

  // Deletar time
  const deleteTeam = useCallback(async (id: string) => {
    setIsLoading(true)
    setError(null)

    try {
      await teamsApi.delete(id)
      setTeams((prev) => prev.filter((t) => t.id !== id))

      if (currentTeam?.id === id) {
        setCurrentTeam(null)
      }

      return true
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to delete team')
      return false
    } finally {
      setIsLoading(false)
    }
  }, [currentTeam?.id])

  // Obter link de convite
  const getInviteLink = useCallback(async (teamId: string): Promise<InviteInfo | null> => {
    try {
      return (await teamsApi.getInvite(teamId)) as InviteInfo
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to get invite link')
      return null
    }
  }, [])

  // Regenerar link de convite
  const regenerateInvite = useCallback(async (teamId: string): Promise<InviteInfo | null> => {
    try {
      return (await teamsApi.regenerateInvite(teamId)) as InviteInfo
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to regenerate invite')
      return null
    }
  }, [])

  // Pré-visualizar time por código
  const previewTeam = useCallback(async (code: string): Promise<TeamPreview | null> => {
    try {
      const response = await teamsApi.previewByCode(code)
      return response.team as TeamPreview
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Invalid invite code')
      return null
    }
  }, [])

  // Entrar em time por código
  const joinTeam = useCallback(async (code: string): Promise<boolean> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await teamsApi.joinByCode(code)
      // Recarregar lista de times
      await fetchTeams()
      return response.success
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to join team')
      return false
    } finally {
      setIsLoading(false)
    }
  }, [fetchTeams])

  return {
    teams,
    currentTeam,
    isLoading,
    error,
    fetchTeams,
    fetchTeam,
    createTeam,
    updateTeam,
    deleteTeam,
    getInviteLink,
    regenerateInvite,
    previewTeam,
    joinTeam,
    clearError: () => setError(null),
  }
}
