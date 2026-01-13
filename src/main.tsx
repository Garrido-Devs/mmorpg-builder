import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

/**
 * Entry point da aplicação
 *
 * Decisão: StrictMode habilitado para detectar problemas
 * em desenvolvimento, mas não afeta produção
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
