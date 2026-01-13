import * as THREE from 'three'
import type { InteractableComponent, Component } from '../types'

interface InteractableObject {
  object: THREE.Object3D
  component: InteractableComponent
  distance: number
}

/**
 * InteractionSystem - Sistema de interação em runtime
 *
 * Responsável por:
 * - Detectar objetos interativos próximos ao player
 * - Mostrar UI de interação (tooltip)
 * - Executar ações ao interagir
 */
export class InteractionSystem {
  private scene: THREE.Scene
  private playerPosition: THREE.Vector3 = new THREE.Vector3()
  private nearbyInteractables: InteractableObject[] = []
  private currentTarget: InteractableObject | null = null
  private interactionKey = 'KeyE'
  private isKeyPressed = false

  // Callbacks para UI
  private onTargetChangeCallbacks: Set<(target: InteractableObject | null) => void> = new Set()
  private onInteractCallbacks: Set<(target: InteractableObject) => void> = new Set()

  constructor(scene: THREE.Scene) {
    this.scene = scene
  }

  public init(): void {
    window.addEventListener('keydown', this.handleKeyDown)
    window.addEventListener('keyup', this.handleKeyUp)
  }

  public destroy(): void {
    window.removeEventListener('keydown', this.handleKeyDown)
    window.removeEventListener('keyup', this.handleKeyUp)
  }

  /**
   * Atualiza o sistema a cada frame
   */
  public update(playerPosition: THREE.Vector3): void {
    this.playerPosition.copy(playerPosition)
    this.findNearbyInteractables()
    this.updateCurrentTarget()
  }

  /**
   * Encontra todos os objetos interativos próximos
   */
  private findNearbyInteractables(): void {
    this.nearbyInteractables = []

    this.scene.traverse((object) => {
      const components = object.userData.components as Component[] | undefined
      if (!components) return

      const interactable = components.find(
        c => c.type === 'interactable' && c.enabled
      ) as InteractableComponent | undefined

      if (!interactable) return

      const distance = this.playerPosition.distanceTo(object.position)

      // Verifica se está dentro do alcance
      if (distance <= interactable.interactionRange) {
        this.nearbyInteractables.push({
          object,
          component: interactable,
          distance,
        })
      }
    })

    // Ordena por distância
    this.nearbyInteractables.sort((a, b) => a.distance - b.distance)
  }

  /**
   * Atualiza o alvo atual de interação
   */
  private updateCurrentTarget(): void {
    const newTarget = this.nearbyInteractables[0] || null

    // Verifica se mudou o alvo
    const changed =
      (!newTarget && this.currentTarget) ||
      (newTarget && !this.currentTarget) ||
      (newTarget && this.currentTarget && newTarget.object !== this.currentTarget.object)

    if (changed) {
      this.currentTarget = newTarget
      this.notifyTargetChange(newTarget)
    }
  }

  /**
   * Trata tecla pressionada
   */
  private handleKeyDown = (event: KeyboardEvent): void => {
    if (event.code === this.interactionKey && !this.isKeyPressed) {
      this.isKeyPressed = true
      this.tryInteract()
    }
  }

  /**
   * Trata tecla solta
   */
  private handleKeyUp = (event: KeyboardEvent): void => {
    if (event.code === this.interactionKey) {
      this.isKeyPressed = false
    }
  }

  /**
   * Tenta interagir com o alvo atual
   */
  private tryInteract(): void {
    if (!this.currentTarget) return

    const { component } = this.currentTarget

    // Verifica tipo de interação
    if (component.interactionType === 'key_press' || component.interactionType === 'proximity') {
      this.executeInteraction(this.currentTarget)
    }
  }

  /**
   * Executa a interação
   */
  private executeInteraction(target: InteractableObject): void {
    console.log('Interagindo com:', target.object.userData.entityName || target.object.name)

    // Notifica listeners
    this.onInteractCallbacks.forEach(cb => cb(target))

    // Executa script se definido
    if (target.component.onInteract) {
      this.executeScript(target.component.onInteract, target)
    }

    // Feedback visual - destaca o objeto brevemente
    this.flashObject(target.object)
  }

  /**
   * Executa um script (placeholder para sistema de scripts)
   */
  private executeScript(scriptId: string, target: InteractableObject): void {
    console.log('Executando script:', scriptId, 'no objeto:', target.object.userData.entityId)

    // TODO: Implementar sistema de scripts real
    // Por enquanto, scripts predefinidos
    switch (scriptId) {
      case 'on_interact_dialog':
        alert(`${target.object.userData.entityName || 'Objeto'} diz: Olá, aventureiro!`)
        break
      case 'on_interact_shop':
        alert('Loja aberta! (UI de loja seria aberta aqui)')
        break
      default:
        console.log('Script não implementado:', scriptId)
    }
  }

  /**
   * Efeito visual de flash ao interagir
   */
  private flashObject(object: THREE.Object3D): void {
    object.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const originalColor = (child.material as THREE.MeshStandardMaterial).emissive?.clone()
        const mat = child.material as THREE.MeshStandardMaterial

        if (mat.emissive) {
          mat.emissive.setHex(0x444444)

          setTimeout(() => {
            if (originalColor) {
              mat.emissive.copy(originalColor)
            } else {
              mat.emissive.setHex(0x000000)
            }
          }, 150)
        }
      }
    })
  }

  /**
   * Retorna o alvo atual
   */
  public getCurrentTarget(): InteractableObject | null {
    return this.currentTarget
  }

  /**
   * Retorna informações para UI
   */
  public getInteractionPrompt(): { show: boolean; text: string; key: string } | null {
    if (!this.currentTarget) return null

    return {
      show: true,
      text: this.currentTarget.component.tooltip || 'Interagir',
      key: this.currentTarget.component.interactionKey || 'E',
    }
  }

  // ============================================
  // Sistema de eventos
  // ============================================

  public onTargetChange(callback: (target: InteractableObject | null) => void): () => void {
    this.onTargetChangeCallbacks.add(callback)
    return () => this.onTargetChangeCallbacks.delete(callback)
  }

  public onInteract(callback: (target: InteractableObject) => void): () => void {
    this.onInteractCallbacks.add(callback)
    return () => this.onInteractCallbacks.delete(callback)
  }

  private notifyTargetChange(target: InteractableObject | null): void {
    this.onTargetChangeCallbacks.forEach(cb => cb(target))
  }
}
