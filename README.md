# MMORPG Builder

Um editor/builder de jogos MMORPG 3D open-source construído com React, TypeScript e Three.js. Crie mundos, posicione NPCs, configure comportamentos de IA e muito mais - tudo no navegador.

## Demonstração

O projeto oferece dois modos de operação:

- **Modo Play**: Jogue e teste seu mundo em tempo real
- **Modo Editor**: Construa e edite seu mundo com ferramentas visuais

## Tecnologias

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| React | 18.2.0 | Interface do usuário |
| TypeScript | 5.2.2 | Linguagem principal |
| Three.js | 0.158.0 | Renderização 3D |
| @react-three/fiber | 8.15.0 | Integração React + Three.js |
| @react-three/drei | 9.88.0 | Utilitários 3D |
| Vite | 5.0.0 | Build tool |

## Instalação

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Setup

```bash
# Clone o repositório
git clone https://github.com/SEU_USUARIO/mmorpg-builder.git
cd mmorpg-builder

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

O projeto estará disponível em `http://localhost:5173`

## Build para Produção

```bash
# Gera a build em ./dist/
npm run build

# Preview da build de produção
npm run preview
```

## Estrutura do Projeto

```
mmorpg-builder/
├── public/
│   └── assets/
│       └── models/           # Modelos 3D (GLB/GLTF)
│           ├── characters/   # Personagens (jogador, NPCs)
│           └── props/        # Props, móveis, decoração
├── src/
│   ├── engine/              # Core da engine
│   │   ├── Engine.ts        # Orquestrador principal
│   │   ├── GameScene.ts     # Cena Three.js
│   │   └── GameLoop.ts      # Loop de atualização
│   ├── entities/            # Entidades do jogo
│   │   ├── Entity.ts        # Classe base
│   │   ├── Player.ts        # Jogador
│   │   └── MapObject.ts     # Objetos do mapa
│   ├── systems/             # Sistemas do jogo
│   │   ├── AISystem.ts      # Comportamentos de IA
│   │   ├── CollisionSystem.ts
│   │   ├── InputSystem.ts
│   │   ├── CameraSystem.ts
│   │   └── EditorSystem.ts
│   ├── components/          # Componentes React UI
│   │   └── editor/          # Painéis do editor
│   ├── types/               # Definições TypeScript
│   ├── data/                # Definições de componentes
│   ├── assets/              # Registro de assets
│   └── utils/               # Utilitários
└── dist/                    # Build de produção
```

## Como Usar

### Modo Play (Jogar)

- **WASD / Setas**: Movimentar personagem
- **E**: Interagir com NPCs e objetos
- **Mouse**: Olhar ao redor (em desenvolvimento)

### Modo Editor

Acesse com `?mode=editor` na URL ou clique no botão "Editor" na interface.

**Controles do Editor:**
- **Click esquerdo**: Selecionar objeto
- **Arrastar**: Mover câmera (orbit)
- **Scroll**: Zoom
- **Transform Gizmo**: Mover/Rotacionar/Escalar objetos selecionados
- **Delete**: Remover objeto selecionado

**Painéis:**
- **Hierarquia**: Lista de objetos na cena
- **Assets**: Biblioteca de modelos 3D para adicionar
- **Inspetor**: Propriedades e componentes do objeto selecionado

## Modelos 3D

### Formatos Suportados

| Formato | Extensão | Descrição |
|---------|----------|-----------|
| **GLTF Binary** | `.glb` | Recomendado - arquivo único com texturas embutidas |
| **GLTF** | `.gltf` + `.bin` | Formato separado (texturas em arquivos externos) |

### Como Adicionar Novos Modelos

1. **Prepare seu modelo:**
   - Exporte como `.glb` (formato binário GLTF)
   - Certifique-se de que texturas estão embutidas
   - Escala recomendada: 1 unidade = 1 metro

2. **Coloque o arquivo:**
   ```
   public/assets/models/
   ├── characters/   # Para personagens e NPCs
   └── props/        # Para objetos, móveis, itens
       └── SUA_CATEGORIA/
           └── seu_modelo.glb
   ```

3. **Registre no AssetRegistry:**
   ```typescript
   // src/assets/AssetRegistry.ts
   {
     id: 'meu_modelo',
     name: 'Meu Modelo',
     path: '/assets/models/props/categoria/seu_modelo.glb',
     type: 'prop',  // ou 'npc', 'item', 'building', etc.
     category: 'Sua Categoria',
     defaultComponents: ['collider'], // componentes padrão
   }
   ```

### Fonte dos Assets Incluídos

Os modelos 3D incluídos são do **KayKit** - uma coleção de assets gratuitos para jogos:

- [KayKit Dungeon Remastered](https://kaylousberg.itch.io/kaykit-dungeon-remastered)
- [KayKit Character Pack](https://kaylousberg.itch.io/kaykit-adventurers)

**Licença dos assets KayKit:** CC0 (domínio público) - Podem ser usados em projetos comerciais e não-comerciais.

### Requisitos para Modelos Personalizados

- **Formato:** GLB (GLTF 2.0 binário)
- **Texturas:** Embutidas no arquivo ou PBR (BaseColor, Normal, Roughness)
- **Escala:** 1 unidade = 1 metro
- **Origem:** Centro do modelo no "chão" (Y = 0)
- **Animações:** Nomeadas (ex: "Idle", "Walking", "Attack") para NPCs

**Softwares para criar/exportar:**
- Blender (gratuito) - Exporte como glTF 2.0
- Maya / 3ds Max - Com plugin GLTF
- Sketchfab - Download em GLB

## Sistema de Componentes

Cada objeto no mapa pode ter múltiplos componentes que definem seu comportamento:

### Componentes Disponíveis

| Componente | Descrição |
|------------|-----------|
| `collider` | Colisão física (box, sphere, capsule) |
| `interactable` | Permite interação com E |
| `npc` | Define NPC com nome, comportamento, atitude |
| `door` | Porta com animação e requisitos |
| `trigger` | Área que dispara eventos |
| `spawner` | Gera entidades automaticamente |
| `portal` | Teleporte entre áreas |
| `quest_giver` | NPC que distribui quests |
| `loot_container` | Baú com tabela de loot |
| `shop` | Interface de compra/venda |
| `waypoint` | Pontos de patrulha para IA |
| `animator` | Máquina de estados de animação |
| `light` | Luz point/spot/directional |
| `audio_source` | Som 3D posicional |
| `particle_emitter` | Efeitos visuais |
| `custom_script` | Scripts customizados |

### Adicionando Componentes

1. Selecione um objeto no editor
2. No painel Inspetor, clique em "Adicionar Componente"
3. Configure as propriedades do componente

## Sistema de IA

### Comportamentos de NPC

| Comportamento | Descrição |
|---------------|-----------|
| `stationary` | Fica parado, olha para o jogador se hostil |
| `patrol` | Caminha entre waypoints definidos |
| `wander` | Movimento aleatório dentro de um raio |
| `follow` | Segue o jogador (NPCs amigáveis) |
| `flee` | Foge do jogador |

### Atitudes

| Atitude | Cor do Nome | Comportamento |
|---------|-------------|---------------|
| `friendly` | Verde | Não ataca, pode seguir |
| `neutral` | Branco | Ignora o jogador |
| `hostile` | Vermelho | Persegue e ataca |

### Zona Segura

O centro do mapa (raio de 12 unidades) é uma zona segura onde NPCs hostis não podem entrar. Ideal para vilas e áreas de comércio.

## Salvando e Carregando Mapas

### Salvar Mapa

O mapa é serializado em JSON e pode ser:
- Salvo no localStorage do navegador
- Baixado como arquivo `.json`

### Carregar Mapa

- Upload de arquivo JSON
- Carregar do localStorage

### Formato do Mapa

```json
{
  "id": "meu_mapa",
  "name": "Meu Mapa",
  "version": "1.0.0",
  "objects": [
    {
      "id": "obj_001",
      "name": "Mercador",
      "assetId": "char_mage",
      "transform": {
        "position": { "x": 0, "y": 0, "z": 5 },
        "rotation": { "x": 0, "y": 0, "z": 0 },
        "scale": { "x": 1, "y": 1, "z": 1 }
      },
      "components": [
        {
          "id": "npc_1",
          "type": "npc",
          "displayName": "Aldric",
          "attitude": "friendly",
          "behavior": "stationary"
        }
      ]
    }
  ]
}
```

## Arquitetura

### Padrões de Design

- **Singleton**: Engine global (`getEngine()`)
- **Component-Based**: Entidades compostas por componentes
- **Observer/Pub-Sub**: Sistema de eventos (`onModeChange`, `onObjectSelected`)
- **State Machine**: Estados de IA (idle → chase → attack)
- **Strategy**: Diferentes comportamentos de NPC

### Fluxo de Atualização (Game Loop)

```
Cada Frame:
├── Atualiza Colisores
├── Atualiza Player (modo play)
│   ├── Processa input
│   ├── Resolve colisões
│   └── Detecta interações
├── Atualiza Animações
├── Atualiza IA (NPCs)
├── Atualiza Câmera
├── Atualiza Editor (modo editor)
└── Renderiza Cena
```

## Extensibilidade

### Adicionando Novo Sistema

```typescript
// src/systems/MeuSistema.ts
import { GameSystem } from '@/types';

export class MeuSistema implements GameSystem {
  init(domElement?: HTMLElement): void {
    // Inicialização
  }

  update(deltaTime: number): void {
    // Atualização por frame
  }

  destroy(): void {
    // Limpeza
  }
}
```

### Adicionando Novo Componente

1. Adicione o tipo em `src/types/components.ts`
2. Defina as propriedades em `src/data/ComponentDefinitions.ts`
3. Implemente a lógica no sistema apropriado

## Limitações Atuais

- Single player apenas (sem multiplayer/networking)
- Terreno plano (sem sistema de terreno procedural)
- Sistema de áudio não implementado
- Sistema de partículas básico
- Sem sistema de inventário
- Sem sistema de quests completo

## Roadmap

- [ ] Sistema de multiplayer
- [ ] Editor de terreno
- [ ] Sistema de áudio completo
- [ ] Sistema de partículas avançado
- [ ] Sistema de inventário
- [ ] Sistema de quests
- [ ] Sistema de diálogos
- [ ] Exportação para executável

## Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## Licença

Este projeto é open-source sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

Os assets 3D incluídos (KayKit) são CC0 (domínio público).

## Créditos

- **Engine/Editor**: Desenvolvido com React + Three.js
- **Assets 3D**: [KayKit by Kay Lousberg](https://kaylousberg.itch.io/)
- **Ícones**: Emojis nativos do sistema
