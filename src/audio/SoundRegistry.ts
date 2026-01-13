/**
 * SoundRegistry - Catalogo de sons disponiveis
 */

export type SoundCategory =
  | 'battle'
  | 'interface'
  | 'inventory'
  | 'npc'
  | 'world'
  | 'misc'
  | 'player'
  | 'ambient'

export interface SoundDefinition {
  id: string
  name: string
  path: string
  category: SoundCategory
  volume?: number // 0-1, default 1
  loop?: boolean
}

const BASE_PATH = '/assets/sounds'

export const SOUNDS: SoundDefinition[] = [
  // ============================================
  // BATALHA
  // ============================================
  {
    id: 'magic1',
    name: 'Magia 1',
    path: `${BASE_PATH}/battle/magic1.wav`,
    category: 'battle',
  },
  {
    id: 'spell',
    name: 'Feitico',
    path: `${BASE_PATH}/battle/spell.wav`,
    category: 'battle',
  },
  {
    id: 'swing1',
    name: 'Golpe 1',
    path: `${BASE_PATH}/battle/swing.wav`,
    category: 'battle',
  },
  {
    id: 'swing2',
    name: 'Golpe 2',
    path: `${BASE_PATH}/battle/swing2.wav`,
    category: 'battle',
  },
  {
    id: 'swing3',
    name: 'Golpe 3',
    path: `${BASE_PATH}/battle/swing3.wav`,
    category: 'battle',
  },
  {
    id: 'sword_unsheathe1',
    name: 'Desembainhar Espada 1',
    path: `${BASE_PATH}/battle/sword-unsheathe.wav`,
    category: 'battle',
  },
  {
    id: 'sword_unsheathe2',
    name: 'Desembainhar Espada 2',
    path: `${BASE_PATH}/battle/sword-unsheathe2.wav`,
    category: 'battle',
  },
  {
    id: 'sword_unsheathe3',
    name: 'Desembainhar Espada 3',
    path: `${BASE_PATH}/battle/sword-unsheathe3.wav`,
    category: 'battle',
  },
  {
    id: 'sword_unsheathe4',
    name: 'Desembainhar Espada 4',
    path: `${BASE_PATH}/battle/sword-unsheathe4.wav`,
    category: 'battle',
  },
  {
    id: 'sword_unsheathe5',
    name: 'Desembainhar Espada 5',
    path: `${BASE_PATH}/battle/sword-unsheathe5.wav`,
    category: 'battle',
  },

  // ============================================
  // INTERFACE
  // ============================================
  {
    id: 'ui_click1',
    name: 'Click UI 1',
    path: `${BASE_PATH}/interface/interface1.wav`,
    category: 'interface',
    volume: 0.5,
  },
  {
    id: 'ui_click2',
    name: 'Click UI 2',
    path: `${BASE_PATH}/interface/interface2.wav`,
    category: 'interface',
    volume: 0.5,
  },
  {
    id: 'ui_click3',
    name: 'Click UI 3',
    path: `${BASE_PATH}/interface/interface3.wav`,
    category: 'interface',
    volume: 0.5,
  },
  {
    id: 'ui_open',
    name: 'Abrir Menu',
    path: `${BASE_PATH}/interface/interface4.wav`,
    category: 'interface',
    volume: 0.5,
  },
  {
    id: 'ui_close',
    name: 'Fechar Menu',
    path: `${BASE_PATH}/interface/interface5.wav`,
    category: 'interface',
    volume: 0.5,
  },
  {
    id: 'ui_confirm',
    name: 'Confirmar',
    path: `${BASE_PATH}/interface/interface6.wav`,
    category: 'interface',
    volume: 0.5,
  },

  // ============================================
  // INVENTARIO
  // ============================================
  {
    id: 'armor_light',
    name: 'Equipar Armadura Leve',
    path: `${BASE_PATH}/inventory/armor-light.wav`,
    category: 'inventory',
  },
  {
    id: 'chainmail1',
    name: 'Cota de Malha 1',
    path: `${BASE_PATH}/inventory/chainmail1.wav`,
    category: 'inventory',
  },
  {
    id: 'chainmail2',
    name: 'Cota de Malha 2',
    path: `${BASE_PATH}/inventory/chainmail2.wav`,
    category: 'inventory',
  },
  {
    id: 'cloth',
    name: 'Tecido',
    path: `${BASE_PATH}/inventory/cloth.wav`,
    category: 'inventory',
  },
  {
    id: 'cloth_heavy',
    name: 'Tecido Pesado',
    path: `${BASE_PATH}/inventory/cloth-heavy.wav`,
    category: 'inventory',
  },
  {
    id: 'coin1',
    name: 'Moeda 1',
    path: `${BASE_PATH}/inventory/coin.wav`,
    category: 'inventory',
  },
  {
    id: 'coin2',
    name: 'Moeda 2',
    path: `${BASE_PATH}/inventory/coin2.wav`,
    category: 'inventory',
  },
  {
    id: 'coin3',
    name: 'Moeda 3',
    path: `${BASE_PATH}/inventory/coin3.wav`,
    category: 'inventory',
  },
  {
    id: 'bottle',
    name: 'Garrafa/Pocao',
    path: `${BASE_PATH}/inventory/bottle.wav`,
    category: 'inventory',
  },
  {
    id: 'bubble1',
    name: 'Bolha 1',
    path: `${BASE_PATH}/inventory/bubble.wav`,
    category: 'inventory',
  },
  {
    id: 'bubble2',
    name: 'Bolha 2',
    path: `${BASE_PATH}/inventory/bubble2.wav`,
    category: 'inventory',
  },
  {
    id: 'bubble3',
    name: 'Bolha 3',
    path: `${BASE_PATH}/inventory/bubble3.wav`,
    category: 'inventory',
  },
  {
    id: 'beads',
    name: 'Contas',
    path: `${BASE_PATH}/inventory/beads.wav`,
    category: 'inventory',
  },
  {
    id: 'metal_ringing',
    name: 'Metal Tilintando',
    path: `${BASE_PATH}/inventory/metal-ringing.wav`,
    category: 'inventory',
  },
  {
    id: 'metal_small1',
    name: 'Metal Pequeno 1',
    path: `${BASE_PATH}/inventory/metal-small1.wav`,
    category: 'inventory',
  },
  {
    id: 'metal_small2',
    name: 'Metal Pequeno 2',
    path: `${BASE_PATH}/inventory/metal-small2.wav`,
    category: 'inventory',
  },
  {
    id: 'metal_small3',
    name: 'Metal Pequeno 3',
    path: `${BASE_PATH}/inventory/metal-small3.wav`,
    category: 'inventory',
  },
  {
    id: 'wood_small',
    name: 'Madeira',
    path: `${BASE_PATH}/inventory/wood-small.wav`,
    category: 'inventory',
  },

  // ============================================
  // NPCs
  // ============================================
  // Beetle
  {
    id: 'beetle_bite1',
    name: 'Besouro Mordida 1',
    path: `${BASE_PATH}/NPC/beetle/bite-small.wav`,
    category: 'npc',
  },
  {
    id: 'beetle_bite2',
    name: 'Besouro Mordida 2',
    path: `${BASE_PATH}/NPC/beetle/bite-small2.wav`,
    category: 'npc',
  },
  {
    id: 'beetle_bite3',
    name: 'Besouro Mordida 3',
    path: `${BASE_PATH}/NPC/beetle/bite-small3.wav`,
    category: 'npc',
  },
  // Giant
  {
    id: 'giant1',
    name: 'Gigante 1',
    path: `${BASE_PATH}/NPC/giant/giant1.wav`,
    category: 'npc',
  },
  {
    id: 'giant2',
    name: 'Gigante 2',
    path: `${BASE_PATH}/NPC/giant/giant2.wav`,
    category: 'npc',
  },
  {
    id: 'giant3',
    name: 'Gigante 3',
    path: `${BASE_PATH}/NPC/giant/giant3.wav`,
    category: 'npc',
  },
  {
    id: 'giant4',
    name: 'Gigante 4',
    path: `${BASE_PATH}/NPC/giant/giant4.wav`,
    category: 'npc',
  },
  {
    id: 'giant5',
    name: 'Gigante 5',
    path: `${BASE_PATH}/NPC/giant/giant5.wav`,
    category: 'npc',
  },
  // Ogre
  {
    id: 'ogre1',
    name: 'Ogro 1',
    path: `${BASE_PATH}/NPC/ogre/ogre1.wav`,
    category: 'npc',
  },
  {
    id: 'ogre2',
    name: 'Ogro 2',
    path: `${BASE_PATH}/NPC/ogre/ogre2.wav`,
    category: 'npc',
  },
  {
    id: 'ogre3',
    name: 'Ogro 3',
    path: `${BASE_PATH}/NPC/ogre/ogre3.wav`,
    category: 'npc',
  },
  {
    id: 'ogre4',
    name: 'Ogro 4',
    path: `${BASE_PATH}/NPC/ogre/ogre4.wav`,
    category: 'npc',
  },
  {
    id: 'ogre5',
    name: 'Ogro 5',
    path: `${BASE_PATH}/NPC/ogre/ogre5.wav`,
    category: 'npc',
  },
  // Slime
  {
    id: 'slime1',
    name: 'Slime 1',
    path: `${BASE_PATH}/NPC/slime/slime1.wav`,
    category: 'npc',
  },
  {
    id: 'slime2',
    name: 'Slime 2',
    path: `${BASE_PATH}/NPC/slime/slime2.wav`,
    category: 'npc',
  },
  {
    id: 'slime3',
    name: 'Slime 3',
    path: `${BASE_PATH}/NPC/slime/slime3.wav`,
    category: 'npc',
  },
  {
    id: 'slime4',
    name: 'Slime 4',
    path: `${BASE_PATH}/NPC/slime/slime4.wav`,
    category: 'npc',
  },
  {
    id: 'slime5',
    name: 'Slime 5',
    path: `${BASE_PATH}/NPC/slime/slime5.wav`,
    category: 'npc',
  },
  // Wolfman
  {
    id: 'wolfman',
    name: 'Lobisomem',
    path: `${BASE_PATH}/NPC/misc/wolfman.wav`,
    category: 'npc',
  },

  // ============================================
  // MUNDO
  // ============================================
  {
    id: 'door',
    name: 'Porta',
    path: `${BASE_PATH}/world/door.wav`,
    category: 'world',
  },

  // ============================================
  // DIVERSOS
  // ============================================
  {
    id: 'burp',
    name: 'Arroto',
    path: `${BASE_PATH}/misc/burp.wav`,
    category: 'misc',
  },
  {
    id: 'random1',
    name: 'Aleatorio 1',
    path: `${BASE_PATH}/misc/random1.wav`,
    category: 'misc',
  },
  {
    id: 'random2',
    name: 'Aleatorio 2',
    path: `${BASE_PATH}/misc/random2.wav`,
    category: 'misc',
  },
  {
    id: 'random3',
    name: 'Aleatorio 3',
    path: `${BASE_PATH}/misc/random3.wav`,
    category: 'misc',
  },
  {
    id: 'random4',
    name: 'Aleatorio 4',
    path: `${BASE_PATH}/misc/random4.wav`,
    category: 'misc',
  },
  {
    id: 'random5',
    name: 'Aleatorio 5',
    path: `${BASE_PATH}/misc/random5.wav`,
    category: 'misc',
  },
  {
    id: 'random6',
    name: 'Aleatorio 6',
    path: `${BASE_PATH}/misc/random6.wav`,
    category: 'misc',
  },
]

/**
 * Busca um som pelo ID
 */
export function getSoundById(id: string): SoundDefinition | undefined {
  return SOUNDS.find(sound => sound.id === id)
}

/**
 * Retorna sons de uma categoria
 */
export function getSoundsByCategory(category: SoundCategory): SoundDefinition[] {
  return SOUNDS.filter(sound => sound.category === category)
}

/**
 * Retorna um som aleatorio de uma categoria
 */
export function getRandomSound(category: SoundCategory): SoundDefinition | undefined {
  const sounds = getSoundsByCategory(category)
  if (sounds.length === 0) return undefined
  return sounds[Math.floor(Math.random() * sounds.length)]
}

/**
 * Grupos de sons para acoes especificas
 */
export const SOUND_GROUPS = {
  // Sons de ataque
  attack: ['swing1', 'swing2', 'swing3'],
  // Sons de UI
  uiClick: ['ui_click1', 'ui_click2', 'ui_click3'],
  // Sons de moeda
  coin: ['coin1', 'coin2', 'coin3'],
  // Sons de slime
  slime: ['slime1', 'slime2', 'slime3', 'slime4', 'slime5'],
  // Sons de gigante
  giant: ['giant1', 'giant2', 'giant3', 'giant4', 'giant5'],
  // Sons de ogro
  ogre: ['ogre1', 'ogre2', 'ogre3', 'ogre4', 'ogre5'],
  // Sons de desembainhar espada
  swordUnsheathe: ['sword_unsheathe1', 'sword_unsheathe2', 'sword_unsheathe3', 'sword_unsheathe4', 'sword_unsheathe5'],
} as const

export type SoundGroup = keyof typeof SOUND_GROUPS
