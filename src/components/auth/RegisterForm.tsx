import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthContext } from './AuthProvider'

const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não conferem',
  path: ['confirmPassword'],
})

type RegisterFormData = z.infer<typeof registerSchema>

interface RegisterFormProps {
  onSuccess?: () => void
  onLoginClick?: () => void
}

/**
 * RegisterForm - Formulário de registro
 */
export function RegisterForm({ onSuccess, onLoginClick }: RegisterFormProps) {
  const { register: registerUser, isLoading } = useAuthContext()
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    setError(null)

    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      })
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar conta')
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="auth-form-header">
        <h2>Criar Conta</h2>
        <p>Crie sua conta para começar a construir jogos</p>
      </div>

      {error && (
        <div className="auth-form-error">
          {error}
        </div>
      )}

      <div className="auth-form-field">
        <label htmlFor="name">Nome</label>
        <input
          id="name"
          type="text"
          placeholder="Seu nome"
          {...register('name')}
          className={errors.name ? 'error' : ''}
        />
        {errors.name && (
          <span className="auth-form-field-error">{errors.name.message}</span>
        )}
      </div>

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
            placeholder="Minimo 6 caracteres"
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

      <div className="auth-form-field">
        <label htmlFor="confirmPassword">Confirmar Senha</label>
        <div className="auth-form-password-wrapper">
          <input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Digite a senha novamente"
            {...register('confirmPassword')}
            className={errors.confirmPassword ? 'error' : ''}
          />
          <button
            type="button"
            className="auth-form-password-toggle"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            aria-label={showConfirmPassword ? 'Esconder senha' : 'Mostrar senha'}
          >
            {showConfirmPassword ? (
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
        {errors.confirmPassword && (
          <span className="auth-form-field-error">{errors.confirmPassword.message}</span>
        )}
      </div>

      <button
        type="submit"
        className="auth-form-submit"
        disabled={isLoading}
      >
        {isLoading ? 'Criando conta...' : 'Criar Conta'}
      </button>

      <div className="auth-form-footer">
        <span>Já tem uma conta?</span>
        <button
          type="button"
          className="auth-form-link"
          onClick={onLoginClick}
        >
          Entrar
        </button>
      </div>
    </form>
  )
}
