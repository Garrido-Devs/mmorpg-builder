import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { Entity } from './Entity'
import type { EntityData, InputState } from '../types'

// Modelos de personagem disponíveis
export const PLAYER_MODELS = [
  { id: 'barbarian', name: 'Bárbaro', path: '/assets/models/characters/Barbarian.glb' },
  { id: 'knight', name: 'Cavaleiro', path: '/assets/models/characters/Knight.glb' },
  { id: 'mage', name: 'Mago', path: '/assets/models/characters/Mage.glb' },
  { id: 'rogue', name: 'Ladino', path: '/assets/models/characters/Rogue.glb' },
  { id: 'rogue_hooded', name: 'Ladino Encapuzado', path: '/assets/models/characters/Rogue_Hooded.glb' },
]

const gltfLoader = new GLTFLoader()

/**
 * Player - Entidade controlada pelo jogador
 *
 * Responsabilidades:
 * - Renderização do personagem 3D com animações
 * - Movimento baseado em input WASD
 * - Lógica de movimento em terceira pessoa
 */
export class Player extends Entity {
  private moveSpeed = 5 // Unidades por segundo
  private rotationSpeed = 3 // Radianos por segundo
  private moveDirection = new THREE.Vector3()

  // Sistema de animação
  private mixer: THREE.AnimationMixer | null = null
  private animations: Map<string, THREE.AnimationClip> = new Map()
  private currentAction: THREE.AnimationAction | null = null
  private currentAnimationName = ''

  // Modelo atual
  private currentModelId = 'mage'
  private isLoading = false

  // Stats de combate
  public health = 100
  public maxHealth = 100
  public mana = 50
  public maxMana = 50
  public stamina = 100
  public maxStamina = 100
  public damage = 15
  public defense = 5
  public attackRange = 2
  public attackCooldown = 0.8 // segundos
  private lastAttackTime = 0
  private isDead = false

  // Sistema de pulo
  private verticalVelocity = 0
  private isGrounded = true
  private jumpForce = 8
  private gravity = 20
  private groundLevel = 0

  // Sistema de sprint
  private sprintMultiplier = 1.8
  private staminaDrain = 20 // por segundo
  private staminaRegen = 15 // por segundo

  // Callbacks
  private onModelChangeCallbacks: Set<(modelId: string) => void> = new Set()
  private onHealthChangeCallbacks: Set<(health: number, maxHealth: number) => void> = new Set()
  private onManaChangeCallbacks: Set<(mana: number, maxMana: number) => void> = new Set()
  private onStaminaChangeCallbacks: Set<(stamina: number, maxStamina: number) => void> = new Set()
  private onDeathCallbacks: Set<() => void> = new Set()

  constructor() {
    super('player', 'player')
    this.createMesh()
    this.loadModel(PLAYER_MODELS[2].path) // Mago por padrão
  }

  /**
   * Cria o mesh visual do player (placeholder inicial)
   */
  private createMesh(): void {
    this.mesh = new THREE.Group()
    this.mesh.name = 'player'

    // Placeholder enquanto carrega
    const placeholderGeometry = new THREE.CapsuleGeometry(0.3, 0.8, 8, 16)
    const placeholderMaterial = new THREE.MeshStandardMaterial({
      color: 0x4a90d9,
      roughness: 0.7,
    })
    const placeholder = new THREE.Mesh(placeholderGeometry, placeholderMaterial)
    placeholder.position.y = 0.7
    placeholder.castShadow = true
    placeholder.name = 'placeholder'
    this.mesh.add(placeholder)

    // Dados do objeto para seleção no editor
    this.mesh.userData = {
      entityId: 'player',
      entityName: 'Player',
      isPlayer: true,
      components: [],
    }

    // Posição inicial
    this.mesh.position.set(0, 0, 0)
  }

  /**
   * Carrega um modelo de personagem
   */
  public async loadModel(path: string): Promise<void> {
    if (this.isLoading) return
    this.isLoading = true

    try {
      const gltf = await gltfLoader.loadAsync(path)
      const model = gltf.scene

      // Configurar sombras
      model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true
          child.receiveShadow = true
        }
      })

      // Escalar se necessário (KayKit models são pequenos)
      model.scale.setScalar(1)

      // Remover modelo anterior
      const oldModel = this.mesh.getObjectByName('characterModel')
      if (oldModel) {
        this.mesh.remove(oldModel)
      }

      // Remover placeholder
      const placeholder = this.mesh.getObjectByName('placeholder')
      if (placeholder) {
        this.mesh.remove(placeholder)
      }

      // Adicionar novo modelo
      model.name = 'characterModel'
      this.mesh.add(model)

      // Configurar animações
      this.setupAnimations(gltf.animations)

      // Iniciar com animação idle
      this.playAnimation('Idle')

      console.log(`Modelo carregado: ${path}`)
      console.log(`Animações disponíveis: ${Array.from(this.animations.keys()).join(', ')}`)

    } catch (error) {
      console.error('Erro ao carregar modelo do player:', error)
    }

    this.isLoading = false
  }

  /**
   * Configura as animações do modelo
   */
  private setupAnimations(clips: THREE.AnimationClip[]): void {
    // Limpar animações anteriores
    this.animations.clear()
    if (this.mixer) {
      this.mixer.stopAllAction()
    }

    // Criar mixer
    this.mixer = new THREE.AnimationMixer(this.mesh)

    // Mapear animações
    clips.forEach((clip) => {
      // Normalizar nomes de animação
      let name = clip.name
      // KayKit usa nomes como "CharacterArmature|Idle"
      if (name.includes('|')) {
        name = name.split('|')[1]
      }
      this.animations.set(name, clip)
    })
  }

  /**
   * Toca uma animação
   */
  public playAnimation(name: string, crossFadeDuration = 0.2): void {
    if (!this.mixer) return
    if (this.currentAnimationName === name) return

    const clip = this.animations.get(name)
    if (!clip) {
      // Tentar encontrar uma animação similar
      const similar = Array.from(this.animations.keys()).find(k =>
        k.toLowerCase().includes(name.toLowerCase())
      )
      if (similar) {
        this.playAnimation(similar, crossFadeDuration)
      }
      return
    }

    const newAction = this.mixer.clipAction(clip)

    if (this.currentAction) {
      // Cross-fade suave
      this.currentAction.fadeOut(crossFadeDuration)
      newAction.reset().fadeIn(crossFadeDuration).play()
    } else {
      newAction.play()
    }

    this.currentAction = newAction
    this.currentAnimationName = name
  }

  /**
   * Troca o personagem
   */
  public async setCharacter(modelId: string): Promise<void> {
    const model = PLAYER_MODELS.find(m => m.id === modelId)
    if (!model) return

    this.currentModelId = modelId
    await this.loadModel(model.path)

    // Notificar listeners
    this.onModelChangeCallbacks.forEach(cb => cb(modelId))
  }

  /**
   * Retorna o ID do modelo atual
   */
  public getCurrentModelId(): string {
    return this.currentModelId
  }

  /**
   * Registra callback para mudança de modelo
   */
  public onModelChange(callback: (modelId: string) => void): () => void {
    this.onModelChangeCallbacks.add(callback)
    return () => this.onModelChangeCallbacks.delete(callback)
  }

  /**
   * Registra callback para mudança de vida
   */
  public onHealthChange(callback: (health: number, maxHealth: number) => void): () => void {
    this.onHealthChangeCallbacks.add(callback)
    // Chama imediatamente com valor atual
    callback(this.health, this.maxHealth)
    return () => this.onHealthChangeCallbacks.delete(callback)
  }

  /**
   * Registra callback para morte
   */
  public onDeath(callback: () => void): () => void {
    this.onDeathCallbacks.add(callback)
    return () => this.onDeathCallbacks.delete(callback)
  }

  /**
   * Registra callback para mudanca de mana
   */
  public onManaChange(callback: (mana: number, maxMana: number) => void): () => void {
    this.onManaChangeCallbacks.add(callback)
    callback(this.mana, this.maxMana)
    return () => this.onManaChangeCallbacks.delete(callback)
  }

  /**
   * Registra callback para mudanca de stamina
   */
  public onStaminaChange(callback: (stamina: number, maxStamina: number) => void): () => void {
    this.onStaminaChangeCallbacks.add(callback)
    callback(this.stamina, this.maxStamina)
    return () => this.onStaminaChangeCallbacks.delete(callback)
  }

  /**
   * Pulo
   */
  public jump(): void {
    if (this.isGrounded && !this.isDead) {
      this.verticalVelocity = this.jumpForce
      this.isGrounded = false
      this.playAnimation('Jump')
    }
  }

  /**
   * Usa mana
   */
  public useMana(amount: number): boolean {
    if (this.mana < amount) return false
    this.mana -= amount
    this.onManaChangeCallbacks.forEach(cb => cb(this.mana, this.maxMana))
    return true
  }

  /**
   * Recupera mana
   */
  public regenMana(amount: number): void {
    this.mana = Math.min(this.maxMana, this.mana + amount)
    this.onManaChangeCallbacks.forEach(cb => cb(this.mana, this.maxMana))
  }

  /**
   * Recebe dano
   */
  public takeDamage(amount: number): void {
    if (this.isDead) return

    this.health = Math.max(0, this.health - amount)
    this.onHealthChangeCallbacks.forEach(cb => cb(this.health, this.maxHealth))

    if (this.health <= 0) {
      this.die()
    }
  }

  /**
   * Cura
   */
  public heal(amount: number): void {
    if (this.isDead) return

    this.health = Math.min(this.maxHealth, this.health + amount)
    this.onHealthChangeCallbacks.forEach(cb => cb(this.health, this.maxHealth))
  }

  /**
   * Verifica se pode atacar
   */
  public canAttack(): boolean {
    if (this.isDead) return false
    const now = Date.now() / 1000
    return now - this.lastAttackTime >= this.attackCooldown
  }

  /**
   * Executa ataque
   */
  public attack(): boolean {
    if (!this.canAttack()) return false

    this.lastAttackTime = Date.now() / 1000
    this.playAnimation('Attack')

    // Volta para idle após ataque
    setTimeout(() => {
      if (this.currentAnimationName === 'Attack') {
        this.playAnimation('Idle')
      }
    }, 500)

    return true
  }

  /**
   * Morre
   */
  private die(): void {
    this.isDead = true
    this.playAnimation('Death')
    this.onDeathCallbacks.forEach(cb => cb())

    // Respawn após 3 segundos
    setTimeout(() => {
      this.respawn()
    }, 3000)
  }

  /**
   * Respawn
   */
  public respawn(): void {
    this.isDead = false
    this.health = this.maxHealth
    this.mesh.position.set(0, 0, 0)
    this.playAnimation('Idle')
    this.onHealthChangeCallbacks.forEach(cb => cb(this.health, this.maxHealth))
  }

  /**
   * Verifica se está morto
   */
  public getIsDead(): boolean {
    return this.isDead
  }

  /**
   * Atualiza o player baseado no input
   */
  public updateWithInput(deltaTime: number, input: InputState): void {
    // Atualizar animações
    if (this.mixer) {
      this.mixer.update(deltaTime)
    }

    this.handleMovement(deltaTime, input)
  }

  /**
   * Processa o movimento do player
   */
  private handleMovement(deltaTime: number, input: InputState): void {
    // Não move se estiver morto
    if (this.isDead) return

    // ==================
    // PULO E GRAVIDADE
    // ==================
    if (!this.isGrounded) {
      this.verticalVelocity -= this.gravity * deltaTime
      this.mesh.position.y += this.verticalVelocity * deltaTime

      // Verifica se chegou ao chao
      if (this.mesh.position.y <= this.groundLevel) {
        this.mesh.position.y = this.groundLevel
        this.verticalVelocity = 0
        this.isGrounded = true
      }
    }

    // Pulo (via input)
    if (input.jump && this.isGrounded) {
      this.jump()
    }

    // ==================
    // MOVIMENTO HORIZONTAL
    // ==================
    this.moveDirection.set(0, 0, 0)

    if (input.forward) this.moveDirection.z -= 1
    if (input.backward) this.moveDirection.z += 1
    if (input.left) this.moveDirection.x -= 1
    if (input.right) this.moveDirection.x += 1

    // Verifica se está se movendo
    const isMoving = this.moveDirection.length() > 0

    // ==================
    // SPRINT
    // ==================
    let currentSpeed = this.moveSpeed
    const isSprinting = input.sprint && isMoving && this.stamina > 0

    if (isSprinting) {
      currentSpeed *= this.sprintMultiplier
      this.stamina = Math.max(0, this.stamina - this.staminaDrain * deltaTime)
      this.onStaminaChangeCallbacks.forEach(cb => cb(this.stamina, this.maxStamina))
    } else if (this.stamina < this.maxStamina) {
      // Regenera stamina quando nao esta correndo
      this.stamina = Math.min(this.maxStamina, this.stamina + this.staminaRegen * deltaTime)
      this.onStaminaChangeCallbacks.forEach(cb => cb(this.stamina, this.maxStamina))
    }

    // ==================
    // APLICA MOVIMENTO
    // ==================
    if (isMoving) {
      this.moveDirection.normalize()

      // Rotaciona o player para a direção do movimento
      const targetAngle = Math.atan2(this.moveDirection.x, this.moveDirection.z)
      const currentAngle = this.mesh.rotation.y

      // Interpolação suave da rotação
      const angleDiff = this.normalizeAngle(targetAngle - currentAngle)
      this.mesh.rotation.y += angleDiff * this.rotationSpeed * deltaTime * 5

      // Move o player
      const velocity = this.moveDirection.multiplyScalar(currentSpeed * deltaTime)
      this.mesh.position.add(velocity)

      // Tocar animação de andar/correr
      if (this.isGrounded) {
        this.playAnimation(isSprinting ? 'Run' : 'Walking')
      }
    } else {
      // Tocar animação idle (apenas se não estiver atacando ou pulando)
      if (this.currentAnimationName !== 'Attack' && this.isGrounded) {
        this.playAnimation('Idle')
      }
    }

    // ==================
    // REGENERACAO DE MANA
    // ==================
    if (this.mana < this.maxMana) {
      this.mana = Math.min(this.maxMana, this.mana + 2 * deltaTime) // 2 mana por segundo
      this.onManaChangeCallbacks.forEach(cb => cb(this.mana, this.maxMana))
    }
  }

  /**
   * Normaliza um ângulo para o intervalo [-PI, PI]
   */
  private normalizeAngle(angle: number): number {
    while (angle > Math.PI) angle -= Math.PI * 2
    while (angle < -Math.PI) angle += Math.PI * 2
    return angle
  }

  /**
   * Retorna lista de animações disponíveis
   */
  public getAvailableAnimations(): string[] {
    return Array.from(this.animations.keys())
  }

  /**
   * Serializa o player (não incluído no mapa)
   */
  public serialize(): EntityData {
    return {
      id: this.id,
      name: 'Player',
      type: this.type,
      prefabId: 'player',
      tags: ['player'],
      layer: 'default',
      visible: true,
      enabled: true,
      transform: this.getTransformData(),
      components: [],
      children: [],
      parent: null,
      metadata: {
        modelId: this.currentModelId,
      },
    }
  }
}
