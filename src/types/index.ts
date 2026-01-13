import * as THREE from 'three'
import type { Component, ComponentType } from './components'

// Re-exportar tipos de componentes
export * from './components'

// ============================================
// Tipos base para vetores e transformações
// ============================================

export interface Vector3Data {
  x: number
  y: number
  z: number
}

export interface TransformData {
  position: Vector3Data
  rotation: Vector3Data
  scale: Vector3Data
}

// ============================================
// Tags para categorização de entidades
// ============================================

export type EntityTag =
  | 'static'
  | 'dynamic'
  | 'interactive'
  | 'destructible'
  | 'enemy'
  | 'friendly'
  | 'neutral'
  | 'player'
  | 'npc'
  | 'item'
  | 'trigger'
  | 'environment'
  | string // permite tags customizadas

// ============================================
// Tipos para o sistema de entidades
// ============================================

export interface EntityData {
  id: string
  name: string
  type: string
  prefabId: string // referência ao asset/prefab original
  tags: EntityTag[]
  layer: string
  visible: boolean
  enabled: boolean
  transform: TransformData
  components: Component[]
  children: string[] // IDs de entidades filhas
  parent: string | null // ID da entidade pai
  metadata: Record<string, unknown> // dados extras
}

// ============================================
// Tipos para objetos do mapa
// ============================================

export interface MapObjectData extends EntityData {
  assetId: string
}

// ============================================
// Tipos para o sistema de assets
// ============================================

export type AssetType = 'tree' | 'rock' | 'building' | 'prop' | 'npc' | 'item' | 'effect' | 'sound' | 'prefab'

export interface AssetDefinition {
  id: string
  name: string
  path: string
  type: AssetType
  category: string
  thumbnail?: string
  // Componentes padrão que este asset adiciona automaticamente
  defaultComponents?: ComponentType[]
  // Metadados do asset
  metadata?: {
    author?: string
    version?: string
    tags?: string[]
    description?: string
  }
}

// ============================================
// Tipos para o mapa
// ============================================

export interface MapSettings {
  skybox: string
  ambientLight: { color: string; intensity: number }
  fog: { enabled: boolean; color: string; near: number; far: number }
  gravity: number
  timeOfDay: number // 0-24
  weather: string
}

export interface MapData {
  id: string
  name: string
  version: string
  description: string
  author: string
  createdAt: string
  updatedAt: string
  settings: MapSettings
  objects: MapObjectData[]
  // Conexões entre objetos (para waypoints, etc)
  connections: Array<{ from: string; to: string; type: string }>
}

// ============================================
// Tipos para modos do jogo
// ============================================

export type GameMode = 'play' | 'editor'

// ============================================
// Tipos para o editor
// ============================================

export type EditorTool =
  | 'select'
  | 'translate'
  | 'rotate'
  | 'scale'
  | 'place'
  | 'paint'
  | 'erase'

export type EditorPanel =
  | 'hierarchy'
  | 'inspector'
  | 'assets'
  | 'components'
  | 'settings'

export interface EditorState {
  selectedObjectIds: string[]
  activeTool: EditorTool
  activePanel: EditorPanel
  gridVisible: boolean
  gridSnap: boolean
  gridSize: number
  clipboardObjects: MapObjectData[]
}

// ============================================
// Tipos para eventos do engine
// ============================================

export interface EngineEvents {
  onModeChange: (mode: GameMode) => void
  onObjectSelected: (object: THREE.Object3D | null) => void
  onMapUpdated: (data: MapData) => void
  onComponentAdded: (objectId: string, component: Component) => void
  onComponentRemoved: (objectId: string, componentId: string) => void
  onComponentUpdated: (objectId: string, component: Component) => void
}

// ============================================
// Tipos para o sistema de input
// ============================================

export interface InputState {
  forward: boolean
  backward: boolean
  left: boolean
  right: boolean
  mouseDown: boolean
  mousePosition: { x: number; y: number }
}

// ============================================
// Interface para sistemas do engine
// ============================================

export interface GameSystem {
  init(domElement?: HTMLElement): void
  update(deltaTime: number): void
  destroy(): void
}

// ============================================
// Funções helper para criar dados padrão
// ============================================

export function createDefaultTransform(): TransformData {
  return {
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
  }
}

export function createDefaultMapSettings(): MapSettings {
  return {
    skybox: 'default',
    ambientLight: { color: '#ffffff', intensity: 0.5 },
    fog: { enabled: false, color: '#cccccc', near: 10, far: 100 },
    gravity: 9.8,
    timeOfDay: 12,
    weather: 'clear',
  }
}

export function createEmptyEntity(id: string, name: string): EntityData {
  return {
    id,
    name,
    type: 'entity',
    prefabId: '',
    tags: [],
    layer: 'default',
    visible: true,
    enabled: true,
    transform: createDefaultTransform(),
    components: [],
    children: [],
    parent: null,
    metadata: {},
  }
}

export function createEmptyMapData(): MapData {
  return {
    id: `map_${Date.now()}`,
    name: 'Novo Mapa',
    version: '1.0.0',
    description: '',
    author: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    settings: createDefaultMapSettings(),
    objects: [],
    connections: [],
  }
}
