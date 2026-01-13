import type { GameSystem, InputState } from '../types'

/**
 * InputSystem - Gerencia input do teclado e mouse
 *
 * Responsabilidades:
 * - Capturar eventos de teclado (WASD)
 * - Capturar eventos de mouse
 * - Expor estado atual do input para outros sistemas
 *
 * Decisão: Sistema desacoplado que apenas rastreia estado
 * Outros sistemas consultam o estado quando precisam
 */
export class InputSystem implements GameSystem {
  public state: InputState = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    mouseDown: false,
    mousePosition: { x: 0, y: 0 },
  }

  // Mapa de teclas para ações
  private keyMap: Record<string, keyof Pick<InputState, 'forward' | 'backward' | 'left' | 'right'>> = {
    KeyW: 'forward',
    ArrowUp: 'forward',
    KeyS: 'backward',
    ArrowDown: 'backward',
    KeyA: 'left',
    ArrowLeft: 'left',
    KeyD: 'right',
    ArrowRight: 'right',
  }

  public init(): void {
    window.addEventListener('keydown', this.handleKeyDown)
    window.addEventListener('keyup', this.handleKeyUp)
    window.addEventListener('mousedown', this.handleMouseDown)
    window.addEventListener('mouseup', this.handleMouseUp)
    window.addEventListener('mousemove', this.handleMouseMove)
  }

  public update(_deltaTime: number): void {
    // Input é event-driven, não precisa de update
  }

  public destroy(): void {
    window.removeEventListener('keydown', this.handleKeyDown)
    window.removeEventListener('keyup', this.handleKeyUp)
    window.removeEventListener('mousedown', this.handleMouseDown)
    window.removeEventListener('mouseup', this.handleMouseUp)
    window.removeEventListener('mousemove', this.handleMouseMove)
  }

  private handleKeyDown = (event: KeyboardEvent): void => {
    // Ignora se estiver em input de texto
    if (this.isTyping(event)) return

    const action = this.keyMap[event.code]
    if (action) {
      this.state[action] = true
    }
  }

  private handleKeyUp = (event: KeyboardEvent): void => {
    const action = this.keyMap[event.code]
    if (action) {
      this.state[action] = false
    }
  }

  private handleMouseDown = (event: MouseEvent): void => {
    if (event.button === 0) {
      this.state.mouseDown = true
    }
  }

  private handleMouseUp = (event: MouseEvent): void => {
    if (event.button === 0) {
      this.state.mouseDown = false
    }
  }

  private handleMouseMove = (event: MouseEvent): void => {
    this.state.mousePosition = {
      x: event.clientX,
      y: event.clientY,
    }
  }

  /**
   * Verifica se o usuário está digitando em um input
   */
  private isTyping(event: KeyboardEvent): boolean {
    const target = event.target as HTMLElement
    return target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable
  }

  /**
   * Reseta o estado do input (útil ao mudar de modo)
   */
  public reset(): void {
    this.state.forward = false
    this.state.backward = false
    this.state.left = false
    this.state.right = false
    this.state.mouseDown = false
  }
}
