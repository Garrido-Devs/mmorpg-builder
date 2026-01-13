import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTeam } from '../../hooks/useTeam'
import { useAuthContext } from '../../components/auth/AuthProvider'
import { Navbar } from '@/components/shared'
import type { TeamPreview } from '../../types/team'
import '../../styles/auth.css'

/**
 * JoinTeam Page - Página para entrar em time via convite
 */
export function JoinTeam() {
  const { code } = useParams<{ code: string }>()
  const navigate = useNavigate()
  const { isAuthenticated, isLoading: authLoading } = useAuthContext()
  const { previewTeam, joinTeam, isLoading, error } = useTeam()

  const [teamPreview, setTeamPreview] = useState<TeamPreview | null>(null)
  const [loadingPreview, setLoadingPreview] = useState(true)
  const [joining, setJoining] = useState(false)

  // Carregar preview do time
  useEffect(() => {
    if (!code) return

    setLoadingPreview(true)
    previewTeam(code).then((preview) => {
      setTeamPreview(preview)
      setLoadingPreview(false)
    })
  }, [code, previewTeam])

  const handleJoin = async () => {
    if (!code) return

    setJoining(true)
    const success = await joinTeam(code)
    setJoining(false)

    if (success) {
      navigate('/dashboard')
    }
  }

  if (loadingPreview || authLoading) {
    return (
      <div className="auth-page">
        <Navbar />
        <div className="auth-container">
          <div className="auth-loading">
            <div className="auth-loading-spinner" />
            <span>Carregando...</span>
          </div>
        </div>
        <div className="auth-background" />
      </div>
    )
  }

  if (!teamPreview) {
    return (
      <div className="auth-page">
        <Navbar />
        <div className="auth-container">
          <div className="join-team-error">
            <span className="join-team-error-icon">X</span>
            <h2>Link Invalido</h2>
            <p>Este link de convite nao existe ou expirou.</p>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/')}
            >
              Voltar ao Inicio
            </button>
          </div>
        </div>
        <div className="auth-background" />
      </div>
    )
  }

  return (
    <div className="auth-page">
      <Navbar />
      <div className="auth-container">
        <div className="join-team">
          <div className="join-team-header">
            <h2>Convite para Time</h2>
            <p>Voce foi convidado para participar de um time</p>
          </div>

          <div className="join-team-preview">
            <div className="join-team-avatar">
              {teamPreview.avatarUrl ? (
                <img src={teamPreview.avatarUrl} alt={teamPreview.name} />
              ) : (
                <span>{teamPreview.name.charAt(0).toUpperCase()}</span>
              )}
            </div>

            <h3 className="join-team-name">{teamPreview.name}</h3>

            {teamPreview.description && (
              <p className="join-team-description">{teamPreview.description}</p>
            )}

            <div className="join-team-meta">
              <span>Criado por {teamPreview.ownerName}</span>
              <span>{teamPreview.memberCount} membros</span>
            </div>
          </div>

          {error && (
            <div className="join-team-error-message">{error}</div>
          )}

          {!isAuthenticated ? (
            <div className="join-team-auth">
              <p>Faca login ou crie uma conta para entrar no time</p>
              <div className="join-team-auth-buttons">
                <button
                  className="btn btn-primary"
                  onClick={() => navigate(`/auth/login?redirect=/join/${code}`)}
                >
                  Entrar
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => navigate(`/auth/register?redirect=/join/${code}`)}
                >
                  Criar Conta
                </button>
              </div>
            </div>
          ) : (
            <button
              className="btn btn-primary btn-lg"
              onClick={handleJoin}
              disabled={joining || isLoading}
            >
              {joining ? 'Entrando...' : 'Entrar no Time'}
            </button>
          )}
        </div>
      </div>

      <div className="auth-background" />
    </div>
  )
}
