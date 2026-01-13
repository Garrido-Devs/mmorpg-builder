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
    path: '/assets/models/props/dungeon/wall_doorway.glb',
    type: 'building',
    category: 'Dungeon - Estrutura',
    defaultComponents: ['collider'],
  },
  {
    id: 'dungeon_wall_window_closed',
    name: 'Parede com Janela Fechada',
    path: '/assets/models/props/dungeon/wall_window_closed.gltf.glb',
    type: 'building',
    category: 'Dungeon - Estrutura',
    defaultComponents: ['collider'],
  },
  {
    id: 'dungeon_wall_window_open',
    name: 'Parede com Janela Aberta',
    path: '/assets/models/props/dungeon/wall_window_open.gltf.glb',
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
  // DUNGEON - Grades/Portões
  // ============================================
  {
    id: 'dungeon_wall_gated',
    name: 'Parede com Grade',
    path: '/assets/models/props/dungeon/wall_gated.gltf.glb',
    type: 'building',
    category: 'Dungeon - Estrutura',
    defaultComponents: ['collider'],
  },
  {
    id: 'dungeon_wall_corner_gated',
    name: 'Canto com Grade',
    path: '/assets/models/props/dungeon/wall_corner_gated.gltf.glb',
    type: 'building',
    category: 'Dungeon - Estrutura',
    defaultComponents: ['collider'],
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
    id: 'dungeon_shelf_candles',
    name: 'Prateleira com Velas',
    path: '/assets/models/props/dungeon/shelf_small_candles.gltf.glb',
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
    id: 'dungeon_shelf_large',
    name: 'Prateleira Grande',
    path: '/assets/models/props/dungeon/shelf_large.gltf.glb',
    type: 'prop',
    category: 'Dungeon - Decoração',
    defaultComponents: ['collider'],
  },
  {
    id: 'dungeon_shelf_small',
    name: 'Prateleira Pequena',
    path: '/assets/models/props/dungeon/shelf_small.gltf.glb',
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
    id: 'dungeon_table_small_a',
    name: 'Mesa Pequena A',
    path: '/assets/models/props/dungeon/table_small_decorated_A.gltf.glb',
    type: 'prop',
    category: 'Dungeon - Decoração',
    defaultComponents: ['collider'],
  },
  {
    id: 'dungeon_table_small_b',
    name: 'Mesa Pequena B',
    path: '/assets/models/props/dungeon/table_small_decorated_B.gltf.glb',
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
    id: 'furniture_chair_c',
    name: 'Cadeira C',
    path: '/assets/models/props/furniture/chair_C.gltf',
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
    path: '/assets/models/props/furniture/couch.gltf',
    type: 'prop',
    category: 'Móveis - Assentos',
    defaultComponents: ['collider'],
  },
  {
    id: 'furniture_sofa_pillows',
    name: 'Sofá com Almofadas',
    path: '/assets/models/props/furniture/couch_pillows.gltf',
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
    id: 'furniture_table_low',
    name: 'Mesa Baixa',
    path: '/assets/models/props/furniture/table_low.gltf',
    type: 'prop',
    category: 'Móveis - Mesas',
    defaultComponents: ['collider'],
  },
  {
    id: 'furniture_table_medium_square',
    name: 'Mesa Média',
    path: '/assets/models/props/furniture/table_medium.gltf',
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
    id: 'furniture_shelf_big',
    name: 'Prateleira Grande',
    path: '/assets/models/props/furniture/shelf_A_big.gltf',
    type: 'prop',
    category: 'Móveis - Armários',
    defaultComponents: ['collider'],
  },
  {
    id: 'furniture_shelf_small',
    name: 'Prateleira Pequena',
    path: '/assets/models/props/furniture/shelf_A_small.gltf',
    type: 'prop',
    category: 'Móveis - Armários',
    defaultComponents: ['collider'],
  },
  {
    id: 'furniture_shelf_b_large',
    name: 'Estante Grande',
    path: '/assets/models/props/furniture/shelf_B_large.gltf',
    type: 'prop',
    category: 'Móveis - Armários',
    defaultComponents: ['collider'],
  },
  {
    id: 'furniture_shelf_b_small',
    name: 'Estante Pequena',
    path: '/assets/models/props/furniture/shelf_B_small.gltf',
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
    id: 'furniture_rug_oval_a',
    name: 'Tapete Oval A',
    path: '/assets/models/props/furniture/rug_oval_A.gltf',
    type: 'prop',
    category: 'Móveis - Decoração',
    defaultComponents: [],
  },
  {
    id: 'furniture_rug_oval_b',
    name: 'Tapete Oval B',
    path: '/assets/models/props/furniture/rug_oval_B.gltf',
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
    id: 'furniture_picture_medium',
    name: 'Quadro Médio',
    path: '/assets/models/props/furniture/pictureframe_medium.gltf',
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
    id: 'furniture_pillow_a',
    name: 'Almofada A',
    path: '/assets/models/props/furniture/pillow_A.gltf',
    type: 'prop',
    category: 'Móveis - Decoração',
    defaultComponents: [],
  },
  {
    id: 'furniture_pillow_b',
    name: 'Almofada B',
    path: '/assets/models/props/furniture/pillow_B.gltf',
    type: 'prop',
    category: 'Móveis - Decoração',
    defaultComponents: [],
  },
  {
    id: 'furniture_book_set',
    name: 'Conjunto de Livros',
    path: '/assets/models/props/furniture/book_set.gltf',
    type: 'prop',
    category: 'Móveis - Decoração',
    defaultComponents: [],
  },
  {
    id: 'furniture_lamp_standing',
    name: 'Abajur de Pé',
    path: '/assets/models/props/furniture/lamp_standing.gltf',
    type: 'prop',
    category: 'Móveis - Decoração',
    defaultComponents: ['light'],
  },
  {
    id: 'furniture_lamp_table',
    name: 'Abajur de Mesa',
    path: '/assets/models/props/furniture/lamp_table.gltf',
    type: 'prop',
    category: 'Móveis - Decoração',
    defaultComponents: ['light'],
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
