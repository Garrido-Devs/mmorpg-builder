import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Navbar } from '@/components/shared'
import '../../styles/blog.css'

interface BlogPost {
  id: string
  title: string
  description: string
  category: string
  date: string
  file: string
  readTime: string
  tags: string[]
}

// Posts estáticos - 15 posts
const BLOG_POSTS: BlogPost[] = [
  {
    id: 'getting-started',
    title: 'Primeiros Passos',
    description: 'Guia completo para iniciar seu primeiro projeto no MMORPG Builder',
    category: 'Tutorial',
    date: '2024-01-15',
    file: 'getting-started.md',
    readTime: '5 min',
    tags: ['iniciante', 'setup', 'projeto'],
  },
  {
    id: 'editor',
    title: 'Editor de Mapas',
    description: 'Aprenda como usar o editor de mapas e criar seu primeiro cenário',
    category: 'Tutorial',
    date: '2024-01-14',
    file: 'editor.md',
    readTime: '8 min',
    tags: ['editor', 'mapas', 'cenario'],
  },
  {
    id: 'components',
    title: 'Guia de Componentes',
    description: 'Entenda todos os componentes disponíveis para criar seu MMORPG',
    category: 'Documentação',
    date: '2024-01-13',
    file: 'components.md',
    readTime: '10 min',
    tags: ['componentes', 'referencia', 'api'],
  },
  {
    id: 'ai-system',
    title: 'Sistema de IA para NPCs',
    description: 'Configure comportamentos inteligentes para seus NPCs usando o sistema de IA',
    category: 'Tutorial',
    date: '2024-01-12',
    file: 'ai-system.md',
    readTime: '12 min',
    tags: ['ia', 'npc', 'comportamento', 'pathfinding'],
  },
  {
    id: 'combat-system',
    title: 'Configurando Combate',
    description: 'Sistema completo de combate com skills, dano e efeitos',
    category: 'Tutorial',
    date: '2024-01-11',
    file: 'combat-system.md',
    readTime: '15 min',
    tags: ['combate', 'skills', 'dano', 'pvp'],
  },
  {
    id: 'crafting',
    title: 'Resource Nodes e Crafting',
    description: 'Crie sistemas de coleta de recursos e fabricacao de itens',
    category: 'Tutorial',
    date: '2024-01-10',
    file: 'crafting.md',
    readTime: '10 min',
    tags: ['crafting', 'recursos', 'itens'],
  },
  {
    id: 'skills-system',
    title: 'Sistema de Skills',
    description: 'Documentacao completa do sistema de habilidades e progressao',
    category: 'Documentação',
    date: '2024-01-09',
    file: 'skills-system.md',
    readTime: '8 min',
    tags: ['skills', 'habilidades', 'progressao'],
  },
  {
    id: 'quests',
    title: 'Sistema de Quests',
    description: 'Como criar missoes e objetivos para os jogadores',
    category: 'Documentação',
    date: '2024-01-08',
    file: 'quests.md',
    readTime: '12 min',
    tags: ['quests', 'missoes', 'objetivos'],
  },
  {
    id: 'portals',
    title: 'Portais e Teleportes',
    description: 'Configure portais para conectar diferentes mapas e areas',
    category: 'Tutorial',
    date: '2024-01-07',
    file: 'portals.md',
    readTime: '6 min',
    tags: ['portais', 'teleporte', 'mapas'],
  },
  {
    id: 'npcs-dialogs',
    title: 'NPCs e Dialogos',
    description: 'Crie NPCs interativos com sistemas de dialogo ramificado',
    category: 'Tutorial',
    date: '2024-01-06',
    file: 'npcs-dialogs.md',
    readTime: '10 min',
    tags: ['npc', 'dialogo', 'interacao'],
  },
  {
    id: 'collaboration',
    title: 'Trabalhando em Equipe',
    description: 'Como colaborar em tempo real com outros desenvolvedores',
    category: 'Feature',
    date: '2024-01-05',
    file: 'collaboration.md',
    readTime: '7 min',
    tags: ['equipe', 'colaboracao', 'multiplayer'],
  },
  {
    id: 'bank-system',
    title: 'Sistema de Banco',
    description: 'Implemente sistema de armazenamento compartilhado entre personagens',
    category: 'Feature',
    date: '2024-01-04',
    file: 'bank-system.md',
    readTime: '5 min',
    tags: ['banco', 'inventario', 'storage'],
  },
  {
    id: 'assets-guide',
    title: 'Assets 3D Disponiveis',
    description: 'Catalogo completo de modelos 3D incluidos no MMORPG Builder',
    category: 'Documentação',
    date: '2024-01-03',
    file: 'assets-guide.md',
    readTime: '6 min',
    tags: ['assets', '3d', 'modelos'],
  },
  {
    id: 'deploy',
    title: 'Deploy na Vercel',
    description: 'Publique seu jogo online de forma gratuita usando a Vercel',
    category: 'Tutorial',
    date: '2024-01-02',
    file: 'deploy.md',
    readTime: '8 min',
    tags: ['deploy', 'vercel', 'publicar'],
  },
  {
    id: 'faq',
    title: 'FAQ - Perguntas Frequentes',
    description: 'Respostas para as duvidas mais comuns sobre o MMORPG Builder',
    category: 'Documentação',
    date: '2024-01-01',
    file: 'faq.md',
    readTime: '5 min',
    tags: ['faq', 'ajuda', 'suporte'],
  },
]

/**
 * Blog Page - Página de blog/features
 */
export function Blog() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)
  const [postContent, setPostContent] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const categories = ['all', ...new Set(BLOG_POSTS.map((p) => p.category))]

  const filteredPosts = selectedCategory === 'all'
    ? BLOG_POSTS
    : BLOG_POSTS.filter((p) => p.category === selectedCategory)

  useEffect(() => {
    if (selectedPost) {
      setLoading(true)
      const loadContent = async () => {
        try {
          const response = await fetch(`/assets/documentacao/features/${selectedPost.file}`)
          const contentType = response.headers.get('content-type') || ''

          // Verificar se é realmente um arquivo markdown/text, não HTML
          if (response.ok && !contentType.includes('text/html')) {
            const content = await response.text()
            // Verificação adicional: se começa com <!DOCTYPE ou <html, é HTML
            if (!content.trim().startsWith('<!') && !content.trim().startsWith('<html')) {
              setPostContent(content)
            } else {
              setPostContent(`# ${selectedPost.title}\n\n${selectedPost.description}\n\n*Conteúdo em breve...*`)
            }
          } else {
            setPostContent(`# ${selectedPost.title}\n\n${selectedPost.description}\n\n*Conteúdo em breve...*`)
          }
        } catch {
          setPostContent(`# ${selectedPost.title}\n\n${selectedPost.description}\n\n*Conteúdo em breve...*`)
        } finally {
          setLoading(false)
        }
      }
      loadContent()
    }
  }, [selectedPost])

  return (
    <div className="blog-page">
      <Navbar />

      <main className="blog-main">
        {selectedPost ? (
          <div className="blog-post">
            <button
              className="blog-back"
              onClick={() => setSelectedPost(null)}
            >
              ← Voltar
            </button>

            {loading ? (
              <div className="blog-loading">Carregando...</div>
            ) : (
              <article className="blog-post-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {postContent}
                </ReactMarkdown>
              </article>
            )}
          </div>
        ) : (
          <>
            <div className="blog-header">
              <h1>Features & Documentacao</h1>
              <p>Tutoriais, guias e novidades do MMORPG Builder</p>
            </div>

            <Link to="/blog/quiz" className="blog-quiz-banner">
              <div className="blog-quiz-banner-icon">🎯</div>
              <div className="blog-quiz-banner-content">
                <h3>Teste seus conhecimentos!</h3>
                <p>Faca o quiz e descubra seu nivel no MMORPG Builder</p>
              </div>
              <span className="blog-quiz-banner-arrow">→</span>
            </Link>

            <div className="blog-categories">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`blog-category ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat === 'all' ? 'Todos' : cat}
                </button>
              ))}
            </div>

            <div className="blog-grid">
              {filteredPosts.map((post) => (
                <article
                  key={post.id}
                  className="blog-card"
                  onClick={() => setSelectedPost(post)}
                >
                  <div className="blog-card-header">
                    <span className="blog-card-category">{post.category}</span>
                    <span className="blog-card-read-time">{post.readTime}</span>
                  </div>
                  <h2 className="blog-card-title">{post.title}</h2>
                  <p className="blog-card-description">{post.description}</p>
                  <div className="blog-card-footer">
                    <span className="blog-card-date">
                      {new Date(post.date).toLocaleDateString('pt-BR')}
                    </span>
                    <div className="blog-card-tags">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="blog-card-tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
