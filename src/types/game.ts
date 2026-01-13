/**
 * Types para estrutura do jogo
 */

// Configuração geral do jogo
export interface GameConfig {
  title: string
  subtitle: string
  version: string
  genre: string[]
  author: string
}

// Tela de intro
export interface IntroScreen {
  enabled: boolean
  duration: number
  background: string
  logo: string | null
  music: string | null
}

// Tela de loading
export interface LoadingScreen {
  enabled: boolean
  background: string
  showProgress: boolean
  tips: string[]
  music: string | null
}

// Menu principal
export interface MainMenuScreen {
  background: string | null
  music: string | null
  buttons: MenuButton[]
}

export interface MenuButton {
  id: string
  label: string
  action: string
  icon?: string
  disabled?: boolean
}

// Mapa
export interface GameMap {
  id: string
  name: string
  width: number
  height: number
  terrain: string
  entities: MapEntity[]
  spawnPoints: SpawnPoint[]
  zones: MapZone[]
}

export interface MapEntity {
  id: string
  type: string
  position: { x: number; y: number; z: number }
  rotation: { x: number; y: number; z: number }
  scale: { x: number; y: number; z: number }
  components: Record<string, unknown>
}

export interface SpawnPoint {
  id: string
  name: string
  position: { x: number; y: number; z: number }
  isDefault: boolean
}

export interface MapZone {
  id: string
  name: string
  type: 'safe' | 'pvp' | 'boss' | 'dungeon' | 'city'
  bounds: {
    min: { x: number; y: number; z: number }
    max: { x: number; y: number; z: number }
  }
}

// Personagem jogável
export interface GameCharacter {
  id: string
  name: string
  description: string
  model: string
  animations: Record<string, string>
  baseStats: CharacterStats
  startingEquipment: string[]
  startingInventory: string[]
}

export interface CharacterStats {
  health: number
  mana: number
  attack: number
  defense: number
  speed: number
  [key: string]: number
}

// NPC
export interface GameNPC {
  id: string
  name: string
  title: string
  model: string
  dialogue: string | null
  shop: string | null
  quests: string[]
  respawnTime: number
  isHostile: boolean
  combatLevel: number
}

// Item
export interface GameItem {
  id: string
  name: string
  description: string
  icon: string
  type: 'weapon' | 'armor' | 'consumable' | 'material' | 'quest' | 'misc'
  stackable: boolean
  maxStack: number
  value: number
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  effects: ItemEffect[]
}

export interface ItemEffect {
  type: string
  value: number
  duration?: number
}

// Quest
export interface GameQuest {
  id: string
  name: string
  description: string
  type: 'main' | 'side' | 'daily' | 'achievement'
  requirements: QuestRequirement[]
  objectives: QuestObjective[]
  rewards: QuestReward[]
}

export interface QuestRequirement {
  type: 'level' | 'quest' | 'skill' | 'item'
  id?: string
  value: number
}

export interface QuestObjective {
  id: string
  description: string
  type: 'kill' | 'collect' | 'talk' | 'reach' | 'craft'
  target: string
  amount: number
  optional: boolean
}

export interface QuestReward {
  type: 'xp' | 'gold' | 'item' | 'skill_xp' | 'unlock'
  id?: string
  amount: number
}

// Diálogo
export interface GameDialogue {
  id: string
  npcId: string
  nodes: DialogueNode[]
  startNode: string
}

export interface DialogueNode {
  id: string
  text: string
  speaker: 'npc' | 'player'
  options: DialogueOption[]
  actions: DialogueAction[]
}

export interface DialogueOption {
  text: string
  nextNode: string | null
  condition?: {
    type: string
    value: unknown
  }
}

export interface DialogueAction {
  type: 'give_item' | 'take_item' | 'give_xp' | 'start_quest' | 'complete_quest' | 'open_shop'
  data: unknown
}

// Skill
export interface GameSkill {
  id: string
  name: string
  icon: string
  color: string
  category: 'gathering' | 'combat' | 'artisan' | 'support'
  maxLevel: number
  baseXp: number
  xpMultiplier: number
  levelUnlocks: SkillUnlock[]
}

export interface SkillUnlock {
  level: number
  type: 'ability' | 'recipe' | 'area' | 'equipment'
  id: string
  name: string
}
