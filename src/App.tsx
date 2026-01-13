import { Game } from './components'
import { InteractionPrompt } from './components/InteractionPrompt'
import { EditorLayout } from './components/editor'
import { useGameEngine } from './hooks'
import './styles/index.css'

/**
 * App - Componente raiz da aplicação
 *
 * Usa o EditorLayout para estruturar a interface profissional
 */
function App() {
  const { mode, changeMode } = useGameEngine()

  return (
    <EditorLayout mode={mode} onModeChange={changeMode}>
      <Game />
      {mode === 'play' && <InteractionPrompt />}
    </EditorLayout>
  )
}

export default App
