import { useMemo } from 'react'
import type { CollaboratorInfo } from '../../types/collaboration'

interface CursorOverlayProps {
  collaborators: CollaboratorInfo[]
  containerRef: React.RefObject<HTMLElement>
}

/**
 * CursorOverlay - Overlay para mostrar cursores de outros colaboradores
 *
 * Este componente renderiza cursores de outros usuários no editor 3D
 * As posições são convertidas de coordenadas 3D para 2D na tela
 */
export function CursorOverlay({ collaborators }: CursorOverlayProps) {
  // Filtrar colaboradores que não são o usuário atual e têm posição
  const otherCursors = useMemo(() =>
    collaborators.filter((c) => !c.isCurrentUser && c.cursorPosition),
    [collaborators]
  )

  if (otherCursors.length === 0) {
    return null
  }

  return (
    <div className="cursor-overlay">
      {otherCursors.map((collab) => (
        <div
          key={collab.id}
          className="cursor-indicator"
          style={{
            // A posição real seria calculada projetando 3D para 2D
            // Por enquanto, usamos posições relativas
            '--cursor-color': collab.color,
          } as React.CSSProperties}
        >
          <svg
            className="cursor-pointer"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill={collab.color}
          >
            <path d="M5.5 3.21V20.8l4.45-4.45 3.27 7.58 2.69-1.16-3.25-7.54h6.1L5.5 3.21z" />
          </svg>
          <span
            className="cursor-name"
            style={{ backgroundColor: collab.color }}
          >
            {collab.name}
          </span>
        </div>
      ))}
    </div>
  )
}
