import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

/**
 * ThumbnailRenderer - Gera thumbnails 3D de modelos
 *
 * Usa um renderer offscreen para criar imagens de preview dos assets
 */
class ThumbnailRenderer {
  private renderer: THREE.WebGLRenderer | null = null
  private scene: THREE.Scene
  private camera: THREE.PerspectiveCamera
  private loader: GLTFLoader
  private cache: Map<string, string> = new Map()
  private size = 256

  constructor() {
    // Cena para renderização
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x2a2a3a)

    // Câmera
    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
    this.camera.position.set(2, 1.5, 2)
    this.camera.lookAt(0, 0.5, 0)

    // Luzes
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    this.scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(5, 5, 5)
    this.scene.add(directionalLight)

    // Loader
    this.loader = new GLTFLoader()
  }

  /**
   * Inicializa o renderer (deve ser chamado após o DOM estar pronto)
   */
  private initRenderer(): void {
    if (this.renderer) return

    const canvas = document.createElement('canvas')
    canvas.width = this.size
    canvas.height = this.size

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      preserveDrawingBuffer: true,
    })
    this.renderer.setSize(this.size, this.size)
    this.renderer.setPixelRatio(1)
  }

  /**
   * Gera thumbnail de um modelo
   */
  public async generateThumbnail(modelPath: string): Promise<string> {
    // Verificar cache
    if (this.cache.has(modelPath)) {
      return this.cache.get(modelPath)!
    }

    // Se não tem path, retorna placeholder
    if (!modelPath) {
      return this.createPlaceholderThumbnail()
    }

    this.initRenderer()
    if (!this.renderer) {
      return this.createPlaceholderThumbnail()
    }

    try {
      // Carregar modelo
      const gltf = await this.loader.loadAsync(modelPath)
      const model = gltf.scene.clone()

      // Limpar cena
      this.clearScene()

      // Calcular bounding box e centralizar
      const box = new THREE.Box3().setFromObject(model)
      const center = box.getCenter(new THREE.Vector3())
      const size = box.getSize(new THREE.Vector3())

      model.position.sub(center)
      model.position.y += size.y / 2

      // Ajustar câmera baseado no tamanho
      const maxDim = Math.max(size.x, size.y, size.z)
      const distance = maxDim * 2
      this.camera.position.set(distance, distance * 0.75, distance)
      this.camera.lookAt(0, size.y * 0.3, 0)

      // Adicionar à cena
      this.scene.add(model)

      // Renderizar
      this.renderer.render(this.scene, this.camera)

      // Obter imagem
      const dataUrl = this.renderer.domElement.toDataURL('image/png')

      // Cachear
      this.cache.set(modelPath, dataUrl)

      // Limpar
      this.clearScene()

      return dataUrl
    } catch (error) {
      console.warn(`Falha ao gerar thumbnail: ${modelPath}`, error)
      return this.createPlaceholderThumbnail()
    }
  }

  /**
   * Limpa a cena
   */
  private clearScene(): void {
    while (this.scene.children.length > 2) { // Mantém as luzes
      const obj = this.scene.children[this.scene.children.length - 1]
      if (obj instanceof THREE.Light) break
      this.scene.remove(obj)
    }
  }

  /**
   * Cria thumbnail placeholder
   */
  private createPlaceholderThumbnail(): string {
    const canvas = document.createElement('canvas')
    canvas.width = this.size
    canvas.height = this.size
    const ctx = canvas.getContext('2d')!

    // Background
    ctx.fillStyle = '#2a2a3a'
    ctx.fillRect(0, 0, this.size, this.size)

    // Ícone
    ctx.fillStyle = '#666'
    ctx.font = '48px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('📦', this.size / 2, this.size / 2)

    return canvas.toDataURL('image/png')
  }

  /**
   * Pré-carrega thumbnails de uma lista de paths
   */
  public async preloadThumbnails(paths: string[]): Promise<void> {
    const uniquePaths = [...new Set(paths.filter(p => p && !this.cache.has(p)))]

    for (const path of uniquePaths) {
      await this.generateThumbnail(path)
    }
  }

  /**
   * Obtém thumbnail do cache (síncrono)
   */
  public getCachedThumbnail(modelPath: string): string | null {
    return this.cache.get(modelPath) || null
  }

  /**
   * Limpa o cache
   */
  public clearCache(): void {
    this.cache.clear()
  }
}

// Singleton
export const thumbnailRenderer = new ThumbnailRenderer()
