import * as THREE from 'three'
import { GameScene } from './GameScene'
import { GameLoop } from './GameLoop'
import { Player } from '../entities/Player'
import { MapObject } from '../entities/MapObject'
import { InputSystem } from '../systems/InputSystem'
import { CameraSystem } from '../systems/CameraSystem'
import { EditorSystem } from '../systems/EditorSystem'
import { ComponentSystem } from '../systems/ComponentSystem'
import { InteractionSystem } from '../systems/InteractionSystem'
import { CollisionSystem } from '../systems/CollisionSystem'
import { AISystem } from '../systems/AISystem'
import { CollaboratorSystem } from '../systems/CollaboratorSystem'
import type { GameMode, MapData, MapObjectData, AssetDefinition } from '../types'
import { createDefaultMapSettings } from '../types'
import { getAssetById } from '../assets'

/**
 * Engine - Orquestrador principal do jogo
 *
 * Responsabilidades:
 * - Inicializar e conectar todos os sistemas
 * - Gerenciar modos de jogo (play/editor)
 * - Expor API para comunicação com React
 *
 * Decisão: Engine é singleton para facilitar acesso global
 * mas expõe eventos para comunicação reativa com UI
 */
export class Engine {
  public gameScene: GameScene
  public gameLoop: GameLoop
  public player: Player
  public inputSystem: InputSystem
  public cameraSystem: CameraSystem
  public editorSystem: EditorSystem
  public componentSystem: ComponentSystem
  public interactionSystem: InteractionSystem
  public collisionSystem: CollisionSystem
  public aiSystem: AISystem
  public collaboratorSystem: CollaboratorSystem

  private renderer: THREE.WebGLRenderer | null = null
  private camera: THREE.PerspectiveCamera
  private mode: GameMode = 'play'
  private mapObjects: Map<string, MapObject> = new Map()

  // Callbacks para notificar React
  private onModeChangeCallbacks: Set<(mode: GameMode) => void> = new Set()
  private onObjectSelectedCallbacks: Set<(obj: THREE.Object3D | null) => void> = new Set()
  private onMapUpdateCallbacks: Set<(data: MapData) => void> = new Set()

  constructor() {
    // Inicializa cena e câmera
    this.gameScene = new GameScene()
    this.camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000)

    // Inicializa player
    this.player = new Player()
    this.gameScene.add(this.player.mesh)

    // Inicializa sistemas
    this.inputSystem = new InputSystem()
    this.cameraSystem = new CameraSystem(this.camera, this.player)
    this.editorSystem = new EditorSystem(
      this.gameScene,
      this.camera,
      (obj) => this.notifyObjectSelected(obj)
    )
    this.componentSystem = new ComponentSystem(this.gameScene.scene)
    this.interactionSystem = new InteractionSystem(this.gameScene.scene)
    this.collisionSystem = new CollisionSystem(this.gameScene.scene)
    this.aiSystem = new AISystem(this.gameScene.scene)
    this.collaboratorSystem = new CollaboratorSystem(this.gameScene.scene)

    // Inicializa game loop
    this.gameLoop = new GameLoop()
    this.gameLoop.onUpdate(this.update.bind(this))
  }

  /**
   * Inicializa o engine com o canvas do Three.js
   */
  public init(canvas: HTMLCanvasElement): void {
    // Configura renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
    })
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap

    // Inicializa sistemas
    this.inputSystem.init()
    this.cameraSystem.init()
    this.editorSystem.init(this.renderer.domElement)
    this.interactionSystem.init()

    // Configura aspect ratio inicial
    this.handleResize()
    window.addEventListener('resize', this.handleResize)

    // Carrega mapa padrão
    this.loadDefaultMap()

    // Inicia o loop
    this.gameLoop.start()
  }

  /**
   * Carrega o mapa padrão da vila
   */
  private async loadDefaultMap(): Promise<void> {
    try {
      const response = await fetch('/data/maps/default.json')
      if (response.ok) {
        const mapData = await response.json()
        console.log('Carregando mapa padrão:', mapData.name)
        this.loadMap(mapData)
      }
    } catch (error) {
      console.warn('Mapa padrão não encontrado, iniciando vazio')
    }
  }

  /**
   * Destrói o engine e limpa recursos
   */
  public destroy(): void {
    this.gameLoop.stop()
    this.inputSystem.destroy()
    this.cameraSystem.destroy()
    this.editorSystem.destroy()
    this.componentSystem.destroy()
    this.interactionSystem.destroy()
    this.collaboratorSystem.destroy()
    window.removeEventListener('resize', this.handleResize)

    if (this.renderer) {
      this.renderer.dispose()
    }
  }

  /**
   * Update principal - chamado a cada frame
   */
  private update(deltaTime: number): void {
    // Atualiza player apenas no modo play
    if (this.mode === 'play') {
      // Atualiza colliders
      this.collisionSystem.updateColliders()

      // Salva posição atual
      const currentPos = this.player.mesh.position.clone()

      // Calcula nova posição desejada
      this.player.updateWithInput(deltaTime, this.inputSystem.state)

      // Resolve colisões
      const resolvedPos = this.collisionSystem.resolveCollision(
        currentPos,
        this.player.mesh.position
      )
      this.player.mesh.position.copy(resolvedPos)

      // Atualiza sistema de interação
      this.interactionSystem.update(this.player.mesh.position)

      // Atualiza sistema de IA
      this.aiSystem.update(deltaTime, this.player.mesh.position)
    }

    // Atualiza animações de todos os objetos do mapa
    this.mapObjects.forEach((obj) => {
      obj.updateAnimations(deltaTime)
    })

    // Câmera sempre atualiza
    this.cameraSystem.update(deltaTime)

    // Editor atualiza apenas no modo editor
    if (this.mode === 'editor') {
      this.editorSystem.update(deltaTime)
      // Sincroniza helpers de componentes
      this.componentSystem.syncHelpers()
    }

    // Atualiza colaboradores (sempre)
    this.collaboratorSystem.update(deltaTime)

    // Renderiza
    if (this.renderer) {
      this.renderer.render(this.gameScene.scene, this.camera)
    }
  }

  /**
   * Alterna entre modos play e editor
   */
  public setMode(mode: GameMode): void {
    if (this.mode === mode) return

    this.mode = mode

    // Configura sistemas baseado no modo
    this.gameScene.toggleGrid(mode === 'editor')
    this.editorSystem.setEnabled(mode === 'editor')
    this.cameraSystem.setFollowTarget(mode === 'play' ? this.player : null)

    // Mostra/esconde helpers de collider
    this.componentSystem.setCollidersVisible(mode === 'editor')

    // Ao entrar no modo play, escaneia NPCs
    if (mode === 'play') {
      this.aiSystem.scanForNPCs()
    }

    // Notifica listeners
    this.onModeChangeCallbacks.forEach(cb => cb(mode))
  }

  /**
   * Retorna o modo atual
   */
  public getMode(): GameMode {
    return this.mode
  }

  /**
   * Adiciona um objeto ao mapa a partir de um asset
   */
  public placeObject(asset: AssetDefinition, position: THREE.Vector3): MapObject {
    const mapObject = new MapObject(asset.id, asset)
    mapObject.setPosition(position)

    this.mapObjects.set(mapObject.id, mapObject)
    this.gameScene.add(mapObject.mesh)

    // Processa componentes do objeto
    this.componentSystem.processComponents(mapObject.mesh)

    // Registra NPC no sistema de IA se tiver componente NPC
    this.aiSystem.registerNPC(mapObject.mesh)

    this.notifyMapUpdate()
    return mapObject
  }

  /**
   * Atualiza componentes de um objeto (chamado pela UI)
   */
  public updateObjectComponents(object: THREE.Object3D): void {
    this.componentSystem.processComponents(object)
  }

  /**
   * Remove um objeto do mapa
   */
  public removeObject(id: string): void {
    const obj = this.mapObjects.get(id)
    if (obj) {
      // Remove helpers de componentes
      this.componentSystem.removeObject(obj.mesh.userData.entityId)
      this.gameScene.remove(obj.mesh)
      this.mapObjects.delete(id)
      this.notifyMapUpdate()
    }
  }

  /**
   * Exporta os dados do mapa atual
   */
  public getMapData(): MapData {
    const objects: MapObjectData[] = []

    this.mapObjects.forEach((obj) => {
      objects.push(obj.serialize())
    })

    return {
      id: `map_${Date.now()}`,
      name: 'Mapa Sem Título',
      version: '1.0.0',
      description: '',
      author: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      settings: createDefaultMapSettings(),
      objects,
      connections: [],
    }
  }

  /**
   * Carrega um mapa a partir de dados
   */
  public loadMap(data: MapData): void {
    console.log(`Engine: Carregando mapa com ${data.objects.length} objetos`)

    // Limpa objetos existentes
    this.mapObjects.forEach((obj) => {
      this.componentSystem.removeObject(obj.id)
      this.gameScene.remove(obj.mesh)
    })
    this.mapObjects.clear()
    this.aiSystem.clear()

    // Carrega novos objetos
    data.objects.forEach((objData) => {
      // Busca o asset real no registry
      const asset = getAssetById(objData.assetId)

      if (asset) {
        console.log(`  Criando objeto: ${objData.id} (${asset.name}) - path: ${asset.path}`)
        // Cria objeto com o asset real (carrega modelo 3D)
        const mapObject = new MapObject(asset.id, asset)
        mapObject.id = objData.id // Preserva ID original

        // Aplica transformações salvas
        mapObject.setPosition(objData.transform.position)
        mapObject.setRotation(objData.transform.rotation)
        mapObject.setScale(objData.transform.scale)

        // Restaura componentes salvos (sobrescreve os padrão)
        if (objData.components && objData.components.length > 0) {
          mapObject.setComponents(objData.components)
        }

        // Registra no engine
        this.mapObjects.set(mapObject.id, mapObject)
        this.gameScene.add(mapObject.mesh)

        // Processa componentes
        this.componentSystem.processComponents(mapObject.mesh)

        // Registra NPC se tiver componente
        this.aiSystem.registerNPC(mapObject.mesh)
      } else {
        // Fallback: cria placeholder se asset não encontrado
        console.warn(`Asset não encontrado: ${objData.assetId}`)
        const mapObject = MapObject.deserialize(objData)
        this.mapObjects.set(mapObject.id, mapObject)
        this.gameScene.add(mapObject.mesh)
      }
    })

    this.notifyMapUpdate()
  }

  /**
   * Ajusta o tamanho do canvas quando a janela redimensiona
   */
  private handleResize = (): void => {
    if (!this.renderer) return

    const width = window.innerWidth
    const height = window.innerHeight

    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(width, height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }

  // ============================================
  // Sistema de eventos para comunicação com React
  // ============================================

  public onModeChange(callback: (mode: GameMode) => void): () => void {
    this.onModeChangeCallbacks.add(callback)
    return () => this.onModeChangeCallbacks.delete(callback)
  }

  public onObjectSelected(callback: (obj: THREE.Object3D | null) => void): () => void {
    this.onObjectSelectedCallbacks.add(callback)
    return () => this.onObjectSelectedCallbacks.delete(callback)
  }

  public onMapUpdate(callback: (data: MapData) => void): () => void {
    this.onMapUpdateCallbacks.add(callback)
    return () => this.onMapUpdateCallbacks.delete(callback)
  }

  private notifyObjectSelected(obj: THREE.Object3D | null): void {
    this.onObjectSelectedCallbacks.forEach(cb => cb(obj))
  }

  private notifyMapUpdate(): void {
    const data = this.getMapData()
    this.onMapUpdateCallbacks.forEach(cb => cb(data))
  }
}

// Singleton para acesso global
let engineInstance: Engine | null = null

export function getEngine(): Engine {
  if (!engineInstance) {
    engineInstance = new Engine()
  }
  return engineInstance
}

export function destroyEngine(): void {
  if (engineInstance) {
    engineInstance.destroy()
    engineInstance = null
  }
}
