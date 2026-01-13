import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import type { CollaboratorInfo } from '../types/collaboration'

const gltfLoader = new GLTFLoader()

// Modelo usado para colaboradores
const COLLABORATOR_MODEL = '/assets/models/characters/Mage.glb'

interface CollaboratorMesh {
  group: THREE.Group
  mixer: THREE.AnimationMixer | null
  animations: Map<string, THREE.AnimationClip>
  currentAction: THREE.AnimationAction | null
  nameSprite: THREE.Sprite
  targetPosition: THREE.Vector3
  userId: string
}

/**
 * CollaboratorSystem - Renderiza outros usuários no editor em tempo real
 */
export class CollaboratorSystem {
  private scene: THREE.Scene
  private collaborators: Map<string, CollaboratorMesh> = new Map()
  private modelTemplate: THREE.Group | null = null
  private modelAnimations: THREE.AnimationClip[] = []
  private modelLoaded = false
  private pendingUsers: CollaboratorInfo[] = []

  constructor(scene: THREE.Scene) {
    this.scene = scene
    this.preloadModel()
  }

  /**
   * Pre-carrega o modelo de colaborador
   */
  private async preloadModel(): Promise<void> {
    try {
      const gltf = await gltfLoader.loadAsync(COLLABORATOR_MODEL)
      this.modelTemplate = gltf.scene
      this.modelAnimations = gltf.animations
      this.modelLoaded = true

      // Processa usuarios pendentes
      this.pendingUsers.forEach(user => this.addCollaborator(user))
      this.pendingUsers = []
    } catch (error) {
      console.error('[CollaboratorSystem] Erro ao carregar modelo:', error)
    }
  }

  /**
   * Adiciona um colaborador na cena
   */
  public addCollaborator(user: CollaboratorInfo): void {
    // Se ja existe, apenas atualiza
    if (this.collaborators.has(user.id)) {
      this.updateCollaborator(user)
      return
    }

    // Se modelo ainda nao carregou, adiciona a fila
    if (!this.modelLoaded || !this.modelTemplate) {
      this.pendingUsers.push(user)
      return
    }

    console.log('[CollaboratorSystem] Adicionando colaborador:', user.name)

    // Clona o modelo
    const group = new THREE.Group()
    const model = this.modelTemplate.clone()

    // Configura sombras
    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true
        child.receiveShadow = true
        // Adiciona cor do usuario ao material
        if (child.material) {
          const mat = (child.material as THREE.MeshStandardMaterial).clone()
          mat.emissive = new THREE.Color(user.color)
          mat.emissiveIntensity = 0.3
          child.material = mat
        }
      }
    })

    group.add(model)

    // Cria nome flutuante
    const nameSprite = this.createNameSprite(user.name, user.color)
    nameSprite.position.y = 2.2
    group.add(nameSprite)

    // Posiciona
    const pos = user.cursorPosition || { x: 0, y: 0, z: 0 }
    group.position.set(pos.x, pos.y, pos.z)

    // Configura animacoes - mixer no model, nao no group
    let mixer: THREE.AnimationMixer | null = null
    const animations = new Map<string, THREE.AnimationClip>()
    let currentAction: THREE.AnimationAction | null = null

    if (this.modelAnimations.length > 0) {
      // Mixer deve ser no model que contem os bones
      mixer = new THREE.AnimationMixer(model)

      this.modelAnimations.forEach((clip) => {
        let name = clip.name
        if (name.includes('|')) {
          name = name.split('|')[1]
        }
        animations.set(name, clip)
      })

      // Inicia com idle
      const idleClip = animations.get('Idle')
      if (idleClip && mixer) {
        currentAction = mixer.clipAction(idleClip)
        currentAction.play()
      }
    }

    // Adiciona a cena
    this.scene.add(group)

    // Registra
    this.collaborators.set(user.id, {
      group,
      mixer,
      animations,
      currentAction,
      nameSprite,
      targetPosition: new THREE.Vector3(pos.x, pos.y, pos.z),
      userId: user.id,
    })
  }

  /**
   * Cria sprite com nome do usuario
   */
  private createNameSprite(name: string, color: string): THREE.Sprite {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')!
    canvas.width = 256
    canvas.height = 64

    // Fundo semi-transparente
    context.fillStyle = 'rgba(0, 0, 0, 0.6)'
    context.roundRect(0, 0, canvas.width, canvas.height, 8)
    context.fill()

    // Borda colorida
    context.strokeStyle = color
    context.lineWidth = 3
    context.roundRect(0, 0, canvas.width, canvas.height, 8)
    context.stroke()

    // Texto
    context.font = 'bold 24px Arial'
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.fillStyle = color
    context.fillText(name, canvas.width / 2, canvas.height / 2)

    const texture = new THREE.CanvasTexture(canvas)
    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: false,
    })

    const sprite = new THREE.Sprite(material)
    sprite.scale.set(2, 0.5, 1)

    return sprite
  }

  /**
   * Atualiza posicao de um colaborador
   */
  public updateCollaborator(user: CollaboratorInfo): void {
    const collab = this.collaborators.get(user.id)
    if (!collab) {
      // Se nao existe ainda, adiciona
      this.addCollaborator(user)
      return
    }

    // Atualiza posicao alvo
    if (user.cursorPosition) {
      collab.targetPosition.set(
        user.cursorPosition.x,
        user.cursorPosition.y,
        user.cursorPosition.z
      )
    }
  }

  /**
   * Remove um colaborador da cena
   */
  public removeCollaborator(userId: string): void {
    const collab = this.collaborators.get(userId)
    if (!collab) return

    console.log('[CollaboratorSystem] Removendo colaborador:', userId)

    this.scene.remove(collab.group)
    this.collaborators.delete(userId)
  }

  /**
   * Sincroniza com lista de usuarios ativos
   */
  public syncCollaborators(users: CollaboratorInfo[]): void {
    // Remove usuarios que sairam
    const activeIds = new Set(users.map(u => u.id))
    this.collaborators.forEach((_, id) => {
      if (!activeIds.has(id)) {
        this.removeCollaborator(id)
      }
    })

    // Adiciona/atualiza usuarios
    users.forEach(user => {
      // Ignora usuario atual
      if (user.isCurrentUser) return

      if (this.collaborators.has(user.id)) {
        this.updateCollaborator(user)
      } else {
        this.addCollaborator(user)
      }
    })
  }

  /**
   * Update chamado a cada frame - interpolacao suave
   */
  public update(deltaTime: number): void {
    this.collaborators.forEach((collab) => {
      // Interpola posicao
      collab.group.position.lerp(collab.targetPosition, deltaTime * 5)

      // Atualiza animacoes
      if (collab.mixer) {
        collab.mixer.update(deltaTime)
      }

      // Verifica se esta se movendo para trocar animacao
      const distance = collab.group.position.distanceTo(collab.targetPosition)
      if (distance > 0.1) {
        // Usa Walking_A que e o nome correto no modelo KayKit
        this.playAnimation(collab, 'Walking_A')

        // Rotaciona para direcao do movimento
        const direction = new THREE.Vector3()
          .subVectors(collab.targetPosition, collab.group.position)
          .normalize()
        if (direction.length() > 0) {
          const angle = Math.atan2(direction.x, direction.z)
          collab.group.rotation.y = angle
        }
      } else {
        this.playAnimation(collab, 'Idle')
      }
    })
  }

  /**
   * Troca animacao de um colaborador
   */
  private playAnimation(collab: CollaboratorMesh, name: string): void {
    if (!collab.mixer) return

    const clip = collab.animations.get(name)
    if (!clip) return

    const newAction = collab.mixer.clipAction(clip)

    if (collab.currentAction !== newAction) {
      if (collab.currentAction) {
        collab.currentAction.fadeOut(0.2)
      }
      newAction.reset().fadeIn(0.2).play()
      collab.currentAction = newAction
    }
  }

  /**
   * Limpa todos os colaboradores
   */
  public clear(): void {
    this.collaborators.forEach((collab) => {
      this.scene.remove(collab.group)
    })
    this.collaborators.clear()
  }

  /**
   * Destroi o sistema
   */
  public destroy(): void {
    this.clear()
  }
}
