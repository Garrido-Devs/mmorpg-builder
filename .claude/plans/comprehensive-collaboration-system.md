# Plano Completo: Sistema de Colaboração em Tempo Real + Documentação

## Resumo Executivo
Este plano cobre a implementação completa de:
1. Sistema de documentação e blog
2. Sistema de autenticação e times
3. Colaboração em tempo real
4. Estrutura completa do jogo (mapas, menus, etc.)
5. Backend com Vercel (KV, Postgres, Blob Storage)

---

## PARTE 1: Estrutura de Documentação

### 1.1 Criar Estrutura de Pastas
```
public/
├── assets/
│   └── documentacao/
│       ├── timeline.md
│       ├── features/
│       │   ├── editor.md
│       │   ├── components.md
│       │   ├── collaboration.md
│       │   └── ...
│       └── changelog.md
```

### 1.2 Arquivos de Documentação
- `timeline.md` - Histórico do projeto com datas
- `features/*.md` - Documentação de cada feature
- `changelog.md` - Log de mudanças

### 1.3 Página de Blog/Features
- Nova página `/blog` ou `/features`
- Lista de artigos com markdown rendering
- Categorias: Editor, Componentes, Colaboração, Gameplay

---

## PARTE 2: Sistema de Autenticação e Times

### 2.1 Database Schema (Vercel Postgres)

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Teams table
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  invite_code VARCHAR(32) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Team members
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member', -- 'owner', 'admin', 'member'
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

-- Projects (games)
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Project data (maps, entities, etc.)
CREATE TABLE project_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  data_type VARCHAR(50) NOT NULL, -- 'map', 'entity', 'menu', 'config'
  data_key VARCHAR(255) NOT NULL,
  data JSONB NOT NULL,
  version INT DEFAULT 1,
  updated_by UUID REFERENCES users(id),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(project_id, data_type, data_key)
);

-- Active sessions for real-time
CREATE TABLE active_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  cursor_position JSONB,
  last_ping TIMESTAMP DEFAULT NOW()
);
```

### 2.2 Migrations
Criar arquivos em `/api/migrations/`:
- `001_create_users.sql`
- `002_create_teams.sql`
- `003_create_team_members.sql`
- `004_create_projects.sql`
- `005_create_project_data.sql`
- `006_create_active_sessions.sql`

### 2.3 API Routes (Vercel Serverless Functions)

```
api/
├── auth/
│   ├── register.ts      POST - Criar conta
│   ├── login.ts         POST - Login
│   ├── logout.ts        POST - Logout
│   └── me.ts            GET  - Dados do usuário logado
├── teams/
│   ├── index.ts         GET/POST - Listar/Criar times
│   ├── [id].ts          GET/PUT/DELETE - Operações no time
│   ├── [id]/invite.ts   GET - Gerar link de convite
│   └── join/[code].ts   POST - Entrar via convite
├── projects/
│   ├── index.ts         GET/POST - Listar/Criar projetos
│   ├── [id].ts          GET/PUT/DELETE - Operações no projeto
│   └── [id]/data.ts     GET/PUT - Dados do projeto
├── realtime/
│   ├── connect.ts       WebSocket - Conexão real-time
│   ├── sync.ts          POST - Sincronizar mudanças
│   └── presence.ts      GET - Usuários online
└── migrations/
    └── run.ts           POST - Executar migrations
```

---

## PARTE 3: Sistema de Colaboração em Tempo Real

### 3.1 Tecnologia
- **Vercel KV** para cache de sessões e estado real-time
- **Vercel Edge Functions** para baixa latência
- **Server-Sent Events (SSE)** ou **WebSocket via Pusher/Ably** (Vercel não suporta WebSocket nativo)

### 3.2 Fluxo de Colaboração
1. Usuário abre projeto → Registra sessão
2. Mudanças são enviadas via POST para API
3. API salva no Postgres e publica evento no KV/Pusher
4. Outros usuários recebem mudanças via SSE
5. Conflitos resolvidos via CRDT ou "last-write-wins"

### 3.3 Componentes React
- `useCollaboration` hook - Gerencia conexão real-time
- `CollaboratorCursors` - Mostra cursores de outros usuários
- `SyncIndicator` - Mostra status de sincronização
- `ConflictResolver` - UI para resolver conflitos

---

## PARTE 4: Estrutura do Jogo

### 4.1 Data Model do Jogo

```typescript
interface GameProject {
  id: string
  name: string
  description: string
  thumbnail: string

  // Metadata
  meta: {
    title: string
    subtitle: string
    version: string
    author: string
    genre: string[]
  }

  // Screens
  screens: {
    intro: IntroScreen
    loading: LoadingScreen
    mainMenu: MainMenuScreen
    pauseMenu: PauseMenuScreen
  }

  // Content
  maps: Map[]
  characters: Character[]
  npcs: NPC[]
  items: Item[]
  quests: Quest[]
  dialogues: Dialogue[]

  // Config
  config: GameConfig
}
```

### 4.2 Estrutura de Arquivos por Projeto

```
projects/{project-id}/
├── meta.json           - Título, descrição, autor
├── config.json         - Configurações do jogo
├── screens/
│   ├── intro.json      - Tela de intro
│   ├── loading.json    - Tela de loading
│   ├── main-menu.json  - Menu principal
│   └── pause-menu.json - Menu de pausa
├── maps/
│   ├── world-1.json    - Dados do mapa
│   └── ...
├── entities/
│   ├── characters.json - Personagens jogáveis
│   ├── npcs.json       - NPCs
│   └── items.json      - Itens
├── content/
│   ├── quests.json     - Quests
│   └── dialogues.json  - Diálogos
└── assets/
    └── ... (referências a assets)
```

### 4.3 Editor de Menus
- Drag & drop para posicionar elementos
- Preview em tempo real
- Suporte a:
  - Botões
  - Texto
  - Imagens
  - Backgrounds
  - Animações

---

## PARTE 5: Novas Páginas e Componentes

### 5.1 Páginas
1. `/auth/login` - Login
2. `/auth/register` - Cadastro
3. `/auth/join/[code]` - Entrar via convite
4. `/dashboard` - Dashboard do usuário
5. `/teams` - Gerenciar times
6. `/projects` - Listar projetos
7. `/projects/[id]` - Editor do projeto
8. `/projects/[id]/play` - Jogar o projeto
9. `/blog` - Blog/Features
10. `/docs` - Documentação

### 5.2 Componentes
1. Auth
   - `LoginForm`
   - `RegisterForm`
   - `AuthProvider`

2. Teams
   - `TeamCard`
   - `TeamMembers`
   - `InviteLink`

3. Projects
   - `ProjectCard`
   - `ProjectEditor`
   - `ProjectPreview`

4. Collaboration
   - `CollaboratorList`
   - `CursorOverlay`
   - `SyncStatus`

5. Game Builder
   - `MapEditor` (já existe parcialmente)
   - `MenuEditor`
   - `CharacterEditor`
   - `NPCEditor`
   - `QuestEditor`
   - `DialogueEditor`

---

## PARTE 6: Dependências Necessárias

### 6.1 NPM Packages
```json
{
  "dependencies": {
    // Database
    "@vercel/postgres": "^0.5.0",
    "@vercel/kv": "^1.0.0",
    "@vercel/blob": "^0.15.0",

    // Auth
    "bcryptjs": "^2.4.3",
    "jose": "^5.0.0",

    // Real-time (opção 1: Pusher)
    "pusher": "^5.2.0",
    "pusher-js": "^8.4.0",

    // Markdown
    "react-markdown": "^9.0.0",
    "remark-gfm": "^4.0.0",

    // Forms
    "react-hook-form": "^7.48.0",
    "zod": "^3.22.0",

    // UUID
    "uuid": "^9.0.0"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/uuid": "^9.0.0"
  }
}
```

### 6.2 Variáveis de Ambiente
```env
# Vercel Postgres
POSTGRES_URL=
POSTGRES_PRISMA_URL=
POSTGRES_URL_NON_POOLING=
POSTGRES_USER=
POSTGRES_HOST=
POSTGRES_PASSWORD=
POSTGRES_DATABASE=

# Vercel KV
KV_URL=
KV_REST_API_URL=
KV_REST_API_TOKEN=
KV_REST_API_READ_ONLY_TOKEN=

# Vercel Blob
BLOB_READ_WRITE_TOKEN=

# Auth
JWT_SECRET=

# Pusher (para real-time)
PUSHER_APP_ID=
PUSHER_KEY=
PUSHER_SECRET=
PUSHER_CLUSTER=
```

---

## PARTE 7: Arquivos a Criar

### Total: ~80+ arquivos

#### API (Serverless Functions)
1. `api/auth/register.ts`
2. `api/auth/login.ts`
3. `api/auth/logout.ts`
4. `api/auth/me.ts`
5. `api/teams/index.ts`
6. `api/teams/[id].ts`
7. `api/teams/[id]/invite.ts`
8. `api/teams/join/[code].ts`
9. `api/projects/index.ts`
10. `api/projects/[id].ts`
11. `api/projects/[id]/data.ts`
12. `api/realtime/sync.ts`
13. `api/realtime/presence.ts`
14. `api/migrations/run.ts`

#### Migrations
15. `api/migrations/001_create_users.sql`
16. `api/migrations/002_create_teams.sql`
17. `api/migrations/003_create_team_members.sql`
18. `api/migrations/004_create_projects.sql`
19. `api/migrations/005_create_project_data.sql`
20. `api/migrations/006_create_active_sessions.sql`

#### Páginas React
21. `src/pages/Auth/Login.tsx`
22. `src/pages/Auth/Register.tsx`
23. `src/pages/Auth/JoinTeam.tsx`
24. `src/pages/Dashboard/Dashboard.tsx`
25. `src/pages/Teams/Teams.tsx`
26. `src/pages/Teams/TeamDetail.tsx`
27. `src/pages/Projects/Projects.tsx`
28. `src/pages/Projects/ProjectEditor.tsx`
29. `src/pages/Blog/Blog.tsx`
30. `src/pages/Blog/BlogPost.tsx`

#### Componentes
31. `src/components/auth/LoginForm.tsx`
32. `src/components/auth/RegisterForm.tsx`
33. `src/components/auth/AuthProvider.tsx`
34. `src/components/teams/TeamCard.tsx`
35. `src/components/teams/TeamMembers.tsx`
36. `src/components/teams/InviteLink.tsx`
37. `src/components/projects/ProjectCard.tsx`
38. `src/components/projects/ProjectList.tsx`
39. `src/components/collaboration/CollaboratorList.tsx`
40. `src/components/collaboration/CursorOverlay.tsx`
41. `src/components/collaboration/SyncStatus.tsx`
42. `src/components/game/MenuEditor.tsx`
43. `src/components/game/CharacterEditor.tsx`
44. `src/components/game/NPCEditor.tsx`
45. `src/components/game/QuestEditor.tsx`
46. `src/components/game/DialogueEditor.tsx`
47. `src/components/game/IntroEditor.tsx`
48. `src/components/game/LoadingEditor.tsx`
49. `src/components/blog/BlogCard.tsx`
50. `src/components/blog/BlogContent.tsx`

#### Hooks
51. `src/hooks/useAuth.ts`
52. `src/hooks/useTeam.ts`
53. `src/hooks/useProject.ts`
54. `src/hooks/useCollaboration.ts`
55. `src/hooks/useRealtime.ts`

#### Types
56. `src/types/auth.ts`
57. `src/types/team.ts`
58. `src/types/project.ts`
59. `src/types/game.ts`
60. `src/types/collaboration.ts`

#### Utils
61. `src/utils/api.ts`
62. `src/utils/auth.ts`
63. `src/utils/realtime.ts`
64. `src/utils/storage.ts`

#### Documentação
65. `public/assets/documentacao/timeline.md`
66. `public/assets/documentacao/changelog.md`
67. `public/assets/documentacao/features/editor.md`
68. `public/assets/documentacao/features/components.md`
69. `public/assets/documentacao/features/collaboration.md`
70. `public/assets/documentacao/features/gameplay.md`

#### Styles
71. `src/styles/auth.css`
72. `src/styles/dashboard.css`
73. `src/styles/teams.css`
74. `src/styles/projects.css`
75. `src/styles/blog.css`
76. `src/styles/collaboration.css`

#### Config
77. `vercel.json` (atualizar)
78. `.env.local.example`
79. `src/config/routes.ts`
80. `src/config/api.ts`

---

## PARTE 8: Ordem de Implementação

### Fase 1: Infraestrutura (30 min)
1. Instalar dependências
2. Configurar variáveis de ambiente
3. Criar migrations SQL
4. API de migrations

### Fase 2: Autenticação (30 min)
5. API auth (register, login, logout, me)
6. AuthProvider e hooks
7. Páginas Login/Register
8. Middleware de autenticação

### Fase 3: Times (20 min)
9. API teams
10. Páginas e componentes de teams
11. Sistema de convites

### Fase 4: Projetos (30 min)
12. API projects
13. Páginas de projetos
14. Estrutura de dados do jogo

### Fase 5: Colaboração Real-time (30 min)
15. Configurar Pusher/SSE
16. API sync/presence
17. Hooks e componentes de colaboração

### Fase 6: Documentação (20 min)
18. Criar estrutura de docs
19. Página de blog
20. Conteúdo inicial

### Fase 7: Editores de Game (40 min)
21. MenuEditor
22. CharacterEditor
23. NPCEditor
24. QuestEditor
25. DialogueEditor

---

## Permissões Necessárias

Para implementar tudo isso em 2 horas, preciso de permissão para:

1. **Criar arquivos** - ~80 arquivos novos
2. **Modificar arquivos** - App.tsx, package.json, vercel.json, rotas
3. **Instalar pacotes** - npm install de ~15 pacotes
4. **Criar pastas** - api/, public/assets/documentacao/, novos componentes

---

## Notas Importantes

1. **Vercel Postgres** precisa ser configurado no dashboard da Vercel
2. **Pusher** precisa de conta (plano gratuito disponível)
3. **Variáveis de ambiente** precisam ser configuradas na Vercel
4. Algumas funcionalidades podem precisar de ajustes após deploy inicial
