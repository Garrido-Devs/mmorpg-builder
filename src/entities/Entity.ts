import * as THREE from 'three'
import type { EntityData, Vector3Data, TransformData } from '../types'

/**
 * Entity - Classe base para todas as entidades do jogo
 *
 * Responsabilidades:
 * - Gerenciar mesh Three.js associado
 * - Fornecer métodos comuns de transformação
 * - Serialização/deserialização de dados
 */
export abstract class Entity {
  public id: string
  public mesh: THREE.Object3D
  protected type: string

  constructor(id: string, type: string) {
    this.id = id
    this.type = type
    this.mesh = new THREE.Object3D()
  }

  /**
   * Define a posição da entidade
   */
  public setPosition(position: THREE.Vector3 | Vector3Data): void {
    if (position instanceof THREE.Vector3) {
      this.mesh.position.copy(position)
    } else {
      this.mesh.position.set(position.x, position.y, position.z)
    }
  }

  /**
   * Retorna a posição atual
   */
  public getPosition(): THREE.Vector3 {
    return this.mesh.position.clone()
  }

  /**
   * Define a rotação (em radianos)
   */
  public setRotation(rotation: Vector3Data): void {
    this.mesh.rotation.set(rotation.x, rotation.y, rotation.z)
  }

  /**
   * Retorna a rotação atual
   */
  public getRotation(): THREE.Euler {
    return this.mesh.rotation.clone()
  }

  /**
   * Define a escala
   */
  public setScale(scale: Vector3Data | number): void {
    if (typeof scale === 'number') {
      this.mesh.scale.setScalar(scale)
    } else {
      this.mesh.scale.set(scale.x, scale.y, scale.z)
    }
  }

  /**
   * Retorna a escala atual
   */
  public getScale(): THREE.Vector3 {
    return this.mesh.scale.clone()
  }

  /**
   * Converte Vector3 do Three.js para dados serializáveis
   */
  protected vector3ToData(v: THREE.Vector3 | THREE.Euler): Vector3Data {
    return { x: v.x, y: v.y, z: v.z }
  }

  /**
   * Retorna os dados de transformação para serialização
   */
  public getTransformData(): TransformData {
    return {
      position: this.vector3ToData(this.mesh.position),
      rotation: this.vector3ToData(this.mesh.rotation),
      scale: this.vector3ToData(this.mesh.scale),
    }
  }

  /**
   * Serializa a entidade para dados puros
   */
  public abstract serialize(): EntityData

  /**
   * Update chamado a cada frame (opcional)
   */
  public update(_deltaTime: number): void {
    // Implementar nas subclasses se necessário
  }
}
