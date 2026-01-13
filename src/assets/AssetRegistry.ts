import type { AssetDefinition, AssetType } from '../types'

/**
 * AssetRegistry - Catálogo de assets disponíveis
 *
 * Cada asset pode ter componentes padrão que serão adicionados automaticamente
 * quando o asset for colocado no mapa
 */

export const ASSETS: AssetDefinition[] = [
  // ============================================
  // PERSONAGENS - KayKit Adventurers
  // ============================================
  {
    id: 'char_barbarian',
    name: 'Bárbaro',
    path: '/assets/models/characters/Barbarian.glb',
    type: 'npc',
    category: 'Personagens',
    defaultComponents: ['collider', 'interactable', 'npc'],
  },
  {
    id: 'char_knight',
    name: 'Cavaleiro',
    path: '/assets/models/characters/Knight.glb',
    type: 'npc',
    category: 'Personagens',
    defaultComponents: ['collider', 'interactable', 'npc'],
  },
  {
    id: 'char_mage',
    name: 'Mago',
    path: '/assets/models/characters/Mage.glb',
    type: 'npc',
    category: 'Personagens',
    defaultComponents: ['collider', 'interactable', 'npc'],
  },
  {
    id: 'char_rogue',
    name: 'Ladino',
    path: '/assets/models/characters/Rogue.glb',
    type: 'npc',
    category: 'Personagens',
    defaultComponents: ['collider', 'interactable', 'npc'],
  },
  {
    id: 'char_rogue_hooded',
    name: 'Ladino Encapuzado',
    path: '/assets/models/characters/Rogue_Hooded.glb',
    type: 'npc',
    category: 'Personagens',
    defaultComponents: ['collider', 'interactable', 'npc'],
  },

  // ============================================
  // INIMIGOS - KayKit Skeletons
  // ============================================
  {
    id: 'enemy_skeleton_warrior',
    name: 'Esqueleto Guerreiro',
    path: '/assets/models/characters/Skeleton_Warrior.glb',
    type: 'npc',
    category: 'Inimigos',
    defaultComponents: ['collider', 'npc'],
  },
  {
    id: 'enemy_skeleton_mage',
    name: 'Esqueleto Mago',
    path: '/assets/models/characters/Skeleton_Mage.glb',
    type: 'npc',
    category: 'Inimigos',
    defaultComponents: ['collider', 'npc'],
  },
  {
    id: 'enemy_skeleton_rogue',
    name: 'Esqueleto Ladino',
    path: '/assets/models/characters/Skeleton_Rogue.glb',
    type: 'npc',
    category: 'Inimigos',
    defaultComponents: ['collider', 'npc'],
  },
  {
    id: 'enemy_skeleton_minion',
    name: 'Esqueleto Lacaio',
    path: '/assets/models/characters/Skeleton_Minion.glb',
    type: 'npc',
    category: 'Inimigos',
    defaultComponents: ['collider', 'npc'],
  },

  // ============================================
  // DUNGEON - Paredes e Pisos
  // ============================================
  {
    id: 'dungeon_wall',
    name: 'Parede',
    path: '/assets/models/props/dungeon/wall.gltf.glb',
    type: 'building',
    category: 'Dungeon - Estrutura',
    defaultComponents: ['collider'],
  },
  {
    id: 'dungeon_wall_arched',
    name: 'Parede com Arco',
    path: '/assets/models/props/dungeon/wall_arched.gltf.glb',
    type: 'building',
    category: 'Dungeon - Estrutura',
    defaultComponents: ['collider'],
  },
  {
    id: 'dungeon_wall_doorway',
    name: 'Parede com Porta',
    path: '/assets/models/props/dungeon/wall_doorway.gltf.glb',
    type: 'building',
    category: 'Dungeon - Estrutura',
    defaultComponents: ['collider'],
  },
  {
    id: 'dungeon_wall_window',
    name: 'Parede com Janela',
    path: '/assets/models/props/dungeon/wall_window.gltf.glb',
    type: 'building',
    category: 'Dungeon - Estrutura',
    defaultComponents: ['collider'],
  },
  {
    id: 'dungeon_floor_tile',
    name: 'Piso de Pedra',
    path: '/assets/models/props/dungeon/floor_tile_small.gltf.glb',
    type: 'prop',
    category: 'Dungeon - Estrutura',
    defaultComponents: [],
  },
  {
    id: 'dungeon_floor_wood',
    name: 'Piso de Madeira',
    path: '/assets/models/props/dungeon/floor_wood_small.gltf.glb',
    type: 'prop',
    category: 'Dungeon - Estrutura',
    defaultComponents: [],
  },
  {
    id: 'dungeon_stairs',
    name: 'Escada',
    path: '/assets/models/props/dungeon/stairs.gltf.glb',
    type: 'prop',
    category: 'Dungeon - Estrutura',
    defaultComponents: ['collider'],
  },
  {
    id: 'dungeon_stairs_walled',
    name: 'Escada com Paredes',
    path: '/assets/models/props/dungeon/stairs_walled.gltf.glb',
    type: 'prop',
    category: 'Dungeon - Estrutura',
    defaultComponents: ['collider'],
  },
  {
    id: 'dungeon_column',
    name: 'Coluna',
    path: '/assets/models/props/dungeon/column.gltf.glb',
    type: 'prop',
    category: 'Dungeon - Estrutura',
    defaultComponents: ['collider'],
  },

  // ============================================
  // DUNGEON - Portas
  // ============================================
  {
    id: 'dungeon_door',
    name: 'Porta',
    path: '/assets/models/props/dungeon/door.gltf.glb',
    type: 'prop',
    category: 'Dungeon - Portas',
    defaultComponents: ['collider', 'interactable'],
  },
  {
    id: 'dungeon_door_bars',
    name: 'Porta de Grade',
    path: '/assets/models/props/dungeon/door_bars.gltf.glb',
    type: 'prop',
    category: 'Dungeon - Portas',
    defaultComponents: ['collider', 'interactable'],
  },

  // ============================================
  // DUNGEON - Containers
  // ============================================
  {
    id: 'dungeon_barrel',
    name: 'Barril',
    path: '/assets/models/props/dungeon/barrel_large.gltf.glb',
    type: 'prop',
    category: 'Dungeon - Containers',
    defaultComponents: ['collider'],
  },
  {
    id: 'dungeon_barrel_small',
    name: 'Barril Pequeno',
    path: '/assets/models/props/dungeon/barrel_small.gltf.glb',
    type: 'prop',
    category: 'Dungeon - Containers',
    defaultComponents: ['collider'],
  },
  {
    id: 'dungeon_barrel_stack',
    name: 'Barris Empilhados',
    path: '/assets/models/props/dungeon/barrel_small_stack.gltf.glb',
    type: 'prop',
    category: 'Dungeon - Containers',
    defaultComponents: ['collider'],
  },
  {
    id: 'dungeon_crate',
    name: 'Caixa',
    path: '/assets/models/props/dungeon/box_large.gltf.glb',
    type: 'prop',
    category: 'Dungeon - Containers',
    defaultComponents: ['collider'],
  },
  {
    id: 'dungeon_crates_stacked',
    name: 'Caixas Empilhadas',
    path: '/assets/models/props/dungeon/crates_stacked.gltf.glb',
    type: 'prop',
    category: 'Dungeon - Containers',
    defaultComponents: ['collider'],
  },
  {
    id: 'dungeon_chest',
    name: 'Baú',
    path: '/assets/models/props/dungeon/chest.glb',
    type: 'prop',
    category: 'Dungeon - Containers',
    defaultComponents: ['collider', 'interactable'],
  },
  {
    id: 'dungeon_chest_gold',
    name: 'Baú Dourado',
    path: '/assets/models/props/dungeon/chest_gold.glb',
    type: 'prop',
    category: 'Dungeon - Containers',
    defaultComponents: ['collider', 'interactable'],
  },
  {
    id: 'dungeon_keg',
    name: 'Tonel',
    path: '/assets/models/props/dungeon/keg.gltf.glb',
    type: 'prop',
    category: 'Dungeon - Containers',
    defaultComponents: ['collider'],
  },
  {
    id: 'dungeon_trunk_large',
    name: 'Baú Grande',
    path: '/assets/models/props/dungeon/trunk_large_A.gltf.glb',
    type: 'prop',
    category: 'Dungeon - Containers',
    defaultComponents: ['collider', 'interactable'],
  },

  // ============================================
  // DUNGEON - Iluminação
  // ============================================
  {
    id: 'dungeon_torch',
    name: 'Tocha',
    path: '/assets/models/props/dungeon/torch.gltf.glb',
    type: 'prop',
    category: 'Dungeon - Iluminação',
    defaultComponents: ['light'],
  },
  {
    id: 'dungeon_torch_mounted',
    name: 'Tocha de Parede',
    path: '/assets/models/props/dungeon/torch_mounted.gltf.glb',
    type: 'prop',
    category: 'Dungeon - Iluminação',
    defaultComponents: ['light'],
  },
  {
    id: 'dungeon_candle',
    name: 'Vela',
    path: '/assets/models/props/dungeon/candle.gltf.glb',
    type: 'prop',
    category: 'Dungeon - Iluminação',
    defaultComponents: ['light'],
  },
  {
    id: 'dungeon_candle_triple',
    name: 'Velas Triplas',
    path: '/assets/models/props/dungeon/candle_triple.gltf.glb',
    type: 'prop',
    category: 'Dungeon - Iluminação',
    defaultComponents: ['light'],
  },
  {
    id: 'dungeon_chandelier',
    name: 'Candelabro',
    path: '/assets/models/props/dungeon/chandelier_candles.gltf.glb',
    type: 'prop',
    category: 'Dungeon - Iluminação',
    defaultComponents: ['light'],
  },

  // ============================================
  // DUNGEON - Decoração
  // ============================================
  {
    id: 'dungeon_banner_red',
    name: 'Bandeira Vermelha',
    path: '/assets/models/props/dungeon/banner_red.gltf.glb',
    type: 'prop',
    category: 'Dungeon - Decoração',
    defaultComponents: [],
  },
  {
    id: 'dungeon_banner_blue',
    name: 'Bandeira Azul',
    path: '/assets/models/props/dungeon/banner_blue.gltf.glb',
    type: 'prop',
    category: 'Dungeon - Decoração',
    defaultComponents: [],
  },
  {
    id: 'dungeon_banner_green',
    name: 'Bandeira Verde',
    path: '/assets/models/props/dungeon/banner_green.gltf.glb',
    type: 'prop',
    category: 'Dungeon - Decoração',
    defaultComponents: [],
  },
  {
    id: 'dungeon_coin_stack',
    name: 'Pilha de Moedas',
    path: '/assets/models/props/dungeon/coin_stack_medium.gltf.glb',
    type: 'item',
    category: 'Dungeon - Decoração',
    defaultComponents: ['interactable'],
  },
  {
    id: 'dungeon_bottle_a',
    name: 'Garrafa A',
    path: '/assets/models/props/dungeon/bottle_A_brown.gltf.glb',
    type: 'prop',
    category: 'Dungeon - Decoração',
    defaultComponents: [],
  },
  {
    id: 'dungeon_bottle_b',
    name: 'Garrafa B',
    path: '/assets/models/props/dungeon/bottle_B_green.gltf.glb',
    type: 'prop',
    category: 'Dungeon - Decoração',
    defaultComponents: [],
  },
  {
    id: 'dungeon_bottle_c',
    name: 'Garrafa C',
    path: '/assets/models/props/dungeon/bottle_C_brown.gltf.glb',
    type: 'prop',
    category: 'Dungeon - Decoração',
    defaultComponents: [],
  },
  {
    id: 'dungeon_bed',
    name: 'Cama de Chão',
    path: '/assets/models/props/dungeon/bed_floor.gltf.glb',
    type: 'prop',
    category: 'Dungeon - Decoração',
    defaultComponents: [],
  },
  {
    id: 'dungeon_shelf_potions',
    name: 'Prateleira com Poções',
    path: '/assets/models/props/dungeon/shelf_potions.gltf.glb',
    type: 'prop',
    category: 'Dungeon - Decoração',
    defaultComponents: ['collider'],
  },
  {
    id: 'dungeon_table',
    name: 'Mesa',
    path: '/assets/models/props/dungeon/table_medium.gltf.glb',
    type: 'prop',
    category: 'Dungeon - Decoração',
    defaultComponents: ['collider'],
  },
  {
    id: 'dungeon_table_small',
    name: 'Mesa Pequena',
    path: '/assets/models/props/dungeon/table_small_decorated.gltf.glb',
    type: 'prop',
    category: 'Dungeon - Decoração',
    defaultComponents: ['collider'],
  },

  // ============================================
  // MÓVEIS - Camas
  // ============================================
  {
    id: 'furniture_bed_double_a',
    name: 'Cama de Casal A',
    path: '/assets/models/props/furniture/bed_double_A.gltf',
    type: 'prop',
    category: 'Móveis - Camas',
    defaultComponents: ['collider'],
  },
  {
    id: 'furniture_bed_double_b',
    name: 'Cama de Casal B',
    path: '/assets/models/props/furniture/bed_double_B.gltf',
    type: 'prop',
    category: 'Móveis - Camas',
    defaultComponents: ['collider'],
  },
  {
    id: 'furniture_bed_single_a',
    name: 'Cama de Solteiro A',
    path: '/assets/models/props/furniture/bed_single_A.gltf',
    type: 'prop',
    category: 'Móveis - Camas',
    defaultComponents: ['collider'],
  },
  {
    id: 'furniture_bed_single_b',
    name: 'Cama de Solteiro B',
    path: '/assets/models/props/furniture/bed_single_B.gltf',
    type: 'prop',
    category: 'Móveis - Camas',
    defaultComponents: ['collider'],
  },

  // ============================================
  // MÓVEIS - Cadeiras e Sofás
  // ============================================
  {
    id: 'furniture_chair_a',
    name: 'Cadeira A',
    path: '/assets/models/props/furniture/chair_A.gltf',
    type: 'prop',
    category: 'Móveis - Assentos',
    defaultComponents: ['collider'],
  },
  {
    id: 'furniture_chair_b',
    name: 'Cadeira B',
    path: '/assets/models/props/furniture/chair_B.gltf',
    type: 'prop',
    category: 'Móveis - Assentos',
    defaultComponents: ['collider'],
  },
  {
    id: 'furniture_chair_stool',
    name: 'Banco',
    path: '/assets/models/props/furniture/chair_stool.gltf',
    type: 'prop',
    category: 'Móveis - Assentos',
    defaultComponents: ['collider'],
  },
  {
    id: 'furniture_armchair',
    name: 'Poltrona',
    path: '/assets/models/props/furniture/armchair.gltf',
    type: 'prop',
    category: 'Móveis - Assentos',
    defaultComponents: ['collider'],
  },
  {
    id: 'furniture_armchair_pillows',
    name: 'Poltrona com Almofadas',
    path: '/assets/models/props/furniture/armchair_pillows.gltf',
    type: 'prop',
    category: 'Móveis - Assentos',
    defaultComponents: ['collider'],
  },
  {
    id: 'furniture_sofa',
    name: 'Sofá',
    path: '/assets/models/props/furniture/sofa_A.gltf',
    type: 'prop',
    category: 'Móveis - Assentos',
    defaultComponents: ['collider'],
  },

  // ============================================
  // MÓVEIS - Mesas
  // ============================================
  {
    id: 'furniture_table_small',
    name: 'Mesa Pequena',
    path: '/assets/models/props/furniture/table_small.gltf',
    type: 'prop',
    category: 'Móveis - Mesas',
    defaultComponents: ['collider'],
  },
  {
    id: 'furniture_table_medium',
    name: 'Mesa Média',
    path: '/assets/models/props/furniture/table_medium_long.gltf',
    type: 'prop',
    category: 'Móveis - Mesas',
    defaultComponents: ['collider'],
  },
  {
    id: 'furniture_desk',
    name: 'Escrivaninha',
    path: '/assets/models/props/furniture/desk.gltf',
    type: 'prop',
    category: 'Móveis - Mesas',
    defaultComponents: ['collider'],
  },

  // ============================================
  // MÓVEIS - Armários
  // ============================================
  {
    id: 'furniture_cabinet_small',
    name: 'Armário Pequeno',
    path: '/assets/models/props/furniture/cabinet_small.gltf',
    type: 'prop',
    category: 'Móveis - Armários',
    defaultComponents: ['collider', 'interactable'],
  },
  {
    id: 'furniture_cabinet_medium',
    name: 'Armário Médio',
    path: '/assets/models/props/furniture/cabinet_medium.gltf',
    type: 'prop',
    category: 'Móveis - Armários',
    defaultComponents: ['collider', 'interactable'],
  },
  {
    id: 'furniture_bookcase',
    name: 'Estante de Livros',
    path: '/assets/models/props/furniture/bookcase.gltf',
    type: 'prop',
    category: 'Móveis - Armários',
    defaultComponents: ['collider'],
  },
  {
    id: 'furniture_shelf',
    name: 'Prateleira',
    path: '/assets/models/props/furniture/shelf_A.gltf',
    type: 'prop',
    category: 'Móveis - Armários',
    defaultComponents: ['collider'],
  },

  // ============================================
  // MÓVEIS - Decoração
  // ============================================
  {
    id: 'furniture_rug_a',
    name: 'Tapete A',
    path: '/assets/models/props/furniture/rug_rectangle_A.gltf',
    type: 'prop',
    category: 'Móveis - Decoração',
    defaultComponents: [],
  },
  {
    id: 'furniture_rug_b',
    name: 'Tapete B',
    path: '/assets/models/props/furniture/rug_rectangle_B.gltf',
    type: 'prop',
    category: 'Móveis - Decoração',
    defaultComponents: [],
  },
  {
    id: 'furniture_rug_oval',
    name: 'Tapete Oval',
    path: '/assets/models/props/furniture/rug_oval.gltf',
    type: 'prop',
    category: 'Móveis - Decoração',
    defaultComponents: [],
  },
  {
    id: 'furniture_picture_large',
    name: 'Quadro Grande',
    path: '/assets/models/props/furniture/pictureframe_large_A.gltf',
    type: 'prop',
    category: 'Móveis - Decoração',
    defaultComponents: [],
  },
  {
    id: 'furniture_picture_small',
    name: 'Quadro Pequeno',
    path: '/assets/models/props/furniture/pictureframe_small_A.gltf',
    type: 'prop',
    category: 'Móveis - Decoração',
    defaultComponents: [],
  },
  {
    id: 'furniture_mirror',
    name: 'Espelho',
    path: '/assets/models/props/furniture/mirror.gltf',
    type: 'prop',
    category: 'Móveis - Decoração',
    defaultComponents: [],
  },

  // ============================================
  // ARMAS
  // ============================================
  {
    id: 'weapon_sword_1h',
    name: 'Espada',
    path: '/assets/models/props/weapons/sword_1handed.gltf',
    type: 'item',
    category: 'Armas',
    defaultComponents: ['interactable'],
  },
  {
    id: 'weapon_sword_2h',
    name: 'Espada de Duas Mãos',
    path: '/assets/models/props/weapons/sword_2handed.gltf',
    type: 'item',
    category: 'Armas',
    defaultComponents: ['interactable'],
  },
  {
    id: 'weapon_axe_1h',
    name: 'Machado',
    path: '/assets/models/props/weapons/axe_1handed.gltf',
    type: 'item',
    category: 'Armas',
    defaultComponents: ['interactable'],
  },
  {
    id: 'weapon_axe_2h',
    name: 'Machado de Duas Mãos',
    path: '/assets/models/props/weapons/axe_2handed.gltf',
    type: 'item',
    category: 'Armas',
    defaultComponents: ['interactable'],
  },
  {
    id: 'weapon_dagger',
    name: 'Adaga',
    path: '/assets/models/props/weapons/dagger.gltf',
    type: 'item',
    category: 'Armas',
    defaultComponents: ['interactable'],
  },
  {
    id: 'weapon_staff',
    name: 'Cajado',
    path: '/assets/models/props/weapons/staff.gltf',
    type: 'item',
    category: 'Armas',
    defaultComponents: ['interactable'],
  },
  {
    id: 'weapon_wand',
    name: 'Varinha',
    path: '/assets/models/props/weapons/wand.gltf',
    type: 'item',
    category: 'Armas',
    defaultComponents: ['interactable'],
  },
  {
    id: 'weapon_crossbow_1h',
    name: 'Besta',
    path: '/assets/models/props/weapons/crossbow_1handed.gltf',
    type: 'item',
    category: 'Armas',
    defaultComponents: ['interactable'],
  },
  {
    id: 'weapon_crossbow_2h',
    name: 'Besta Grande',
    path: '/assets/models/props/weapons/crossbow_2handed.gltf',
    type: 'item',
    category: 'Armas',
    defaultComponents: ['interactable'],
  },

  // ============================================
  // ESCUDOS
  // ============================================
  {
    id: 'shield_round',
    name: 'Escudo Redondo',
    path: '/assets/models/props/weapons/shield_round.gltf',
    type: 'item',
    category: 'Armas',
    defaultComponents: ['interactable'],
  },
  {
    id: 'shield_square',
    name: 'Escudo Quadrado',
    path: '/assets/models/props/weapons/shield_square.gltf',
    type: 'item',
    category: 'Armas',
    defaultComponents: ['interactable'],
  },
  {
    id: 'shield_badge',
    name: 'Escudo com Emblema',
    path: '/assets/models/props/weapons/shield_badge.gltf',
    type: 'item',
    category: 'Armas',
    defaultComponents: ['interactable'],
  },

  // ============================================
  // ITENS
  // ============================================
  {
    id: 'item_spellbook_open',
    name: 'Livro de Magias Aberto',
    path: '/assets/models/props/weapons/spellbook_open.gltf',
    type: 'item',
    category: 'Itens',
    defaultComponents: ['interactable'],
  },
  {
    id: 'item_spellbook_closed',
    name: 'Livro de Magias Fechado',
    path: '/assets/models/props/weapons/spellbook_closed.gltf',
    type: 'item',
    category: 'Itens',
    defaultComponents: ['interactable'],
  },
  {
    id: 'item_quiver',
    name: 'Aljava',
    path: '/assets/models/props/weapons/quiver.gltf',
    type: 'item',
    category: 'Itens',
    defaultComponents: ['interactable'],
  },
  {
    id: 'item_arrow',
    name: 'Flecha',
    path: '/assets/models/props/weapons/arrow.gltf',
    type: 'item',
    category: 'Itens',
    defaultComponents: ['interactable'],
  },
  {
    id: 'item_arrow_bundle',
    name: 'Feixe de Flechas',
    path: '/assets/models/props/weapons/arrow_bundle.gltf',
    type: 'item',
    category: 'Itens',
    defaultComponents: ['interactable'],
  },
  {
    id: 'item_smokebomb',
    name: 'Bomba de Fumaça',
    path: '/assets/models/props/weapons/smokebomb.gltf',
    type: 'item',
    category: 'Itens',
    defaultComponents: ['interactable'],
  },

  // ============================================
  // TRIGGERS / PREFABS (sem modelo visual)
  // ============================================
  {
    id: 'trigger_zone',
    name: 'Zona de Trigger',
    path: '',
    type: 'prefab',
    category: 'Triggers',
    defaultComponents: ['collider'],
  },
  {
    id: 'spawn_point',
    name: 'Ponto de Spawn',
    path: '',
    type: 'prefab',
    category: 'Triggers',
    defaultComponents: [],
  },
  {
    id: 'waypoint',
    name: 'Waypoint',
    path: '',
    type: 'prefab',
    category: 'Triggers',
    defaultComponents: [],
  },
]

/**
 * Busca um asset pelo ID
 */
export function getAssetById(id: string): AssetDefinition | undefined {
  return ASSETS.find(asset => asset.id === id)
}

/**
 * Retorna todos os assets de um tipo específico
 */
export function getAssetsByType(type: AssetType): AssetDefinition[] {
  return ASSETS.filter(asset => asset.type === type)
}

/**
 * Retorna assets agrupados por categoria
 */
export function getAssetsByCategory(): Record<string, AssetDefinition[]> {
  const grouped: Record<string, AssetDefinition[]> = {}

  ASSETS.forEach(asset => {
    if (!grouped[asset.category]) {
      grouped[asset.category] = []
    }
    grouped[asset.category].push(asset)
  })

  return grouped
}

/**
 * Retorna todas as categorias disponíveis
 */
export function getCategories(): string[] {
  const categories = new Set(ASSETS.map(asset => asset.category))
  return Array.from(categories)
}

/**
 * Retorna todos os tipos de asset disponíveis
 */
export function getAssetTypes(): AssetType[] {
  const types = new Set(ASSETS.map(asset => asset.type))
  return Array.from(types)
}

/**
 * Busca assets por nome ou categoria
 */
export function searchAssets(query: string): AssetDefinition[] {
  const lowerQuery = query.toLowerCase()
  return ASSETS.filter(
    asset =>
      asset.name.toLowerCase().includes(lowerQuery) ||
      asset.category.toLowerCase().includes(lowerQuery) ||
      asset.id.toLowerCase().includes(lowerQuery)
  )
}
