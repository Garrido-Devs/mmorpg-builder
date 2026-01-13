import { useState, useEffect, useCallback } from 'react'

interface ActionSlot {
  id: string
  name: string
  icon: string
  cooldown: number
  maxCooldown: number
  manaCost: number
  key: string
  type: 'attack' | 'skill' | 'item' | 'empty'
}

const DEFAULT_ACTIONS: ActionSlot[] = [
  { id: '1', name: 'Ataque Basico', icon: '⚔️', cooldown: 0, maxCooldown: 0, manaCost: 0, key: '1', type: 'attack' },
  { id: '2', name: 'Golpe Forte', icon: '💥', cooldown: 0, maxCooldown: 3, manaCost: 10, key: '2', type: 'skill' },
  { id: '3', name: 'Bola de Fogo', icon: '🔥', cooldown: 0, maxCooldown: 5, manaCost: 20, key: '3', type: 'skill' },
  { id: '4', name: 'Cura', icon: '💚', cooldown: 0, maxCooldown: 10, manaCost: 30, key: '4', type: 'skill' },
  { id: '5', name: 'Escudo', icon: '🛡️', cooldown: 0, maxCooldown: 15, manaCost: 25, key: '5', type: 'skill' },
  { id: '6', name: 'Velocidade', icon: '💨', cooldown: 0, maxCooldown: 20, manaCost: 15, key: '6', type: 'skill' },
  { id: '7', name: 'Pocao HP', icon: '🧪', cooldown: 0, maxCooldown: 30, manaCost: 0, key: '7', type: 'item' },
  { id: '8', name: 'Pocao MP', icon: '🧴', cooldown: 0, maxCooldown: 30, manaCost: 0, key: '8', type: 'item' },
  { id: '9', name: 'Vazio', icon: '', cooldown: 0, maxCooldown: 0, manaCost: 0, key: '9', type: 'empty' },
  { id: '0', name: 'Vazio', icon: '', cooldown: 0, maxCooldown: 0, manaCost: 0, key: '0', type: 'empty' },
]

/**
 * ActionBar - Barra de acoes/skills do jogador
 */
export function ActionBar() {
  const [actions, setActions] = useState<ActionSlot[]>(DEFAULT_ACTIONS)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)

  // Executa acao
  const executeAction = useCallback((slot: ActionSlot) => {
    if (slot.type === 'empty') return
    if (slot.cooldown > 0) return

    console.log(`[ActionBar] Executando: ${slot.name}`)

    // Inicia cooldown
    if (slot.maxCooldown > 0) {
      setActions(prev =>
        prev.map(a =>
          a.id === slot.id ? { ...a, cooldown: a.maxCooldown } : a
        )
      )
    }

    // Emite evento de acao
    window.dispatchEvent(
      new CustomEvent('player-action', {
        detail: { actionId: slot.id, actionType: slot.type, actionName: slot.name },
      })
    )
  }, [])

  // Atualiza cooldowns
  useEffect(() => {
    const interval = setInterval(() => {
      setActions(prev =>
        prev.map(a => ({
          ...a,
          cooldown: Math.max(0, a.cooldown - 0.1),
        }))
      )
    }, 100)

    return () => clearInterval(interval)
  }, [])

  // Atalhos de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignora se estiver digitando em input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      const key = e.key
      const slot = actions.find(a => a.key === key)
      if (slot) {
        executeAction(slot)
        setSelectedSlot(slot.id)
        setTimeout(() => setSelectedSlot(null), 150)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [actions, executeAction])

  return (
    <div className="action-bar">
      <div className="action-bar-slots">
        {actions.map((slot) => (
          <button
            key={slot.id}
            className={`action-slot ${slot.type} ${selectedSlot === slot.id ? 'active' : ''} ${slot.cooldown > 0 ? 'on-cooldown' : ''}`}
            onClick={() => executeAction(slot)}
            disabled={slot.cooldown > 0 || slot.type === 'empty'}
            title={`${slot.name}${slot.manaCost > 0 ? ` (${slot.manaCost} MP)` : ''} [${slot.key}]`}
          >
            <span className="action-slot-icon">{slot.icon}</span>
            <span className="action-slot-key">{slot.key}</span>

            {/* Cooldown overlay */}
            {slot.cooldown > 0 && (
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

            {/* Mana cost indicator */}
            {slot.manaCost > 0 && (
              <span className="action-slot-mana">{slot.manaCost}</span>
            )}
          </button>
        ))}
      </div>

      {/* XP Bar sob a action bar */}
      <div className="action-bar-xp">
        <div className="action-bar-xp-fill" style={{ width: '35%' }} />
      </div>
    </div>
  )
}
