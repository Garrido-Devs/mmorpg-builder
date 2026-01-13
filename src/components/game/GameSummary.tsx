import type {
  GameConfig,
  GameMap,
  GameNPC,
  GameItem,
  GameQuest,
  GameSkill,
  GameCharacter,
} from '../../types/game'

interface GameSummaryProps {
  config: GameConfig
  maps?: GameMap[]
  npcs?: GameNPC[]
  items?: GameItem[]
  quests?: GameQuest[]
  skills?: GameSkill[]
  characters?: GameCharacter[]
}

/**
 * Resumo visual do conteudo do jogo
 */
export function GameSummary({
  config,
  maps = [],
  npcs = [],
  items = [],
  quests = [],
  skills = [],
  characters = [],
}: GameSummaryProps) {
  // Calcular estatisticas
  const hostileNpcs = npcs.filter((n) => n.isHostile).length
  const friendlyNpcs = npcs.length - hostileNpcs

  const questsByType = quests.reduce(
    (acc, q) => {
      acc[q.type] = (acc[q.type] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  const itemsByRarity = items.reduce(
    (acc, i) => {
      acc[i.rarity] = (acc[i.rarity] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  const totalEntities = maps.reduce((acc, m) => acc + m.entities.length, 0)
  const totalZones = maps.reduce((acc, m) => acc + m.zones.length, 0)

  return (
    <div className="game-summary">
      <div className="game-summary-header">
        <h2>{config.title || 'Sem titulo'}</h2>
        {config.subtitle && <p className="game-summary-subtitle">{config.subtitle}</p>}
        <div className="game-summary-meta">
          <span>v{config.version}</span>
          {config.author && <span>por {config.author}</span>}
        </div>
        {config.genre.length > 0 && (
          <div className="game-summary-genres">
            {config.genre.map((g) => (
              <span key={g} className="game-summary-genre-tag">
                {g}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="game-summary-grid">
        {/* Mapas */}
        <div className="game-summary-card">
          <div className="game-summary-card-icon">Map</div>
          <div className="game-summary-card-content">
            <div className="game-summary-card-value">{maps.length}</div>
            <div className="game-summary-card-label">Mapas</div>
            <div className="game-summary-card-details">
              <span>{totalEntities} entidades</span>
              <span>{totalZones} zonas</span>
            </div>
          </div>
        </div>

        {/* Personagens */}
        <div className="game-summary-card">
          <div className="game-summary-card-icon">Char</div>
          <div className="game-summary-card-content">
            <div className="game-summary-card-value">{characters.length}</div>
            <div className="game-summary-card-label">Personagens</div>
          </div>
        </div>

        {/* NPCs */}
        <div className="game-summary-card">
          <div className="game-summary-card-icon">NPC</div>
          <div className="game-summary-card-content">
            <div className="game-summary-card-value">{npcs.length}</div>
            <div className="game-summary-card-label">NPCs</div>
            <div className="game-summary-card-details">
              <span>{friendlyNpcs} amigaveis</span>
              <span>{hostileNpcs} hostis</span>
            </div>
          </div>
        </div>

        {/* Itens */}
        <div className="game-summary-card">
          <div className="game-summary-card-icon">Item</div>
          <div className="game-summary-card-content">
            <div className="game-summary-card-value">{items.length}</div>
            <div className="game-summary-card-label">Itens</div>
            <div className="game-summary-card-details">
              {Object.entries(itemsByRarity).map(([rarity, count]) => (
                <span key={rarity} className={`rarity-${rarity}`}>
                  {count} {rarity}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Quests */}
        <div className="game-summary-card">
          <div className="game-summary-card-icon">Quest</div>
          <div className="game-summary-card-content">
            <div className="game-summary-card-value">{quests.length}</div>
            <div className="game-summary-card-label">Quests</div>
            <div className="game-summary-card-details">
              {Object.entries(questsByType).map(([type, count]) => (
                <span key={type}>
                  {count} {type}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="game-summary-card">
          <div className="game-summary-card-icon">Skill</div>
          <div className="game-summary-card-content">
            <div className="game-summary-card-value">{skills.length}</div>
            <div className="game-summary-card-label">Skills</div>
          </div>
        </div>
      </div>
    </div>
  )
}
