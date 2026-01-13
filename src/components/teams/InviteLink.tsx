import { useState, useCallback } from 'react'
import type { InviteInfo } from '../../types/team'

interface InviteLinkProps {
  invite: InviteInfo | null
  onRegenerate?: () => Promise<void>
  isLoading?: boolean
}

/**
 * InviteLink - Componente para exibir e gerenciar link de convite
 */
export function InviteLink({ invite, onRegenerate, isLoading }: InviteLinkProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    if (!invite?.inviteLink) return

    try {
      await navigator.clipboard.writeText(invite.inviteLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback para navegadores antigos
      const input = document.createElement('input')
      input.value = invite.inviteLink
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [invite?.inviteLink])

  if (!invite) {
    return (
      <div className="invite-link invite-link-loading">
        Carregando link de convite...
      </div>
    )
  }

  return (
    <div className="invite-link">
      <div className="invite-link-header">
        <h4>Link de Convite</h4>
        <p>Compartilhe este link para convidar pessoas para o time</p>
      </div>

      <div className="invite-link-content">
        <div className="invite-link-code">
          <span className="invite-link-code-label">Código:</span>
          <span className="invite-link-code-value">{invite.inviteCode}</span>
        </div>

        <div className="invite-link-url">
          <input
            type="text"
            value={invite.inviteLink}
            readOnly
            className="invite-link-input"
          />

          <button
            className={`invite-link-copy ${copied ? 'copied' : ''}`}
            onClick={handleCopy}
          >
            {copied ? 'Copiado!' : 'Copiar'}
          </button>
        </div>

        <button
          className="invite-link-regenerate"
          onClick={onRegenerate}
          disabled={isLoading}
        >
          {isLoading ? 'Gerando...' : 'Gerar Novo Link'}
        </button>

        <p className="invite-link-warning">
          Ao gerar um novo link, o link anterior será invalidado.
        </p>
      </div>
    </div>
  )
}
