import { useState, useRef } from 'react'
import type { SoundDefinition } from '@/audio/SoundRegistry'

interface SoundCardProps {
  sound: SoundDefinition
  compact?: boolean
}

/**
 * SoundCard - Card para exibir e tocar um som
 */
export function SoundCard({ sound, compact = false }: SoundCardProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const handlePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
        setIsPlaying(false)
      } else {
        audioRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  const handleEnded = () => {
    setIsPlaying(false)
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'battle':
        return '⚔️'
      case 'interface':
        return '🖱️'
      case 'inventory':
        return '🎒'
      case 'npc':
        return '👹'
      case 'world':
        return '🌍'
      case 'misc':
        return '🎵'
      default:
        return '🔊'
    }
  }

  if (compact) {
    return (
      <button
        className={`sound-card-compact ${isPlaying ? 'playing' : ''}`}
        onClick={handlePlay}
        title={sound.name}
      >
        <span className="sound-icon">{isPlaying ? '⏹️' : '▶️'}</span>
        <span className="sound-name">{sound.name}</span>
        <audio ref={audioRef} src={sound.path} onEnded={handleEnded} preload="none" />
      </button>
    )
  }

  return (
    <div className={`sound-card ${isPlaying ? 'playing' : ''}`}>
      <div className="sound-card-header">
        <span className="sound-category-icon">{getCategoryIcon(sound.category)}</span>
        <span className="sound-category">{sound.category}</span>
      </div>
      <div className="sound-card-body">
        <button className="sound-play-btn" onClick={handlePlay}>
          {isPlaying ? '⏹️' : '▶️'}
        </button>
        <div className="sound-info">
          <h4 className="sound-name">{sound.name}</h4>
          <code className="sound-id">{sound.id}</code>
        </div>
      </div>
      <audio ref={audioRef} src={sound.path} onEnded={handleEnded} preload="none" />
    </div>
  )
}
