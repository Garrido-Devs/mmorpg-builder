import * as THREE from 'three'
import type { ColliderComponent, Component } from '../types'

interface ColliderData {
  object: THREE.Object3D
  component: ColliderComponent
  boundingBox: THREE.Box3
}

interface DynamicCollider {
  id: string
  position: THREE.Vector3
  radius: number
}

/**
 * CollisionSystem - Sistema de colisão em runtime
 *
 * Responsável por:
 * - Detectar colisões entre o player e objetos com collider
 * - Impedir o player de atravessar objetos sólidos
 * - Detectar triggers
 */
export class CollisionSystem {
  private scene: THREE.Scene
  private colliders: ColliderData[] = []
  private dynamicColliders: Map<string, DynamicCollider> = new Map()
  private playerBox: THREE.Box3 = new THREE.Box3()
  private playerSize = new THREE.Vector3(0.8, 1.8, 0.8) // Tamanho do player
  private playerRadius = 0.4 // Raio do player para colisão esférica

  // Callbacks para triggers
  private onTriggerEnterCallbacks: Set<(collider: ColliderData) => void> = new Set()
  private onTriggerExitCallbacks: Set<(collider: ColliderData) => void> = new Set()

  // Triggers ativos (player está dentro)
  private activeTriggers: Set<string> = new Set()

  constructor(scene: THREE.Scene) {
    this.scene = scene
  }

  /**
   * Adiciona um collider dinâmico (ex: colaboradores)
   */
  public addDynamicCollider(id: string, position: THREE.Vector3, radius = 0.5): void {
    this.dynamicColliders.set(id, { id, position: position.clone(), radius })
  }

  /**
   * Atualiza posição de um collider dinâmico
   */
  public updateDynamicCollider(id: string, position: THREE.Vector3): void {
    const collider = this.dynamicColliders.get(id)
    if (collider) {
      collider.position.copy(position)
    }
  }

  /**
   * Remove um collider dinâmico
   */
  public removeDynamicCollider(id: string): void {
    this.dynamicColliders.delete(id)
  }

  /**
   * Atualiza a lista de colliders da cena
   */
  public updateColliders(): void {
    this.colliders = []

    this.scene.traverse((object) => {
      const components = object.userData.components as Component[] | undefined
      if (!components) return

      const collider = components.find(
        c => c.type === 'collider' && c.enabled
      ) as ColliderComponent | undefined

      if (!collider) return

      // Calcula bounding box
      const boundingBox = this.calculateBoundingBox(object, collider)

      this.colliders.push({
        object,
        component: collider,
        boundingBox,
      })
    })
  }

  /**
   * Calcula o bounding box do collider
   */
  private calculateBoundingBox(object: THREE.Object3D, collider: ColliderComponent): THREE.Box3 {
    const size = collider.size || { x: 1, y: 1, z: 1 }
    const offset = collider.offset || { x: 0, y: 0, z: 0 }

    const center = new THREE.Vector3(
      object.position.x + offset.x,
      object.position.y + offset.y + size.y / 2, // Centro do box
      object.position.z + offset.z
    )

    const halfSize = new THREE.Vector3(size.x / 2, size.y / 2, size.z / 2)

    return new THREE.Box3(
      center.clone().sub(halfSize),
      center.clone().add(halfSize)
    )
  }

  /**
   * Verifica colisão e retorna posição corrigida
   */
  public resolveCollision(
    currentPosition: THREE.Vector3,
    desiredPosition: THREE.Vector3
  ): THREE.Vector3 {
    // Atualiza bounding box do player na posição desejada
    this.updatePlayerBox(desiredPosition)

    let finalPosition = desiredPosition.clone()

    // Verifica colisão com colliders estáticos
    for (const collider of this.colliders) {
      // Atualiza bounding box do collider (pode ter se movido)
      collider.boundingBox = this.calculateBoundingBox(collider.object, collider.component)

      const entityId = collider.object.userData.entityId as string

      // Verifica se há interseção
      if (this.playerBox.intersectsBox(collider.boundingBox)) {
        if (collider.component.isTrigger) {
          // É um trigger - não bloqueia, mas notifica
          if (!this.activeTriggers.has(entityId)) {
            this.activeTriggers.add(entityId)
            this.notifyTriggerEnter(collider)
          }
        } else {
          // É um collider sólido - resolve a colisão
          finalPosition = this.pushOutOfCollider(currentPosition, finalPosition, collider.boundingBox)
        }
      } else {
        // Player saiu do trigger
        if (this.activeTriggers.has(entityId)) {
          this.activeTriggers.delete(entityId)
          this.notifyTriggerExit(collider)
        }
      }
    }

    // Verifica colisão com colliders dinâmicos (colaboradores)
    for (const [, dynCollider] of this.dynamicColliders) {
      const distance = new THREE.Vector2(
        finalPosition.x - dynCollider.position.x,
        finalPosition.z - dynCollider.position.z
      ).length()

      const minDistance = this.playerRadius + dynCollider.radius

      if (distance < minDistance && distance > 0) {
        // Empurra o player para fora
        const pushDir = new THREE.Vector2(
          finalPosition.x - dynCollider.position.x,
          finalPosition.z - dynCollider.position.z
        ).normalize()

        const pushAmount = minDistance - distance

        finalPosition.x += pushDir.x * pushAmount
        finalPosition.z += pushDir.y * pushAmount
      }
    }

    return finalPosition
  }

  /**
   * Atualiza o bounding box do player
   */
  private updatePlayerBox(position: THREE.Vector3): void {
    const halfSize = this.playerSize.clone().multiplyScalar(0.5)

    this.playerBox.min.set(
      position.x - halfSize.x,
      position.y,
      position.z - halfSize.z
    )
    this.playerBox.max.set(
      position.x + halfSize.x,
      position.y + this.playerSize.y,
      position.z + halfSize.z
    )
  }

  /**
   * Empurra o player para fora do collider
   */
  private pushOutOfCollider(
    currentPosition: THREE.Vector3,
    desiredPosition: THREE.Vector3,
    colliderBox: THREE.Box3
  ): THREE.Vector3 {
    const result = desiredPosition.clone()

    // Calcula overlap em cada eixo
    const playerMin = this.playerBox.min
    const playerMax = this.playerBox.max
    const colliderMin = colliderBox.min
    const colliderMax = colliderBox.max

    // Overlap em X
    const overlapX = Math.min(playerMax.x - colliderMin.x, colliderMax.x - playerMin.x)
    // Overlap em Z
    const overlapZ = Math.min(playerMax.z - colliderMin.z, colliderMax.z - playerMin.z)

    // Determina qual eixo resolver (o menor overlap)
    if (overlapX < overlapZ) {
      // Resolver em X
      if (currentPosition.x < colliderBox.getCenter(new THREE.Vector3()).x) {
        result.x = colliderMin.x - this.playerSize.x / 2 - 0.01
      } else {
        result.x = colliderMax.x + this.playerSize.x / 2 + 0.01
      }
    } else {
      // Resolver em Z
      if (currentPosition.z < colliderBox.getCenter(new THREE.Vector3()).z) {
        result.z = colliderMin.z - this.playerSize.z / 2 - 0.01
      } else {
        result.z = colliderMax.z + this.playerSize.z / 2 + 0.01
      }
    }

    return result
  }

  /**
   * Verifica se uma posição colide com algo
   */
  public checkCollision(position: THREE.Vector3): boolean {
    this.updatePlayerBox(position)

    for (const collider of this.colliders) {
      if (!collider.component.isTrigger && this.playerBox.intersectsBox(collider.boundingBox)) {
        return true
      }
    }

    return false
  }

  // ============================================
  // Sistema de eventos
  // ============================================

  public onTriggerEnter(callback: (collider: ColliderData) => void): () => void {
    this.onTriggerEnterCallbacks.add(callback)
    return () => this.onTriggerEnterCallbacks.delete(callback)
  }

  public onTriggerExit(callback: (collider: ColliderData) => void): () => void {
    this.onTriggerExitCallbacks.add(callback)
    return () => this.onTriggerExitCallbacks.delete(callback)
  }

  private notifyTriggerEnter(collider: ColliderData): void {
    console.log('Trigger Enter:', collider.object.userData.entityName || collider.object.userData.entityId)
    this.onTriggerEnterCallbacks.forEach(cb => cb(collider))
  }

  private notifyTriggerExit(collider: ColliderData): void {
    console.log('Trigger Exit:', collider.object.userData.entityName || collider.object.userData.entityId)
    this.onTriggerExitCallbacks.forEach(cb => cb(collider))
  }
}
