import { useState, useEffect, useCallback } from 'react'
import type { GameConfig } from '../../types/game'

interface GameConfigEditorProps {
  config: GameConfig
  onUpdate: (config: GameConfig) => void
  disabled?: boolean
}

const GENRE_OPTIONS = [
  'MMORPG',
  'RPG',
  'Aventura',
  'Acao',
  'Sandbox',
  'Survival',
  'PvP',
  'PvE',
  'Fantasy',
  'Sci-Fi',
  'Medieval',
]

/**
 * Editor de configuracoes gerais do jogo
 */
export function GameConfigEditor({ config, onUpdate, disabled }: GameConfigEditorProps) {
  const [localConfig, setLocalConfig] = useState<GameConfig>(config)

  useEffect(() => {
    setLocalConfig(config)
  }, [config])

  const handleChange = useCallback(
    (key: keyof GameConfig, value: string | string[]) => {
      const newConfig = { ...localConfig, [key]: value }
      setLocalConfig(newConfig)
      onUpdate(newConfig)
    },
    [localConfig, onUpdate]
  )

  const toggleGenre = useCallback(
    (genre: string) => {
      const newGenres = localConfig.genre.includes(genre)
        ? localConfig.genre.filter((g) => g !== genre)
        : [...localConfig.genre, genre]
      handleChange('genre', newGenres)
    },
    [localConfig.genre, handleChange]
  )

  return (
    <div className="game-editor-section">
      <h3 className="game-editor-section-title">Configuracoes do Jogo</h3>

      <div className="game-editor-field">
        <label htmlFor="game-title">Titulo do Jogo</label>
        <input
          id="game-title"
          type="text"
          value={localConfig.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Nome do seu jogo"
          disabled={disabled}
        />
      </div>

      <div className="game-editor-field">
        <label htmlFor="game-subtitle">Subtitulo</label>
        <input
          id="game-subtitle"
          type="text"
          value={localConfig.subtitle}
          onChange={(e) => handleChange('subtitle', e.target.value)}
          placeholder="Subtitulo ou slogan"
          disabled={disabled}
        />
      </div>

      <div className="game-editor-field">
        <label htmlFor="game-version">Versao</label>
        <input
          id="game-version"
          type="text"
          value={localConfig.version}
          onChange={(e) => handleChange('version', e.target.value)}
          placeholder="1.0.0"
          disabled={disabled}
        />
      </div>

      <div className="game-editor-field">
        <label htmlFor="game-author">Autor</label>
        <input
          id="game-author"
          type="text"
          value={localConfig.author}
          onChange={(e) => handleChange('author', e.target.value)}
          placeholder="Seu nome ou estudio"
          disabled={disabled}
        />
      </div>

      <div className="game-editor-field">
        <label>Generos</label>
        <div className="game-editor-genres">
          {GENRE_OPTIONS.map((genre) => (
            <button
              key={genre}
              type="button"
              className={`game-editor-genre-tag ${
                localConfig.genre.includes(genre) ? 'selected' : ''
              }`}
              onClick={() => toggleGenre(genre)}
              disabled={disabled}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
