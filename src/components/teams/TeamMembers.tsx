import type { TeamMember } from '../../types/team'

interface TeamMembersProps {
  members: TeamMember[]
  currentUserRole?: string
  onRemoveMember?: (memberId: string) => void
  onChangeRole?: (memberId: string, role: string) => void
}

/**
 * TeamMembers - Lista de membros de um time
 */
export function TeamMembers({
  members,
  currentUserRole,
  onRemoveMember,
  onChangeRole,
}: TeamMembersProps) {
  const canManageMembers = currentUserRole === 'owner' || currentUserRole === 'admin'

  return (
    <div className="team-members">
      <h3 className="team-members-title">
        Membros ({members.length})
      </h3>

      <div className="team-members-list">
        {members.map((member) => (
          <div key={member.id} className="team-member">
            <div className="team-member-avatar">
              {member.avatarUrl ? (
                <img src={member.avatarUrl} alt={member.name} />
              ) : (
                <span>{member.name.charAt(0).toUpperCase()}</span>
              )}
            </div>

            <div className="team-member-info">
              <span className="team-member-name">{member.name}</span>
              <span className="team-member-email">{member.email}</span>
            </div>

            <div className="team-member-role">
              {canManageMembers && member.role !== 'owner' ? (
                <select
                  value={member.role}
                  onChange={(e) => onChangeRole?.(member.id, e.target.value)}
                  className="team-member-role-select"
                >
                  <option value="member">Membro</option>
                  <option value="admin">Admin</option>
                </select>
              ) : (
                <span className={`team-member-role-badge ${member.role}`}>
                  {member.role === 'owner' ? 'Dono' :
                   member.role === 'admin' ? 'Admin' : 'Membro'}
                </span>
              )}
            </div>

            {canManageMembers && member.role !== 'owner' && (
              <button
                className="team-member-remove"
                onClick={() => onRemoveMember?.(member.id)}
                title="Remover membro"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
