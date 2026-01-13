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
            <span>Colaboracao em Tempo Real</span>
          </div>
          <h1 className="hero-title">
            Crie seu <span>MMORPG 3D</span> com sua equipe
          </h1>
          <p className="hero-description">
            Editor visual colaborativo para criar jogos MMORPG. Trabalhe em equipe em tempo real,
            gerencie projetos, convide membros - tudo no navegador.
          </p>
          <div className="hero-buttons">
            <Link to="/auth/register" className="btn-primary">
              Criar Conta Gratis
            </Link>
            <Link to="/blog" className="btn-secondary">
              Ver Features
            </Link>
          </div>
          <p className="hero-note">
            Ja tem uma conta? <Link to="/auth/login">Entrar</Link>
          </p>
        </div>

        <div className="hero-preview">
          <div className="hero-preview-placeholder">
            <div className="hero-preview-placeholder-icon">👥</div>
            <p>Colaboracao em Tempo Real</p>
          </div>
        </div>
      </section>

      {/* New: Collaboration Features */}
      <section className="collab-features landing-section">
        <div className="section-header">
          <span className="section-tag">Novo</span>
          <h2 className="section-title">Trabalhe em Equipe</h2>
          <p className="section-description">
            Sistema completo de colaboracao para criar jogos em equipe.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card feature-highlight">
            <div className="feature-icon">👥</div>
            <h3 className="feature-title">Times e Projetos</h3>
            <p className="feature-description">
              Crie times, convide membros por link, gerencie permissoes.
              Cada time pode ter multiplos projetos.
            </p>
          </div>

          <div className="feature-card feature-highlight">
            <div className="feature-icon">⚡</div>
            <h3 className="feature-title">Edicao em Tempo Real</h3>
            <p className="feature-description">
              Veja outros membros editando ao vivo. Cursores coloridos,
              sincronizacao automatica, sem conflitos.
            </p>
          </div>

          <div className="feature-card feature-highlight">
            <div className="feature-icon">☁️</div>
            <h3 className="feature-title">Salvamento na Nuvem</h3>
            <p className="feature-description">
              Projetos salvos automaticamente no Vercel. Acesse de qualquer
              lugar, qualquer dispositivo.
            </p>
          </div>

          <div className="feature-card feature-highlight">
            <div className="feature-icon">🔐</div>
            <h3 className="feature-title">Autenticacao Segura</h3>
            <p className="feature-description">
              Sistema de contas com JWT. Seus projetos protegidos,
              apenas membros do time podem acessar.
            </p>
          </div>

          <div className="feature-card feature-highlight">
            <div className="feature-icon">🔗</div>
            <h3 className="feature-title">Convites por Link</h3>
            <p className="feature-description">
              Convide membros para seu time com um link unico.
              Controle quem pode entrar, regenere links quando quiser.
            </p>
          </div>

          <div className="feature-card feature-highlight">
            <div className="feature-icon">👁️</div>
            <h3 className="feature-title">Presenca em Tempo Real</h3>
            <p className="feature-description">
              Veja quem esta online no projeto. Avatares e indicadores
              mostram onde cada membro esta trabalhando.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features landing-section">
        <div className="section-header">
          <span className="section-tag">Editor</span>
          <h2 className="section-title">Ferramentas Profissionais</h2>
          <p className="section-description">
            Tudo que voce precisa para criar seu jogo MMORPG.
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
            <div className="feature-icon">⛏️</div>
            <h3 className="feature-title">Componentes MMORPG</h3>
            <p className="feature-description">
              Resource Nodes, Crafting Stations, Banks, Skills, Equipment,
              Prayer Altars, Agility e Farming - estilo RuneScape.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🧩</div>
            <h3 className="feature-title">+20 Tipos de Componentes</h3>
            <p className="feature-description">
              Colisores, triggers, spawners, portais, lojas, quest givers,
              dialogos e muito mais.
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
            <h3 className="step-title">Crie sua Conta</h3>
            <p className="step-description">
              Registre-se gratuitamente. Crie um time e convide
              seus colegas pelo link de convite.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">2</div>
            <h3 className="step-title">Crie um Projeto</h3>
            <p className="step-description">
              Inicie um novo projeto de jogo. Configure titulo, descricao,
              tela de intro, loading e menu principal.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">3</div>
            <h3 className="step-title">Edite em Equipe</h3>
            <p className="step-description">
              Use o editor visual para criar seu mundo. Trabalhe junto
              com sua equipe em tempo real!
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
              <div className="roadmap-phase">Fase 1 - Concluida</div>
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
            <div className="roadmap-dot completed"></div>
            <div className="roadmap-content">
              <div className="roadmap-phase">Fase 2 - Concluida</div>
              <h3 className="roadmap-title">Componentes MMORPG</h3>
              <div className="roadmap-features">
                <span className="roadmap-tag">Resource Nodes</span>
                <span className="roadmap-tag">Crafting Stations</span>
                <span className="roadmap-tag">Banks</span>
                <span className="roadmap-tag">Skills & Equipment</span>
              </div>
            </div>
          </div>

          <div className="roadmap-item">
            <div className="roadmap-dot current"></div>
            <div className="roadmap-content">
              <div className="roadmap-phase">Fase 3 - Atual</div>
              <h3 className="roadmap-title">Colaboracao em Tempo Real</h3>
              <div className="roadmap-features">
                <span className="roadmap-tag">Autenticacao</span>
                <span className="roadmap-tag">Times & Projetos</span>
                <span className="roadmap-tag">Edicao Colaborativa</span>
                <span className="roadmap-tag">Salvamento na Nuvem</span>
              </div>
            </div>
          </div>

          <div className="roadmap-item">
            <div className="roadmap-dot future"></div>
            <div className="roadmap-content">
              <div className="roadmap-phase">Fase 4</div>
              <h3 className="roadmap-title">Multiplayer no Jogo</h3>
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
              <div className="roadmap-phase">Fase 5</div>
              <h3 className="roadmap-title">Terreno e Ambiente</h3>
              <div className="roadmap-features">
                <span className="roadmap-tag">Editor de Terreno</span>
                <span className="roadmap-tag">Clima Dinamico</span>
                <span className="roadmap-tag">Ciclo Dia/Noite</span>
                <span className="roadmap-tag">Vegetacao Procedural</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section landing-section">
        <div className="cta-content">
          <h2 className="cta-title">Pronto para criar seu MMORPG?</h2>
          <p className="cta-description">
            Junte-se a comunidade de criadores. Crie sua conta gratuita e comece a construir hoje.
          </p>
          <div className="cta-buttons">
            <Link to="/auth/register" className="btn-primary btn-large">
              Criar Conta Gratis
            </Link>
            <Link to="/blog" className="btn-secondary btn-large">
              Ver Documentacao
            </Link>
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
              <li><Link to="/auth/register">Criar Conta</Link></li>
              <li><Link to="/auth/login">Entrar</Link></li>
              <li><Link to="/blog">Features</Link></li>
              <li><Link to="/assets">Assets</Link></li>
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
            MIT License | Criado por{' '}
            <a
              href="https://wa.me/5567993109148"
              target="_blank"
              rel="noopener noreferrer"
            >
              Emerson Garrido
            </a>
          </p>
          <p className="footer-credits">
            Assets por{' '}
            <a href="https://kaylousberg.itch.io/" target="_blank" rel="noopener noreferrer">
              KayKit
            </a>
            {' '}(CC0) |{' '}
            <a
              href="https://github.com/Garrido-Devs/mmorpg-builder"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}
