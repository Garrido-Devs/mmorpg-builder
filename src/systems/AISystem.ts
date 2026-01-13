import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import type { NPCComponent, Component } from '../types'

// Estados de IA
type AIState = 'idle' | 'patrol' | 'chase' | 'attack' | 'return' | 'dead'

// Dados de um NPC gerenciado
interface ManagedNPC {
  object: THREE.Object3D
  component: NPCComponent
  state: AIState
  mixer: THREE.AnimationMixer | null
  animations: Map<string, THREE.AnimationClip>
  currentAction: THREE.AnimationAction | null
  currentAnimation: string

  // Patrol
  patrolPoints: THREE.Vector3[]
  currentPatrolIndex: number
  patrolWaitTime: number

  // Combat
  lastAttackTime: number
  health: number
  maxHealth: number

  // Movement
  startPosition: THREE.Vector3
  targetPosition: THREE.Vector3 | null
}

const gltfLoader = new GLTFLoader()

/**
 * AISystem - Sistema de IA para NPCs e Inimigos
 *
 * Responsável por:
 * - Gerenciar comportamentos de NPCs (patrulha, perseguição, ataque)
 * - Controlar animações dos NPCs
 * - Detectar e reagir ao player
 */
export class AISystem {
  private scene: THREE.Scene
  private managedNPCs: Map<string, ManagedNPC> = new Map()
  private playerPosition: THREE.Vector3 = new THREE.Vector3()

  // Configurações
  private detectionRange = 8
  private attackRange = 1.5
  private moveSpeed = 2
  private attackCooldown = 1.5 // segundos

  // Zona segura (monstros não entram)
  private safeZoneCenter = new THREE.Vector3(0, 0, 0)
  private safeZoneRadius = 12 // raio da área segura

  constructor(scene: THREE.Scene) {
    this.scene = scene
  }

  /**
   * Registra um NPC para ser gerenciado
   */
  public async registerNPC(object: THREE.Object3D): Promise<void> {
    const entityId = object.userData.entityId as string
    if (!entityId || this.managedNPCs.has(entityId)) return

    const components = object.userData.components as Component[] | undefined
    if (!components) return

    const npcComponent = components.find(c => c.type === 'npc' && c.enabled) as NPCComponent | undefined
    if (!npcComponent) return

    // Criar entrada gerenciada
    const managed: ManagedNPC = {
      object,
      component: npcComponent,
      state: 'idle',
      mixer: null,
      animations: new Map(),
      currentAction: null,
      currentAnimation: '',
      patrolPoints: this.generatePatrolPoints(object.position, npcComponent.patrolRadius || 5),
      currentPatrolIndex: 0,
      patrolWaitTime: 0,
      lastAttackTime: 0,
      health: 100,
      maxHealth: 100,
      startPosition: object.position.clone(),
      targetPosition: null,
    }

    this.managedNPCs.set(entityId, managed)

    // Carregar animações do modelo
    await this.loadAnimations(managed)

    // Iniciar com idle
    this.playAnimation(managed, 'Idle')

    console.log(`NPC registrado: ${entityId}`)
    console.log(`  - Attitude: ${npcComponent.attitude}`)
    console.log(`  - Behavior: ${npcComponent.behavior}`)
    console.log(`  - PatrolRadius: ${npcComponent.patrolRadius}`)
    console.log(`  - AssetPath: ${managed.object.userData.assetPath}`)
  }

  /**
   * Remove um NPC do gerenciamento
   */
  public unregisterNPC(entityId: string): void {
    const managed = this.managedNPCs.get(entityId)
    if (managed?.mixer) {
      managed.mixer.stopAllAction()
    }
    this.managedNPCs.delete(entityId)
  }

  /**
   * Carrega animações do modelo
   */
  private async loadAnimations(managed: ManagedNPC): Promise<void> {
    // Buscar o modelo GLTF original para pegar as animações
    const assetPath = managed.object.userData.assetPath as string
    if (!assetPath) return

    try {
      const gltf = await gltfLoader.loadAsync(assetPath)

      if (gltf.animations.length > 0) {
        managed.mixer = new THREE.AnimationMixer(managed.object)

        gltf.animations.forEach((clip) => {
          let name = clip.name
          if (name.includes('|')) {
            name = name.split('|')[1]
          }
          managed.animations.set(name, clip)
        })

        console.log(`Animações carregadas para NPC ${managed.object.userData.entityId}: ${Array.from(managed.animations.keys()).join(', ')}`)
      }
    } catch (error) {
      console.warn('Falha ao carregar animações do NPC:', error)
    }
  }

  /**
   * Toca uma animação no NPC
   */
  private playAnimation(managed: ManagedNPC, name: string): void {
    if (!managed.mixer || managed.currentAnimation === name) return

    const clip = managed.animations.get(name)
    if (!clip) {
      // Tentar encontrar similar
      const similar = Array.from(managed.animations.keys()).find(k =>
        k.toLowerCase().includes(name.toLowerCase())
      )
      if (similar) {
        this.playAnimation(managed, similar)
      }
      return
    }

    const newAction = managed.mixer.clipAction(clip)

    if (managed.currentAction) {
      managed.currentAction.fadeOut(0.2)
      newAction.reset().fadeIn(0.2).play()
    } else {
      newAction.play()
    }

    managed.currentAction = newAction
    managed.currentAnimation = name
  }

  /**
   * Gera pontos de patrulha ao redor de uma posição
   */
  private generatePatrolPoints(center: THREE.Vector3, radius: number): THREE.Vector3[] {
    const points: THREE.Vector3[] = []
    const numPoints = 4

    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * Math.PI * 2
      points.push(new THREE.Vector3(
        center.x + Math.cos(angle) * radius,
        center.y,
        center.z + Math.sin(angle) * radius
      ))
    }

    return points
  }

  /**
   * Atualiza o sistema
   */
  public update(deltaTime: number, playerPosition: THREE.Vector3): void {
    this.playerPosition.copy(playerPosition)

    this.managedNPCs.forEach((managed) => {
      // Atualizar animações
      if (managed.mixer) {
        managed.mixer.update(deltaTime)
      }

      // Atualizar IA
      this.updateNPCBehavior(managed, deltaTime)
    })
  }

  /**
   * Atualiza comportamento de um NPC
   */
  private updateNPCBehavior(managed: ManagedNPC, deltaTime: number): void {
    const distanceToPlayer = managed.object.position.distanceTo(this.playerPosition)
    const { component } = managed
    const isHostile = component.attitude === 'hostile'

    // Comportamentos baseados no tipo
    switch (component.behavior) {
      case 'flee':
        // Fugir do player quando próximo
        if (distanceToPlayer <= this.detectionRange) {
          this.updateFleeBehavior(managed, deltaTime)
        } else {
          this.setState(managed, 'idle')
        }
        return

      case 'follow':
        // Seguir o player (amigável)
        if (distanceToPlayer > 3) {
          this.moveTowards(managed, this.playerPosition, deltaTime)
        } else {
          this.setState(managed, 'idle')
        }
        return

      case 'wander':
        // Vagar aleatoriamente
        this.updateWanderBehavior(managed, deltaTime)
        return

      case 'patrol':
        // Patrulhar se não hostil, ou patrulhar até detectar player se hostil
        if (!isHostile) {
          if (component.patrolRadius > 0) {
            this.updatePatrolBehavior(managed, deltaTime)
          } else {
            this.setState(managed, 'idle')
          }
          return
        }
        break

      case 'stationary':
      default:
        // Ficar parado se não hostil
        if (!isHostile) {
          this.setState(managed, 'idle')
          return
        }
        break
    }

    // NPC hostil - lógica de combate (para patrol e stationary)
    switch (managed.state) {
      case 'idle':
      case 'patrol':
        // Verificar se player está no range de detecção
        if (distanceToPlayer <= this.detectionRange) {
          this.setState(managed, 'chase')
        } else if (component.behavior === 'patrol' && component.patrolRadius > 0) {
          this.updatePatrolBehavior(managed, deltaTime)
        }
        break

      case 'chase':
        // Verifica se player está na zona segura
        const playerInSafeZone = this.isInSafeZone(this.playerPosition)
        const npcInSafeZone = this.isInSafeZone(managed.object.position)

        if (playerInSafeZone && !npcInSafeZone) {
          // Player está na zona segura, NPC para na borda e fica olhando
          this.lookAt(managed, this.playerPosition)
          this.setState(managed, 'idle')
        } else if (distanceToPlayer <= this.attackRange) {
          this.setState(managed, 'attack')
        } else if (distanceToPlayer > this.detectionRange * 1.5) {
          // Perdeu o player, voltar
          this.setState(managed, 'return')
        } else {
          // Perseguir player, mas não entrar na zona segura
          let targetPos = this.playerPosition.clone()

          if (playerInSafeZone) {
            // Calcula ponto na borda da zona segura
            targetPos = this.getPointOnSafeZoneBorder(managed.object.position, this.playerPosition)
          }

          this.moveTowards(managed, targetPos, deltaTime)
        }
        break

      case 'attack':
        // Verifica zona segura para ataque
        if (this.isInSafeZone(this.playerPosition) && !this.isInSafeZone(managed.object.position)) {
          this.lookAt(managed, this.playerPosition)
          this.setState(managed, 'idle')
        } else if (distanceToPlayer > this.attackRange * 1.5) {
          this.setState(managed, 'chase')
        } else {
          this.performAttack(managed)
        }
        break

      case 'return':
        // Voltar para posição inicial
        const distToStart = managed.object.position.distanceTo(managed.startPosition)
        if (distToStart < 0.5) {
          this.setState(managed, 'idle')
        } else if (distanceToPlayer <= this.detectionRange) {
          this.setState(managed, 'chase')
        } else {
          this.moveTowards(managed, managed.startPosition, deltaTime)
        }
        break

      case 'dead':
        // Não fazer nada
        break
    }
  }

  /**
   * Comportamento de fuga
   */
  private updateFleeBehavior(managed: ManagedNPC, deltaTime: number): void {
    // Calcula direção oposta ao player
    const direction = new THREE.Vector3()
      .subVectors(managed.object.position, this.playerPosition)
      .normalize()

    // Posição de fuga
    const fleeTarget = managed.object.position.clone().add(direction.multiplyScalar(5))

    // Limita a área de fuga (não vai muito longe da posição inicial)
    const distFromStart = fleeTarget.distanceTo(managed.startPosition)
    if (distFromStart > 15) {
      // Se está muito longe, tenta ir para os lados
      const perpendicular = new THREE.Vector3(-direction.z, 0, direction.x)
      fleeTarget.copy(managed.object.position.clone().add(perpendicular.multiplyScalar(3)))
    }

    this.moveTowards(managed, fleeTarget, deltaTime, this.moveSpeed * 1.2) // Foge mais rápido
  }

  /**
   * Comportamento de vagar
   */
  private updateWanderBehavior(managed: ManagedNPC, deltaTime: number): void {
    // Se não tem alvo ou chegou no alvo, escolhe novo
    if (!managed.targetPosition || managed.object.position.distanceTo(managed.targetPosition) < 0.5) {
      // Espera um pouco antes de escolher novo destino
      if (managed.patrolWaitTime > 0) {
        managed.patrolWaitTime -= deltaTime
        this.setState(managed, 'idle')
        return
      }

      // Escolhe ponto aleatório próximo da posição inicial
      const radius = managed.component.patrolRadius || 5
      const angle = Math.random() * Math.PI * 2
      const distance = Math.random() * radius

      managed.targetPosition = new THREE.Vector3(
        managed.startPosition.x + Math.cos(angle) * distance,
        managed.startPosition.y,
        managed.startPosition.z + Math.sin(angle) * distance
      )
      managed.patrolWaitTime = 1 + Math.random() * 3
    }

    // Move para o alvo
    this.moveTowards(managed, managed.targetPosition, deltaTime, this.moveSpeed * 0.5) // Vaga devagar
  }

  /**
   * Atualiza comportamento de patrulha
   */
  private updatePatrolBehavior(managed: ManagedNPC, deltaTime: number): void {
    if (managed.patrolPoints.length === 0) return

    // Se está esperando
    if (managed.patrolWaitTime > 0) {
      managed.patrolWaitTime -= deltaTime
      this.playAnimation(managed, 'Idle')
      return
    }

    const target = managed.patrolPoints[managed.currentPatrolIndex]
    const distance = managed.object.position.distanceTo(target)

    if (distance < 0.5) {
      // Chegou no ponto, esperar e ir pro próximo
      managed.patrolWaitTime = 2 + Math.random() * 2
      managed.currentPatrolIndex = (managed.currentPatrolIndex + 1) % managed.patrolPoints.length
    } else {
      // Mover para o ponto
      this.moveTowards(managed, target, deltaTime)
      this.setState(managed, 'patrol')
    }
  }

  /**
   * Move NPC em direção a um ponto
   */
  private moveTowards(managed: ManagedNPC, target: THREE.Vector3, deltaTime: number, speed?: number): void {
    const actualSpeed = speed ?? this.moveSpeed

    // Direção para o alvo
    const direction = new THREE.Vector3()
      .subVectors(target, managed.object.position)
      .normalize()

    // Calcula separação de outros NPCs
    const separation = this.calculateSeparation(managed)

    // Combina direção com separação
    const finalDirection = direction.add(separation.multiplyScalar(2)).normalize()

    // Mover
    managed.object.position.add(
      finalDirection.multiplyScalar(actualSpeed * deltaTime)
    )

    // Rotacionar para direção do alvo (não da separação)
    const targetDirection = new THREE.Vector3().subVectors(target, managed.object.position)
    const angle = Math.atan2(targetDirection.x, targetDirection.z)
    managed.object.rotation.y = angle

    // Animação
    this.playAnimation(managed, 'Walking')
  }

  /**
   * Calcula vetor de separação de outros NPCs
   */
  private calculateSeparation(managed: ManagedNPC): THREE.Vector3 {
    const separation = new THREE.Vector3()
    const separationRadius = 1.5 // Distância mínima entre NPCs
    let count = 0

    this.managedNPCs.forEach((other) => {
      if (other === managed) return

      const distance = managed.object.position.distanceTo(other.object.position)
      if (distance < separationRadius && distance > 0) {
        // Vetor apontando para longe do outro NPC
        const away = new THREE.Vector3()
          .subVectors(managed.object.position, other.object.position)
          .normalize()
          .divideScalar(distance) // Mais forte quando mais perto

        separation.add(away)
        count++
      }
    })

    if (count > 0) {
      separation.divideScalar(count)
    }

    return separation
  }

  /**
   * Verifica se uma posição está dentro da zona segura
   */
  private isInSafeZone(position: THREE.Vector3): boolean {
    const distance = position.distanceTo(this.safeZoneCenter)
    return distance < this.safeZoneRadius
  }

  /**
   * Calcula ponto na borda da zona segura entre NPC e alvo
   */
  private getPointOnSafeZoneBorder(_npcPos: THREE.Vector3, targetPos: THREE.Vector3): THREE.Vector3 {
    const direction = new THREE.Vector3()
      .subVectors(targetPos, this.safeZoneCenter)
      .normalize()

    // Ponto na borda da zona segura, um pouco para fora
    return this.safeZoneCenter.clone().add(
      direction.multiplyScalar(this.safeZoneRadius + 0.5)
    )
  }

  /**
   * Faz NPC olhar para uma posição
   */
  private lookAt(managed: ManagedNPC, target: THREE.Vector3): void {
    const direction = new THREE.Vector3()
      .subVectors(target, managed.object.position)
      .normalize()
    const angle = Math.atan2(direction.x, direction.z)
    managed.object.rotation.y = angle
  }

  /**
   * Executa ataque
   */
  private performAttack(managed: ManagedNPC): void {
    const now = Date.now() / 1000

    // Olhar para o player
    const direction = new THREE.Vector3()
      .subVectors(this.playerPosition, managed.object.position)
      .normalize()
    const angle = Math.atan2(direction.x, direction.z)
    managed.object.rotation.y = angle

    if (now - managed.lastAttackTime >= this.attackCooldown) {
      managed.lastAttackTime = now

      // Tocar animação de ataque
      this.playAnimation(managed, 'Attack')

      // TODO: Causar dano ao player
      console.log(`${managed.object.userData.entityName} atacou!`)
    }
  }

  /**
   * Define estado do NPC
   */
  private setState(managed: ManagedNPC, state: AIState): void {
    if (managed.state === state) return

    managed.state = state

    // Animação baseada no estado
    switch (state) {
      case 'idle':
        this.playAnimation(managed, 'Idle')
        break
      case 'patrol':
      case 'chase':
      case 'return':
        this.playAnimation(managed, 'Walking')
        break
      case 'attack':
        this.playAnimation(managed, 'Attack')
        break
      case 'dead':
        this.playAnimation(managed, 'Death')
        break
    }
  }

  /**
   * Escaneia a cena por novos NPCs
   */
  public scanForNPCs(): void {
    console.log('AISystem: Escaneando cena por NPCs...')
    let count = 0
    this.scene.traverse((object) => {
      const components = object.userData.components as Component[] | undefined
      if (!components) return

      const hasNPC = components.some(c => c.type === 'npc' && c.enabled)
      if (hasNPC) {
        count++
        this.registerNPC(object)
      }
    })
    console.log(`AISystem: ${count} NPCs encontrados`)
  }

  /**
   * Limpa todos os NPCs
   */
  public clear(): void {
    this.managedNPCs.forEach((managed) => {
      if (managed.mixer) {
        managed.mixer.stopAllAction()
      }
    })
    this.managedNPCs.clear()
  }
}
