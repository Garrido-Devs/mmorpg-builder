import { useCallback } from 'react'
import { getEngine } from '../../../engine'

interface SkillInfo {
  id: string
  name: string
  icon: string
  cooldown: number
  maxCooldown: number
  isReady: boolean
}

interface ActionBarProps {
  skills?: SkillInfo[]
}

/**
 * ActionBar - Barra de acoes/skills do jogador
 * Conectada ao CombatSystem real
 */
export function ActionBar({ skills = [] }: ActionBarProps) {
  // Executa skill pelo indice
  const executeSkill = useCallback((index: number) => {
    const engine = getEngine()
    engine.combatSystem.useSkill(index)
  }, [])

  // Preenche slots vazios se nao tiver 10 skills
  const slots = [...skills]
  while (slots.length < 10) {
    slots.push({
      id: `empty_${slots.length}`,
      name: 'Vazio',
      icon: '',
      cooldown: 0,
      maxCooldown: 0,
      isReady: false,
    })
  }

  return (
    <div className="action-bar">
      <div className="action-bar-slots">
        {slots.slice(0, 10).map((slot, index) => {
          const key = index === 9 ? '0' : String(index + 1)
          const isEmpty = !slot.icon

          return (
            <button
              key={slot.id}
              className={`action-slot ${isEmpty ? 'empty' : 'skill'} ${!slot.isReady && !isEmpty ? 'on-cooldown' : ''}`}
              onClick={() => !isEmpty && executeSkill(index)}
              disabled={!slot.isReady || isEmpty}
              title={isEmpty ? 'Vazio' : `${slot.name} [${key}]`}
            >
              <span className="action-slot-icon">{slot.icon}</span>
              <span className="action-slot-key">{key}</span>

              {/* Cooldown overlay */}
              {slot.cooldown > 0 && slot.maxCooldown > 0 && (
                <div
                  className="action-slot-cooldown"
                  style={{
                    height: `${(slot.cooldown / slot.maxCooldown) * 100}%`,
                  }}
                >
                  <span className="action-slot-cooldown-text">
                    {slot.cooldown.toFixed(1)}
                  </span>
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* XP Bar sob a action bar */}
      <div className="action-bar-xp">
        <div className="action-bar-xp-fill" style={{ width: '0%' }} />
      </div>
    </div>
  )
}
