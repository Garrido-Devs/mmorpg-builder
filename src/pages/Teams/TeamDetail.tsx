import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { RequireAuth, useAuthContext } from '../../components/auth/AuthProvider'
import { useTeam } from '../../hooks/useTeam'
import { TeamMembers } from '../../components/teams/TeamMembers'
import { InviteLink } from '../../components/teams/InviteLink'
import { Navbar } from '@/components/shared'
import type { InviteInfo } from '../../types/team'
import '../../styles/teams.css'

/**
 * TeamDetail Page - Detalhes de um time
 */
export function TeamDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuthContext()
  const { currentTeam, fetchTeam, getInviteLink, regenerateInvite, isLoading, error, clearError } = useTeam()
  const [invite, setInvite] = useState<InviteInfo | null>(null)
  const [inviteLoading, setInviteLoading] = useState(false)
  const [inviteError, setInviteError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      loadTeam()
    }
  }, [id])

  const loadTeam = async () => {
    if (!id) return
    clearError()
    const team = await fetchTeam(id)
    if (!team) return

    // Load invite link separately - don't let it affect team display
    try {
      setInviteLoading(true)
      const inviteData = await getInviteLink(id)
      if (inviteData) {
        setInvite(inviteData)
        setInviteError(null)
      }
      clearError() // Clear any error from getInviteLink
    } catch {
      setInviteError('Falha ao carregar link de convite')
    } finally {
      setInviteLoading(false)
    }
  }

  const handleRegenerateInvite = useCallback(async () => {
    if (!id) return
    setInviteLoading(true)
    setInviteError(null)
    try {
      const newInvite = await regenerateInvite(id)
      if (newInvite) {
        setInvite(newInvite)
      }
      clearError()
    } catch {
      setInviteError('Falha ao regenerar link de convite')
    } finally {
      setInviteLoading(false)
    }
  }, [id, regenerateInvite, clearError])

  if (!id) {
    return null
  }

  // Use currentTeam from hook
  const team = currentTeam
  const members = currentTeam?.members || []
  const projects = currentTeam?.projects || []

  const isOwner = team?.ownerId === user?.id
  const currentMember = members.find(m => m.id === user?.id)
  const currentUserRole = team?.currentUserRole || (isOwner ? 'owner' : currentMember?.role || 'member')
  const isAdmin = currentUserRole === 'owner' || currentUserRole === 'admin'

  return (
    <RequireAuth>
      <div className="teams-page">
        <Navbar />

        <main className="teams-main" style={{ paddingTop: '100px' }}>
          {isLoading ? (
            <div className="teams-loading">Carregando time...</div>
          ) : error ? (
            <div className="teams-error">{error}</div>
          ) : team ? (
            <>
              <div className="team-detail-header">
                <button
                  className="team-detail-back"
                  onClick={() => navigate('/teams')}
                >
                  ← Voltar
                </button>

                <div className="team-detail-info">
                  <div className="team-detail-avatar">
                    {team.avatarUrl ? (
                      <img src={team.avatarUrl} alt={team.name} />
                    ) : (
                      <span>{team.name?.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div>
                    <h1>{team.name}</h1>
                    {team.description && (
                      <p className="team-detail-description">{team.description}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="team-detail-content">
                <div className="team-detail-section">
                  <TeamMembers
                    members={members}
                    currentUserRole={currentUserRole}
                    onRemoveMember={(memberId) => {
                      // TODO: Implement remove member
                      console.log('Remove member:', memberId)
                    }}
                  />
                </div>

                {isAdmin && (
                  <div className="team-detail-section">
                    <h2>Convidar Membros</h2>
                    {inviteError ? (
                      <div className="invite-error">
                        <p>{inviteError}</p>
                        <button
                          className="btn btn-secondary"
                          onClick={() => loadTeam()}
                        >
                          Tentar novamente
                        </button>
                      </div>
                    ) : (
                      <InviteLink
                        invite={invite}
                        onRegenerate={handleRegenerateInvite}
                        isLoading={inviteLoading}
                      />
                    )}
                  </div>
                )}

                <div className="team-detail-section">
                  <h2>Projetos ({projects.length})</h2>
                  {projects.length === 0 ? (
                    <div className="team-detail-empty">
                      <p>Nenhum projeto neste time ainda.</p>
                      <button
                        className="btn btn-primary"
                        onClick={() => navigate(`/projects?team=${id}`)}
                      >
                        Criar Projeto
                      </button>
                    </div>
                  ) : (
                    <div className="team-detail-projects">
                      {projects.map((project: any) => (
                        <div
                          key={project.id}
                          className="team-detail-project"
                          onClick={() => navigate(`/projects/${project.id}`)}
                        >
                          <span className="team-detail-project-icon">📁</span>
                          <span className="team-detail-project-name">{project.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="teams-error">Time nao encontrado</div>
          )}
        </main>
      </div>
    </RequireAuth>
  )
}
