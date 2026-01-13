import { useEffect } from 'react'
import { Game } from '@/components'
import { InteractionPrompt } from '@/components/InteractionPrompt'
import { EditorLayout } from '@/components/editor'
import { useGameEngine } from '@/hooks'
import { SEO } from '@/components/shared'

export function Editor() {
  const { mode, changeMode } = useGameEngine()

  // Start in editor mode by default
  useEffect(() => {
    changeMode('editor')
  }, [])

  return (
    <>
      <SEO
        title="Editor"
        description="Editor visual do MMORPG Builder. Crie e edite mundos 3D com ferramentas profissionais."
      />
      <EditorLayout mode={mode} onModeChange={changeMode}>
        <Game />
        {mode === 'play' && <InteractionPrompt />}
      </EditorLayout>
    </>
  )
}
