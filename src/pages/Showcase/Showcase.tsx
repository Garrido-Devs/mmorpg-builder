import { useState, useEffect } from 'react'
import { Navbar, SEO, ModelThumbnail } from '@/components/shared'
import '@/styles/landing.css'
import '@/styles/showcase.css'

interface GameEntry {
  id: string
  name: string
  author: string
  description: string
  url: string
  thumbnail: string
  tags: string[]
  createdAt: string
}

interface ShowcaseData {
  games: GameEntry[]
  submitUrl: string
}

export function Showcase() {
  const [data, setData] = useState<ShowcaseData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/data/showcase.json')
      .then((res) => res.json())
      .then((json) => {
        setData(json)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="landing-page">
      <SEO
        title="Showcase"
        description="Jogos criados com o MMORPG Builder. Veja o que a comunidade esta construindo e publique seu proprio jogo."
      />
      <Navbar />

      <div className="showcase-page">
        <header className="showcase-header">
          <span className="section-tag">Comunidade</span>
          <h1>Showcase</h1>
          <p>Jogos criados pela comunidade usando o MMORPG Builder</p>
        </header>

        <div className="showcase-content">
          {loading ? (
            <div className="showcase-loading">
              <div className="model-thumbnail-spinner" />
              <p>Carregando jogos...</p>
            </div>
          ) : data && data.games.length > 0 ? (
            <div className="showcase-grid">
              {data.games.map((game) => (
                <a
                  key={game.id}
                  href={game.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="showcase-card"
                >
                  <div className="showcase-card-thumbnail">
                    {game.thumbnail.endsWith('.glb') ? (
                      <ModelThumbnail modelPath={game.thumbnail} size={200} />
                    ) : (
                      <img src={game.thumbnail} alt={game.name} />
                    )}
                  </div>
                  <div className="showcase-card-content">
                    <h3>{game.name}</h3>
                    <p className="showcase-card-author">por {game.author}</p>
                    <p className="showcase-card-description">{game.description}</p>
                    <div className="showcase-card-tags">
                      {game.tags.map((tag) => (
                        <span key={tag} className="showcase-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="showcase-empty">
              <div className="showcase-empty-icon">🎮</div>
              <h3>Nenhum jogo publicado ainda</h3>
              <p>Seja o primeiro a publicar seu jogo!</p>
            </div>
          )}

          <div className="showcase-submit">
            <h2>Publique seu Jogo</h2>
            <p>
              Criou um jogo usando o MMORPG Builder? Adicione ao showcase e mostre para a comunidade!
            </p>
            <div className="showcase-submit-steps">
              <div className="submit-step">
                <span className="submit-step-number">1</span>
                <div>
                  <h4>Hospede seu jogo</h4>
                  <p>Faca deploy na Vercel, Netlify ou qualquer hosting</p>
                </div>
              </div>
              <div className="submit-step">
                <span className="submit-step-number">2</span>
                <div>
                  <h4>Abra uma issue</h4>
                  <p>Preencha o formulario com nome, descricao e link</p>
                </div>
              </div>
              <div className="submit-step">
                <span className="submit-step-number">3</span>
                <div>
                  <h4>Aguarde aprovacao</h4>
                  <p>Seu jogo aparecera aqui apos revisao</p>
                </div>
              </div>
            </div>
            {data?.submitUrl && (
              <a
                href={data.submitUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Submeter Jogo
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
