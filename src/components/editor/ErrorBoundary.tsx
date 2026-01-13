import React, { Component, ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

/**
 * EditorErrorBoundary - Captura erros em componentes filhos
 *
 * Previne que erros em um componente quebrem todo o editor
 * Mostra uma UI de fallback amigável com informações do erro
 */
export class EditorErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.setState({ errorInfo })
    console.error('EditorErrorBoundary caught an error:', error, errorInfo)
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="editor-error">
          <div className="editor-error-icon">⚠️</div>
          <div className="editor-error-title">Erro no Componente</div>
          <div className="editor-error-message">
            {this.state.error?.message || 'Um erro inesperado ocorreu'}
          </div>
          {this.state.errorInfo && (
            <details className="editor-error-details">
              <summary>Detalhes do erro</summary>
              <pre>{this.state.errorInfo.componentStack}</pre>
            </details>
          )}
          <button
            className="editor-btn editor-btn-primary"
            onClick={this.handleReset}
            style={{ marginTop: '12px' }}
          >
            Tentar Novamente
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Hook para usar com componentes funcionais
 * Envolve o componente em um ErrorBoundary
 */
export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  fallback?: ReactNode
): React.FC<P> {
  const WithErrorBoundary: React.FC<P> = (props) => (
    <EditorErrorBoundary fallback={fallback}>
      <WrappedComponent {...props} />
    </EditorErrorBoundary>
  )

  WithErrorBoundary.displayName = `WithErrorBoundary(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`

  return WithErrorBoundary
}
