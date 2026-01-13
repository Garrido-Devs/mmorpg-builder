import * as THREE from 'three'

/**
 * GameScene - Gerencia a cena Three.js principal
 *
 * Responsabilidades:
 * - Criar e configurar a cena base
 * - Gerenciar iluminação
 * - Criar o ground plane
 * - Fornecer helpers visuais para o editor
 */
export class GameScene {
  public scene: THREE.Scene
  public ground: THREE.Mesh
  private gridHelper: THREE.GridHelper | null = null

  constructor() {
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x87ceeb) // Céu azul claro

    this.setupLighting()
    this.ground = this.createGround()
  }

  /**
   * Configura iluminação ambiente e direcional
   */
  private setupLighting(): void {
    // Luz ambiente para iluminação base
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    this.scene.add(ambientLight)

    // Luz direcional simulando o sol
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(10, 20, 10)
    directionalLight.castShadow = true

    // Configuração de sombras
    directionalLight.shadow.mapSize.width = 2048
    directionalLight.shadow.mapSize.height = 2048
    directionalLight.shadow.camera.near = 0.5
    directionalLight.shadow.camera.far = 100
    directionalLight.shadow.camera.left = -50
    directionalLight.shadow.camera.right = 50
    directionalLight.shadow.camera.top = 50
    directionalLight.shadow.camera.bottom = -50

    this.scene.add(directionalLight)
  }

  /**
   * Cria o plano do chão
   */
  private createGround(): THREE.Mesh {
    const geometry = new THREE.PlaneGeometry(100, 100)
    const material = new THREE.MeshStandardMaterial({
      color: 0x3a7d44,
      roughness: 0.8,
    })

    const ground = new THREE.Mesh(geometry, material)
    ground.rotation.x = -Math.PI / 2 // Rotaciona para ficar horizontal
    ground.receiveShadow = true
    ground.name = 'ground'

    this.scene.add(ground)
    return ground
  }

  /**
   * Mostra/esconde o grid helper (útil no modo editor)
   */
  public toggleGrid(show: boolean): void {
    if (show && !this.gridHelper) {
      this.gridHelper = new THREE.GridHelper(100, 100, 0x444444, 0x888888)
      this.gridHelper.position.y = 0.01 // Ligeiramente acima do ground
      this.scene.add(this.gridHelper)
    } else if (!show && this.gridHelper) {
      this.scene.remove(this.gridHelper)
      this.gridHelper = null
    }
  }

  /**
   * Adiciona um objeto à cena
   */
  public add(object: THREE.Object3D): void {
    this.scene.add(object)
  }

  /**
   * Remove um objeto da cena
   */
  public remove(object: THREE.Object3D): void {
    this.scene.remove(object)
  }

  /**
   * Retorna todos os objetos interativos (exceto ground e helpers)
   */
  public getInteractiveObjects(): THREE.Object3D[] {
    return this.scene.children.filter(
      obj => obj.name !== 'ground' && !(obj instanceof THREE.GridHelper)
    )
  }
}
