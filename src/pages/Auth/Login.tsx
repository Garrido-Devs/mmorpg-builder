import { useNavigate } from 'react-router-dom'
import { LoginForm } from '../../components/auth/LoginForm'
import { Navbar } from '@/components/shared'
import '../../styles/auth.css'

/**
 * Login Page - Página de login
 */
export function Login() {
  const navigate = useNavigate()

  return (
    <div className="auth-page">
      <Navbar />
      <div className="auth-container">
        <LoginForm
          onSuccess={() => navigate('/dashboard')}
          onRegisterClick={() => navigate('/auth/register')}
        />
      </div>

      <div className="auth-background" />
    </div>
  )
}
