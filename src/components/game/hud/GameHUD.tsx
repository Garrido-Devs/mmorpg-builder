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

interface GameHUDProps {
  visible?: boolean
  editorMode?: boolean
}

/**
 * GameHUD - Interface do jogador estilo MMORPG
 */
export function GameHUD({ visible = true, editorMode = false }: GameHUDProps) {
  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    name: 'Aventureiro',
    level: 1,
    health: 100,
    maxHealth: 100,
    mana: 50,
    maxMana: 50,
    experience: 0,
    experienceToLevel: 100,
  })

  const [target, setTarget] = useState<TargetInfo | null>(null)
  const [playerPosition, setPlayerPosition] = useState({ x: 0, z: 0 })

  // Carrega dados do usuario logado
  useEffect(() => {
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
  }, [])

  // Escuta posicao do player para o minimap
  useEffect(() => {
    const engine = getEngine()
    const unsubscribe = engine.onPlayerMove((pos) => {
      setPlayerPosition({ x: pos.x, z: pos.z })
    })
    return unsubscribe
  }, [])

  // Escuta selecao de alvo
  useEffect(() => {
    const handleTargetSelect = (event: CustomEvent<TargetInfo | null>) => {
      setTarget(event.detail)
    }

    window.addEventListener('target-selected', handleTargetSelect as EventListener)
    return () => window.removeEventListener('target-selected', handleTargetSelect as EventListener)
  }, [])

  // Escuta dano recebido/curado
  useEffect(() => {
    const handlePlayerDamage = (event: CustomEvent<{ amount: number }>) => {
      setPlayerStats(prev => ({
        ...prev,
        health: Math.max(0, prev.health - event.detail.amount),
      }))
    }

    const handlePlayerHeal = (event: CustomEvent<{ amount: number }>) => {
      setPlayerStats(prev => ({
        ...prev,
        health: Math.min(prev.maxHealth, prev.health + event.detail.amount),
      }))
    }

    window.addEventListener('player-damage', handlePlayerDamage as EventListener)
    window.addEventListener('player-heal', handlePlayerHeal as EventListener)
    return () => {
      window.removeEventListener('player-damage', handlePlayerDamage as EventListener)
      window.removeEventListener('player-heal', handlePlayerHeal as EventListener)
    }
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
        <ActionBar />
      </div>
    </div>
  )
}
