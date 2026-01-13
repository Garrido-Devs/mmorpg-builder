import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export function Navbar() {
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <div className="navbar-logo-icon">M</div>
        <span>MMORPG Builder</span>
      </Link>

      {/* Mobile Menu Button */}
      <button
        className={`navbar-menu-btn ${isMenuOpen ? 'active' : ''}`}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Desktop Links */}
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
        <Link to="/showcase" className={`navbar-link ${isActive('/showcase') ? 'active' : ''}`}>
          Showcase
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

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="navbar-mobile-overlay" onClick={closeMenu} />
      )}

      {/* Mobile Menu */}
      <div className={`navbar-mobile ${isMenuOpen ? 'active' : ''}`}>
        <Link
          to="/"
          className={`navbar-mobile-link ${isActive('/') ? 'active' : ''}`}
          onClick={closeMenu}
        >
          Home
        </Link>
        <Link
          to="/docs"
          className={`navbar-mobile-link ${isActive('/docs') ? 'active' : ''}`}
          onClick={closeMenu}
        >
          Documentacao
        </Link>
        <Link
          to="/assets"
          className={`navbar-mobile-link ${isActive('/assets') ? 'active' : ''}`}
          onClick={closeMenu}
        >
          Assets
        </Link>
        <Link
          to="/showcase"
          className={`navbar-mobile-link ${isActive('/showcase') ? 'active' : ''}`}
          onClick={closeMenu}
        >
          Showcase
        </Link>
        <a
          href="https://github.com/Garrido-Devs/mmorpg-builder"
          target="_blank"
          rel="noopener noreferrer"
          className="navbar-mobile-link"
          onClick={closeMenu}
        >
          GitHub
        </a>
        <Link to="/editor" className="navbar-cta navbar-mobile-cta" onClick={closeMenu}>
          Abrir Editor
        </Link>
      </div>
    </nav>
  )
}
