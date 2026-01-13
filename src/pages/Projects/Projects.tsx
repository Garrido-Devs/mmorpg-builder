import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RequireAuth, useAuthContext } from '../../components/auth/AuthProvider'
import { useProject } from '../../hooks/useProject'
import { useTeam } from '../../hooks/useTeam'
import { ProjectCard } from '../../components/projects/ProjectCard'
import { CreateProjectModal } from '../../components/projects/CreateProjectModal'
import '../../styles/projects.css'

/**
 * Projects Page - Lista de projetos do usuário
 */
export function Projects() {
  const navigate = useNavigate()
  const { user, logout } = useAuthContext()
  const { projects, fetchProjects, createProject, isLoading, error } = useProject()
  const { teams, fetchTeams } = useTeam()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all')

  useEffect(() => {
    fetchProjects()
    fetchTeams()
  }, [fetchProjects, fetchTeams])

  const filteredProjects = projects.filter((p) => {
    if (filter === 'published') return p.isPublished
    if (filter === 'draft') return !p.isPublished
    return true
  })

  return (
    <RequireAuth>
      <div className="projects-page">
        <header className="page-header">
          <div className="page-logo" onClick={() => navigate('/dashboard')}>
            <span className="page-logo-icon">🎮</span>
            <span className="page-logo-text">MMORPG Builder</span>
          </div>

          <nav className="page-nav">
            <a href="/dashboard">Dashboard</a>
            <a href="/projects" className="active">Projetos</a>
            <a href="/teams">Times</a>
            <a href="/docs">Docs</a>
            <a href="/blog">Blog</a>
          </nav>

          <div className="page-user">
            <span className="page-user-name">{user?.name}</span>
            <button className="page-logout" onClick={logout}>Sair</button>
          </div>
        </header>

        <main className="projects-main">
          <div className="projects-header">
            <div>
              <h1>Seus Projetos</h1>
              <p>Gerencie seus jogos e projetos</p>
            </div>

            <button
              className="btn btn-primary"
              onClick={() => setShowCreateModal(true)}
              disabled={teams.length === 0}
              title={teams.length === 0 ? 'Crie um time primeiro' : undefined}
            >
              + Novo Projeto
            </button>
          </div>

          <div className="projects-filters">
            <button
              className={`projects-filter ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              Todos ({projects.length})
            </button>
            <button
              className={`projects-filter ${filter === 'published' ? 'active' : ''}`}
              onClick={() => setFilter('published')}
            >
              Publicados ({projects.filter((p) => p.isPublished).length})
            </button>
            <button
              className={`projects-filter ${filter === 'draft' ? 'active' : ''}`}
              onClick={() => setFilter('draft')}
            >
              Rascunhos ({projects.filter((p) => !p.isPublished).length})
            </button>
          </div>

          {error && (
            <div className="projects-error">{error}</div>
          )}

          {isLoading ? (
            <div className="projects-loading">Carregando projetos...</div>
          ) : filteredProjects.length === 0 ? (
            <div className="projects-empty">
              <div className="projects-empty-icon">🎮</div>
              <h2>Nenhum projeto {filter !== 'all' ? 'neste filtro' : 'ainda'}</h2>
              <p>
                {teams.length === 0
                  ? 'Crie um time primeiro para poder criar projetos.'
                  : 'Comece criando seu primeiro jogo MMORPG!'}
              </p>
              {teams.length > 0 && (
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => setShowCreateModal(true)}
                >
                  Criar Primeiro Projeto
                </button>
              )}
            </div>
          ) : (
            <div className="projects-grid">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => navigate(`/editor/${project.id}`)}
                />
              ))}
            </div>
          )}
        </main>

        <CreateProjectModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={async (data) => {
            const project = await createProject(data)
            if (project) {
              navigate(`/editor/${project.id}`)
            }
          }}
          teams={teams}
          isLoading={isLoading}
        />
      </div>
    </RequireAuth>
  )
}
