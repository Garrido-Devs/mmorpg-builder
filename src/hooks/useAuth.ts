import { useState, useEffect, useCallback } from 'react'
import type { User, AuthState, LoginCredentials, RegisterData } from '../types/auth'
import { authApi, ApiError } from '../utils/api'

const AUTH_TOKEN_KEY = 'auth_token'
const AUTH_USER_KEY = 'auth_user'

/**
 * Hook para gerenciar autenticação
 */
export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  })

  // Carregar estado inicial do localStorage
  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY)
    const userStr = localStorage.getItem(AUTH_USER_KEY)

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as User
        setState({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        })

        // Validar token com o servidor
        authApi.me().catch(() => {
          // Token inválido, limpar
          localStorage.removeItem(AUTH_TOKEN_KEY)
          localStorage.removeItem(AUTH_USER_KEY)
          setState({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          })
        })
      } catch {
        setState((prev) => ({ ...prev, isLoading: false }))
      }
    } else {
      setState((prev) => ({ ...prev, isLoading: false }))
    }
  }, [])

  // Login
  const login = useCallback(async (credentials: LoginCredentials) => {
    setState((prev) => ({ ...prev, isLoading: true }))

    try {
      const response = await authApi.login(credentials)
      const user = response.user as User

      localStorage.setItem(AUTH_TOKEN_KEY, response.token)
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))

      setState({
        user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
      })
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }))

      if (error instanceof ApiError) {
        throw new Error(error.message)
      }
      throw error
    }
  }, [])

  // Register
  const register = useCallback(async (data: RegisterData) => {
    setState((prev) => ({ ...prev, isLoading: true }))

    try {
      const response = await authApi.register(data)
      const user = response.user as User

      localStorage.setItem(AUTH_TOKEN_KEY, response.token)
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))

      setState({
        user,
        token: response.token,
        isAuthenticated: true,
        isLoading: false,
      })
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }))

      if (error instanceof ApiError) {
        throw new Error(error.message)
      }
      throw error
    }
  }, [])

  // Logout
  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem(AUTH_USER_KEY)

    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    })

    // Notificar servidor (não esperar resposta)
    authApi.logout().catch(() => {})
  }, [])

  // Update user
  const updateUser = useCallback((updates: Partial<User>) => {
    setState((prev) => {
      if (!prev.user) return prev

      const updatedUser = { ...prev.user, ...updates }
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(updatedUser))

      return { ...prev, user: updatedUser }
    })
  }, [])

  return {
    ...state,
    login,
    register,
    logout,
    updateUser,
  }
}
