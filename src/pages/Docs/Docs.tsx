import { useParams, useNavigate } from 'react-router-dom'
import { Navbar, SEO } from '@/components/shared'
import { COMPONENT_DEFINITIONS } from '@/data/ComponentDefinitions'
import type { ComponentDefinition } from '@/types/components'
import '@/styles/landing.css'
import '@/styles/docs.css'

const DOCS_SECTIONS = [
  {
    id: 'getting-started',
    title: 'Comecando',
    icon: '🚀',
    items: [
      { id: 'installation', title: 'Instalacao' },
      { id: 'first-project', title: 'Primeiro Projeto' },
      { id: 'editor-interface', title: 'Interface do Editor' },
    ],
  },
  {
    id: 'assets-3d',
    title: 'Assets 3D',
    icon: '📦',
    items: [
      { id: 'formats', title: 'Formatos Suportados' },
      { id: 'adding-models', title: 'Adicionando Modelos' },
      { id: 'folder-structure', title: 'Estrutura de Pastas' },
      { id: 'animations', title: 'Animacoes' },
    ],
  },
  {
    id: 'components',
    title: 'Componentes',
    icon: '🧩',
    items: [
      { id: 'overview', title: 'Visao Geral' },
      { id: 'component-list', title: 'Lista de Componentes' },
      { id: 'custom-components', title: 'Componentes Custom' },
    ],
  },
  {
    id: 'ai-system',
    title: 'Sistema de IA',
    icon: '🤖',
    items: [
      { id: 'behaviors', title: 'Comportamentos' },
      { id: 'attitudes', title: 'Atitudes' },
      { id: 'safe-zone', title: 'Zona Segura' },
      { id: 'combat', title: 'Combate' },
    ],
  },
  {
    id: 'maps',
    title: 'Mapas',
    icon: '🗺️',
    items: [
      { id: 'save-load', title: 'Salvar e Carregar' },
      { id: 'json-format', title: 'Formato JSON' },
      { id: 'serialization', title: 'Serializacao' },
    ],
  },
  {
    id: 'contributing',
    title: 'Contribuindo',
    icon: '🤝',
    items: [
      { id: 'how-to-contribute', title: 'Como Contribuir' },
      { id: 'code-style', title: 'Estilo de Codigo' },
      { id: 'pull-requests', title: 'Pull Requests' },
    ],
  },
]

export function Docs() {
  const { section } = useParams()
  const navigate = useNavigate()
  const currentSection = section || 'getting-started'

  return (
    <div className="landing-page">
      <SEO
        title="Documentacao"
        description="Aprenda a usar o MMORPG Builder. Guias completos sobre assets 3D, componentes, sistema de IA e muito mais."
      />
      <Navbar />

      <div className="docs-layout">
        {/* Sidebar */}
        <aside className="docs-sidebar">
          <div className="docs-sidebar-header">
            <h3>Documentacao</h3>
          </div>
          <nav className="docs-nav">
            {DOCS_SECTIONS.map((sec) => (
              <div key={sec.id} className="docs-nav-section">
                <button
                  className={`docs-nav-title ${currentSection === sec.id ? 'active' : ''}`}
                  onClick={() => navigate(`/docs/${sec.id}`)}
                >
                  <span className="docs-nav-icon">{sec.icon}</span>
                  {sec.title}
                </button>
                {currentSection === sec.id && (
                  <ul className="docs-nav-items">
                    {sec.items.map((item) => (
                      <li key={item.id}>
                        <a href={`#${item.id}`}>{item.title}</a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className="docs-content">
          {currentSection === 'getting-started' && <GettingStartedDocs />}
          {currentSection === 'assets-3d' && <Assets3DDocs />}
          {currentSection === 'components' && <ComponentsDocs />}
          {currentSection === 'ai-system' && <AISystemDocs />}
          {currentSection === 'maps' && <MapsDocs />}
          {currentSection === 'contributing' && <ContributingDocs />}
        </main>
      </div>
    </div>
  )
}

function GettingStartedDocs() {
  return (
    <article className="docs-article">
      <h1>Comecando com MMORPG Builder</h1>
      <p className="docs-lead">
        Guia rapido para instalar, configurar e comecar a criar seu primeiro jogo.
      </p>

      <section id="installation">
        <h2>Instalacao</h2>
        <p>Clone o repositorio e instale as dependencias:</p>
        <pre className="docs-code">
{`# Clone o repositório
git clone https://github.com/Garrido-Devs/mmorpg-builder.git
cd mmorpg-builder

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev`}
        </pre>
        <p>O projeto estara disponivel em <code>http://localhost:5173</code></p>
      </section>

      <section id="first-project">
        <h2>Primeiro Projeto</h2>
        <ol>
          <li>Acesse o editor em <code>/editor</code></li>
          <li>No painel de Assets (esquerda), escolha um asset para adicionar</li>
          <li>Clique e arraste para posicionar no mundo</li>
          <li>Use o painel Inspector (direita) para configurar propriedades</li>
          <li>Adicione componentes como Collider, NPC, Interactable</li>
          <li>Salve seu mapa usando o botao na toolbar</li>
        </ol>
      </section>

      <section id="editor-interface">
        <h2>Interface do Editor</h2>
        <div className="docs-grid">
          <div className="docs-card">
            <h4>Painel de Assets</h4>
            <p>Biblioteca com +100 modelos 3D organizados por categoria.</p>
          </div>
          <div className="docs-card">
            <h4>Viewport</h4>
            <p>Visualizacao 3D do mundo. Clique para selecionar, arraste para mover.</p>
          </div>
          <div className="docs-card">
            <h4>Inspector</h4>
            <p>Propriedades e componentes do objeto selecionado.</p>
          </div>
          <div className="docs-card">
            <h4>Hierarquia</h4>
            <p>Lista de todos os objetos no mapa atual.</p>
          </div>
        </div>
      </section>
    </article>
  )
}

function Assets3DDocs() {
  return (
    <article className="docs-article">
      <h1>Assets 3D</h1>
      <p className="docs-lead">
        Como adicionar, organizar e usar modelos 3D no seu jogo.
      </p>

      <section id="formats">
        <h2>Formatos Suportados</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Formato</th>
              <th>Extensao</th>
              <th>Descricao</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>GLTF Binary</strong></td>
              <td>.glb</td>
              <td>Recomendado - arquivo unico com texturas embutidas</td>
            </tr>
            <tr>
              <td>GLTF</td>
              <td>.gltf + .bin</td>
              <td>Formato separado (texturas em arquivos externos)</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section id="adding-models">
        <h2>Adicionando Modelos</h2>
        <ol>
          <li>
            <strong>Prepare seu modelo:</strong>
            <ul>
              <li>Exporte como <code>.glb</code> (formato binario GLTF)</li>
              <li>Certifique-se de que texturas estao embutidas</li>
              <li>Escala recomendada: 1 unidade = 1 metro</li>
            </ul>
          </li>
          <li>
            <strong>Coloque o arquivo:</strong>
            <pre className="docs-code">
{`public/assets/models/
├── characters/   # Para personagens e NPCs
└── props/        # Para objetos, móveis, itens
    └── SUA_CATEGORIA/
        └── seu_modelo.glb`}
            </pre>
          </li>
          <li>
            <strong>Registre no AssetRegistry:</strong>
            <pre className="docs-code">
{`// src/assets/AssetRegistry.ts
{
  id: 'meu_modelo',
  name: 'Meu Modelo',
  path: '/assets/models/props/categoria/seu_modelo.glb',
  type: 'prop',
  category: 'Sua Categoria',
  defaultComponents: ['collider'],
}`}
            </pre>
          </li>
        </ol>
      </section>

      <section id="folder-structure">
        <h2>Estrutura de Pastas</h2>
        <pre className="docs-code">
{`public/assets/models/
├── characters/           # Personagens jogáveis e NPCs
│   ├── Barbarian.glb
│   ├── Knight.glb
│   └── Skeleton_*.glb
└── props/
    ├── dungeon/         # Props de dungeon
    ├── furniture/       # Móveis
    └── items/           # Itens coletáveis`}
        </pre>
      </section>

      <section id="animations">
        <h2>Animacoes</h2>
        <p>Animacoes devem estar embutidas no arquivo GLB com nomes padronizados:</p>
        <ul>
          <li><code>Idle</code> - Animacao parada</li>
          <li><code>Walking</code> - Caminhando</li>
          <li><code>Running</code> - Correndo</li>
          <li><code>Attack</code> - Ataque</li>
          <li><code>Death</code> - Morte</li>
        </ul>
        <p>O sistema detecta automaticamente animacoes com o padrao <code>CharacterArmature|NomeAnimacao</code>.</p>
      </section>
    </article>
  )
}

function ComponentsDocs() {
  return (
    <article className="docs-article">
      <h1>Sistema de Componentes</h1>
      <p className="docs-lead">
        Componentes definem o comportamento dos objetos no jogo.
      </p>

      <section id="overview">
        <h2>Visao Geral</h2>
        <p>
          Cada objeto no mapa pode ter multiplos componentes que definem seu comportamento.
          Componentes sao configurados no painel Inspector quando um objeto esta selecionado.
        </p>
      </section>

      <section id="component-list">
        <h2>Lista de Componentes</h2>
        <div className="docs-component-grid">
          {Object.values(COMPONENT_DEFINITIONS).map((comp: ComponentDefinition) => (
            <div key={comp.type} className="docs-component-card">
              <div className="docs-component-header">
                <span className="docs-component-icon">{comp.icon}</span>
                <h4>{comp.name}</h4>
              </div>
              <p>{comp.description}</p>
              <span className="docs-component-category">{comp.category}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="custom-components">
        <h2>Componentes Custom</h2>
        <p>Para criar um novo componente:</p>
        <ol>
          <li>Adicione o tipo em <code>src/types/components.ts</code></li>
          <li>Defina as propriedades em <code>src/data/ComponentDefinitions.ts</code></li>
          <li>Implemente a logica no sistema apropriado</li>
        </ol>
      </section>
    </article>
  )
}

function AISystemDocs() {
  return (
    <article className="docs-article">
      <h1>Sistema de IA</h1>
      <p className="docs-lead">
        Configure comportamentos inteligentes para seus NPCs.
      </p>

      <section id="behaviors">
        <h2>Comportamentos</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Comportamento</th>
              <th>Descricao</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>stationary</code></td>
              <td>Fica parado no lugar, olha para o jogador se hostil</td>
            </tr>
            <tr>
              <td><code>patrol</code></td>
              <td>Caminha entre waypoints definidos</td>
            </tr>
            <tr>
              <td><code>wander</code></td>
              <td>Movimento aleatorio dentro de um raio</td>
            </tr>
            <tr>
              <td><code>follow</code></td>
              <td>Segue o jogador (NPCs amigaveis)</td>
            </tr>
            <tr>
              <td><code>flee</code></td>
              <td>Foge do jogador</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section id="attitudes">
        <h2>Atitudes</h2>
        <div className="docs-grid">
          <div className="docs-card docs-card-success">
            <h4>Friendly (Amigavel)</h4>
            <p>Nome em verde. Nao ataca, pode seguir o jogador.</p>
          </div>
          <div className="docs-card">
            <h4>Neutral</h4>
            <p>Nome em branco. Ignora o jogador completamente.</p>
          </div>
          <div className="docs-card docs-card-danger">
            <h4>Hostile (Hostil)</h4>
            <p>Nome em vermelho. Persegue e ataca o jogador.</p>
          </div>
        </div>
      </section>

      <section id="safe-zone">
        <h2>Zona Segura</h2>
        <p>
          O centro do mapa (raio de 12 unidades) e uma zona segura onde NPCs hostis nao podem entrar.
          Ideal para vilas, areas de comercio e pontos de spawn.
        </p>
        <ul>
          <li><strong>Centro:</strong> (0, 0, 0)</li>
          <li><strong>Raio:</strong> 12 unidades</li>
          <li>NPCs hostis param na borda da zona</li>
        </ul>
      </section>

      <section id="combat">
        <h2>Combate</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Parametro</th>
              <th>Valor Padrao</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Range de Deteccao</td>
              <td>8 unidades</td>
            </tr>
            <tr>
              <td>Range de Ataque</td>
              <td>1.5 unidades</td>
            </tr>
            <tr>
              <td>Cooldown de Ataque</td>
              <td>1.5 segundos</td>
            </tr>
            <tr>
              <td>Velocidade de Movimento</td>
              <td>2 unidades/seg</td>
            </tr>
          </tbody>
        </table>
      </section>
    </article>
  )
}

function MapsDocs() {
  return (
    <article className="docs-article">
      <h1>Mapas</h1>
      <p className="docs-lead">
        Salve, carregue e compartilhe seus mundos.
      </p>

      <section id="save-load">
        <h2>Salvar e Carregar</h2>
        <h4>Salvar</h4>
        <ul>
          <li><strong>LocalStorage:</strong> Salva no navegador (persistente)</li>
          <li><strong>Download:</strong> Baixa arquivo JSON para compartilhar</li>
        </ul>
        <h4>Carregar</h4>
        <ul>
          <li><strong>LocalStorage:</strong> Carrega mapas salvos anteriormente</li>
          <li><strong>Upload:</strong> Carrega arquivo JSON do computador</li>
        </ul>
      </section>

      <section id="json-format">
        <h2>Formato JSON</h2>
        <pre className="docs-code">
{`{
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
      "components": [...]
    }
  ]
}`}
        </pre>
      </section>

      <section id="serialization">
        <h2>Serializacao</h2>
        <p>O sistema de serializacao converte objetos Three.js para JSON e vice-versa:</p>
        <pre className="docs-code">
{`import { serializeMap, deserializeMap } from '@/utils/MapSerializer'

// Salvar
const json = serializeMap(mapData)
downloadMap(json, 'meu_mapa.json')

// Carregar
const mapData = await loadMapFromFile()
engine.loadMap(mapData)`}
        </pre>
      </section>
    </article>
  )
}

function ContributingDocs() {
  return (
    <article className="docs-article">
      <h1>Contribuindo</h1>
      <p className="docs-lead">
        Ajude a melhorar o MMORPG Builder!
      </p>

      <section id="how-to-contribute">
        <h2>Como Contribuir</h2>
        <ol>
          <li>Fork o repositorio no GitHub</li>
          <li>Clone seu fork: <code>git clone https://github.com/SEU_USER/mmorpg-builder.git</code></li>
          <li>Crie uma branch: <code>git checkout -b feature/minha-feature</code></li>
          <li>Faca suas alteracoes</li>
          <li>Commit: <code>git commit -m "Adiciona minha feature"</code></li>
          <li>Push: <code>git push origin feature/minha-feature</code></li>
          <li>Abra um Pull Request</li>
        </ol>
      </section>

      <section id="code-style">
        <h2>Estilo de Codigo</h2>
        <ul>
          <li>TypeScript strict mode</li>
          <li>Componentes funcionais React</li>
          <li>CSS com variaveis customizadas</li>
          <li>Comentarios em portugues (opcional)</li>
        </ul>
      </section>

      <section id="pull-requests">
        <h2>Pull Requests</h2>
        <p>Ao abrir um PR, inclua:</p>
        <ul>
          <li>Descricao clara do que foi alterado</li>
          <li>Screenshots (se houver mudancas visuais)</li>
          <li>Testes realizados</li>
        </ul>
      </section>
    </article>
  )
}
