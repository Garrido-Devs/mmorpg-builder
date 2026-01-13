import { useState, useEffect, useCallback } from 'react'
import type { LoadingScreen } from '../../types/game'

interface LoadingScreenEditorProps {
  loading: LoadingScreen
  onUpdate: (loading: LoadingScreen) => void
  disabled?: boolean
}

/**
 * Editor de tela de carregamento
 */
export function LoadingScreenEditor({ loading, onUpdate, disabled }: LoadingScreenEditorProps) {
  const [localLoading, setLocalLoading] = useState<LoadingScreen>(loading)
  const [newTip, setNewTip] = useState('')

  useEffect(() => {
    setLocalLoading(loading)
  }, [loading])

  const handleChange = useCallback(
    <K extends keyof LoadingScreen>(key: K, value: LoadingScreen[K]) => {
      const newLoading = { ...localLoading, [key]: value }
      setLocalLoading(newLoading)
      onUpdate(newLoading)
    },
    [localLoading, onUpdate]
  )

  const addTip = useCallback(() => {
    if (!newTip.trim()) return
    const newTips = [...localLoading.tips, newTip.trim()]
    handleChange('tips', newTips)
    setNewTip('')
  }, [newTip, localLoading.tips, handleChange])

  const removeTip = useCallback(
    (index: number) => {
      const newTips = localLoading.tips.filter((_, i) => i !== index)
      handleChange('tips', newTips)
    },
    [localLoading.tips, handleChange]
  )

  return (
    <div className="game-editor-section">
      <h3 className="game-editor-section-title">Tela de Carregamento</h3>

      <div className="game-editor-field game-editor-field-inline">
        <label htmlFor="loading-enabled">Ativar tela de loading</label>
        <input
          id="loading-enabled"
          type="checkbox"
          checked={localLoading.enabled}
          onChange={(e) => handleChange('enabled', e.target.checked)}
          disabled={disabled}
        />
      </div>

      {localLoading.enabled && (
        <>
          <div className="game-editor-field game-editor-field-inline">
            <label htmlFor="loading-progress">Mostrar barra de progresso</label>
            <input
              id="loading-progress"
              type="checkbox"
              checked={localLoading.showProgress}
              onChange={(e) => handleChange('showProgress', e.target.checked)}
              disabled={disabled}
            />
          </div>

          <div className="game-editor-field">
            <label htmlFor="loading-background">Background (URL ou cor)</label>
            <input
              id="loading-background"
              type="text"
              value={localLoading.background}
              onChange={(e) => handleChange('background', e.target.value)}
              placeholder="#000000 ou URL da imagem"
              disabled={disabled}
            />
          </div>

          <div className="game-editor-field">
            <label htmlFor="loading-music">Musica (URL)</label>
            <input
              id="loading-music"
              type="text"
              value={localLoading.music || ''}
              onChange={(e) => handleChange('music', e.target.value || null)}
              placeholder="URL do arquivo de audio"
              disabled={disabled}
            />
          </div>

          <div className="game-editor-field">
            <label>Dicas de Loading</label>
            <div className="game-editor-tips-list">
              {localLoading.tips.map((tip, index) => (
                <div key={index} className="game-editor-tip-item">
                  <span>{tip}</span>
                  <button
                    type="button"
                    className="game-editor-tip-remove"
                    onClick={() => removeTip(index)}
                    disabled={disabled}
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
            <div className="game-editor-tip-add">
              <input
                type="text"
                value={newTip}
                onChange={(e) => setNewTip(e.target.value)}
                placeholder="Digite uma dica..."
                disabled={disabled}
                onKeyDown={(e) => e.key === 'Enter' && addTip()}
              />
              <button type="button" onClick={addTip} disabled={disabled || !newTip.trim()}>
                Adicionar
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
