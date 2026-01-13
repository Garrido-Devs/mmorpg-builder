import { useState, useEffect } from 'react'
import { getEngine } from '../engine'
import './InteractionPrompt.css'

/**
 * InteractionPrompt - Mostra o prompt de interação quando perto de objetos interativos
 */
export function InteractionPrompt() {
  const [prompt, setPrompt] = useState<{ show: boolean; text: string; key: string } | null>(null)

  useEffect(() => {
    const engine = getEngine()

    // Polling para atualizar o prompt
    const interval = setInterval(() => {
      if (engine.getMode() === 'play') {
        const newPrompt = engine.interactionSystem.getInteractionPrompt()
        setPrompt(newPrompt)
      } else {
        setPrompt(null)
      }
    }, 100) // Atualiza 10x por segundo

    return () => clearInterval(interval)
  }, [])

  if (!prompt || !prompt.show) return null

  return (
    <div className="interaction-prompt">
      <div className="interaction-prompt-key">{prompt.key}</div>
      <div className="interaction-prompt-text">{prompt.text}</div>
    </div>
  )
}
