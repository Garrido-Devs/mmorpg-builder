import { Routes, Route } from 'react-router-dom'
import { ScrollToTop } from './components/shared'
import { AuthProvider } from './components/auth/AuthProvider'

// Páginas públicas
import { Landing } from './pages/Landing'
import { Docs } from './pages/Docs'
import { Assets } from './pages/Assets'
import { Showcase } from './pages/Showcase'
import { Play } from './pages/Play'
import { Blog } from './pages/Blog/Blog'
import { Quiz } from './pages/Blog/Quiz'

// Páginas de autenticação
import { Login } from './pages/Auth/Login'
import { Register } from './pages/Auth/Register'
import { JoinTeam } from './pages/Auth/JoinTeam'

// Páginas protegidas
import { Dashboard } from './pages/Dashboard/Dashboard'
import { Teams } from './pages/Teams/Teams'
import { TeamDetail } from './pages/Teams/TeamDetail'
import { Projects } from './pages/Projects/Projects'
import { Editor } from './pages/Editor'

import './styles/index.css'

function App() {
  return (
    <AuthProvider>
      <ScrollToTop />
      <Routes>
        {/* Páginas públicas */}
        <Route path="/" element={<Landing />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/docs/:section" element={<Docs />} />
        <Route path="/assets" element={<Assets />} />
        <Route path="/showcase" element={<Showcase />} />
        <Route path="/play" element={<Play />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/quiz" element={<Quiz />} />

        {/* Autenticação */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/join/:code" element={<JoinTeam />} />

        {/* Páginas protegidas */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/teams/:id" element={<TeamDetail />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/editor/:projectId" element={<Editor />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
