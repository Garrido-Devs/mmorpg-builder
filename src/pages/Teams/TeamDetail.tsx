import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { RequireAuth, useAuthContext } from '../../components/auth/AuthProvider'
import { useTeam } from '../../hooks/useTeam'
import { TeamMembers } from '../../components/teams/TeamMembers'
import { InviteLink } from '../../components/teams/InviteLink'
import { Navbar } from '@/components/shared'
import type { InviteInfo, TeamMember, TeamProject, Team } from '../../types/team'
import '../../styles/teams.css'

/**
 * TeamDetail Page - Detalhes de um time
 */
export function TeamDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuthContext()
  const { fetchTeam, getInviteLink, regenerateInvite, isLoading, error } = useTeam()
  const [team, setTeam] = useState<Team | null>(null)
  const [members, setMembers] = useState<TeamMember[]>([])
  const [projects, setProjects] = useState<TeamProject[]>([])
  const [invite, setInvite] = useState<InviteInfo | null>(null)
  const [inviteLoading, setInviteLoading] = useState(false)

  useEffect(() => {
    if (id) {
      loadTeam()
    }
  }, [id])

  const loadTeam = async () => {
    if (!id) return
    const data = await fetchTeam(id)
    if (data) {
      setTeam(data)
      setMembers(data.members || [])
      setProjects(data.projects || [])
      // Load invite link
      const inviteData = await getInviteLink(id)
      if (inviteData) {
        setInvite(inviteData)
      }
    }
  }

  const handleRegenerateInvite = useCallback(async () => {
    if (!id) return
    setInviteLoading(true)
    const newInvite = await regenerateInvite(id)
    if (newInvite) {
      setInvite(newInvite)
    }
    setInviteLoading(false)
  }, [id, regenerateInvite])

  if (!id) {
    return null
  }

  const isOwner = team?.ownerId === user?.id
  // Note: member.id is the member's user ID in this context
  const currentMember = members.find(m => m.id === user?.id)
  const currentUserRole = isOwner ? 'owner' : currentMember?.role || 'member'
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
                    <InviteLink
                      invite={invite}
                      onRegenerate={handleRegenerateInvite}
                      isLoading={inviteLoading}
                    />
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
