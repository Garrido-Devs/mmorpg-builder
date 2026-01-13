import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext, RequireAuth } from '../../components/auth/AuthProvider'
import { useTeam } from '../../hooks/useTeam'
import { useProject } from '../../hooks/useProject'
import { TeamCard } from '../../components/teams/TeamCard'
import { ProjectCard } from '../../components/projects/ProjectCard'
import { CreateTeamModal } from '../../components/teams/CreateTeamModal'
import { CreateProjectModal } from '../../components/projects/CreateProjectModal'
import '../../styles/dashboard.css'

/**
 * Dashboard Page - Página principal após login
 */
export function Dashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuthContext()
  const { teams, fetchTeams, createTeam, isLoading: teamsLoading } = useTeam()
  const { projects, fetchProjects, createProject, isLoading: projectsLoading } = useProject()

  const [showCreateTeam, setShowCreateTeam] = useState(false)
  const [showCreateProject, setShowCreateProject] = useState(false)

  useEffect(() => {
    fetchTeams()
    fetchProjects()
  }, [fetchTeams, fetchProjects])

  const recentProjects = projects.slice(0, 4)

  return (
    <RequireAuth>
      <div className="dashboard">
        <header className="dashboard-header">
          <div className="dashboard-logo" onClick={() => navigate('/')}>
            <span className="dashboard-logo-icon">🎮</span>
            <span className="dashboard-logo-text">MMORPG Builder</span>
          </div>

          <nav className="dashboard-nav">
            <a href="/dashboard" className="active">Dashboard</a>
            <a href="/projects">Projetos</a>
            <a href="/teams">Times</a>
            <a href="/docs">Docs</a>
            <a href="/blog">Blog</a>
          </nav>

          <div className="dashboard-user">
            <span className="dashboard-user-name">{user?.name}</span>
            <div className="dashboard-user-avatar">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} />
              ) : (
                <span>{user?.name?.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <button className="dashboard-logout" onClick={logout}>
              Sair
            </button>
          </div>
        </header>

        <main className="dashboard-main">
          <div className="dashboard-welcome">
            <h1>Bem-vindo, {user?.name?.split(' ')[0]}!</h1>
            <p>O que você quer criar hoje?</p>
          </div>

          <div className="dashboard-actions">
            <button
              className="dashboard-action-card"
              onClick={() => setShowCreateProject(true)}
            >
              <span className="dashboard-action-icon">🎮</span>
              <span className="dashboard-action-title">Novo Projeto</span>
              <span className="dashboard-action-desc">Criar um novo jogo MMORPG</span>
            </button>

            <button
              className="dashboard-action-card"
              onClick={() => setShowCreateTeam(true)}
            >
              <span className="dashboard-action-icon">👥</span>
              <span className="dashboard-action-title">Novo Time</span>
              <span className="dashboard-action-desc">Colaborar com outras pessoas</span>
            </button>

            <button
              className="dashboard-action-card"
              onClick={() => navigate('/docs')}
            >
              <span className="dashboard-action-icon">📚</span>
              <span className="dashboard-action-title">Documentação</span>
              <span className="dashboard-action-desc">Aprender a usar o builder</span>
            </button>
          </div>

          <section className="dashboard-section">
            <div className="dashboard-section-header">
              <h2>Projetos Recentes</h2>
              <button
                className="dashboard-section-link"
                onClick={() => navigate('/projects')}
              >
                Ver todos
              </button>
            </div>

            {projectsLoading ? (
              <div className="dashboard-loading">Carregando projetos...</div>
            ) : recentProjects.length === 0 ? (
              <div className="dashboard-empty">
                <p>Você ainda não tem projetos.</p>
                <button
                  className="btn btn-primary"
                  onClick={() => setShowCreateProject(true)}
                >
                  Criar Primeiro Projeto
                </button>
              </div>
            ) : (
              <div className="dashboard-projects-grid">
                {recentProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onClick={() => navigate(`/editor/${project.id}`)}
                  />
                ))}
              </div>
            )}
          </section>

          <section className="dashboard-section">
            <div className="dashboard-section-header">
              <h2>Seus Times</h2>
              <button
                className="dashboard-section-link"
                onClick={() => navigate('/teams')}
              >
                Ver todos
              </button>
            </div>

            {teamsLoading ? (
              <div className="dashboard-loading">Carregando times...</div>
            ) : teams.length === 0 ? (
              <div className="dashboard-empty">
                <p>Você ainda não faz parte de nenhum time.</p>
                <button
                  className="btn btn-primary"
                  onClick={() => setShowCreateTeam(true)}
                >
                  Criar Time
                </button>
              </div>
            ) : (
              <div className="dashboard-teams-grid">
                {teams.map((team) => (
                  <TeamCard
                    key={team.id}
                    team={team}
                    onClick={() => navigate(`/teams/${team.id}`)}
                  />
                ))}
              </div>
            )}
          </section>
        </main>

        <CreateTeamModal
          isOpen={showCreateTeam}
          onClose={() => setShowCreateTeam(false)}
          onSubmit={async (data) => {
            await createTeam(data)
          }}
          isLoading={teamsLoading}
        />

        <CreateProjectModal
          isOpen={showCreateProject}
          onClose={() => setShowCreateProject(false)}
          onSubmit={async (data) => {
            const project = await createProject(data)
            if (project) {
              navigate(`/editor/${project.id}`)
            }
          }}
          teams={teams}
          isLoading={projectsLoading}
        />
      </div>
    </RequireAuth>
  )
}
