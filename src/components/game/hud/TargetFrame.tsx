import type { TargetInfo } from './GameHUD'

interface TargetFrameProps {
  target: TargetInfo
  onDeselect: () => void
}

/**
 * TargetFrame - Quadro do alvo selecionado
 */
export function TargetFrame({ target, onDeselect }: TargetFrameProps) {
  const healthPercent = (target.health / target.maxHealth) * 100

  // Cor baseada no tipo de alvo
  const getTypeColor = () => {
    switch (target.type) {
      case 'enemy':
        return 'var(--hud-enemy)'
      case 'npc':
        return 'var(--hud-npc)'
      case 'player':
        return 'var(--hud-player)'
      default:
        return 'var(--hud-neutral)'
    }
  }

  // Icone baseado no tipo
  const getTypeIcon = () => {
    switch (target.type) {
      case 'enemy':
        return '💀'
      case 'npc':
        return '💬'
      case 'player':
        return '👤'
      default:
        return '❓'
    }
  }

  return (
    <div className="target-frame" style={{ borderColor: getTypeColor() }}>
      {/* Botao de fechar */}
      <button className="target-frame-close" onClick={onDeselect}>
        ✕
      </button>

      {/* Icone do tipo */}
      <div className="target-frame-icon" style={{ background: getTypeColor() }}>
        {getTypeIcon()}
      </div>

      {/* Info do alvo */}
      <div className="target-frame-info">
        <div className="target-frame-header">
          <span className="target-frame-name">{target.name}</span>
          <span className="target-frame-level">Lv.{target.level}</span>
        </div>

        {/* Barra de vida do alvo */}
        <div className="target-frame-bar">
          <div
            className="target-frame-bar-fill"
            style={{
              width: `${healthPercent}%`,
              background: healthPercent > 50
                ? 'var(--hud-health)'
                : healthPercent > 25
                  ? 'var(--hud-warning)'
                  : 'var(--hud-danger)',
            }}
          />
          <span className="target-frame-bar-text">
            {target.health} / {target.maxHealth}
          </span>
        </div>
      </div>

      {/* Acoes rapidas */}
      {target.type === 'enemy' && (
        <div className="target-frame-actions">
          <button className="target-action-btn attack" title="Atacar (Tab)">
            ⚔️
          </button>
        </div>
      )}
    </div>
  )
}
