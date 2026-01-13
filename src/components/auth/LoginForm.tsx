import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthContext } from './AuthProvider'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
})

type LoginFormData = z.infer<typeof loginSchema>

interface LoginFormProps {
  onSuccess?: () => void
  onRegisterClick?: () => void
}

/**
 * LoginForm - Formulário de login
 */
export function LoginForm({ onSuccess, onRegisterClick }: LoginFormProps) {
  const { login, isLoading } = useAuthContext()
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setError(null)

    try {
      await login(data)
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login')
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="auth-form-header">
        <h2>Entrar</h2>
        <p>Acesse sua conta para continuar</p>
      </div>

      {error && (
        <div className="auth-form-error">
          {error}
        </div>
      )}

      <div className="auth-form-field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="seu@email.com"
          {...register('email')}
          className={errors.email ? 'error' : ''}
        />
        {errors.email && (
          <span className="auth-form-field-error">{errors.email.message}</span>
        )}
      </div>

      <div className="auth-form-field">
        <label htmlFor="password">Senha</label>
        <div className="auth-form-password-wrapper">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Sua senha"
            {...register('password')}
            className={errors.password ? 'error' : ''}
          />
          <button
            type="button"
            className="auth-form-password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Esconder senha' : 'Mostrar senha'}
          >
            {showPassword ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            )}
          </button>
        </div>
        {errors.password && (
          <span className="auth-form-field-error">{errors.password.message}</span>
        )}
      </div>

      <button
        type="submit"
        className="auth-form-submit"
        disabled={isLoading}
      >
        {isLoading ? 'Entrando...' : 'Entrar'}
      </button>

      <div className="auth-form-footer">
        <span>Não tem uma conta?</span>
        <button
          type="button"
          className="auth-form-link"
          onClick={onRegisterClick}
        >
          Criar conta
        </button>
      </div>
    </form>
  )
}
