import type { PlayerStats } from './GameHUD'

interface PlayerFrameProps {
  stats: PlayerStats
}

/**
 * PlayerFrame - Quadro com informacoes do jogador
 */
export function PlayerFrame({ stats }: PlayerFrameProps) {
  const healthPercent = (stats.health / stats.maxHealth) * 100
  const manaPercent = (stats.mana / stats.maxMana) * 100
  const expPercent = (stats.experience / stats.experienceToLevel) * 100

  return (
    <div className="player-frame">
      {/* Avatar e Level */}
      <div className="player-frame-avatar">
        {stats.avatarUrl ? (
          <img src={stats.avatarUrl} alt={stats.name} />
        ) : (
          <div className="player-frame-avatar-placeholder">
            {stats.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="player-frame-level">{stats.level}</div>
      </div>

      {/* Nome e Barras */}
      <div className="player-frame-info">
        <div className="player-frame-name">{stats.name}</div>

        {/* Barra de Vida */}
        <div className="player-frame-bar health-bar">
          <div
            className="player-frame-bar-fill health-fill"
            style={{ width: `${healthPercent}%` }}
          />
          <span className="player-frame-bar-text">
            {stats.health} / {stats.maxHealth}
          </span>
        </div>

        {/* Barra de Mana */}
        <div className="player-frame-bar mana-bar">
          <div
            className="player-frame-bar-fill mana-fill"
            style={{ width: `${manaPercent}%` }}
          />
          <span className="player-frame-bar-text">
            {stats.mana} / {stats.maxMana}
          </span>
        </div>

        {/* Barra de XP */}
        <div className="player-frame-bar exp-bar">
          <div
            className="player-frame-bar-fill exp-fill"
            style={{ width: `${expPercent}%` }}
          />
          <span className="player-frame-bar-text">
            XP: {stats.experience} / {stats.experienceToLevel}
          </span>
        </div>
      </div>
    </div>
  )
}
