import type { Team } from '../../types/team'

interface TeamCardProps {
  team: Team
  onClick?: () => void
}

/**
 * TeamCard - Card de exibição de um time
 */
export function TeamCard({ team, onClick }: TeamCardProps) {
  return (
    <div className="team-card" onClick={onClick}>
      <div className="team-card-avatar">
        {team.avatarUrl ? (
          <img src={team.avatarUrl} alt={team.name} />
        ) : (
          <span>{team.name.charAt(0).toUpperCase()}</span>
        )}
      </div>

      <div className="team-card-content">
        <h3 className="team-card-name">{team.name}</h3>
        {team.description && (
          <p className="team-card-description">{team.description}</p>
        )}

        <div className="team-card-stats">
          <span className="team-card-stat">
            <span className="team-card-stat-icon">👥</span>
            {team.memberCount || 1} {team.memberCount === 1 ? 'membro' : 'membros'}
          </span>
          <span className="team-card-stat">
            <span className="team-card-stat-icon">📁</span>
            {team.projectCount || 0} {team.projectCount === 1 ? 'projeto' : 'projetos'}
          </span>
        </div>
      </div>

      <div className="team-card-role">
        <span className={`team-card-role-badge ${team.currentUserRole}`}>
          {team.currentUserRole === 'owner' ? 'Dono' :
           team.currentUserRole === 'admin' ? 'Admin' : 'Membro'}
        </span>
      </div>
    </div>
  )
}
