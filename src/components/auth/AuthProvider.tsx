import { createContext, useContext, ReactNode } from 'react'
import { useAuth } from '../../hooks/useAuth'
import type { AuthContextValue } from '../../types/auth'

const AuthContext = createContext<AuthContextValue | null>(null)

interface AuthProviderProps {
  children: ReactNode
}

/**
 * AuthProvider - Provedor de contexto de autenticação
 *
 * Envolve a aplicação para fornecer estado de auth em qualquer componente
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useAuth()

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Hook para acessar o contexto de autenticação
 */
export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }

  return context
}

/**
 * Componente para proteger rotas que requerem autenticação
 */
interface RequireAuthProps {
  children: ReactNode
  fallback?: ReactNode
}

export function RequireAuth({ children, fallback }: RequireAuthProps) {
  const { isAuthenticated, isLoading } = useAuthContext()

  if (isLoading) {
    return (
      <div className="auth-loading">
        <div className="auth-loading-spinner" />
        <span>Carregando...</span>
      </div>
    )
  }

  if (!isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>
    }

    // Redirecionar para login
    window.location.href = '/auth/login'
    return null
  }

  return <>{children}</>
}
