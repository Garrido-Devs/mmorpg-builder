import type { Project } from '../../types/project'

interface ProjectCardProps {
  project: Project
  onClick?: () => void
}

/**
 * ProjectCard - Card de exibição de um projeto
 */
export function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <div className="project-card" onClick={onClick}>
      <div className="project-card-thumbnail">
        {project.thumbnailUrl ? (
          <img src={project.thumbnailUrl} alt={project.name} />
        ) : (
          <div className="project-card-thumbnail-placeholder">
            <span>🎮</span>
          </div>
        )}

        {project.isPublished && (
          <span className="project-card-badge published">Publicado</span>
        )}
        {project.isPublic && !project.isPublished && (
          <span className="project-card-badge public">Público</span>
        )}
      </div>

      <div className="project-card-content">
        <h3 className="project-card-name">{project.name}</h3>
        {project.gameTitle && project.gameTitle !== project.name && (
          <span className="project-card-game-title">{project.gameTitle}</span>
        )}
        {project.description && (
          <p className="project-card-description">{project.description}</p>
        )}

        <div className="project-card-meta">
          <span className="project-card-team">{project.teamName}</span>
          <span className="project-card-version">v{project.gameVersion}</span>
        </div>

        <div className="project-card-footer">
          <span className="project-card-updated">
            Atualizado {formatDate(project.updatedAt)}
          </span>
        </div>
      </div>
    </div>
  )
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'agora'
  if (diffMins < 60) return `há ${diffMins} min`
  if (diffHours < 24) return `há ${diffHours}h`
  if (diffDays < 7) return `há ${diffDays} dias`

  return date.toLocaleDateString('pt-BR')
}
