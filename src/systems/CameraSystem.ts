import * as THREE from 'three'
import type { GameSystem } from '../types'
import type { Player } from '../entities/Player'

/**
 * CameraSystem - Gerencia a câmera do jogo
 *
 * Responsabilidades:
 * - Seguir o player em terceira pessoa
 * - Interpolar suavemente a posição
 * - Permitir modo livre para o editor
 *
 * Decisão: Câmera com offset fixo e lerp para suavidade
 * Pode ser expandido com orbital controls depois
 */
export class CameraSystem implements GameSystem {
  private camera: THREE.PerspectiveCamera
  private target: Player | null

  // Configuração da câmera terceira pessoa
  private offset = new THREE.Vector3(0, 8, 12) // Atrás e acima do player
  private lookAtOffset = new THREE.Vector3(0, 1, 0) // Olha um pouco acima do player

  // Suavização
  private smoothSpeed = 5
  private currentPosition = new THREE.Vector3()
  private desiredPosition = new THREE.Vector3()
  private lookAtPosition = new THREE.Vector3()

  constructor(camera: THREE.PerspectiveCamera, target: Player) {
    this.camera = camera
    this.target = target
  }

  public init(): void {
    // Posiciona câmera inicialmente
    if (this.target) {
      const targetPos = this.target.getPosition()
      this.currentPosition.copy(targetPos).add(this.offset)
      this.camera.position.copy(this.currentPosition)
      this.updateLookAt()
    }
  }

  public update(deltaTime: number): void {
    if (!this.target) {
      // Modo editor - câmera livre (pode ser controlada por OrbitControls)
      return
    }

    const targetPos = this.target.getPosition()

    // Calcula posição desejada (offset relativo ao player)
    this.desiredPosition.copy(targetPos).add(this.offset)

    // Interpola suavemente para a posição desejada
    this.currentPosition.lerp(this.desiredPosition, this.smoothSpeed * deltaTime)
    this.camera.position.copy(this.currentPosition)

    // Atualiza lookAt
    this.updateLookAt()
  }

  /**
   * Atualiza para onde a câmera está olhando
   */
  private updateLookAt(): void {
    if (!this.target) return

    const targetPos = this.target.getPosition()
    this.lookAtPosition.copy(targetPos).add(this.lookAtOffset)
    this.camera.lookAt(this.lookAtPosition)
  }

  public destroy(): void {
    // Nada para limpar
  }

  /**
   * Define o alvo da câmera (null para modo livre)
   */
  public setFollowTarget(target: Player | null): void {
    this.target = target
  }

  /**
   * Retorna a câmera
   */
  public getCamera(): THREE.PerspectiveCamera {
    return this.camera
  }

  /**
   * Define o offset da câmera
   */
  public setOffset(offset: THREE.Vector3): void {
    this.offset.copy(offset)
  }

  /**
   * Define a velocidade de suavização
   */
  public setSmoothSpeed(speed: number): void {
    this.smoothSpeed = speed
  }
}
