import type { ComponentDefinition, ComponentType } from '../types/components'

/**
 * Definições de todos os componentes disponíveis
 * Usado pelo editor para renderizar o painel de propriedades
 */

export const COMPONENT_DEFINITIONS: Record<ComponentType, ComponentDefinition> = {
  transform: {
    type: 'transform',
    name: 'Transform',
    icon: '📐',
    description: 'Posição, rotação e escala do objeto',
    category: 'physics',
    allowMultiple: false,
    properties: [
      { name: 'Posição', key: 'position', type: 'vector3', default: { x: 0, y: 0, z: 0 }, group: 'Transform' },
      { name: 'Rotação', key: 'rotation', type: 'vector3', default: { x: 0, y: 0, z: 0 }, group: 'Transform' },
      { name: 'Escala', key: 'scale', type: 'vector3', default: { x: 1, y: 1, z: 1 }, group: 'Transform' },
    ],
  },

  interactable: {
    type: 'interactable',
    name: 'Interactable',
    icon: '👆',
    description: 'Permite interação do jogador com o objeto',
    category: 'interaction',
    allowMultiple: false,
    properties: [
      {
        name: 'Tipo de Interação', key: 'interactionType', type: 'select', default: 'click',
        options: [
          { label: 'Clique', value: 'click' },
          { label: 'Proximidade', value: 'proximity' },
          { label: 'Tecla', value: 'key_press' },
          { label: 'Automático', value: 'auto' },
        ],
        group: 'Interação',
      },
      { name: 'Alcance', key: 'interactionRange', type: 'number', default: 3, min: 0.5, max: 50, step: 0.5, group: 'Interação' },
      { name: 'Tecla', key: 'interactionKey', type: 'string', default: 'E', group: 'Interação' },
      { name: 'Tooltip', key: 'tooltip', type: 'string', default: 'Interagir', group: 'Visual' },
      { name: 'Destacar ao Hover', key: 'highlightOnHover', type: 'boolean', default: true, group: 'Visual' },
      { name: 'Cooldown (s)', key: 'cooldown', type: 'number', default: 0, min: 0, max: 60, group: 'Interação' },
      { name: 'Ao Interagir', key: 'onInteract', type: 'script', default: '', group: 'Eventos' },
      { name: 'Ao Hover Enter', key: 'onHoverEnter', type: 'script', default: '', group: 'Eventos' },
      { name: 'Ao Hover Exit', key: 'onHoverExit', type: 'script', default: '', group: 'Eventos' },
    ],
  },

  shop: {
    type: 'shop',
    name: 'Shop',
    icon: '🏪',
    description: 'Loja para compra e venda de itens',
    category: 'gameplay',
    allowMultiple: false,
    properties: [
      { name: 'ID da Loja', key: 'shopId', type: 'string', default: '', description: 'Identificador único global', group: 'Identificação' },
      { name: 'Nome da Loja', key: 'shopName', type: 'string', default: 'Nova Loja', group: 'Identificação' },
      {
        name: 'Tipo', key: 'shopType', type: 'select', default: 'both',
        options: [
          { label: 'Apenas Compra', value: 'buy' },
          { label: 'Apenas Venda', value: 'sell' },
          { label: 'Compra e Venda', value: 'both' },
          { label: 'Troca', value: 'trade' },
        ],
        group: 'Configuração',
      },
      { name: 'Itens', key: 'items', type: 'array', default: [], group: 'Inventário' },
      { name: 'Mensagem de Boas-vindas', key: 'welcomeMessage', type: 'string', default: 'Bem-vindo à minha loja!', group: 'Diálogo' },
      { name: 'Multiplicador Compra', key: 'buyMultiplier', type: 'number', default: 1, min: 0.1, max: 10, step: 0.1, group: 'Preços' },
      { name: 'Multiplicador Venda', key: 'sellMultiplier', type: 'number', default: 0.5, min: 0.1, max: 10, step: 0.1, group: 'Preços' },
      { name: 'Facção Necessária', key: 'requiredReputation', type: 'string', default: '', group: 'Requisitos' },
      { name: 'Nível de Reputação', key: 'requiredReputationLevel', type: 'number', default: 0, min: 0, max: 100, group: 'Requisitos' },
    ],
  },

  door: {
    type: 'door',
    name: 'Door',
    icon: '🚪',
    description: 'Porta que pode ser aberta, fechada ou trancada',
    category: 'interaction',
    allowMultiple: false,
    properties: [
      { name: 'ID da Porta', key: 'doorId', type: 'string', default: '', group: 'Identificação' },
      {
        name: 'Estado Inicial', key: 'initialState', type: 'select', default: 'closed',
        options: [
          { label: 'Aberta', value: 'open' },
          { label: 'Fechada', value: 'closed' },
          { label: 'Trancada', value: 'locked' },
          { label: 'Quebrada', value: 'broken' },
        ],
        group: 'Estado',
      },
      { name: 'Item Chave', key: 'keyItemId', type: 'asset', default: '', description: 'Item necessário para destrancar', group: 'Trava' },
      { name: 'Nível de Lockpicking', key: 'lockLevel', type: 'number', default: 0, min: 0, max: 100, group: 'Trava' },
      { name: 'Fechar Automaticamente', key: 'autoClose', type: 'boolean', default: false, group: 'Comportamento' },
      { name: 'Delay Auto-fechar (s)', key: 'autoCloseDelay', type: 'number', default: 5, min: 1, max: 60, group: 'Comportamento' },
      { name: 'Animação Abrir', key: 'openAnimation', type: 'asset', default: '', group: 'Animações' },
      { name: 'Animação Fechar', key: 'closeAnimation', type: 'asset', default: '', group: 'Animações' },
      { name: 'Som Abrir', key: 'openSound', type: 'asset', default: '', group: 'Áudio' },
      { name: 'Som Fechar', key: 'closeSound', type: 'asset', default: '', group: 'Áudio' },
      { name: 'Som Trancada', key: 'lockedSound', type: 'asset', default: '', group: 'Áudio' },
      { name: 'Ao Abrir', key: 'onOpen', type: 'script', default: '', group: 'Eventos' },
      { name: 'Ao Fechar', key: 'onClose', type: 'script', default: '', group: 'Eventos' },
      { name: 'Ao Tentar Abrir (Trancada)', key: 'onLocked', type: 'script', default: '', group: 'Eventos' },
    ],
  },

  npc: {
    type: 'npc',
    name: 'NPC',
    icon: '🧑',
    description: 'Personagem não-jogável',
    category: 'ai',
    allowMultiple: false,
    properties: [
      { name: 'ID do NPC', key: 'npcId', type: 'string', default: '', group: 'Identificação' },
      { name: 'Nome', key: 'displayName', type: 'string', default: 'NPC', group: 'Identificação' },
      { name: 'Título', key: 'title', type: 'string', default: '', description: 'Ex: Ferreiro, Guardião', group: 'Identificação' },
      { name: 'Facção', key: 'faction', type: 'string', default: 'neutral', group: 'Facção' },
      {
        name: 'Atitude', key: 'attitude', type: 'select', default: 'neutral',
        options: [
          { label: 'Amigável', value: 'friendly' },
          { label: 'Neutro', value: 'neutral' },
          { label: 'Hostil', value: 'hostile' },
        ],
        group: 'Comportamento',
      },
      {
        name: 'Comportamento', key: 'behavior', type: 'select', default: 'stationary',
        options: [
          { label: 'Estacionário', value: 'stationary' },
          { label: 'Patrulha', value: 'patrol' },
          { label: 'Vagar', value: 'wander' },
          { label: 'Seguir', value: 'follow' },
          { label: 'Fugir', value: 'flee' },
        ],
        group: 'Comportamento',
      },
      { name: 'ID do Diálogo', key: 'dialogueId', type: 'asset', default: '', group: 'Diálogo' },
      { name: 'Saudação', key: 'greetingMessage', type: 'string', default: 'Olá, viajante!', group: 'Diálogo' },
      { name: 'Quests para Dar', key: 'questsToGive', type: 'array', default: [], group: 'Quests' },
      { name: 'Quests para Completar', key: 'questsToComplete', type: 'array', default: [], group: 'Quests' },
      { name: 'Nível', key: 'level', type: 'number', default: 1, min: 1, max: 100, group: 'Combate' },
      { name: 'Vida', key: 'health', type: 'number', default: 100, min: 1, max: 100000, group: 'Combate' },
      { name: 'Dano', key: 'damage', type: 'number', default: 10, min: 0, max: 10000, group: 'Combate' },
      { name: 'Pontos de Patrulha', key: 'patrolPoints', type: 'array', default: [], group: 'Patrulha' },
      { name: 'Raio de Patrulha', key: 'patrolRadius', type: 'number', default: 5, min: 0, max: 50, step: 1, group: 'Patrulha', description: 'Raio para patrulha automática quando não há waypoints' },
      { name: 'Velocidade Patrulha', key: 'patrolSpeed', type: 'number', default: 2, min: 0.5, max: 10, step: 0.5, group: 'Patrulha' },
      { name: 'Tempo de Espera', key: 'patrolWaitTime', type: 'number', default: 2, min: 0, max: 60, group: 'Patrulha' },
      { name: 'Tempo de Respawn (s)', key: 'respawnTime', type: 'number', default: 300, min: 0, max: 86400, group: 'Respawn' },
      { name: 'Ao Spawnar', key: 'onSpawn', type: 'script', default: '', group: 'Eventos' },
      { name: 'Ao Morrer', key: 'onDeath', type: 'script', default: '', group: 'Eventos' },
      { name: 'Ao Iniciar Combate', key: 'onCombatStart', type: 'script', default: '', group: 'Eventos' },
      { name: 'Ao Finalizar Combate', key: 'onCombatEnd', type: 'script', default: '', group: 'Eventos' },
    ],
  },

  trigger: {
    type: 'trigger',
    name: 'Trigger',
    icon: '⚡',
    description: 'Zona que dispara eventos quando o jogador entra',
    category: 'gameplay',
    allowMultiple: false,
    properties: [
      { name: 'ID do Trigger', key: 'triggerId', type: 'string', default: '', group: 'Identificação' },
      {
        name: 'Forma', key: 'shape', type: 'select', default: 'box',
        options: [
          { label: 'Cubo', value: 'box' },
          { label: 'Esfera', value: 'sphere' },
          { label: 'Cilindro', value: 'cylinder' },
        ],
        group: 'Forma',
      },
      { name: 'Tamanho', key: 'size', type: 'vector3', default: { x: 5, y: 5, z: 5 }, group: 'Forma' },
      { name: 'Disparar Apenas Uma Vez', key: 'triggerOnce', type: 'boolean', default: false, group: 'Comportamento' },
      { name: 'Cooldown (s)', key: 'triggerCooldown', type: 'number', default: 0, min: 0, max: 3600, group: 'Comportamento' },
      { name: 'Filtrar por Tag', key: 'filterByTag', type: 'array', default: [], group: 'Filtros' },
      { name: 'Filtrar por Time', key: 'filterByTeam', type: 'array', default: [], group: 'Filtros' },
      { name: 'Quest Necessária', key: 'requiresQuest', type: 'asset', default: '', group: 'Requisitos' },
      { name: 'Ao Entrar', key: 'onEnter', type: 'script', default: '', group: 'Eventos' },
      { name: 'Ao Sair', key: 'onExit', type: 'script', default: '', group: 'Eventos' },
      { name: 'Enquanto Dentro', key: 'onStay', type: 'script', default: '', group: 'Eventos' },
    ],
  },

  spawner: {
    type: 'spawner',
    name: 'Spawner',
    icon: '🎯',
    description: 'Gera entidades automaticamente',
    category: 'gameplay',
    allowMultiple: true,
    properties: [
      { name: 'ID do Spawner', key: 'spawnerId', type: 'string', default: '', group: 'Identificação' },
      { name: 'Entidade', key: 'entityToSpawn', type: 'asset', default: '', description: 'Prefab/Asset a spawnar', group: 'Spawn' },
      {
        name: 'Tipo', key: 'spawnType', type: 'select', default: 'enemy',
        options: [
          { label: 'NPC', value: 'npc' },
          { label: 'Item', value: 'item' },
          { label: 'Inimigo', value: 'enemy' },
          { label: 'Recurso', value: 'resource' },
        ],
        group: 'Spawn',
      },
      { name: 'Quantidade Máxima', key: 'maxCount', type: 'number', default: 5, min: 1, max: 100, group: 'Spawn' },
      { name: 'Raio de Spawn', key: 'spawnRadius', type: 'number', default: 5, min: 0, max: 50, group: 'Spawn' },
      { name: 'Tempo de Respawn (s)', key: 'respawnTime', type: 'number', default: 60, min: 0, max: 86400, group: 'Spawn' },
      { name: 'Spawnar ao Iniciar', key: 'spawnOnStart', type: 'boolean', default: true, group: 'Spawn' },
      {
        name: 'Hora do Dia', key: 'requiredTimeOfDay', type: 'select', default: 'any',
        options: [
          { label: 'Qualquer', value: 'any' },
          { label: 'Dia', value: 'day' },
          { label: 'Noite', value: 'night' },
          { label: 'Amanhecer', value: 'dawn' },
          { label: 'Anoitecer', value: 'dusk' },
        ],
        group: 'Condições',
      },
      { name: 'Clima Necessário', key: 'requiredWeather', type: 'array', default: [], group: 'Condições' },
      { name: 'Ao Spawnar', key: 'onSpawn', type: 'script', default: '', group: 'Eventos' },
      { name: 'Quando Todos Mortos', key: 'onAllDead', type: 'script', default: '', group: 'Eventos' },
    ],
  },

  portal: {
    type: 'portal',
    name: 'Portal',
    icon: '🌀',
    description: 'Teleporta o jogador para outro local',
    category: 'gameplay',
    allowMultiple: false,
    properties: [
      { name: 'ID do Portal', key: 'portalId', type: 'string', default: '', group: 'Identificação' },
      { name: 'Mapa Destino', key: 'destinationMap', type: 'asset', default: '', group: 'Destino' },
      { name: 'Posição Destino', key: 'destinationPosition', type: 'vector3', default: { x: 0, y: 0, z: 0 }, group: 'Destino' },
      { name: 'Rotação Destino', key: 'destinationRotation', type: 'number', default: 0, min: 0, max: 360, group: 'Destino' },
      { name: 'Nível Mínimo', key: 'requiredLevel', type: 'number', default: 0, min: 0, max: 100, group: 'Requisitos' },
      { name: 'Quest Necessária', key: 'requiredQuest', type: 'asset', default: '', group: 'Requisitos' },
      { name: 'Item Necessário', key: 'requiredItem', type: 'asset', default: '', description: 'Consumido ao usar', group: 'Requisitos' },
      { name: 'Efeito do Portal', key: 'portalEffect', type: 'asset', default: '', group: 'Visual' },
      { name: 'Efeito de Teleporte', key: 'teleportEffect', type: 'asset', default: '', group: 'Visual' },
      { name: 'Ao Iniciar Teleporte', key: 'onTeleportStart', type: 'script', default: '', group: 'Eventos' },
      { name: 'Ao Finalizar Teleporte', key: 'onTeleportEnd', type: 'script', default: '', group: 'Eventos' },
    ],
  },

  quest_giver: {
    type: 'quest_giver',
    name: 'Quest Giver',
    icon: '❗',
    description: 'Distribui quests aos jogadores',
    category: 'gameplay',
    allowMultiple: false,
    properties: [
      { name: 'ID', key: 'questGiverId', type: 'string', default: '', group: 'Identificação' },
      { name: 'Quests Disponíveis', key: 'availableQuests', type: 'array', default: [], group: 'Quests' },
      { name: 'Ícone Quest Disponível', key: 'availableQuestIcon', type: 'asset', default: '', group: 'Indicadores' },
      { name: 'Ícone Quest em Progresso', key: 'inProgressQuestIcon', type: 'asset', default: '', group: 'Indicadores' },
      { name: 'Ícone Quest Completável', key: 'completableQuestIcon', type: 'asset', default: '', group: 'Indicadores' },
      { name: 'Ao Aceitar Quest', key: 'onQuestAccept', type: 'script', default: '', group: 'Eventos' },
      { name: 'Ao Completar Quest', key: 'onQuestComplete', type: 'script', default: '', group: 'Eventos' },
      { name: 'Ao Recusar Quest', key: 'onQuestDecline', type: 'script', default: '', group: 'Eventos' },
    ],
  },

  loot_container: {
    type: 'loot_container',
    name: 'Loot Container',
    icon: '📦',
    description: 'Container com itens para saquear',
    category: 'gameplay',
    allowMultiple: false,
    properties: [
      { name: 'ID do Container', key: 'containerId', type: 'string', default: '', group: 'Identificação' },
      {
        name: 'Tipo', key: 'containerType', type: 'select', default: 'chest',
        options: [
          { label: 'Baú', value: 'chest' },
          { label: 'Corpo', value: 'corpse' },
          { label: 'Barril', value: 'barrel' },
          { label: 'Caixa', value: 'crate' },
          { label: 'Customizado', value: 'custom' },
        ],
        group: 'Configuração',
      },
      { name: 'Tabela de Loot', key: 'lootTable', type: 'array', default: [], group: 'Loot' },
      { name: 'Respawnar Loot', key: 'respawnLoot', type: 'boolean', default: false, group: 'Comportamento' },
      { name: 'Tempo de Respawn (s)', key: 'respawnTime', type: 'number', default: 300, min: 0, max: 86400, group: 'Comportamento' },
      { name: 'Destruir Quando Vazio', key: 'destroyWhenEmpty', type: 'boolean', default: false, group: 'Comportamento' },
      { name: 'Chave Necessária', key: 'requiredKey', type: 'asset', default: '', group: 'Requisitos' },
      { name: 'Nível de Lockpicking', key: 'lockLevel', type: 'number', default: 0, min: 0, max: 100, group: 'Requisitos' },
      { name: 'Animação Abrir', key: 'openAnimation', type: 'asset', default: '', group: 'Animação' },
      { name: 'Ao Abrir', key: 'onOpen', type: 'script', default: '', group: 'Eventos' },
      { name: 'Ao Saquear', key: 'onLoot', type: 'script', default: '', group: 'Eventos' },
      { name: 'Quando Vazio', key: 'onEmpty', type: 'script', default: '', group: 'Eventos' },
    ],
  },

  waypoint: {
    type: 'waypoint',
    name: 'Waypoint',
    icon: '📍',
    description: 'Ponto de referência para patrulhas e navegação',
    category: 'ai',
    allowMultiple: true,
    properties: [
      { name: 'ID', key: 'waypointId', type: 'string', default: '', group: 'Identificação' },
      { name: 'Nome', key: 'waypointName', type: 'string', default: '', group: 'Identificação' },
      { name: 'Grupo', key: 'waypointGroup', type: 'string', default: '', group: 'Navegação' },
      { name: 'Waypoints Conectados', key: 'connectedWaypoints', type: 'array', default: [], group: 'Navegação' },
      { name: 'Tempo de Espera (s)', key: 'waitTime', type: 'number', default: 0, min: 0, max: 60, group: 'Comportamento' },
      { name: 'Ação no Waypoint', key: 'actionAtWaypoint', type: 'script', default: '', group: 'Ações' },
    ],
  },

  audio_source: {
    type: 'audio_source',
    name: 'Audio Source',
    icon: '🔊',
    description: 'Reproduz sons no ambiente',
    category: 'audio',
    allowMultiple: true,
    properties: [
      { name: 'Áudio', key: 'audioClip', type: 'asset', default: '', group: 'Áudio' },
      { name: 'Volume', key: 'volume', type: 'number', default: 1, min: 0, max: 1, step: 0.1, group: 'Áudio' },
      { name: 'Pitch', key: 'pitch', type: 'number', default: 1, min: 0.1, max: 3, step: 0.1, group: 'Áudio' },
      { name: 'Loop', key: 'loop', type: 'boolean', default: false, group: 'Reprodução' },
      { name: 'Tocar ao Iniciar', key: 'playOnStart', type: 'boolean', default: false, group: 'Reprodução' },
      { name: 'Som 3D', key: 'spatial', type: 'boolean', default: true, group: 'Espacial' },
      { name: 'Distância Mínima', key: 'minDistance', type: 'number', default: 1, min: 0, max: 100, group: 'Espacial' },
      { name: 'Distância Máxima', key: 'maxDistance', type: 'number', default: 50, min: 1, max: 500, group: 'Espacial' },
      { name: 'Ao Tocar', key: 'onPlay', type: 'script', default: '', group: 'Eventos' },
      { name: 'Ao Parar', key: 'onStop', type: 'script', default: '', group: 'Eventos' },
    ],
  },

  particle_emitter: {
    type: 'particle_emitter',
    name: 'Particle Emitter',
    icon: '✨',
    description: 'Emite partículas visuais',
    category: 'visual',
    allowMultiple: true,
    properties: [
      { name: 'Efeito', key: 'particleEffect', type: 'asset', default: '', group: 'Partículas' },
      { name: 'Tocar ao Iniciar', key: 'playOnStart', type: 'boolean', default: true, group: 'Reprodução' },
      { name: 'Loop', key: 'loop', type: 'boolean', default: true, group: 'Reprodução' },
      { name: 'Duração (s)', key: 'duration', type: 'number', default: 5, min: 0.1, max: 60, group: 'Reprodução' },
      { name: 'Ao Iniciar', key: 'onStart', type: 'script', default: '', group: 'Eventos' },
      { name: 'Ao Finalizar', key: 'onEnd', type: 'script', default: '', group: 'Eventos' },
    ],
  },

  light: {
    type: 'light',
    name: 'Light',
    icon: '💡',
    description: 'Fonte de luz',
    category: 'visual',
    allowMultiple: true,
    properties: [
      {
        name: 'Tipo', key: 'lightType', type: 'select', default: 'point',
        options: [
          { label: 'Pontual', value: 'point' },
          { label: 'Spot', value: 'spot' },
          { label: 'Direcional', value: 'directional' },
        ],
        group: 'Tipo',
      },
      { name: 'Cor', key: 'color', type: 'color', default: '#ffffff', group: 'Aparência' },
      { name: 'Intensidade', key: 'intensity', type: 'number', default: 1, min: 0, max: 10, step: 0.1, group: 'Aparência' },
      { name: 'Alcance', key: 'range', type: 'number', default: 10, min: 1, max: 100, group: 'Aparência' },
      { name: 'Projetar Sombras', key: 'castShadows', type: 'boolean', default: true, group: 'Sombras' },
      { name: 'Ângulo do Spot', key: 'spotAngle', type: 'number', default: 45, min: 1, max: 180, group: 'Spot' },
      { name: 'Tremer', key: 'flicker', type: 'boolean', default: false, group: 'Animação' },
      { name: 'Velocidade Tremor', key: 'flickerSpeed', type: 'number', default: 1, min: 0.1, max: 10, step: 0.1, group: 'Animação' },
    ],
  },

  collider: {
    type: 'collider',
    name: 'Collider',
    icon: '🔲',
    description: 'Área de colisão física',
    category: 'physics',
    allowMultiple: true,
    properties: [
      {
        name: 'Forma', key: 'shape', type: 'select', default: 'box',
        options: [
          { label: 'Cubo', value: 'box' },
          { label: 'Esfera', value: 'sphere' },
          { label: 'Cápsula', value: 'capsule' },
          { label: 'Mesh', value: 'mesh' },
        ],
        group: 'Forma',
      },
      { name: 'É Trigger', key: 'isTrigger', type: 'boolean', default: false, description: 'Detecta colisões sem bloquear', group: 'Configuração' },
      { name: 'Tamanho', key: 'size', type: 'vector3', default: { x: 1, y: 1, z: 1 }, description: 'Dimensões do collider', group: 'Dimensões' },
      { name: 'Offset', key: 'offset', type: 'vector3', default: { x: 0, y: 0, z: 0 }, description: 'Deslocamento do centro', group: 'Dimensões' },
      {
        name: 'Layer', key: 'layer', type: 'select', default: 'default',
        description: 'Camada de colisão',
        options: [
          { label: 'Default', value: 'default' },
          { label: 'Player', value: 'player' },
          { label: 'Enemy', value: 'enemy' },
          { label: 'NPC', value: 'npc' },
          { label: 'Interactable', value: 'interactable' },
          { label: 'Projectile', value: 'projectile' },
          { label: 'Trigger', value: 'trigger' },
          { label: 'Ground', value: 'ground' },
          { label: 'Wall', value: 'wall' },
        ],
        group: 'Colisão',
      },
    ],
  },

  animator: {
    type: 'animator',
    name: 'Animator',
    icon: '🎬',
    description: 'Controla animações do objeto',
    category: 'visual',
    allowMultiple: false,
    properties: [
      { name: 'Estado Padrão', key: 'defaultState', type: 'string', default: 'idle', group: 'Estados' },
      { name: 'Estados', key: 'states', type: 'array', default: [], group: 'Estados' },
      { name: 'Parâmetros', key: 'parameters', type: 'object', default: {}, group: 'Parâmetros' },
    ],
  },

  custom_script: {
    type: 'custom_script',
    name: 'Custom Script',
    icon: '📜',
    description: 'Script customizado',
    category: 'scripting',
    allowMultiple: true,
    properties: [
      { name: 'ID do Script', key: 'scriptId', type: 'asset', default: '', group: 'Script' },
      { name: 'Nome', key: 'scriptName', type: 'string', default: '', group: 'Identificação' },
      { name: 'Parâmetros', key: 'parameters', type: 'object', default: {}, group: 'Parâmetros' },
    ],
  },
}

/**
 * Retorna componentes agrupados por categoria
 */
export function getComponentsByCategory(): Record<string, ComponentDefinition[]> {
  const grouped: Record<string, ComponentDefinition[]> = {}

  Object.values(COMPONENT_DEFINITIONS).forEach((def) => {
    if (!grouped[def.category]) {
      grouped[def.category] = []
    }
    grouped[def.category].push(def)
  })

  return grouped
}

/**
 * Nomes das categorias para exibição
 */
export const CATEGORY_NAMES: Record<string, string> = {
  gameplay: 'Gameplay',
  interaction: 'Interação',
  visual: 'Visual',
  audio: 'Áudio',
  physics: 'Física',
  ai: 'IA',
  scripting: 'Scripts',
}
