import * as THREE from 'three'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import type { GameSystem, AssetDefinition } from '../types'
import type { GameScene } from '../engine/GameScene'

// Loader compartilhado para preview
const gltfLoader = new GLTFLoader()

/**
 * EditorSystem - Sistema de edição do mapa
 *
 * Responsabilidades:
 * - Seleção de objetos via raycaster
 * - TransformControls para mover/rotacionar objetos
 * - OrbitControls para navegação livre da câmera
 * - Modo de posicionamento de novos assets
 *
 * Decisão: Sistema completamente separado do gameplay
 * Ativado apenas quando mode === 'editor'
 */
export class EditorSystem implements GameSystem {
  private gameScene: GameScene
  private camera: THREE.Camera
  private domElement: HTMLElement | null = null
  private enabled = false

  // Controles
  private transformControls: TransformControls | null = null
  private orbitControls: OrbitControls | null = null

  // Raycaster para seleção
  private raycaster = new THREE.Raycaster()
  private mouse = new THREE.Vector2()

  // Estado do editor
  private selectedObject: THREE.Object3D | null = null
  private activeAsset: AssetDefinition | null = null
  private isPlacingMode = false
  private isDragging = false

  // Callback para notificar seleção
  private onSelectCallback: (obj: THREE.Object3D | null) => void

  // Preview do objeto sendo posicionado
  private placementPreview: THREE.Object3D | null = null

  constructor(
    gameScene: GameScene,
    camera: THREE.Camera,
    onSelect: (obj: THREE.Object3D | null) => void
  ) {
    this.gameScene = gameScene
    this.camera = camera
    this.onSelectCallback = onSelect
  }

  public init(domElement: HTMLElement): void {
    this.domElement = domElement
    this.setupControls()
  }

  /**
   * Configura os controles do editor
   */
  private setupControls(): void {
    if (!this.domElement) return

    // TransformControls para manipular objetos
    this.transformControls = new TransformControls(this.camera, this.domElement)
    this.transformControls.addEventListener('dragging-changed', (event) => {
      // Marca se está arrastando para ignorar cliques
      this.isDragging = event.value as boolean
      // Desabilita orbit controls enquanto arrasta
      if (this.orbitControls) {
        this.orbitControls.enabled = !(event.value as boolean)
      }
    })
    this.gameScene.scene.add(this.transformControls)

    // OrbitControls para navegação
    this.orbitControls = new OrbitControls(this.camera, this.domElement)
    this.orbitControls.enableDamping = true
    this.orbitControls.dampingFactor = 0.1
    this.orbitControls.maxPolarAngle = Math.PI / 2 - 0.1 // Evita ir abaixo do chão
    this.orbitControls.enabled = false // Desabilitado até entrar no modo editor

    // Event listeners
    this.domElement.addEventListener('click', this.handleClick)
    this.domElement.addEventListener('mousemove', this.handleMouseMove)
    window.addEventListener('keydown', this.handleKeyDown)
  }

  public update(_deltaTime: number): void {
    if (!this.enabled) return

    // Atualiza orbit controls
    if (this.orbitControls) {
      this.orbitControls.update()
    }
  }

  public destroy(): void {
    if (this.transformControls) {
      this.gameScene.scene.remove(this.transformControls)
      this.transformControls.dispose()
    }

    if (this.orbitControls) {
      this.orbitControls.dispose()
    }

    if (this.domElement) {
      this.domElement.removeEventListener('click', this.handleClick)
      this.domElement.removeEventListener('mousemove', this.handleMouseMove)
    }

    window.removeEventListener('keydown', this.handleKeyDown)
  }

  /**
   * Ativa/desativa o editor
   */
  public setEnabled(enabled: boolean): void {
    this.enabled = enabled

    if (this.orbitControls) {
      this.orbitControls.enabled = enabled
    }

    if (!enabled) {
      this.deselect()
      this.clearPlacementMode()
    }
  }

  /**
   * Trata clique no canvas
   */
  private handleClick = (event: MouseEvent): void => {
    if (!this.enabled) return
    // Ignora cliques se estava arrastando ou se clicou no painel
    if (this.isDragging) return

    // Ignora cliques fora do canvas (ex: no painel do editor)
    const target = event.target as HTMLElement
    if (target.tagName !== 'CANVAS') return

    this.updateMousePosition(event)

    if (this.isPlacingMode && this.activeAsset) {
      // Modo de posicionamento - coloca objeto
      this.placeObjectAtMouse()
    } else {
      // Modo normal - seleciona objeto
      this.selectObjectAtMouse()
    }
  }

  /**
   * Trata movimento do mouse
   */
  private handleMouseMove = (event: MouseEvent): void => {
    if (!this.enabled || !this.isPlacingMode) return

    this.updateMousePosition(event)
    this.updatePlacementPreview()
  }

  /**
   * Trata teclas
   */
  private handleKeyDown = (event: KeyboardEvent): void => {
    if (!this.enabled) return

    switch (event.code) {
      case 'KeyG':
        // Translate mode
        if (this.transformControls) {
          this.transformControls.setMode('translate')
        }
        break

      case 'KeyR':
        // Rotate mode
        if (this.transformControls) {
          this.transformControls.setMode('rotate')
        }
        break

      case 'KeyS':
        // Scale mode (apenas se não estiver digitando)
        if (!event.ctrlKey && !event.metaKey && this.transformControls) {
          this.transformControls.setMode('scale')
        }
        break

      case 'Escape':
        // Cancela seleção ou modo de posicionamento
        if (this.isPlacingMode) {
          this.clearPlacementMode()
        } else {
          this.deselect()
        }
        break

      case 'Delete':
      case 'Backspace':
        // Remove objeto selecionado
        this.deleteSelected()
        break
    }
  }

  /**
   * Atualiza posição do mouse normalizada
   */
  private updateMousePosition(event: MouseEvent): void {
    const rect = this.domElement!.getBoundingClientRect()
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
  }

  /**
   * Seleciona objeto sob o mouse
   */
  private selectObjectAtMouse(): void {
    this.raycaster.setFromCamera(this.mouse, this.camera)

    // Pega objetos interativos (exclui ground, grid, TransformControls, etc)
    const objects = this.gameScene.getInteractiveObjects().filter(obj => {
      // Exclui TransformControls e seus filhos
      if (this.isPartOfTransformControls(obj)) return false
      // Exclui helpers de collider
      if (obj.userData.isColliderHelper) return false
      // Exclui luzes de componentes
      if (obj.userData.isComponentLight) return false
      return true
    })

    const intersects = this.raycaster.intersectObjects(objects, true)

    if (intersects.length > 0) {
      // Encontra o objeto raiz (Group do MapObject ou Player)
      let object = intersects[0].object
      while (object.parent && !object.userData.entityId && object.name !== 'player') {
        object = object.parent
      }

      // Seleciona se encontrou um objeto com entityId ou é o player
      if (object.userData.entityId || object.name === 'player') {
        this.select(object)
      }
    } else {
      this.deselect()
    }
  }

  /**
   * Verifica se um objeto faz parte do TransformControls
   */
  private isPartOfTransformControls(obj: THREE.Object3D): boolean {
    let current: THREE.Object3D | null = obj
    while (current) {
      if (current === this.transformControls) return true
      current = current.parent
    }
    return false
  }

  /**
   * Seleciona um objeto
   */
  public select(object: THREE.Object3D): void {
    this.selectedObject = object

    if (this.transformControls) {
      this.transformControls.attach(object)
    }

    this.onSelectCallback(object)
  }

  /**
   * Remove seleção
   */
  public deselect(): void {
    this.selectedObject = null

    if (this.transformControls) {
      this.transformControls.detach()
    }

    this.onSelectCallback(null)
  }

  /**
   * Deleta objeto selecionado
   */
  public deleteSelected(): void {
    if (!this.selectedObject) return

    const entityId = this.selectedObject.userData.entityId
    if (entityId) {
      this.gameScene.remove(this.selectedObject)
      this.deselect()
      // Engine.removeObject(entityId) seria chamado aqui
    }
  }

  /**
   * Entra no modo de posicionamento de asset
   */
  public setActiveAsset(asset: AssetDefinition | null): void {
    this.activeAsset = asset
    this.isPlacingMode = asset !== null

    if (asset) {
      this.createPlacementPreview(asset)
    } else {
      this.clearPlacementMode()
    }
  }

  /**
   * Cria preview do objeto sendo posicionado
   */
  private createPlacementPreview(asset: AssetDefinition): void {
    this.clearPlacementPreview()

    // Cria um grupo para o preview
    this.placementPreview = new THREE.Group()
    this.gameScene.add(this.placementPreview)

    // Se tem path de modelo, carrega o modelo real
    if (asset.path) {
      this.loadPreviewModel(asset.path)
    } else {
      // Fallback para geometria baseada no tipo
      this.createFallbackPreview(asset.type)
    }
  }

  /**
   * Carrega modelo real para preview
   */
  private async loadPreviewModel(path: string): Promise<void> {
    if (!this.placementPreview) return

    try {
      const gltf = await gltfLoader.loadAsync(path)
      const model = gltf.scene.clone()

      // Centraliza o modelo
      const box = new THREE.Box3().setFromObject(model)
      const center = box.getCenter(new THREE.Vector3())
      model.position.sub(new THREE.Vector3(center.x, box.min.y, center.z))

      // Aplica material semi-transparente
      model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const originalMaterial = child.material as THREE.MeshStandardMaterial
          child.material = new THREE.MeshStandardMaterial({
            color: originalMaterial.color || 0x44ff44,
            map: originalMaterial.map,
            transparent: true,
            opacity: 0.7,
            emissive: 0x22ff22,
            emissiveIntensity: 0.2,
          })
        }
      })

      if (this.placementPreview) {
        this.placementPreview.add(model)
      }
    } catch (error) {
      console.warn('Falha ao carregar preview:', error)
      this.createFallbackPreview('prop')
    }
  }

  /**
   * Cria preview fallback quando não tem modelo
   */
  private createFallbackPreview(type: string): void {
    if (!this.placementPreview) return

    let geometry: THREE.BufferGeometry
    let yOffset = 0.5

    switch (type) {
      case 'tree':
        geometry = new THREE.ConeGeometry(1, 3, 8)
        yOffset = 1.5
        break
      case 'rock':
        geometry = new THREE.DodecahedronGeometry(0.8)
        yOffset = 0.4
        break
      case 'building':
        geometry = new THREE.BoxGeometry(3, 4, 3)
        yOffset = 2
        break
      case 'npc':
        geometry = new THREE.CapsuleGeometry(0.4, 1, 8, 16)
        yOffset = 0.9
        break
      default:
        geometry = new THREE.BoxGeometry(1, 1, 1)
        yOffset = 0.5
    }

    const material = new THREE.MeshStandardMaterial({
      color: 0x44ff44,
      transparent: true,
      opacity: 0.7,
      emissive: 0x22ff22,
      emissiveIntensity: 0.3,
    })

    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.y = yOffset
    this.placementPreview.add(mesh)
  }

  /**
   * Remove preview de posicionamento
   */
  private clearPlacementPreview(): void {
    if (this.placementPreview) {
      this.gameScene.remove(this.placementPreview)
      this.placementPreview = null
    }
  }

  /**
   * Limpa modo de posicionamento
   */
  private clearPlacementMode(): void {
    this.isPlacingMode = false
    this.activeAsset = null
    this.clearPlacementPreview()
  }

  /**
   * Atualiza posição do preview de posicionamento
   */
  private updatePlacementPreview(): void {
    if (!this.placementPreview) return

    const position = this.getMouseWorldPosition()
    if (position) {
      this.placementPreview.position.x = position.x
      this.placementPreview.position.z = position.z
    }
  }

  /**
   * Coloca objeto na posição do mouse
   */
  private placeObjectAtMouse(): void {
    const position = this.getMouseWorldPosition()
    if (position && this.activeAsset) {
      // Dispara evento para Engine criar o objeto
      const event = new CustomEvent('editor:placeObject', {
        detail: {
          asset: this.activeAsset,
          position,
        },
      })
      window.dispatchEvent(event)
    }
  }

  /**
   * Obtém posição do mouse no mundo 3D (no plano do chão)
   */
  private getMouseWorldPosition(): THREE.Vector3 | null {
    this.raycaster.setFromCamera(this.mouse, this.camera)

    const intersects = this.raycaster.intersectObject(this.gameScene.ground)
    if (intersects.length > 0) {
      return intersects[0].point
    }

    return null
  }

  /**
   * Retorna o objeto selecionado
   */
  public getSelectedObject(): THREE.Object3D | null {
    return this.selectedObject
  }

  /**
   * Retorna se está em modo de posicionamento
   */
  public isInPlacingMode(): boolean {
    return this.isPlacingMode
  }

  /**
   * Define o modo de transformação (translate/rotate/scale)
   */
  public setTransformMode(mode: 'translate' | 'rotate' | 'scale'): void {
    if (this.transformControls) {
      this.transformControls.setMode(mode)
    }
  }
}
