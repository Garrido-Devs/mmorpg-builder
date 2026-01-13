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
  public damage = 15
  public attackRange = 2
  public attackCooldown = 0.8 // segundos
  private lastAttackTime = 0
  private isDead = false

  // Callbacks
  private onModelChangeCallbacks: Set<(modelId: string) => void> = new Set()
  private onHealthChangeCallbacks: Set<(health: number, maxHealth: number) => void> = new Set()
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

    // Calcula direção de movimento baseado no input
    this.moveDirection.set(0, 0, 0)

    if (input.forward) this.moveDirection.z -= 1
    if (input.backward) this.moveDirection.z += 1
    if (input.left) this.moveDirection.x -= 1
    if (input.right) this.moveDirection.x += 1

    // Verifica se está se movendo
    const isMoving = this.moveDirection.length() > 0

    if (isMoving) {
      this.moveDirection.normalize()

      // Rotaciona o player para a direção do movimento
      const targetAngle = Math.atan2(this.moveDirection.x, this.moveDirection.z)
      const currentAngle = this.mesh.rotation.y

      // Interpolação suave da rotação
      const angleDiff = this.normalizeAngle(targetAngle - currentAngle)
      this.mesh.rotation.y += angleDiff * this.rotationSpeed * deltaTime * 5

      // Move o player
      const velocity = this.moveDirection.multiplyScalar(this.moveSpeed * deltaTime)
      this.mesh.position.add(velocity)

      // Tocar animação de andar/correr
      this.playAnimation('Walking')
    } else {
      // Tocar animação idle (apenas se não estiver atacando)
      if (this.currentAnimationName !== 'Attack') {
        this.playAnimation('Idle')
      }
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
