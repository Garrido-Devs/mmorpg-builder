import { Link, useLocation } from 'react-router-dom'

export function Navbar() {
  const location = useLocation()

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <div className="navbar-logo-icon">M</div>
        <span>MMORPG Builder</span>
      </Link>

      <div className="navbar-links">
        <Link to="/" className={`navbar-link ${isActive('/') ? 'active' : ''}`}>
          Home
        </Link>
        <Link to="/docs" className={`navbar-link ${isActive('/docs') ? 'active' : ''}`}>
          Documentacao
        </Link>
        <Link to="/assets" className={`navbar-link ${isActive('/assets') ? 'active' : ''}`}>
          Assets
        </Link>
        <a
          href="https://github.com/Garrido-Devs/mmorpg-builder"
          target="_blank"
          rel="noopener noreferrer"
          className="navbar-link"
        >
          GitHub
        </a>
        <Link to="/editor" className="navbar-cta">
          Abrir Editor
        </Link>
      </div>
    </nav>
  )
}
