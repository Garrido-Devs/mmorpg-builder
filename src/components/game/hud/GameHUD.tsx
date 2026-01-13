import { useState, useEffect } from 'react'
import { PlayerFrame } from './PlayerFrame'
import { TargetFrame } from './TargetFrame'
import { Minimap } from './Minimap'
import { ActionBar } from './ActionBar'
import { getEngine } from '../../../engine'
import './hud.css'

export interface PlayerStats {
  name: string
  level: number
  health: number
  maxHealth: number
  mana: number
  maxMana: number
  stamina: number
  maxStamina: number
  experience: number
  experienceToLevel: number
  avatarUrl?: string
}

export interface TargetInfo {
  id: string
  name: string
  level: number
  health: number
  maxHealth: number
  type: 'enemy' | 'npc' | 'player'
}

export interface SkillInfo {
  id: string
  name: string
  icon: string
  cooldown: number
  maxCooldown: number
  isReady: boolean
}

interface GameHUDProps {
  visible?: boolean
  editorMode?: boolean
}

/**
 * GameHUD - Interface do jogador estilo MMORPG
 * Conectado aos sistemas reais do engine
 */
export function GameHUD({ visible = true, editorMode = false }: GameHUDProps) {
  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    name: 'Aventureiro',
    level: 1,
    health: 100,
    maxHealth: 100,
    mana: 50,
    maxMana: 50,
    stamina: 100,
    maxStamina: 100,
    experience: 0,
    experienceToLevel: 100,
  })

  const [target, setTarget] = useState<TargetInfo | null>(null)
  const [playerPosition, setPlayerPosition] = useState({ x: 0, z: 0 })
  const [skills, setSkills] = useState<SkillInfo[]>([])

  // Conecta aos stats reais do player
  useEffect(() => {
    const engine = getEngine()
    const player = engine.player

    // Carrega nome do usuario
    const userStr = localStorage.getItem('auth_user')
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        setPlayerStats(prev => ({
          ...prev,
          name: user.name || 'Aventureiro',
          avatarUrl: user.avatarUrl,
        }))
      } catch (e) {
        console.error('Erro ao carregar usuario:', e)
      }
    }

    // Escuta mudancas de HP
    const unsubHealth = player.onHealthChange((health, maxHealth) => {
      setPlayerStats(prev => ({ ...prev, health, maxHealth }))
    })

    // Escuta mudancas de Mana
    const unsubMana = player.onManaChange((mana, maxMana) => {
      setPlayerStats(prev => ({ ...prev, mana, maxMana }))
    })

    // Escuta mudancas de Stamina
    const unsubStamina = player.onStaminaChange((stamina, maxStamina) => {
      setPlayerStats(prev => ({ ...prev, stamina, maxStamina }))
    })

    // Escuta posicao
    const unsubPosition = engine.onPlayerMove((pos) => {
      setPlayerPosition({ x: pos.x, z: pos.z })
    })

    // Carrega skills do combat system
    const combatSystem = engine.combatSystem
    const skillStates = combatSystem.getSkillStates()
    setSkills(skillStates.map(s => ({
      id: s.skill.id,
      name: s.skill.name,
      icon: s.skill.icon,
      cooldown: s.currentCooldown,
      maxCooldown: s.skill.cooldown,
      isReady: s.isReady,
    })))

    // Escuta cooldowns de skills
    const unsubCooldown = combatSystem.onSkillCooldown((index, cooldown, maxCooldown) => {
      setSkills(prev => prev.map((s, i) =>
        i === index ? { ...s, cooldown, maxCooldown, isReady: cooldown <= 0 } : s
      ))
    })

    return () => {
      unsubHealth()
      unsubMana()
      unsubStamina()
      unsubPosition()
      unsubCooldown()
    }
  }, [])

  // Escuta selecao de alvo (via eventos)
  useEffect(() => {
    const handleTargetSelect = (event: CustomEvent<TargetInfo | null>) => {
      setTarget(event.detail)
    }

    window.addEventListener('target-selected', handleTargetSelect as EventListener)
    return () => window.removeEventListener('target-selected', handleTargetSelect as EventListener)
  }, [])

  if (!visible) return null

  return (
    <div className={`game-hud ${editorMode ? 'game-hud--editor' : ''}`}>
      {/* Canto superior esquerdo - Info do jogador */}
      <div className="hud-top-left">
        <PlayerFrame stats={playerStats} />
      </div>

      {/* Centro superior - Alvo selecionado */}
      {target && (
        <div className="hud-top-center">
          <TargetFrame target={target} onDeselect={() => setTarget(null)} />
        </div>
      )}

      {/* Canto superior direito - Minimap */}
      <div className="hud-top-right">
        <Minimap playerPosition={playerPosition} />
      </div>

      {/* Centro inferior - Barra de acoes */}
      <div className="hud-bottom-center">
        <ActionBar skills={skills} />
      </div>
    </div>
  )
}
