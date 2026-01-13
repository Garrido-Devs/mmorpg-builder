# Checklist de Funcionalidades - MMORPG Builder

Este documento lista todas as funcionalidades prometidas no site e seu status de funcionamento.
Cada item precisa ser validado manualmente.

**Legenda:**
- [ ] Nao testado
- [x] Funcionando
- [!] Com problemas
- [-] Nao implementado

---

## Bugs Conhecidos

- [x] ~~**BUG: Pagina /assets retorna 404 no Vercel**~~ - CORRIGIDO em vercel.json (alterado regex de `assets` para `assets/`)

---

## 1. Sistema de Colaboracao (Fase 3 - Atual)

### 1.1 Autenticacao
- [ ] Registro de conta (`/auth/register`)
- [ ] Login (`/auth/login`)
- [ ] Logout
- [ ] Sessao JWT persistente
- [ ] Protecao de rotas privadas

### 1.2 Times
- [ ] Criar time
- [ ] Listar times do usuario
- [ ] Ver detalhes do time (`/teams/:id`)
- [ ] Editar nome do time
- [ ] Deletar time
- [ ] Gerenciar membros (adicionar/remover)
- [ ] Sistema de permissoes (Owner, Admin, Member)

### 1.3 Convites
- [ ] Gerar link de convite unico
- [ ] Entrar em time via link (`/join/:code`)
- [ ] Regenerar link de convite
- [ ] Validacao de codigo de convite

### 1.4 Projetos
- [ ] Criar projeto
- [ ] Listar projetos do time
- [ ] Editar projeto
- [ ] Deletar projeto
- [ ] Abrir projeto no editor

### 1.5 Colaboracao em Tempo Real
- [ ] Presenca de usuarios online
- [ ] Cursores coloridos de outros usuarios
- [ ] Sincronizacao automatica de alteracoes
- [ ] Resolucao de conflitos

### 1.6 Salvamento na Nuvem
- [ ] Auto-save de projetos
- [ ] Carregar projeto do servidor
- [ ] Historico de versoes (se implementado)

---

## 2. Editor Visual (Fase 1)

### 2.1 Interface do Editor
- [ ] Viewport 3D com Three.js
- [ ] Painel de hierarquia (lista de objetos)
- [ ] Painel de inspector (propriedades do objeto)
- [ ] Painel de assets (biblioteca de modelos)
- [ ] Barra de ferramentas

### 2.2 Transformacoes
- [ ] Selecionar objetos (click)
- [ ] Mover objetos (translate gizmo)
- [ ] Rotacionar objetos (rotate gizmo)
- [ ] Escalar objetos (scale gizmo)
- [ ] Atalhos de teclado (W, E, R)

### 2.3 Camera
- [ ] Orbitar camera (arrastar)
- [ ] Zoom (scroll)
- [ ] Pan (shift + arrastar)
- [ ] Reset camera

### 2.4 Gerenciamento de Objetos
- [ ] Adicionar objeto da biblioteca
- [ ] Duplicar objeto
- [ ] Deletar objeto
- [ ] Renomear objeto
- [ ] Agrupar/desagrupar

---

## 3. Assets 3D (Fase 1)

### 3.1 Biblioteca de Assets
- [ ] Pagina de assets (`/assets`) - ~~BUG corrigido~~
- [ ] Painel de assets no editor
- [ ] Busca por nome
- [ ] Filtro por categoria
- [ ] Preview do modelo 3D
- [ ] Detalhes do asset (ID, tipo, categoria)

### 3.2 Categorias de Assets
- [ ] Characters (personagens jogaveis)
- [ ] Enemies (inimigos/monstros)
- [ ] Props (objetos decorativos)
- [ ] Furniture (moveis)
- [ ] Weapons (armas)
- [ ] Nature (arvores, pedras, etc.)
- [ ] Structures (construcoes)

### 3.3 Modelos Especificos
- [ ] Barbarian (com animacoes)
- [ ] Knight (com animacoes)
- [ ] Mage (com animacoes)
- [ ] Rogue (com animacoes)
- [ ] Skeleton (com animacoes)
- [ ] Skeleton Minion
- [ ] Skeleton Mage

---

## 4. Sistema de Componentes (Fase 1)

### 4.1 Componentes Basicos
- [ ] Collider (colisao)
- [ ] Interactable (interacao)
- [ ] Trigger (area de ativacao)
- [ ] Door (porta abre/fecha)
- [ ] Spawner (gera objetos)

### 4.2 Componentes de Jogo
- [ ] NPC (personagem nao jogavel)
- [ ] Portal (teletransporte)
- [ ] Quest Giver (dador de quest)
- [ ] Loot Container (bau de loot)
- [ ] Shop (loja)
- [ ] Waypoint (ponto de patrulha)

### 4.3 Componentes de Midia
- [ ] Light (iluminacao)
- [ ] Audio Source (som)
- [ ] Particle Emitter (particulas)
- [ ] Animator (animacoes)

### 4.4 Componentes MMORPG (Fase 2)
- [ ] Resource Node (minerio, arvore, etc.)
- [ ] Crafting Station (mesa de craft)
- [ ] Bank (banco de itens)
- [ ] Skill Training (treino de skills)
- [ ] Equipment (sistema de equipamento)
- [ ] Prayer Altar (altar de prece)
- [ ] Agility Course (parkour)
- [ ] Farming Patch (agricultura)

### 4.5 Inspector de Componentes
- [ ] Adicionar componente ao objeto
- [ ] Remover componente
- [ ] Editar propriedades do componente
- [ ] Ver componentes padrao do asset

---

## 5. Sistema de IA (Fase 1)

### 5.1 Comportamentos (Behaviors)
- [ ] Stationary (parado)
- [ ] Patrol (patrulha entre pontos)
- [ ] Wander (vagar aleatoriamente)
- [ ] Follow (seguir jogador)
- [ ] Flee (fugir do jogador)

### 5.2 Atitudes
- [ ] Friendly (amigavel - verde)
- [ ] Neutral (neutro - branco)
- [ ] Hostile (hostil - vermelho)

### 5.3 Parametros de IA
- [ ] Detection range (8 unidades)
- [ ] Attack range (1.5 unidades)
- [ ] Attack cooldown (1.5s)
- [ ] Safe zone (12 unidades do centro)
- [ ] Patrol speed
- [ ] Wander radius

### 5.4 Combate
- [ ] Detectar jogador no range
- [ ] Iniciar combate
- [ ] Sistema de ataque
- [ ] Sistema de dano
- [ ] Morte do NPC/Jogador

---

## 6. Sistema de Mapas (Fase 1)

### 6.1 Salvar/Carregar
- [ ] Salvar mapa local (localStorage)
- [ ] Carregar mapa local
- [ ] Exportar mapa (download JSON)
- [ ] Importar mapa (upload JSON)

### 6.2 Serializacao
- [ ] Salvar posicao dos objetos
- [ ] Salvar rotacao dos objetos
- [ ] Salvar escala dos objetos
- [ ] Salvar componentes dos objetos
- [ ] Salvar propriedades dos componentes

---

## 7. Modo Play

### 7.1 Controles do Jogador
- [ ] Movimento (WASD ou setas)
- [ ] Camera em terceira pessoa
- [ ] Colisao com objetos
- [ ] Interacao com objetos (E ou click)

### 7.2 HUD do Jogo
- [ ] Barra de vida
- [ ] Barra de mana/energia
- [ ] Inventario
- [ ] Minimapa
- [ ] Chat (se multiplayer)

### 7.3 Sistemas de Jogo
- [ ] Sistema de combate
- [ ] Sistema de loot
- [ ] Sistema de quests
- [ ] Sistema de dialogo
- [ ] Sistema de crafting
- [ ] Sistema de skills

---

## 8. Paginas do Site

### 8.1 Paginas Publicas
- [ ] Landing page (`/`)
- [ ] Documentacao (`/docs`)
- [ ] Documentacao por secao (`/docs/:section`)
- [ ] Assets (`/assets`) - ~~BUG corrigido~~
- [ ] Showcase (`/showcase`)
- [ ] Blog/Features (`/blog`)
- [ ] Quiz (`/blog/quiz`)

### 8.2 Paginas de Auth
- [ ] Login (`/auth/login`)
- [ ] Register (`/auth/register`)
- [ ] Join Team (`/join/:code`)

### 8.3 Paginas Protegidas
- [ ] Dashboard (`/dashboard`)
- [ ] Teams (`/teams`)
- [ ] Team Detail (`/teams/:id`)
- [ ] Projects (`/projects`)
- [ ] Editor (`/editor`)
- [ ] Editor com projeto (`/editor/:projectId`)

### 8.4 Modo de Jogo
- [ ] Play (`/play`)
- [ ] Play com mapa especifico

---

## 9. Deploy e Infraestrutura

### 9.1 Vercel
- [ ] Deploy automatico
- [ ] Functions serverless funcionando
- [ ] Postgres conectado
- [ ] Blob storage funcionando
- [ ] KV storage funcionando

### 9.2 API Endpoints
- [ ] `POST /api/auth/register`
- [ ] `POST /api/auth/login`
- [ ] `POST /api/auth/logout`
- [ ] `GET /api/auth/check`
- [ ] `GET /api/projects`
- [ ] `POST /api/projects`
- [ ] `PUT /api/projects/:id`
- [ ] `DELETE /api/projects/:id`
- [ ] `GET /api/teams`
- [ ] `POST /api/teams`
- [ ] `GET /api/teams/:id`
- [ ] `PUT /api/teams/:id`
- [ ] `DELETE /api/teams/:id`
- [ ] `POST /api/teams/:id/invite`
- [ ] `POST /api/teams/join/:code`
- [ ] `POST /api/realtime/presence`
- [ ] `POST /api/realtime/sync`

---

## 10. Documentacao

### 10.1 Docs Embutidos (`/docs`)
- [ ] Getting Started
- [ ] Assets 3D
- [ ] Components
- [ ] AI System
- [ ] Maps
- [ ] Contributing

### 10.2 Blog/Features (`/blog`)
- [ ] Getting Started
- [ ] Editor
- [ ] Components
- [ ] AI System
- [ ] Combat System
- [ ] Crafting
- [ ] Skills System
- [ ] Quests
- [ ] Portals
- [ ] NPCs & Dialogs
- [ ] Collaboration
- [ ] Bank System
- [ ] Assets Guide
- [ ] Deploy to Vercel
- [ ] FAQ

---

## 11. HUD Estilo MMORPG (NOVO)

> **IMPLEMENTADO:** HUD aparece no Editor (modo Play) e na pagina /play

### 11.1 Barras de Status (PlayerFrame.tsx)
- [x] Barra de vida (HP)
- [x] Barra de mana/energia (MP)
- [ ] Barra de stamina
- [x] Barra de experiencia (XP)
- [x] Indicador de nivel

### 11.2 Mapa e Navegacao (Minimap.tsx)
- [x] Minimapa no canto da tela
- [ ] Mapa completo (M para abrir)
- [ ] Icones de NPCs no mapa
- [ ] Icones de quests no mapa
- [ ] Waypoints/marcadores

### 11.3 Nomes e Indicadores
- [ ] Nome em cima dos personagens (jogadores)
- [ ] Nome em cima dos NPCs
- [ ] Barra de vida em cima dos inimigos
- [ ] Indicadores de nivel dos NPCs
- [ ] Titulos/guildas dos jogadores

### 11.4 Target Frame (TargetFrame.tsx)
- [x] Selecao de alvo (click em NPC/inimigo)
- [x] Info do alvo (nome, nivel, vida)
- [x] Deselecionar alvo

### 11.5 Action Bar (ActionBar.tsx)
- [x] Barra de acoes/skills
- [x] Hotkeys (1-9, 0)
- [ ] Arrastar skills para barra
- [x] Cooldown visual

### 11.6 Interface de Chat
- [ ] Janela de chat
- [ ] Chat global
- [ ] Chat de grupo/party
- [ ] Chat privado (whisper)
- [ ] Chat de guilda
- [ ] Filtro de palavras
- [ ] Historico de mensagens

---

## 12. Sistema de Inventario (NOVO)

### 12.1 Mochila/Bag
- [ ] Interface de mochila (I para abrir)
- [ ] Grid de slots
- [ ] Arrastar e soltar itens
- [ ] Empilhar itens (stackable)
- [ ] Limitar peso/capacidade
- [ ] Ordenar itens
- [ ] Busca de itens

### 12.2 Bau/Bank
- [ ] Interface de bau pessoal
- [ ] Expandir slots do bau
- [ ] Transferir itens mochila <-> bau
- [ ] Baus compartilhados (guilda)
- [ ] Tabs/abas no bau

### 12.3 Equipamentos
- [ ] Interface de equipamento (C para abrir)
- [ ] Slots: cabeca, peito, pernas, pes, maos, arma, escudo, anel, colar
- [ ] Preview do personagem com equipamentos
- [ ] Comparacao de stats ao equipar
- [ ] Requisitos de nivel/classe

---

## 13. Sistema de Trade (NOVO)

### 13.1 Trade entre Jogadores
- [ ] Solicitar trade (click direito no jogador)
- [ ] Janela de trade (2 paineis)
- [ ] Adicionar itens ao trade
- [ ] Adicionar gold ao trade
- [ ] Confirmar trade (ambos)
- [ ] Cancelar trade
- [ ] Historico de trades

### 13.2 Trade com NPCs (Shop)
- [ ] Interface de loja
- [ ] Comprar itens
- [ ] Vender itens
- [ ] Precos dinamicos
- [ ] Itens em estoque limitado

---

## 14. Customizacao de Personagem (NOVO)

### 14.1 Criacao de Personagem
- [ ] Selecao de classe
- [ ] Selecao de raca
- [ ] Customizacao de aparencia
- [ ] Nome do personagem
- [ ] Preview 3D do personagem

### 14.2 Aparencia
- [ ] Cor de pele
- [ ] Cor de cabelo
- [ ] Estilo de cabelo
- [ ] Rosto/face
- [ ] Corpo (altura, largura)
- [ ] Acessorios

### 14.3 Sincronizacao Online
- [ ] Aparencia refletida no multiplayer
- [ ] Equipamentos visiveis para outros
- [ ] Animacoes sincronizadas
- [ ] Efeitos visuais de skills

---

## 15. Sistema de Audio (NOVO)

### 15.1 Pack de Sons (rpg_sound_pack.zip)
- [x] Extrair e organizar sons em `/public/assets/sounds/`
- [x] Sons de batalha (battle/)
  - [x] magic1.wav, spell.wav
  - [x] swing.wav, swing2.wav, swing3.wav
  - [x] sword-unsheathe (5 variacoes)
- [x] Sons de interface (interface/)
  - [x] interface1-6.wav
- [x] Sons de inventario (inventory/)
- [x] Sons de NPCs (NPC/)
  - [x] beetle, giant, gutteral beast, ogre, shade, slime
- [x] Sons de mundo (world/)
- [x] Sons diversos (misc/)

### 15.2 Implementacao de Audio (`src/audio/`)
- [x] Sistema de audio manager (`AudioManager.ts`)
- [ ] Reproducao de sons 3D posicionais
- [x] Volume master/musica/efeitos
- [x] Mute/unmute
- [x] Sons de UI (click, hover, abrir menu) - `useUISound()` hook
- [x] Sons de combate - `useCombatSound()` hook
- [ ] Sons de ambiente (loop)
- [ ] Musica de fundo

---

## 16. Persistencia de Dados (NOVO)

### 16.1 Dados do Jogador (Banco de Dados)
- [ ] Salvar posicao do jogador
- [ ] Salvar nivel e experiencia
- [ ] Salvar stats (HP, MP, etc.)
- [ ] Salvar inventario completo
- [ ] Salvar equipamentos equipados
- [ ] Salvar bau/bank
- [ ] Salvar gold/moedas
- [ ] Salvar skills aprendidas
- [ ] Salvar quests em progresso
- [ ] Salvar quests completadas
- [ ] Salvar achievements
- [ ] Salvar configuracoes do jogador

### 16.2 Dados do Mundo (Criador)
- [ ] Salvar mapa no banco
- [ ] Salvar NPCs e posicoes
- [ ] Salvar spawners e configs
- [ ] Salvar quests criadas
- [ ] Salvar dialogos
- [ ] Salvar lojas/precos
- [ ] Versionamento de mapas
- [ ] Backup automatico

### 16.3 Robustez
- [ ] Auto-save periodico (a cada X minutos)
- [ ] Save ao desconectar
- [ ] Save ao fechar aba/navegador
- [ ] Recuperacao de dados apos crash
- [ ] Validacao de integridade
- [ ] Rollback em caso de erro
- [ ] Logs de alteracoes

---

## Proximos Passos

1. Testar cada item acima
2. Marcar status real de cada funcionalidade
3. Corrigir bugs encontrados
4. Atualizar roadmap na landing page conforme realidade
5. Remover features nao implementadas da landing page
6. **Extrair rpg_sound_pack.zip para /public/assets/sounds/**
7. **Implementar HUD estilo MMORPG**
8. **Implementar sistema de inventario robusto**
9. **Implementar sistema de persistencia no banco**

---

## Notas de Teste

<!-- Adicione aqui notas durante os testes -->

**Data do ultimo teste:** ___/___/______

**Testado por:** _________________

**Ambiente:**
- [ ] Local (localhost)
- [ ] Producao (vercel)

**Navegador:** _________________
