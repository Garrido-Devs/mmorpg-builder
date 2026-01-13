import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { Entity } from './Entity'
import type { MapObjectData, AssetDefinition, Component, ComponentType } from '../types'
import { COMPONENT_DEFINITIONS } from '../data/ComponentDefinitions'

// Contador para gerar IDs únicos
let objectCounter = 0

// Cache de modelos carregados
const modelCache = new Map<string, THREE.Group>()

// Loader compartilhado
const gltfLoader = new GLTFLoader()

/**
 * MapObject - Objeto colocado no mapa pelo editor
 *
 * Responsabilidades:
 * - Representar objetos estáticos no mundo
 * - Armazenar referência ao asset original
 * - Gerenciar componentes
 * - Serializar para salvamento do mapa
 */
export class MapObject extends Entity {
  public assetId: string
  private assetDefinition: AssetDefinition | null
  private components: Component[] = []
  private isLoading = false

  // Sistema de animação
  private mixer: THREE.AnimationMixer | null = null
  private animations: Map<string, THREE.AnimationClip> = new Map()
  private currentAction: THREE.AnimationAction | null = null
  private currentAnimation: string = ''

  // Label de nome flutuante
  private nameLabel: THREE.Sprite | null = null

  constructor(assetId: string, asset?: AssetDefinition) {
    super(`obj_${++objectCounter}`, 'mapObject')
    this.assetId = assetId
    this.assetDefinition = asset || null
    this.createMesh()
    this.initializeDefaultComponents()
  }

  /**
   * Cria o mesh visual baseado no tipo de asset
   */
  private createMesh(): void {
    // Cria um grupo vazio primeiro
    this.mesh = new THREE.Group()

    // Armazena metadados no userData
    this.mesh.userData.entityId = this.id
    this.mesh.userData.entityName = this.assetDefinition?.name || 'Objeto'
    this.mesh.userData.assetId = this.assetId
    this.mesh.userData.components = this.components
    this.mesh.name = `mapObject_${this.id}`

    // Se tem path, carrega o modelo GLB/GLTF
    if (this.assetDefinition?.path) {
      this.loadModel(this.assetDefinition.path)
    } else {
      // Se não tem path, cria placeholder baseado no tipo
      this.createPlaceholder()
    }
  }

  /**
   * Carrega modelo GLB/GLTF
   */
  private async loadModel(path: string): Promise<void> {
    this.isLoading = true

    // Guarda o path no userData para o AISystem poder usar
    this.mesh.userData.assetPath = path

    try {
      const gltf = await gltfLoader.loadAsync(path)
      const model = gltf.scene

      // Adiciona ao cache (modelo sem animações)
      if (!modelCache.has(path)) {
        modelCache.set(path, model.clone())
      }

      this.setupLoadedModel(model, gltf.animations)

      if (gltf.animations.length > 0) {
        console.log(`MapObject: Modelo ${path} carregado com ${gltf.animations.length} animações:`, gltf.animations.map(a => a.name))
      } else {
        console.log(`MapObject: Modelo ${path} carregado SEM animações`)
      }
    } catch (error) {
      console.warn(`Falha ao carregar modelo: ${path}`, error)
      // Fallback para placeholder
      this.createPlaceholder()
    }

    this.isLoading = false
  }

  /**
   * Configura o modelo carregado
   */
  private setupLoadedModel(model: THREE.Group, animations?: THREE.AnimationClip[]): void {
    // Configura sombras em todos os meshes
    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })

    // Centraliza o modelo
    const box = new THREE.Box3().setFromObject(model)
    const center = box.getCenter(new THREE.Vector3())
    model.position.sub(new THREE.Vector3(center.x, box.min.y, center.z))

    // Remove placeholder se existir
    while (this.mesh.children.length > 0) {
      this.mesh.remove(this.mesh.children[0])
    }

    // Adiciona o modelo
    this.mesh.add(model)

    // Configurar animações se existirem
    if (animations && animations.length > 0) {
      this.setupAnimations(animations)
    }

    // Cria label de nome para NPCs
    this.createNameLabel(box)
  }

  /**
   * Cria label de nome flutuante acima do objeto
   */
  private createNameLabel(boundingBox: THREE.Box3): void {
    // Verifica se é NPC
    const npcComponent = this.components.find(c => c.type === 'npc')

    // Só mostra nome para NPCs - props não precisam de nome
    if (!npcComponent) return

    let displayName: string
    let title: string | undefined
    let nameColor: string

    // É NPC - usa configurações do componente
    const npc = npcComponent as import('../types').NPCComponent
    displayName = npc.displayName || ''
    title = npc.title
    const attitude = npc.attitude

    if (!displayName || displayName === 'NPC') return

    // Cor baseada na atitude
    nameColor = '#ffffff' // neutral
    if (attitude === 'friendly') nameColor = '#22ff22'
    else if (attitude === 'hostile') nameColor = '#ff4444'

    // Cria canvas para o texto
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')!
    canvas.width = 256
    canvas.height = 64

    // Desenha o texto
    context.fillStyle = 'rgba(0, 0, 0, 0.5)'
    context.fillRect(0, 0, canvas.width, canvas.height)

    context.font = 'bold 24px Arial'
    context.textAlign = 'center'
    context.textBaseline = 'middle'

    // Nome
    context.fillStyle = nameColor
    context.fillText(displayName, canvas.width / 2, title ? 20 : 32)

    // Título (se houver - apenas NPCs)
    if (title) {
      context.font = '16px Arial'
      context.fillStyle = '#aaaaaa'
      context.fillText(`<${title}>`, canvas.width / 2, 44)
    }

    // Cria textura e sprite
    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true

    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: false,
    })

    this.nameLabel = new THREE.Sprite(material)
    this.nameLabel.scale.set(2, 0.5, 1)

    // Posiciona acima do modelo
    const height = boundingBox.max.y - boundingBox.min.y
    this.nameLabel.position.y = height + 0.5

    this.mesh.add(this.nameLabel)
  }

  /**
   * Configura animações do modelo
   */
  private setupAnimations(clips: THREE.AnimationClip[]): void {
    this.mixer = new THREE.AnimationMixer(this.mesh)

    clips.forEach((clip) => {
      let name = clip.name
      if (name.includes('|')) {
        name = name.split('|')[1]
      }
      this.animations.set(name, clip)
    })

    // Iniciar com idle se disponível
    if (this.animations.has('Idle')) {
      console.log(`MapObject ${this.id}: Tocando animação Idle`)
      this.playAnimation('Idle')
    } else {
      // Tentar primeira animação disponível
      const firstAnim = this.animations.keys().next().value
      if (firstAnim) {
        console.log(`MapObject ${this.id}: Tocando primeira animação: ${firstAnim}`)
        this.playAnimation(firstAnim)
      } else {
        console.log(`MapObject ${this.id}: Nenhuma animação disponível`)
      }
    }
  }

  /**
   * Toca uma animação
   */
  public playAnimation(name: string): void {
    if (!this.mixer) return
    if (this.currentAnimation === name) return

    const clip = this.animations.get(name)
    if (!clip) {
      const similar = Array.from(this.animations.keys()).find(k =>
        k.toLowerCase().includes(name.toLowerCase())
      )
      if (similar) {
        this.playAnimation(similar)
      }
      return
    }

    const newAction = this.mixer.clipAction(clip)

    if (this.currentAction) {
      this.currentAction.fadeOut(0.2)
      newAction.reset().fadeIn(0.2).play()
    } else {
      newAction.play()
    }

    this.currentAction = newAction
    this.currentAnimation = name
  }

  /**
   * Atualiza animações (chamar a cada frame)
   */
  public updateAnimations(deltaTime: number): void {
    if (this.mixer) {
      this.mixer.update(deltaTime)
    }
  }

  /**
   * Retorna animações disponíveis
   */
  public getAnimations(): string[] {
    return Array.from(this.animations.keys())
  }

  /**
   * Cria placeholder visual quando não há modelo
   */
  private createPlaceholder(): void {
    const type = this.assetDefinition?.type || 'prop'
    let geometry: THREE.BufferGeometry
    let material: THREE.Material

    // Cria geometria baseada no tipo
    switch (type) {
      case 'tree':
        geometry = new THREE.ConeGeometry(1, 3, 8)
        material = new THREE.MeshStandardMaterial({ color: 0x228b22 })
        break

      case 'rock':
        geometry = new THREE.DodecahedronGeometry(0.8)
        material = new THREE.MeshStandardMaterial({
          color: 0x808080,
          roughness: 0.9,
        })
        break

      case 'building':
        geometry = new THREE.BoxGeometry(3, 4, 3)
        material = new THREE.MeshStandardMaterial({
          color: 0xd4a574,
          roughness: 0.6,
        })
        break

      case 'npc':
        geometry = new THREE.CapsuleGeometry(0.4, 1, 8, 16)
        material = new THREE.MeshStandardMaterial({
          color: 0x6366f1,
          roughness: 0.5,
        })
        break

      case 'item':
        geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3)
        material = new THREE.MeshStandardMaterial({
          color: 0xffd700,
          roughness: 0.3,
          metalness: 0.8,
        })
        break

      case 'prefab':
        // Prefabs sem modelo visual (triggers, waypoints)
        geometry = new THREE.BoxGeometry(1, 1, 1)
        material = new THREE.MeshBasicMaterial({
          color: 0x22c55e,
          wireframe: true,
          transparent: true,
          opacity: 0.5,
        })
        break

      default:
        geometry = new THREE.BoxGeometry(1, 1, 1)
        material = new THREE.MeshStandardMaterial({ color: 0xffffff })
    }

    const mesh = new THREE.Mesh(geometry, material)
    mesh.castShadow = true
    mesh.receiveShadow = true

    // Ajusta posição Y baseado no tipo
    if (type === 'tree') {
      mesh.position.y = 1.5
    } else if (type === 'building') {
      mesh.position.y = 2
    } else if (type === 'rock') {
      mesh.position.y = 0.4
    } else if (type === 'npc') {
      mesh.position.y = 0.9
    } else if (type === 'item') {
      mesh.position.y = 0.15
    } else {
      mesh.position.y = 0.5
    }

    this.mesh.add(mesh)
  }

  /**
   * Inicializa componentes padrão baseado no asset
   */
  private initializeDefaultComponents(): void {
    const defaultTypes = this.assetDefinition?.defaultComponents || []

    defaultTypes.forEach((type) => {
      const component = this.addComponent(type)

      // Configura NPCs de inimigos como hostis por padrão
      if (type === 'npc' && component && this.assetDefinition?.category === 'Inimigos') {
        const npcComp = component as import('../types').NPCComponent
        npcComp.attitude = 'hostile'
        npcComp.behavior = 'patrol'
        npcComp.patrolRadius = 5
        npcComp.displayName = this.assetDefinition.name
      }
    })

    // Sincroniza com mesh
    this.mesh.userData.components = this.components
  }

  /**
   * Adiciona um componente
   */
  public addComponent(type: ComponentType): Component | null {
    const definition = COMPONENT_DEFINITIONS[type]
    if (!definition) return null

    // Verifica se já tem (se não permite múltiplos)
    if (!definition.allowMultiple && this.hasComponent(type)) {
      return null
    }

    // Cria componente com valores padrão
    const component: Component = {
      id: `${type}_${Date.now()}`,
      type,
      enabled: true,
      ...definition.properties.reduce((acc, prop) => {
        acc[prop.key] = prop.default
        return acc
      }, {} as Record<string, unknown>),
    } as Component

    this.components.push(component)
    this.mesh.userData.components = this.components

    return component
  }

  /**
   * Remove um componente
   */
  public removeComponent(componentId: string): void {
    this.components = this.components.filter(c => c.id !== componentId)
    this.mesh.userData.components = this.components
  }

  /**
   * Verifica se tem um tipo de componente
   */
  public hasComponent(type: ComponentType): boolean {
    return this.components.some(c => c.type === type)
  }

  /**
   * Retorna componente por tipo
   */
  public getComponent<T extends Component>(type: ComponentType): T | undefined {
    return this.components.find(c => c.type === type) as T | undefined
  }

  /**
   * Retorna todos os componentes
   */
  public getComponents(): Component[] {
    return this.components
  }

  /**
   * Define os componentes (usado ao carregar mapa)
   */
  public setComponents(components: Component[]): void {
    this.components = components
    this.mesh.userData.components = this.components
  }

  /**
   * Verifica se o modelo ainda está carregando
   */
  public isModelLoading(): boolean {
    return this.isLoading
  }

  /**
   * Serializa o objeto para salvamento
   */
  public serialize(): MapObjectData {
    return {
      id: this.id,
      name: this.mesh.userData.entityName || this.assetDefinition?.name || 'Objeto',
      type: this.type,
      prefabId: this.assetId,
      assetId: this.assetId,
      tags: [],
      layer: 'default',
      visible: this.mesh.visible,
      enabled: true,
      transform: this.getTransformData(),
      components: this.components,
      children: [],
      parent: null,
      metadata: {},
    }
  }

  /**
   * Cria um MapObject a partir de dados salvos
   */
  public static deserialize(data: MapObjectData): MapObject {
    // Cria asset definition mínimo para reconstruir visualmente
    const assetDef: AssetDefinition = {
      id: data.assetId,
      name: data.name,
      path: '',
      type: 'prop',
      category: 'Geral',
    }

    const obj = new MapObject(data.assetId, assetDef)
    obj.id = data.id // Preserva ID original
    obj.components = data.components || []

    // Aplica transformações
    obj.setPosition(data.transform.position)
    obj.setRotation(data.transform.rotation)
    obj.setScale(data.transform.scale)

    // Atualiza userData
    obj.mesh.userData.entityId = data.id
    obj.mesh.userData.entityName = data.name
    obj.mesh.userData.components = obj.components

    return obj
  }
}

/**
 * Pré-carrega um modelo para o cache
 */
export async function preloadModel(path: string): Promise<void> {
  if (modelCache.has(path) || !path) return

  try {
    const gltf = await gltfLoader.loadAsync(path)
    modelCache.set(path, gltf.scene.clone())
  } catch (error) {
    console.warn(`Falha ao pré-carregar modelo: ${path}`, error)
  }
}

/**
 * Limpa o cache de modelos
 */
export function clearModelCache(): void {
  modelCache.clear()
}
