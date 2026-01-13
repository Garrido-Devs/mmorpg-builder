interface SyncStatusProps {
  isConnected: boolean
  pendingChanges: number
  lastSyncAt: string | null
}

/**
 * SyncStatus - Indicador de status de sincronização
 */
export function SyncStatus({ isConnected, pendingChanges, lastSyncAt }: SyncStatusProps) {
  const getStatusInfo = () => {
    if (!isConnected) {
      return {
        icon: '⚠️',
        text: 'Desconectado',
        className: 'disconnected',
      }
    }

    if (pendingChanges > 0) {
      return {
        icon: '🔄',
        text: `Salvando ${pendingChanges} ${pendingChanges === 1 ? 'alteração' : 'alterações'}...`,
        className: 'syncing',
      }
    }

    return {
      icon: '✓',
      text: 'Sincronizado',
      className: 'synced',
    }
  }

  const status = getStatusInfo()

  return (
    <div className={`sync-status ${status.className}`}>
      <span className="sync-status-icon">{status.icon}</span>
      <span className="sync-status-text">{status.text}</span>
      {lastSyncAt && isConnected && pendingChanges === 0 && (
        <span className="sync-status-time">
          {formatLastSync(lastSyncAt)}
        </span>
      )}
    </div>
  )
}

function formatLastSync(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSecs = Math.floor(diffMs / 1000)

  if (diffSecs < 5) return 'agora'
  if (diffSecs < 60) return `há ${diffSecs}s`

  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}
