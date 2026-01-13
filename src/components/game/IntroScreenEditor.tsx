import { useState, useEffect, useCallback } from 'react'
import type { IntroScreen } from '../../types/game'

interface IntroScreenEditorProps {
  intro: IntroScreen
  onUpdate: (intro: IntroScreen) => void
  disabled?: boolean
}

/**
 * Editor de tela de introducao
 */
export function IntroScreenEditor({ intro, onUpdate, disabled }: IntroScreenEditorProps) {
  const [localIntro, setLocalIntro] = useState<IntroScreen>(intro)

  useEffect(() => {
    setLocalIntro(intro)
  }, [intro])

  const handleChange = useCallback(
    <K extends keyof IntroScreen>(key: K, value: IntroScreen[K]) => {
      const newIntro = { ...localIntro, [key]: value }
      setLocalIntro(newIntro)
      onUpdate(newIntro)
    },
    [localIntro, onUpdate]
  )

  return (
    <div className="game-editor-section">
      <h3 className="game-editor-section-title">Tela de Introducao</h3>

      <div className="game-editor-field game-editor-field-inline">
        <label htmlFor="intro-enabled">Ativar intro</label>
        <input
          id="intro-enabled"
          type="checkbox"
          checked={localIntro.enabled}
          onChange={(e) => handleChange('enabled', e.target.checked)}
          disabled={disabled}
        />
      </div>

      {localIntro.enabled && (
        <>
          <div className="game-editor-field">
            <label htmlFor="intro-duration">Duracao (segundos)</label>
            <input
              id="intro-duration"
              type="number"
              value={localIntro.duration}
              onChange={(e) => handleChange('duration', Number(e.target.value))}
              min={1}
              max={30}
              disabled={disabled}
            />
          </div>

          <div className="game-editor-field">
            <label htmlFor="intro-background">Background (URL ou cor)</label>
            <input
              id="intro-background"
              type="text"
              value={localIntro.background}
              onChange={(e) => handleChange('background', e.target.value)}
              placeholder="#000000 ou URL da imagem"
              disabled={disabled}
            />
          </div>

          <div className="game-editor-field">
            <label htmlFor="intro-logo">Logo (URL)</label>
            <input
              id="intro-logo"
              type="text"
              value={localIntro.logo || ''}
              onChange={(e) => handleChange('logo', e.target.value || null)}
              placeholder="URL do logo"
              disabled={disabled}
            />
          </div>

          <div className="game-editor-field">
            <label htmlFor="intro-music">Musica (URL)</label>
            <input
              id="intro-music"
              type="text"
              value={localIntro.music || ''}
              onChange={(e) => handleChange('music', e.target.value || null)}
              placeholder="URL do arquivo de audio"
              disabled={disabled}
            />
          </div>
        </>
      )}
    </div>
  )
}
