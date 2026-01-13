/**
 * Sistema de Componentes para MMORPG
 *
 * Arquitetura inspirada em Unity/Unreal Engine
 * Cada objeto pode ter múltiplos componentes que definem seu comportamento
 */

// ============================================
// Tipos base de componentes
// ============================================

export type ComponentType =
  | 'transform'
  | 'interactable'
  | 'shop'
  | 'door'
  | 'npc'
  | 'trigger'
  | 'spawner'
  | 'portal'
  | 'quest_giver'
  | 'loot_container'
  | 'waypoint'
  | 'audio_source'
  | 'particle_emitter'
  | 'light'
  | 'collider'
  | 'animator'
  | 'custom_script'
  // Novos componentes MMORPG
  | 'resource_node'
  | 'crafting_station'
  | 'bank'
  | 'skill'
  | 'equipment'
  | 'prayer_altar'
  | 'agility_obstacle'
  | 'farming_patch'

// ============================================
// Interface base para todos os componentes
// ============================================

export interface BaseComponent {
  id: string
  type: ComponentType
  enabled: boolean
}

// ============================================
// Componente: Interactable
// Define objetos com os quais o player pode interagir
// ============================================

export type InteractionType = 'click' | 'proximity' | 'key_press' | 'auto'

export interface InteractableComponent extends BaseComponent {
  type: 'interactable'
  interactionType: InteractionType
  interactionRange: number
  interactionKey: string // ex: 'E', 'F', 'Space'
  tooltip: string
  highlightOnHover: boolean
  cooldown: number // segundos entre interações
  // Eventos
  onInteract: string // ID do script ou ação
  onHoverEnter: string
  onHoverExit: string
}

// ============================================
// Componente: Shop (Loja)
// ============================================

export interface ShopItem {
  itemId: string
  price: number
  currency: string // 'gold', 'gems', 'tokens'
  stock: number // -1 = infinito
  requiredLevel: number
}

export interface ShopComponent extends BaseComponent {
  type: 'shop'
  shopId: string // ID único global da loja
  shopName: string
  shopType: 'buy' | 'sell' | 'both' | 'trade'
  items: ShopItem[]
  welcomeMessage: string
  buyMultiplier: number // multiplicador de preço de compra
  sellMultiplier: number // multiplicador de preço de venda
  requiredReputation: string // facção necessária
  requiredReputationLevel: number
}

// ============================================
// Componente: Door (Porta)
// ============================================

export type DoorState = 'open' | 'closed' | 'locked' | 'broken'

export interface DoorComponent extends BaseComponent {
  type: 'door'
  doorId: string
  initialState: DoorState
  keyItemId: string // item necessário para destrancar
  lockLevel: number // nível de lockpicking necessário
  autoClose: boolean
  autoCloseDelay: number
  // Animações
  openAnimation: string
  closeAnimation: string
  // Sons
  openSound: string
  closeSound: string
  lockedSound: string
  // Eventos
  onOpen: string
  onClose: string
  onLocked: string // quando tenta abrir trancada
}

// ============================================
// Componente: NPC
// ============================================

export type NPCBehavior = 'stationary' | 'patrol' | 'wander' | 'follow' | 'flee'
export type NPCAttitude = 'friendly' | 'neutral' | 'hostile'

export interface NPCComponent extends BaseComponent {
  type: 'npc'
  npcId: string // ID único global do NPC
  displayName: string
  title: string // ex: "Ferreiro", "Guardião"
  faction: string
  attitude: NPCAttitude
  behavior: NPCBehavior
  // Diálogo
  dialogueId: string // referência ao sistema de diálogos
  greetingMessage: string
  // Quests
  questsToGive: string[]
  questsToComplete: string[]
  // Combate (se hostil)
  level: number
  health: number
  damage: number
  // Patrulha
  patrolPoints: string[] // IDs de waypoints
  patrolRadius: number // raio de patrulha automática
  patrolSpeed: number
  patrolWaitTime: number
  // Respawn
  respawnTime: number
  // Eventos
  onSpawn: string
  onDeath: string
  onCombatStart: string
  onCombatEnd: string
}

// ============================================
// Componente: Trigger (Zona de gatilho)
// ============================================

export type TriggerShape = 'box' | 'sphere' | 'cylinder'

export interface TriggerComponent extends BaseComponent {
  type: 'trigger'
  triggerId: string
  shape: TriggerShape
  size: { x: number; y: number; z: number }
  triggerOnce: boolean // dispara apenas uma vez
  triggerCooldown: number
  // Filtros
  filterByTag: string[] // apenas entidades com estas tags
  filterByTeam: string[] // apenas players de certos times
  requiresQuest: string // quest necessária para ativar
  // Eventos
  onEnter: string
  onExit: string
  onStay: string // chamado enquanto dentro
}

// ============================================
// Componente: Spawner (Gerador de entidades)
// ============================================

export interface SpawnerComponent extends BaseComponent {
  type: 'spawner'
  spawnerId: string
  entityToSpawn: string // ID do prefab/asset
  spawnType: 'npc' | 'item' | 'enemy' | 'resource'
  maxCount: number
  spawnRadius: number
  respawnTime: number
  spawnOnStart: boolean
  // Condições
  requiredTimeOfDay: 'any' | 'day' | 'night' | 'dawn' | 'dusk'
  requiredWeather: string[]
  // Eventos
  onSpawn: string
  onAllDead: string
}

// ============================================
// Componente: Portal (Teleporte)
// ============================================

export interface PortalComponent extends BaseComponent {
  type: 'portal'
  portalId: string
  destinationMap: string // ID do mapa destino
  destinationPosition: { x: number; y: number; z: number }
  destinationRotation: number
  // Requisitos
  requiredLevel: number
  requiredQuest: string
  requiredItem: string // item consumido ao usar
  // Visual
  portalEffect: string
  teleportEffect: string
  // Eventos
  onTeleportStart: string
  onTeleportEnd: string
}

// ============================================
// Componente: Quest Giver
// ============================================

export interface QuestGiverComponent extends BaseComponent {
  type: 'quest_giver'
  questGiverId: string
  availableQuests: string[]
  // Indicadores visuais
  availableQuestIcon: string
  inProgressQuestIcon: string
  completableQuestIcon: string
  // Eventos
  onQuestAccept: string
  onQuestComplete: string
  onQuestDecline: string
}

// ============================================
// Componente: Loot Container (Baú, corpo, etc)
// ============================================

export interface LootItem {
  itemId: string
  quantity: number
  dropChance: number // 0-100
}

export interface LootContainerComponent extends BaseComponent {
  type: 'loot_container'
  containerId: string
  containerType: 'chest' | 'corpse' | 'barrel' | 'crate' | 'custom'
  lootTable: LootItem[]
  // Comportamento
  respawnLoot: boolean
  respawnTime: number
  destroyWhenEmpty: boolean
  // Requisitos
  requiredKey: string
  lockLevel: number
  // Animação
  openAnimation: string
  // Eventos
  onOpen: string
  onLoot: string
  onEmpty: string
}

// ============================================
// Componente: Waypoint
// ============================================

export interface WaypointComponent extends BaseComponent {
  type: 'waypoint'
  waypointId: string
  waypointName: string
  waypointGroup: string // grupo de waypoints conectados
  connectedWaypoints: string[] // IDs de waypoints vizinhos
  waitTime: number // tempo de espera neste ponto
  // Para NPCs
  actionAtWaypoint: string // ação a executar
}

// ============================================
// Componente: Audio Source
// ============================================

export interface AudioSourceComponent extends BaseComponent {
  type: 'audio_source'
  audioClip: string
  volume: number
  pitch: number
  loop: boolean
  playOnStart: boolean
  spatial: boolean // som 3D
  minDistance: number
  maxDistance: number
  // Eventos
  onPlay: string
  onStop: string
}

// ============================================
// Componente: Particle Emitter
// ============================================

export interface ParticleEmitterComponent extends BaseComponent {
  type: 'particle_emitter'
  particleEffect: string // ID do efeito
  playOnStart: boolean
  loop: boolean
  duration: number
  // Eventos
  onStart: string
  onEnd: string
}

// ============================================
// Componente: Light
// ============================================

export type LightType = 'point' | 'spot' | 'directional' | 'ambient'

export interface LightComponent extends BaseComponent {
  type: 'light'
  lightType: LightType
  color: string // hex
  intensity: number
  range: number
  castShadows: boolean
  // Para spotlight
  spotAngle: number
  // Animação
  flicker: boolean
  flickerSpeed: number
}

// ============================================
// Componente: Collider
// ============================================

export type ColliderShape = 'box' | 'sphere' | 'capsule' | 'mesh'

export interface ColliderComponent extends BaseComponent {
  type: 'collider'
  shape: ColliderShape
  isTrigger: boolean
  size: { x: number; y: number; z: number }
  offset: { x: number; y: number; z: number }
  layer: string // para filtrar colisões
}

// ============================================
// Componente: Animator
// ============================================

export interface AnimationState {
  name: string
  clip: string
  loop: boolean
  speed: number
}

export interface AnimatorComponent extends BaseComponent {
  type: 'animator'
  defaultState: string
  states: AnimationState[]
  // Parâmetros para transições
  parameters: Record<string, boolean | number | string>
}

// ============================================
// Componente: Custom Script
// ============================================

export interface CustomScriptComponent extends BaseComponent {
  type: 'custom_script'
  scriptId: string
  scriptName: string
  // Parâmetros customizáveis
  parameters: Record<string, unknown>
}

// ============================================
// Componente: Resource Node (Mineração, Lenhador, Pesca)
// ============================================

export type ResourceType = 'ore' | 'tree' | 'fishing' | 'herb' | 'custom'

export interface ResourceNodeComponent extends BaseComponent {
  type: 'resource_node'
  resourceId: string
  resourceName: string
  resourceType: ResourceType
  requiredSkill: string
  requiredLevel: number
  requiredTool: string
  xpReward: number
  harvestItem: string
  minQuantity: number
  maxQuantity: number
  harvestTime: number
  maxUses: number
  respawnTime: number
  depletedModel: string
  harvestAnimation: string
  harvestSound: string
  // Eventos
  onHarvestStart: string
  onHarvest: string
  onDeplete: string
  onRespawn: string
}

// ============================================
// Componente: Crafting Station (Forja, Fogão, Bancada)
// ============================================

export type CraftingStationType = 'anvil' | 'range' | 'fire' | 'workbench' | 'loom' | 'pottery' | 'altar' | 'custom'

export interface CraftingStationComponent extends BaseComponent {
  type: 'crafting_station'
  stationId: string
  stationName: string
  stationType: CraftingStationType
  associatedSkill: string
  requiredLevel: number
  recipes: string[]
  xpBonus: number
  successBonus: number
  requiresFuel: boolean
  fuelType: string
  useAnimation: string
  useSound: string
  particles: string
  // Eventos
  onCraftStart: string
  onCraftComplete: string
  onCraftFail: string
}

// ============================================
// Componente: Bank (Sistema de Armazenamento)
// ============================================

export interface BankComponent extends BaseComponent {
  type: 'bank'
  bankId: string
  bankName: string
  baseSlots: number
  slotsPerUpgrade: number
  maxUpgrades: number
  upgradeCost: number
  depositFee: number
  withdrawFee: number
  allowNotes: boolean
  allowPlaceholders: boolean
  tabCount: number
  requiredQuest: string
  requiredLevel: number
  welcomeMessage: string
  // Eventos
  onOpen: string
  onDeposit: string
  onWithdraw: string
}

// ============================================
// Componente: Skill (Sistema de Habilidades)
// ============================================

export type SkillCategory = 'gathering' | 'combat' | 'artisan' | 'support'

export interface SkillComponent extends BaseComponent {
  type: 'skill'
  skillId: string
  skillName: string
  skillIcon: string
  skillColor: string
  skillCategory: SkillCategory
  maxLevel: number
  baseXp: number
  xpMultiplier: number
  isElite: boolean
  parentSkill: string
  parentLevelRequired: number
  levelUnlocks: string[]
  skillCape: string
  // Eventos
  onXpGain: string
  onLevelUp: string
  onMaxLevel: string
}

// ============================================
// Componente: Equipment (Slots de Equipamento)
// ============================================

export type EquipmentSlot = 'head' | 'cape' | 'amulet' | 'weapon' | 'body' | 'shield' | 'legs' | 'gloves' | 'boots' | 'ring' | 'ammo' | 'two_handed'
export type CombatStyle = 'melee' | 'ranged' | 'magic' | 'hybrid' | 'none'

export interface EquipmentComponent extends BaseComponent {
  type: 'equipment'
  equipmentId: string
  equipmentName: string
  slot: EquipmentSlot
  combatStyle: CombatStyle
  // Bônus de ataque
  attackStab: number
  attackSlash: number
  attackCrush: number
  attackMagic: number
  attackRanged: number
  // Bônus de defesa
  defenseStab: number
  defenseSlash: number
  defenseCrush: number
  defenseMagic: number
  defenseRanged: number
  // Outros bônus
  strengthBonus: number
  rangedStrength: number
  magicDamage: number
  prayerBonus: number
  attackSpeed: number
  // Requisitos
  requiredAttack: number
  requiredStrength: number
  requiredDefence: number
  requiredRanged: number
  requiredMagic: number
  requiredQuest: string
  // Degradação
  degradable: boolean
  maxCharges: number
  repairCost: number
  specialEffects: string[]
  // Eventos
  onEquip: string
  onUnequip: string
  onAttack: string
}

// ============================================
// Componente: Prayer Altar
// ============================================

export type AltarType = 'normal' | 'gilded' | 'chaos' | 'nature'

export interface PrayerAltarComponent extends BaseComponent {
  type: 'prayer_altar'
  altarId: string
  altarName: string
  altarType: AltarType
  restoresPrayer: boolean
  acceptsBones: boolean
  xpBonus: number
  burnersLit: number
  burnerBonus: number
  restoreCooldown: number
  prayAnimation: string
  praySound: string
  // Eventos
  onRestore: string
  onOffer: string
}

// ============================================
// Componente: Agility Obstacle
// ============================================

export type ObstacleType = 'jump' | 'climb' | 'swing' | 'cross' | 'slide' | 'balance' | 'custom'

export interface AgilityObstacleComponent extends BaseComponent {
  type: 'agility_obstacle'
  obstacleId: string
  obstacleName: string
  obstacleType: ObstacleType
  requiredLevel: number
  baseXp: number
  isPartOfCourse: boolean
  courseId: string
  courseOrder: number
  canFail: boolean
  failChance: number
  failDamage: number
  failPosition: { x: number; y: number; z: number }
  destinationPosition: { x: number; y: number; z: number }
  crossTime: number
  animation: string
  sound: string
  // Eventos
  onStart: string
  onComplete: string
  onFail: string
}

// ============================================
// Componente: Farming Patch
// ============================================

export type FarmingPatchType = 'allotment' | 'herb' | 'tree' | 'fruit_tree' | 'flower' | 'bush' | 'hops' | 'special'

export interface FarmingPatchComponent extends BaseComponent {
  type: 'farming_patch'
  patchId: string
  patchName: string
  patchType: FarmingPatchType
  requiredLevel: number
  acceptedSeeds: string[]
  acceptsCompost: boolean
  baseGrowTime: number
  growthStages: number
  canGetDiseased: boolean
  diseaseChance: number
  cureItem: string
  protectionNpc: string
  protectionPayment: string[]
  plantXp: number
  harvestXp: number
  healthCheckXp: number
  emptyModel: string
  stageModels: string[]
  diseasedModel: string
  deadModel: string
  // Eventos
  onPlant: string
  onGrow: string
  onHarvest: string
  onDisease: string
  onDie: string
}

// ============================================
// Union type de todos os componentes
// ============================================

export type Component =
  | InteractableComponent
  | ShopComponent
  | DoorComponent
  | NPCComponent
  | TriggerComponent
  | SpawnerComponent
  | PortalComponent
  | QuestGiverComponent
  | LootContainerComponent
  | WaypointComponent
  | AudioSourceComponent
  | ParticleEmitterComponent
  | LightComponent
  | ColliderComponent
  | AnimatorComponent
  | CustomScriptComponent
  // Novos componentes MMORPG
  | ResourceNodeComponent
  | CraftingStationComponent
  | BankComponent
  | SkillComponent
  | EquipmentComponent
  | PrayerAltarComponent
  | AgilityObstacleComponent
  | FarmingPatchComponent

// ============================================
// Definições de componentes (metadados para o editor)
// ============================================

export interface ComponentPropertyDefinition {
  name: string
  key: string
  type: 'string' | 'number' | 'boolean' | 'select' | 'color' | 'vector3' | 'array' | 'object' | 'script' | 'asset'
  default: unknown
  options?: { label: string; value: string }[] // para select
  min?: number
  max?: number
  step?: number
  description?: string
  group?: string // para agrupar propriedades no editor
  filterType?: string // para filtrar assets/scripts por tipo
}

export interface ComponentDefinition {
  type: ComponentType
  name: string
  icon: string
  description: string
  category: 'gameplay' | 'interaction' | 'visual' | 'audio' | 'physics' | 'ai' | 'scripting'
  properties: ComponentPropertyDefinition[]
  allowMultiple: boolean // pode ter múltiplos deste componente?
}
