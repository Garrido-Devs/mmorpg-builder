import * as THREE from 'three'
import type { GameSystem } from '../types'
import { AudioManager } from '../audio/AudioManager'

/**
 * Definicao de uma skill/habilidade
 */
export interface SkillDefinition {
  id: string
  name: string
  description: string
  icon: string
  damage: number
  manaCost: number
  cooldown: number // em segundos
  range: number
  type: 'melee' | 'ranged' | 'heal' | 'buff'
  soundId?: string
}

/**
 * Estado de uma skill (cooldown atual)
 */
export interface SkillState {
  skill: SkillDefinition
  currentCooldown: number
  isReady: boolean
}

/**
 * Interface para entidades combatentes
 */
export interface Combatant {
  id: string
  mesh: THREE.Object3D
  health: number
  maxHealth: number
  mana?: number
  maxMana?: number
  damage: number
  defense?: number
  isDead: boolean
  takeDamage: (amount: number) => void
  heal?: (amount: number) => void
}

/**
 * CombatSystem - Sistema de combate do jogo
 *
 * Responsabilidades:
 * - Gerenciar ataques e dano
 * - Detectar colisoes de ataque
 * - Gerenciar habilidades e cooldowns
 * - Numeros de dano flutuantes
 */
export class CombatSystem implements GameSystem {
  private scene: THREE.Scene
  private player: Combatant | null = null
  private enemies: Map<string, Combatant> = new Map()
  private players: Map<string, Combatant> = new Map() // outros jogadores para PvP

  // Skills do jogador
  private skills: SkillState[] = []

  // Callbacks para UI
  private onDamageDealtCallbacks: Set<(targetId: string, damage: number, position: THREE.Vector3) => void> = new Set()
  private onDamageReceivedCallbacks: Set<(damage: number) => void> = new Set()
  private onSkillUsedCallbacks: Set<(skillIndex: number) => void> = new Set()
  private onSkillCooldownCallbacks: Set<(skillIndex: number, cooldown: number, maxCooldown: number) => void> = new Set()
  private onTargetKilledCallbacks: Set<(targetId: string) => void> = new Set()

  // Numeros de dano flutuantes
  private damageNumbers: { mesh: THREE.Sprite; velocity: THREE.Vector3; lifetime: number }[] = []

  // Skills padrao
  private defaultSkills: SkillDefinition[] = [
    {
      id: 'basic_attack',
      name: 'Ataque Basico',
      description: 'Ataque corpo a corpo',
      icon: '⚔️',
      damage: 10,
      manaCost: 0,
      cooldown: 0.8,
      range: 2.5,
      type: 'melee',
      soundId: 'swing1',
    },
    {
      id: 'power_strike',
      name: 'Golpe Poderoso',
      description: 'Ataque forte com mais dano',
      icon: '💥',
      damage: 25,
      manaCost: 10,
      cooldown: 3,
      range: 2.5,
      type: 'melee',
      soundId: 'swing2',
    },
    {
      id: 'fireball',
      name: 'Bola de Fogo',
      description: 'Projeta fogo no inimigo',
      icon: '🔥',
      damage: 30,
      manaCost: 20,
      cooldown: 5,
      range: 10,
      type: 'ranged',
      soundId: 'magic1',
    },
    {
      id: 'heal',
      name: 'Cura',
      description: 'Recupera vida',
      icon: '💚',
      damage: -25, // negativo = cura
      manaCost: 15,
      cooldown: 8,
      range: 0,
      type: 'heal',
      soundId: 'bubble1',
    },
    {
      id: 'poison',
      name: 'Veneno',
      description: 'Envenena o alvo',
      icon: '🧪',
      damage: 15,
      manaCost: 12,
      cooldown: 6,
      range: 8,
      type: 'ranged',
      soundId: 'bottle',
    },
    {
      id: 'shield',
      name: 'Escudo',
      description: 'Aumenta defesa temporariamente',
      icon: '🛡️',
      damage: 0,
      manaCost: 10,
      cooldown: 10,
      range: 0,
      type: 'buff',
      soundId: 'armor_light',
    },
    {
      id: 'dash',
      name: 'Investida',
      description: 'Avanca rapidamente',
      icon: '💨',
      damage: 5,
      manaCost: 8,
      cooldown: 4,
      range: 5,
      type: 'melee',
      soundId: 'cloth',
    },
    {
      id: 'thunder',
      name: 'Trovao',
      description: 'Raio eletrico',
      icon: '⚡',
      damage: 35,
      manaCost: 25,
      cooldown: 7,
      range: 12,
      type: 'ranged',
      soundId: 'spell',
    },
  ]

  constructor(scene: THREE.Scene) {
    this.scene = scene
    this.initializeSkills()
  }

  private initializeSkills(): void {
    this.skills = this.defaultSkills.map(skill => ({
      skill,
      currentCooldown: 0,
      isReady: true,
    }))
  }

  public init(): void {
    // Inicializacao
  }

  public update(deltaTime: number): void {
    // Atualiza cooldowns das skills
    this.skills.forEach((state, index) => {
      if (state.currentCooldown > 0) {
        state.currentCooldown -= deltaTime
        if (state.currentCooldown <= 0) {
          state.currentCooldown = 0
          state.isReady = true
        }
        this.onSkillCooldownCallbacks.forEach(cb =>
          cb(index, state.currentCooldown, state.skill.cooldown)
        )
      }
    })

    // Atualiza numeros de dano flutuantes
    this.updateDamageNumbers(deltaTime)
  }

  public destroy(): void {
    this.enemies.clear()
    this.players.clear()
    this.damageNumbers.forEach(dn => this.scene.remove(dn.mesh))
    this.damageNumbers = []
  }

  /**
   * Registra o jogador principal
   */
  public setPlayer(player: Combatant): void {
    this.player = player
  }

  /**
   * Registra um inimigo
   */
  public registerEnemy(enemy: Combatant): void {
    this.enemies.set(enemy.id, enemy)
  }

  /**
   * Remove um inimigo
   */
  public unregisterEnemy(id: string): void {
    this.enemies.delete(id)
  }

  /**
   * Registra outro jogador (PvP)
   */
  public registerPlayer(player: Combatant): void {
    this.players.set(player.id, player)
  }

  /**
   * Executa ataque basico do jogador
   */
  public playerAttack(): boolean {
    return this.useSkill(0) // Skill 0 = ataque basico
  }

  /**
   * Usa uma skill pelo indice (0-9)
   */
  public useSkill(skillIndex: number): boolean {
    if (!this.player || this.player.isDead) return false

    const skillState = this.skills[skillIndex]
    if (!skillState) return false

    const { skill } = skillState

    // Verifica cooldown
    if (!skillState.isReady) {
      console.log(`[Combat] Skill ${skill.name} em cooldown`)
      return false
    }

    // Verifica mana
    if (this.player.mana !== undefined && skill.manaCost > this.player.mana) {
      console.log(`[Combat] Mana insuficiente para ${skill.name}`)
      return false
    }

    // Consome mana
    if (this.player.mana !== undefined && skill.manaCost > 0) {
      this.player.mana -= skill.manaCost
    }

    // Inicia cooldown
    skillState.currentCooldown = skill.cooldown
    skillState.isReady = false

    // Toca som
    if (skill.soundId) {
      AudioManager.play(skill.soundId)
    }

    // Notifica UI
    this.onSkillUsedCallbacks.forEach(cb => cb(skillIndex))

    // Executa efeito da skill
    if (skill.type === 'heal') {
      // Cura a si mesmo
      if (this.player.heal) {
        this.player.heal(Math.abs(skill.damage))
        this.showDamageNumber(this.player.mesh.position, Math.abs(skill.damage), true)
      }
    } else if (skill.type === 'buff') {
      // Buff (por enquanto nao faz nada visivel)
      console.log(`[Combat] Buff ${skill.name} aplicado`)
    } else {
      // Ataque - encontra alvos no range
      this.performAttack(skill)
    }

    return true
  }

  /**
   * Executa um ataque e aplica dano aos alvos
   */
  private performAttack(skill: SkillDefinition): void {
    if (!this.player) return

    const playerPos = this.player.mesh.position
    const playerDir = new THREE.Vector3(0, 0, -1).applyQuaternion(this.player.mesh.quaternion)

    // Encontra todos os alvos no range
    const targets: Combatant[] = []

    // Verifica inimigos
    this.enemies.forEach(enemy => {
      if (enemy.isDead) return
      const dist = enemy.mesh.position.distanceTo(playerPos)
      if (dist <= skill.range) {
        // Para melee, verifica se esta na frente (arco de 180 graus)
        if (skill.type === 'melee') {
          const toEnemy = enemy.mesh.position.clone().sub(playerPos).normalize()
          const dot = playerDir.dot(toEnemy)
          // dot > -0.2 = arco de ~180 graus (mais generoso)
          if (dot > -0.2) {
            targets.push(enemy)
          }
        } else {
          // Ranged atinge qualquer um no range
          targets.push(enemy)
        }
      }
    })

    // Verifica outros jogadores (PvP)
    this.players.forEach(player => {
      if (player.isDead) return
      const dist = player.mesh.position.distanceTo(playerPos)
      if (dist <= skill.range) {
        if (skill.type === 'melee') {
          const toPlayer = player.mesh.position.clone().sub(playerPos).normalize()
          const dot = playerDir.dot(toPlayer)
          if (dot > -0.2) {
            targets.push(player)
          }
        } else {
          targets.push(player)
        }
      }
    })

    // Aplica dano
    targets.forEach(target => {
      const finalDamage = this.calculateDamage(skill.damage, this.player!.damage, target.defense || 0)
      target.takeDamage(finalDamage)

      // Mostra numero de dano
      this.showDamageNumber(target.mesh.position, finalDamage, false)

      // Notifica callbacks
      this.onDamageDealtCallbacks.forEach(cb => cb(target.id, finalDamage, target.mesh.position))

      // Verifica se morreu
      if (target.health <= 0) {
        this.onTargetKilledCallbacks.forEach(cb => cb(target.id))
      }
    })

    if (targets.length === 0) {
      console.log(`[Combat] Nenhum alvo encontrado para ${skill.name}`)
    }
  }

  /**
   * Calcula dano final
   */
  private calculateDamage(baseDamage: number, attackerDamage: number, targetDefense: number): number {
    const totalDamage = baseDamage + attackerDamage * 0.5
    const reduction = targetDefense / (targetDefense + 100) // formula de reducao
    return Math.max(1, Math.round(totalDamage * (1 - reduction)))
  }

  /**
   * Aplica dano ao jogador (de um inimigo)
   */
  public damagePlayer(damage: number, attackerId: string): void {
    if (!this.player || this.player.isDead) return

    const finalDamage = this.calculateDamage(damage, 0, 0)
    this.player.takeDamage(finalDamage)

    // Som de dano
    AudioManager.play('swing3')

    // Mostra numero
    this.showDamageNumber(this.player.mesh.position, finalDamage, false)

    this.onDamageReceivedCallbacks.forEach(cb => cb(finalDamage))

    console.log(`[Combat] Player recebeu ${finalDamage} de dano de ${attackerId}`)
  }

  /**
   * Mostra numero de dano flutuante
   */
  private showDamageNumber(position: THREE.Vector3, damage: number, isHeal: boolean): void {
    const canvas = document.createElement('canvas')
    canvas.width = 128
    canvas.height = 64
    const ctx = canvas.getContext('2d')!

    // Estilo
    ctx.font = 'bold 48px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    // Cor
    if (isHeal) {
      ctx.fillStyle = '#22c55e'
      ctx.strokeStyle = '#166534'
    } else {
      ctx.fillStyle = '#ef4444'
      ctx.strokeStyle = '#7f1d1d'
    }

    // Texto
    const text = isHeal ? `+${damage}` : `-${damage}`
    ctx.lineWidth = 4
    ctx.strokeText(text, 64, 32)
    ctx.fillText(text, 64, 32)

    // Sprite
    const texture = new THREE.CanvasTexture(canvas)
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true })
    const sprite = new THREE.Sprite(material)

    sprite.position.copy(position)
    sprite.position.y += 2
    sprite.scale.set(1, 0.5, 1)

    this.scene.add(sprite)

    this.damageNumbers.push({
      mesh: sprite,
      velocity: new THREE.Vector3(0, 2, 0),
      lifetime: 1,
    })
  }

  /**
   * Atualiza numeros de dano
   */
  private updateDamageNumbers(deltaTime: number): void {
    for (let i = this.damageNumbers.length - 1; i >= 0; i--) {
      const dn = this.damageNumbers[i]
      dn.lifetime -= deltaTime

      if (dn.lifetime <= 0) {
        this.scene.remove(dn.mesh)
        dn.mesh.material.dispose()
        this.damageNumbers.splice(i, 1)
      } else {
        // Move para cima e fade out
        dn.mesh.position.add(dn.velocity.clone().multiplyScalar(deltaTime))
        const material = dn.mesh.material as THREE.SpriteMaterial
        material.opacity = dn.lifetime
      }
    }
  }

  /**
   * Retorna estado das skills
   */
  public getSkillStates(): SkillState[] {
    return this.skills
  }

  /**
   * Retorna uma skill especifica
   */
  public getSkill(index: number): SkillState | null {
    return this.skills[index] || null
  }

  // Callbacks
  public onDamageDealt(cb: (targetId: string, damage: number, position: THREE.Vector3) => void): () => void {
    this.onDamageDealtCallbacks.add(cb)
    return () => this.onDamageDealtCallbacks.delete(cb)
  }

  public onDamageReceived(cb: (damage: number) => void): () => void {
    this.onDamageReceivedCallbacks.add(cb)
    return () => this.onDamageReceivedCallbacks.delete(cb)
  }

  public onSkillUsed(cb: (skillIndex: number) => void): () => void {
    this.onSkillUsedCallbacks.add(cb)
    return () => this.onSkillUsedCallbacks.delete(cb)
  }

  public onSkillCooldown(cb: (skillIndex: number, cooldown: number, maxCooldown: number) => void): () => void {
    this.onSkillCooldownCallbacks.add(cb)
    return () => this.onSkillCooldownCallbacks.delete(cb)
  }

  public onTargetKilled(cb: (targetId: string) => void): () => void {
    this.onTargetKilledCallbacks.add(cb)
    return () => this.onTargetKilledCallbacks.delete(cb)
  }
}
