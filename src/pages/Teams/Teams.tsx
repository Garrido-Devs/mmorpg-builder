import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RequireAuth, useAuthContext } from '../../components/auth/AuthProvider'
import { useTeam } from '../../hooks/useTeam'
import { TeamCard } from '../../components/teams/TeamCard'
import { CreateTeamModal } from '../../components/teams/CreateTeamModal'
import '../../styles/teams.css'

/**
 * Teams Page - Lista de times do usuário
 */
export function Teams() {
  const navigate = useNavigate()
  const { user, logout } = useAuthContext()
  const { teams, fetchTeams, createTeam, isLoading, error } = useTeam()
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    fetchTeams()
  }, [fetchTeams])

  return (
    <RequireAuth>
      <div className="teams-page">
        <header className="page-header">
          <div className="page-logo" onClick={() => navigate('/dashboard')}>
            <span className="page-logo-icon">🎮</span>
            <span className="page-logo-text">MMORPG Builder</span>
          </div>

          <nav className="page-nav">
            <a href="/dashboard">Dashboard</a>
            <a href="/projects">Projetos</a>
            <a href="/teams" className="active">Times</a>
            <a href="/docs">Docs</a>
            <a href="/blog">Blog</a>
          </nav>

          <div className="page-user">
            <span className="page-user-name">{user?.name}</span>
            <button className="page-logout" onClick={logout}>Sair</button>
          </div>
        </header>

        <main className="teams-main">
          <div className="teams-header">
            <div>
              <h1>Seus Times</h1>
              <p>Gerencie seus times e colabore com outras pessoas</p>
            </div>

            <button
              className="btn btn-primary"
              onClick={() => setShowCreateModal(true)}
            >
              + Criar Time
            </button>
          </div>

          {error && (
            <div className="teams-error">{error}</div>
          )}

          {isLoading ? (
            <div className="teams-loading">Carregando times...</div>
          ) : teams.length === 0 ? (
            <div className="teams-empty">
              <div className="teams-empty-icon">👥</div>
              <h2>Nenhum time ainda</h2>
              <p>Crie um time para começar a colaborar com outras pessoas em seus projetos.</p>
              <button
                className="btn btn-primary btn-lg"
                onClick={() => setShowCreateModal(true)}
              >
                Criar Primeiro Time
              </button>
            </div>
          ) : (
            <div className="teams-grid">
              {teams.map((team) => (
                <TeamCard
                  key={team.id}
                  team={team}
                  onClick={() => navigate(`/teams/${team.id}`)}
                />
              ))}
            </div>
          )}
        </main>

        <CreateTeamModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={async (data) => {
            const team = await createTeam(data)
            if (team) {
              navigate(`/teams/${team.id}`)
            }
          }}
          isLoading={isLoading}
        />
      </div>
    </RequireAuth>
  )
}
