import * as THREE from 'three'
import type { Component, ColliderComponent, LightComponent } from '../types'

/**
 * ComponentSystem - Processa e aplica comportamentos dos componentes
 *
 * Responsável por:
 * - Criar visualizações de colliders no editor
 * - Criar luzes baseadas no componente Light
 * - Sincronizar dados de componentes com objetos 3D
 */
export class ComponentSystem {
  private colliderHelpers: Map<string, THREE.Object3D> = new Map()
  private lights: Map<string, THREE.Light> = new Map()
  private scene: THREE.Scene

  constructor(scene: THREE.Scene) {
    this.scene = scene
  }

  /**
   * Processa todos os componentes de um objeto
   */
  public processComponents(object: THREE.Object3D): void {
    const components = object.userData.components as Component[] | undefined
    if (!components) return

    const entityId = object.userData.entityId as string

    components.forEach(component => {
      if (!component.enabled) return

      switch (component.type) {
        case 'collider':
          this.processCollider(entityId, object, component as ColliderComponent)
          break
        case 'light':
          this.processLight(entityId, object, component as LightComponent)
          break
      }
    })
  }

  /**
   * Atualiza um componente específico
   */
  public updateComponent(object: THREE.Object3D, component: Component): void {
    const entityId = object.userData.entityId as string

    switch (component.type) {
      case 'collider':
        this.processCollider(entityId, object, component as ColliderComponent)
        break
      case 'light':
        this.processLight(entityId, object, component as LightComponent)
        break
    }
  }

  /**
   * Remove visualizações de um objeto
   */
  public removeObject(entityId: string): void {
    // Remove collider helper
    const colliderHelper = this.colliderHelpers.get(entityId)
    if (colliderHelper) {
      this.scene.remove(colliderHelper)
      this.colliderHelpers.delete(entityId)
    }

    // Remove light
    const light = this.lights.get(entityId)
    if (light) {
      this.scene.remove(light)
      this.lights.delete(entityId)
    }
  }

  /**
   * Processa componente Collider - cria visualização
   */
  private processCollider(entityId: string, object: THREE.Object3D, collider: ColliderComponent): void {
    // Remove helper existente
    const existingHelper = this.colliderHelpers.get(entityId)
    if (existingHelper) {
      this.scene.remove(existingHelper)
    }

    if (!collider.enabled) {
      this.colliderHelpers.delete(entityId)
      return
    }

    // Cria geometria baseada na forma
    let geometry: THREE.BufferGeometry

    const size = collider.size || { x: 1, y: 1, z: 1 }
    const offset = collider.offset || { x: 0, y: 0, z: 0 }

    switch (collider.shape) {
      case 'box':
        geometry = new THREE.BoxGeometry(size.x, size.y, size.z)
        break
      case 'sphere':
        geometry = new THREE.SphereGeometry(Math.max(size.x, size.y, size.z) / 2, 16, 12)
        break
      case 'capsule':
        geometry = new THREE.CapsuleGeometry(size.x / 2, size.y, 8, 8)
        break
      case 'mesh':
        // Para mesh, usa o bounding box do objeto
        const box = new THREE.Box3().setFromObject(object)
        const boxSize = box.getSize(new THREE.Vector3())
        geometry = new THREE.BoxGeometry(boxSize.x, boxSize.y, boxSize.z)
        break
      default:
        geometry = new THREE.BoxGeometry(1, 1, 1)
    }

    // Material wireframe verde para visualização
    const material = new THREE.MeshBasicMaterial({
      color: collider.isTrigger ? 0x00ffff : 0x00ff00,
      wireframe: true,
      transparent: true,
      opacity: 0.5,
    })

    const helper = new THREE.Mesh(geometry, material)
    helper.position.copy(object.position)
    helper.position.x += offset.x
    helper.position.y += offset.y
    helper.position.z += offset.z
    helper.rotation.copy(object.rotation)
    helper.userData.isColliderHelper = true
    helper.userData.parentEntityId = entityId

    this.scene.add(helper)
    this.colliderHelpers.set(entityId, helper)
  }

  /**
   * Processa componente Light - cria luz real
   */
  private processLight(entityId: string, object: THREE.Object3D, lightComponent: LightComponent): void {
    // Remove luz existente
    const existingLight = this.lights.get(entityId)
    if (existingLight) {
      this.scene.remove(existingLight)
    }

    if (!lightComponent.enabled) {
      this.lights.delete(entityId)
      return
    }

    let light: THREE.Light

    const color = new THREE.Color(lightComponent.color || '#ffffff')
    const intensity = lightComponent.intensity ?? 1

    switch (lightComponent.lightType) {
      case 'point':
        const pointLight = new THREE.PointLight(color, intensity, lightComponent.range || 10)
        pointLight.castShadow = lightComponent.castShadows ?? false
        light = pointLight
        break

      case 'spot':
        const spotLight = new THREE.SpotLight(
          color,
          intensity,
          lightComponent.range || 10,
          (lightComponent.spotAngle || 45) * Math.PI / 180
        )
        spotLight.castShadow = lightComponent.castShadows ?? false
        light = spotLight
        break

      case 'directional':
        const dirLight = new THREE.DirectionalLight(color, intensity)
        dirLight.castShadow = lightComponent.castShadows ?? false
        light = dirLight
        break

      case 'ambient':
        light = new THREE.AmbientLight(color, intensity)
        break

      default:
        light = new THREE.PointLight(color, intensity, 10)
    }

    // Posiciona a luz no objeto
    light.position.copy(object.position)
    light.userData.isComponentLight = true
    light.userData.parentEntityId = entityId

    this.scene.add(light)
    this.lights.set(entityId, light)
  }

  /**
   * Atualiza posições dos helpers quando objetos se movem
   */
  public syncHelpers(): void {
    this.colliderHelpers.forEach((helper, entityId) => {
      // Encontra o objeto pai
      const parent = this.findObjectByEntityId(entityId)
      if (parent) {
        const collider = this.getColliderComponent(parent)
        const offset = collider?.offset || { x: 0, y: 0, z: 0 }

        helper.position.copy(parent.position)
        helper.position.x += offset.x
        helper.position.y += offset.y
        helper.position.z += offset.z
        helper.rotation.copy(parent.rotation)
      }
    })

    this.lights.forEach((light, entityId) => {
      const parent = this.findObjectByEntityId(entityId)
      if (parent) {
        light.position.copy(parent.position)
      }
    })
  }

  private findObjectByEntityId(entityId: string): THREE.Object3D | null {
    let found: THREE.Object3D | null = null
    this.scene.traverse(obj => {
      if (obj.userData.entityId === entityId) {
        found = obj
      }
    })
    return found
  }

  private getColliderComponent(object: THREE.Object3D): ColliderComponent | null {
    const components = object.userData.components as Component[] | undefined
    return components?.find(c => c.type === 'collider') as ColliderComponent | null
  }

  /**
   * Mostra/esconde helpers de collider
   */
  public setCollidersVisible(visible: boolean): void {
    this.colliderHelpers.forEach(helper => {
      helper.visible = visible
    })
  }

  /**
   * Limpa todos os recursos
   */
  public destroy(): void {
    this.colliderHelpers.forEach(helper => {
      this.scene.remove(helper)
    })
    this.colliderHelpers.clear()

    this.lights.forEach(light => {
      this.scene.remove(light)
    })
    this.lights.clear()
  }
}
