/**
 * GameLoop - Gerencia o loop principal do jogo
 *
 * Responsabilidades:
 * - Controlar o game loop independente do React
 * - Calcular deltaTime entre frames
 * - Chamar callbacks de update
 *
 * Decisão: Usamos requestAnimationFrame para sincronizar com o refresh do monitor
 */
export class GameLoop {
  private isRunning = false
  private animationFrameId: number | null = null
  private lastTime = 0
  private updateCallbacks: Set<(deltaTime: number) => void> = new Set()

  /**
   * Inicia o game loop
   */
  public start(): void {
    if (this.isRunning) return

    this.isRunning = true
    this.lastTime = performance.now()
    this.tick()
  }

  /**
   * Para o game loop
   */
  public stop(): void {
    this.isRunning = false
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null
    }
  }

  /**
   * Registra um callback para ser chamado a cada frame
   */
  public onUpdate(callback: (deltaTime: number) => void): () => void {
    this.updateCallbacks.add(callback)
    // Retorna função para remover o callback
    return () => this.updateCallbacks.delete(callback)
  }

  /**
   * Loop principal - executa a cada frame
   */
  private tick = (): void => {
    if (!this.isRunning) return

    const currentTime = performance.now()
    // deltaTime em segundos para facilitar cálculos de física
    const deltaTime = (currentTime - this.lastTime) / 1000
    this.lastTime = currentTime

    // Limita deltaTime para evitar "saltos" quando tab fica em background
    const clampedDelta = Math.min(deltaTime, 0.1)

    // Chama todos os callbacks registrados
    this.updateCallbacks.forEach(callback => callback(clampedDelta))

    this.animationFrameId = requestAnimationFrame(this.tick)
  }

  /**
   * Verifica se o loop está rodando
   */
  public get running(): boolean {
    return this.isRunning
  }
}
