import { useNavigate } from 'react-router-dom'
import { RegisterForm } from '../../components/auth/RegisterForm'
import { Navbar } from '@/components/shared'
import '../../styles/auth.css'

/**
 * Register Page - Página de registro
 */
export function Register() {
  const navigate = useNavigate()

  return (
    <div className="auth-page">
      <Navbar />
      <div className="auth-container">
        <RegisterForm
          onSuccess={() => navigate('/dashboard')}
          onLoginClick={() => navigate('/auth/login')}
        />
      </div>

      <div className="auth-background" />
    </div>
  )
}
