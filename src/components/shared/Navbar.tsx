import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

export function Navbar() {
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState('')

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('auth_token')
    const userStr = localStorage.getItem('auth_user')
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr)
        setIsLoggedIn(true)
        setUserName(user.name || 'Usuario')
      } catch {
        setIsLoggedIn(false)
      }
    } else {
      setIsLoggedIn(false)
    }
  }, [location])

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const closeMenu = () => setIsMenuOpen(false)

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    setIsLoggedIn(false)
    setUserName('')
    window.location.href = '/'
  }

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
        <Link to="/blog" className={`navbar-link ${isActive('/blog') ? 'active' : ''}`}>
          Features
        </Link>
        <Link to="/docs" className={`navbar-link ${isActive('/docs') ? 'active' : ''}`}>
          Docs
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

        {isLoggedIn ? (
          <>
            <Link to="/dashboard" className={`navbar-link ${isActive('/dashboard') ? 'active' : ''}`}>
              Dashboard
            </Link>
            <div className="navbar-user">
              <span className="navbar-user-name">{userName}</span>
              <button onClick={handleLogout} className="navbar-logout">
                Sair
              </button>
            </div>
          </>
        ) : (
          <>
            <Link to="/auth/login" className="navbar-link navbar-login">
              Entrar
            </Link>
            <Link to="/auth/register" className="navbar-cta">
              Criar Conta
            </Link>
          </>
        )}
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
          to="/blog"
          className={`navbar-mobile-link ${isActive('/blog') ? 'active' : ''}`}
          onClick={closeMenu}
        >
          Features
        </Link>
        <Link
          to="/docs"
          className={`navbar-mobile-link ${isActive('/docs') ? 'active' : ''}`}
          onClick={closeMenu}
        >
          Docs
        </Link>
        <Link
          to="/assets"
          className={`navbar-mobile-link ${isActive('/assets') ? 'active' : ''}`}
          onClick={closeMenu}
        >
          Assets
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

        {isLoggedIn ? (
          <>
            <Link
              to="/dashboard"
              className={`navbar-mobile-link ${isActive('/dashboard') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Dashboard
            </Link>
            <Link
              to="/teams"
              className={`navbar-mobile-link ${isActive('/teams') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Meus Times
            </Link>
            <Link
              to="/projects"
              className={`navbar-mobile-link ${isActive('/projects') ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Meus Projetos
            </Link>
            <button
              className="navbar-mobile-link navbar-mobile-logout"
              onClick={() => { handleLogout(); closeMenu(); }}
            >
              Sair ({userName})
            </button>
          </>
        ) : (
          <>
            <Link
              to="/auth/login"
              className="navbar-mobile-link"
              onClick={closeMenu}
            >
              Entrar
            </Link>
            <Link
              to="/auth/register"
              className="navbar-cta navbar-mobile-cta"
              onClick={closeMenu}
            >
              Criar Conta Gratis
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
