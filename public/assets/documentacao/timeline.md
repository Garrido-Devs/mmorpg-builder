# Timeline do Projeto MMORPG Builder

## Visão Geral

O MMORPG Builder é uma plataforma para criar jogos MMORPG estilo RuneScape diretamente no navegador, com colaboração em tempo real.

---

## Fase 1: Fundação (Concluído)

### Engine 3D
- Motor de jogo baseado em Three.js
- Sistema de câmera com OrbitControls
- Carregamento de modelos GLTF/GLB
- Sistema de iluminação dinâmica

### Editor de Mapas
- Seleção de objetos via raycaster
- TransformControls para mover/rotacionar/escalar
- Painel de inspeção de propriedades
- Sistema de componentes para entidades

### Componentes Base
- Transform (posição, rotação, escala)
- Collider (física básica)
- Interactable (interações)
- Trigger (áreas de ativação)
- Audio Source (sons 3D)
- Light (iluminação)
- Particle Emitter (partículas)

---

## Fase 2: Componentes MMORPG (Concluído)

### Sistemas de Skill
- Resource Node (mineração, pesca, lenhador)
- Crafting Station (forja, fogão, bancada)
- Farming Patch (agricultura)
- Agility Obstacle (parkour)

### Economia
- Bank (armazenamento)
- Shop (lojas de NPCs)
- Equipment (sistema de equipamentos)

### Religião e Magia
- Prayer Altar (altares de oração)
- Spell casting (em desenvolvimento)

### NPCs e Quests
- NPC (personagens não jogáveis)
- Quest Giver (missões)
- Dialogue System (diálogos)

---

## Fase 3: Colaboração em Tempo Real (Concluído)

### Autenticação
- Sistema de login/registro
- JWT para sessões
- Perfis de usuário

### Times
- Criação de times
- Sistema de convites por link
- Papéis: Owner, Admin, Member
- Gerenciamento de membros

### Projetos
- Criação de projetos por time
- Metadados do jogo
- Versionamento de dados

### Colaboração
- Edição em tempo real via Pusher
- Indicadores de presença
- Sincronização automática
- Resolução de conflitos

---

## Fase 4: Interface do Jogo (Em Desenvolvimento)

### Telas
- Intro
- Loading
- Menu Principal
- Menu de Pausa

### HUD
- Barra de vida/mana
- Inventário
- Mapa mini
- Chat

---

## Fase 5: Publicação (Planejado)

### Deploy
- Build otimizado
- Hospedagem na Vercel
- CDN para assets

### Compartilhamento
- Link público do jogo
- Embed em sites externos
- Estatísticas de acesso

---

## Tecnologias Utilizadas

### Frontend
- React 18
- TypeScript
- Three.js / React Three Fiber
- React Router
- Pusher.js

### Backend
- Vercel Serverless Functions
- Vercel Postgres
- Vercel KV (cache)
- Vercel Blob (assets)

### Autenticação
- bcrypt (hash de senhas)
- jose (JWT)

---

## Contribuidores

- Desenvolvedor Principal
- Claude (AI Assistant)

---

## Links

- [Documentação](/docs)
- [Blog/Features](/blog)
- [GitHub](#)
