import { useState, useEffect } from 'react'
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
  file: string // nome do arquivo .md
}

// Posts estáticos
const BLOG_POSTS: BlogPost[] = [
  {
    id: 'editor',
    title: 'Editor de Mapas',
    description: 'Aprenda como usar o editor de mapas e criar seu primeiro cenário',
    category: 'Tutorial',
    date: '2024-01-13',
    file: 'editor.md',
  },
  {
    id: 'components',
    title: 'Guia de Componentes',
    description: 'Entenda todos os componentes disponíveis para criar seu MMORPG',
    category: 'Documentação',
    date: '2024-01-12',
    file: 'components.md',
  },
  {
    id: 'collaboration',
    title: 'Trabalhando em Equipe',
    description: 'Como colaborar em tempo real com outros desenvolvedores',
    category: 'Feature',
    date: '2024-01-11',
    file: 'collaboration.md',
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
              <h1>Features & Documentação</h1>
              <p>Tutoriais, guias e novidades do MMORPG Builder</p>
            </div>

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
                  <span className="blog-card-category">{post.category}</span>
                  <h2 className="blog-card-title">{post.title}</h2>
                  <p className="blog-card-description">{post.description}</p>
                  <span className="blog-card-date">
                    {new Date(post.date).toLocaleDateString('pt-BR')}
                  </span>
                </article>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
