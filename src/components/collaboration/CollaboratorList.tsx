import type { CollaboratorInfo } from '../../types/collaboration'

interface CollaboratorListProps {
  collaborators: CollaboratorInfo[]
  maxVisible?: number
}

/**
 * CollaboratorList - Lista de colaboradores online
 */
export function CollaboratorList({ collaborators, maxVisible = 5 }: CollaboratorListProps) {
  const visibleCollaborators = collaborators.slice(0, maxVisible)
  const hiddenCount = Math.max(0, collaborators.length - maxVisible)

  if (collaborators.length === 0) {
    return null
  }

  return (
    <div className="collaborator-list">
      <div className="collaborator-avatars">
        {visibleCollaborators.map((collab) => (
          <div
            key={collab.id}
            className={`collaborator-avatar ${collab.isCurrentUser ? 'current' : ''}`}
            style={{ borderColor: collab.color }}
            title={collab.name + (collab.isCurrentUser ? ' (você)' : '')}
          >
            {collab.avatarUrl ? (
              <img src={collab.avatarUrl} alt={collab.name} />
            ) : (
              <span style={{ backgroundColor: collab.color }}>
                {collab.name.charAt(0).toUpperCase()}
              </span>
            )}
            <span className="collaborator-status" style={{ backgroundColor: collab.color }} />
          </div>
        ))}

        {hiddenCount > 0 && (
          <div className="collaborator-avatar more">
            <span>+{hiddenCount}</span>
          </div>
        )}
      </div>

      <span className="collaborator-count">
        {collaborators.length} {collaborators.length === 1 ? 'pessoa' : 'pessoas'} online
      </span>
    </div>
  )
}
