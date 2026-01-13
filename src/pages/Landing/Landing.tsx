import { Link } from 'react-router-dom'
import { Navbar, SEO, ModelThumbnail } from '@/components/shared'
import { ASSETS } from '@/assets/AssetRegistry'
import '@/styles/landing.css'

export function Landing() {
  // Pegar alguns assets para preview
  const previewAssets = ASSETS.slice(0, 8)
  const totalAssets = ASSETS.length

  return (
    <div className="landing-page">
      <SEO />
      <Navbar />

      {/* Hero Section */}
      <section className="hero landing-section">
        <div className="hero-content">
          <div className="hero-badge">
            <span>100% Open Source</span>
          </div>
          <h1 className="hero-title">
            Crie seu <span>MMORPG 3D</span> no navegador
          </h1>
          <p className="hero-description">
            Editor visual completo para criar jogos MMORPG. Posicione NPCs, configure comportamentos de IA,
            adicione colisoes e interacoes - tudo sem precisar escrever codigo.
          </p>
          <div className="hero-buttons">
            <Link to="/editor" className="btn-primary">
              Comecar Agora
            </Link>
            <Link to="/docs" className="btn-secondary">
              Ver Documentacao
            </Link>
          </div>
        </div>

        <div className="hero-preview">
          <div className="hero-preview-placeholder">
            <div className="hero-preview-placeholder-icon">🎮</div>
            <p>Editor 3D Interativo</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features landing-section">
        <div className="section-header">
          <span className="section-tag">Recursos</span>
          <h2 className="section-title">Tudo que voce precisa para criar seu jogo</h2>
          <p className="section-description">
            Ferramentas profissionais de desenvolvimento de jogos, acessiveis para todos.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎨</div>
            <h3 className="feature-title">Editor Visual Completo</h3>
            <p className="feature-description">
              Interface intuitiva para posicionar objetos, configurar propriedades e visualizar
              seu mundo em tempo real.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📦</div>
            <h3 className="feature-title">+{totalAssets} Assets 3D Inclusos</h3>
            <p className="feature-description">
              Personagens, inimigos, moveis, itens e muito mais. Todos prontos para usar
              com animacoes incluidas.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3 className="feature-title">Sistema de IA para NPCs</h3>
            <p className="feature-description">
              NPCs com comportamentos configuraveis: patrulhar, vagar, seguir, fugir.
              Atitudes amigaveis, neutras ou hostis.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🧩</div>
            <h3 className="feature-title">Sistema de Componentes</h3>
            <p className="feature-description">
              16 tipos de componentes: colisores, triggers, spawners, portais,
              lojas, quest givers e muito mais.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💾</div>
            <h3 className="feature-title">Salvar e Carregar Mapas</h3>
            <p className="feature-description">
              Exporte seus mapas como JSON, salve no navegador ou baixe para compartilhar
              com outros desenvolvedores.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🌐</div>
            <h3 className="feature-title">Deploy na Web</h3>
            <p className="feature-description">
              Seu jogo roda direto no navegador. Hospede em qualquer servidor
              estatico como Vercel, Netlify ou GitHub Pages.
            </p>
          </div>
        </div>
      </section>

      {/* Assets Preview Section */}
      <section className="assets-preview landing-section">
        <div className="section-header">
          <span className="section-tag">Assets</span>
          <h2 className="section-title">Biblioteca de Assets Incluida</h2>
          <p className="section-description">
            Modelos 3D de alta qualidade prontos para usar em seu jogo.
          </p>
        </div>

        <div className="assets-grid">
          {previewAssets.map((asset) => (
            <div key={asset.id} className="asset-card">
              <ModelThumbnail modelPath={asset.path} size={80} />
              <div className="asset-card-name">{asset.name}</div>
            </div>
          ))}
        </div>

        <div className="assets-cta">
          <p className="assets-count">
            +{totalAssets} assets disponiveis em {new Set(ASSETS.map((a) => a.category)).size} categorias
          </p>
          <Link to="/assets" className="btn-secondary">
            Ver Todos os Assets
          </Link>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works landing-section">
        <div className="section-header">
          <span className="section-tag">Como Funciona</span>
          <h2 className="section-title">Comece em 3 passos simples</h2>
        </div>

        <div className="steps-container">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3 className="step-title">Clone o Projeto</h3>
            <p className="step-description">
              Clone o repositorio do GitHub, instale as dependencias
              com npm install e inicie o servidor de desenvolvimento.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">2</div>
            <h3 className="step-title">Customize seu Mundo</h3>
            <p className="step-description">
              Use o editor visual para posicionar assets, configurar
              NPCs, criar triggers e definir a logica do seu jogo.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">3</div>
            <h3 className="step-title">Publique seu Jogo</h3>
            <p className="step-description">
              Faca o build de producao e hospede em qualquer servico
              de hospedagem estatica. Seu jogo estara online!
            </p>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="roadmap landing-section">
        <div className="section-header">
          <span className="section-tag">Roadmap</span>
          <h2 className="section-title">O que vem por ai</h2>
          <p className="section-description">
            Projeto em desenvolvimento ativo. Confira o que estamos planejando.
          </p>
        </div>

        <div className="roadmap-timeline">
          <div className="roadmap-item">
            <div className="roadmap-dot completed"></div>
            <div className="roadmap-content">
              <div className="roadmap-phase">Fase 1 - Atual</div>
              <h3 className="roadmap-title">MVP - Editor Base</h3>
              <div className="roadmap-features">
                <span className="roadmap-tag">Editor Visual</span>
                <span className="roadmap-tag">Sistema de Componentes</span>
                <span className="roadmap-tag">IA de NPCs</span>
                <span className="roadmap-tag">100+ Assets</span>
              </div>
            </div>
          </div>

          <div className="roadmap-item">
            <div className="roadmap-dot future"></div>
            <div className="roadmap-content">
              <div className="roadmap-phase">Fase 2</div>
              <h3 className="roadmap-title">Multiplayer</h3>
              <div className="roadmap-features">
                <span className="roadmap-tag">WebSocket Server</span>
                <span className="roadmap-tag">Sincronizacao</span>
                <span className="roadmap-tag">Chat</span>
                <span className="roadmap-tag">Persistencia</span>
              </div>
            </div>
          </div>

          <div className="roadmap-item">
            <div className="roadmap-dot future"></div>
            <div className="roadmap-content">
              <div className="roadmap-phase">Fase 3</div>
              <h3 className="roadmap-title">Terreno e Ambiente</h3>
              <div className="roadmap-features">
                <span className="roadmap-tag">Editor de Terreno</span>
                <span className="roadmap-tag">Clima Dinamico</span>
                <span className="roadmap-tag">Ciclo Dia/Noite</span>
                <span className="roadmap-tag">Vegetacao Procedural</span>
              </div>
            </div>
          </div>

          <div className="roadmap-item">
            <div className="roadmap-dot future"></div>
            <div className="roadmap-content">
              <div className="roadmap-phase">Fase 4</div>
              <h3 className="roadmap-title">Audio e Efeitos</h3>
              <div className="roadmap-features">
                <span className="roadmap-tag">Sistema de Audio</span>
                <span className="roadmap-tag">Particulas</span>
                <span className="roadmap-tag">Shaders</span>
                <span className="roadmap-tag">Post-processing</span>
              </div>
            </div>
          </div>

          <div className="roadmap-item">
            <div className="roadmap-dot future"></div>
            <div className="roadmap-content">
              <div className="roadmap-phase">Fase 5</div>
              <h3 className="roadmap-title">Plataformas</h3>
              <div className="roadmap-features">
                <span className="roadmap-tag">Mobile</span>
                <span className="roadmap-tag">Desktop (Electron)</span>
                <span className="roadmap-tag">PWA</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="community landing-section">
        <div className="section-header">
          <span className="section-tag">Comunidade</span>
          <h2 className="section-title">Junte-se a nos</h2>
          <p className="section-description">
            Projeto open-source feito pela comunidade, para a comunidade.
          </p>
        </div>

        <div className="community-grid">
          <div className="community-card">
            <div className="community-icon">⭐</div>
            <h3 className="community-title">GitHub</h3>
            <p className="community-description">
              De uma estrela, abra issues, envie PRs. Toda contribuicao e bem-vinda!
            </p>
            <a
              href="https://github.com/Garrido-Devs/mmorpg-builder"
              target="_blank"
              rel="noopener noreferrer"
              className="community-link"
            >
              Ver no GitHub
            </a>
          </div>

          <div className="community-card">
            <div className="community-icon">📖</div>
            <h3 className="community-title">Documentacao</h3>
            <p className="community-description">
              Aprenda a usar todas as funcionalidades do editor e a criar seus proprios jogos.
            </p>
            <Link to="/docs" className="community-link">
              Ler Documentacao
            </Link>
          </div>

          <div className="community-card">
            <div className="community-icon">🤝</div>
            <h3 className="community-title">Contribua</h3>
            <p className="community-description">
              Fork o projeto, melhore o codigo, adicione features. Licenca MIT - faca o que quiser!
            </p>
            <Link to="/docs/contributing" className="community-link">
              Como Contribuir
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="navbar-logo-icon">M</div>
              <span>MMORPG Builder</span>
            </div>
            <p className="footer-description">
              Editor open-source para criacao de jogos MMORPG 3D.
              Construido com React, TypeScript e Three.js.
            </p>
          </div>

          <div className="footer-section">
            <h4>Produto</h4>
            <ul className="footer-links">
              <li><Link to="/editor">Editor</Link></li>
              <li><Link to="/assets">Assets</Link></li>
              <li><Link to="/docs">Documentacao</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Recursos</h4>
            <ul className="footer-links">
              <li><Link to="/docs/getting-started">Comecando</Link></li>
              <li><Link to="/docs/assets-3d">Assets 3D</Link></li>
              <li><Link to="/docs/components">Componentes</Link></li>
              <li><Link to="/docs/ai-system">Sistema de IA</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Comunidade</h4>
            <ul className="footer-links">
              <li>
                <a href="https://github.com/Garrido-Devs/mmorpg-builder" target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              </li>
              <li><Link to="/docs/contributing">Contribuir</Link></li>
              <li>
                <a href="https://github.com/Garrido-Devs/mmorpg-builder/issues" target="_blank" rel="noopener noreferrer">
                  Issues
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            MIT License - Use como quiser!
          </p>
          <p className="footer-credits">
            Assets 3D por{' '}
            <a href="https://kaylousberg.itch.io/" target="_blank" rel="noopener noreferrer">
              KayKit
            </a>
            {' '}(CC0)
          </p>
        </div>

        <div className="footer-author">
          <p>
            Desenvolvido por <strong>Emerson Garrido</strong>
          </p>
          <a
            href="https://wa.me/5567993109148"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-whatsapp"
          >
            <span className="whatsapp-icon">📱</span>
            WhatsApp: (67) 99310-9148
          </a>
        </div>
      </footer>
    </div>
  )
}
