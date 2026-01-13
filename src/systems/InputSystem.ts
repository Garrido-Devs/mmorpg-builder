import type { GameSystem, InputState } from '../types'

/**
 * InputSystem - Gerencia input do teclado e mouse
 *
 * Responsabilidades:
 * - Capturar eventos de teclado (WASD, Space, Shift, 1-0)
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
    jump: false,
    sprint: false,
    attack: false,
    mouseDown: false,
    mousePosition: { x: 0, y: 0 },
    skillKeys: [false, false, false, false, false, false, false, false, false, false], // 1-9, 0
  }

  // Callbacks para eventos de acao (dispara uma vez ao pressionar)
  private onAttackCallbacks: Set<() => void> = new Set()
  private onJumpCallbacks: Set<() => void> = new Set()
  private onSkillCallbacks: Set<(skillIndex: number) => void> = new Set()

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

  // Mapa de teclas de skill (1-9, 0)
  private skillKeyMap: Record<string, number> = {
    Digit1: 0,
    Digit2: 1,
    Digit3: 2,
    Digit4: 3,
    Digit5: 4,
    Digit6: 5,
    Digit7: 6,
    Digit8: 7,
    Digit9: 8,
    Digit0: 9,
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

    // Movimento WASD
    const action = this.keyMap[event.code]
    if (action) {
      this.state[action] = true
    }

    // Pulo (Space)
    if (event.code === 'Space' && !this.state.jump) {
      this.state.jump = true
      this.onJumpCallbacks.forEach(cb => cb())
    }

    // Sprint (Shift)
    if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
      this.state.sprint = true
    }

    // Skill keys (1-9, 0)
    const skillIndex = this.skillKeyMap[event.code]
    if (skillIndex !== undefined && !this.state.skillKeys[skillIndex]) {
      this.state.skillKeys[skillIndex] = true
      this.onSkillCallbacks.forEach(cb => cb(skillIndex))
    }
  }

  private handleKeyUp = (event: KeyboardEvent): void => {
    // Movimento WASD
    const action = this.keyMap[event.code]
    if (action) {
      this.state[action] = false
    }

    // Pulo (Space)
    if (event.code === 'Space') {
      this.state.jump = false
    }

    // Sprint (Shift)
    if (event.code === 'ShiftLeft' || event.code === 'ShiftRight') {
      this.state.sprint = false
    }

    // Skill keys
    const skillIndex = this.skillKeyMap[event.code]
    if (skillIndex !== undefined) {
      this.state.skillKeys[skillIndex] = false
    }
  }

  private handleMouseDown = (event: MouseEvent): void => {
    if (event.button === 0) {
      this.state.mouseDown = true
      // Ataque com click esquerdo
      if (!this.state.attack) {
        this.state.attack = true
        this.onAttackCallbacks.forEach(cb => cb())
      }
    }
  }

  private handleMouseUp = (event: MouseEvent): void => {
    if (event.button === 0) {
      this.state.mouseDown = false
      this.state.attack = false
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
    this.state.jump = false
    this.state.sprint = false
    this.state.attack = false
    this.state.mouseDown = false
    this.state.skillKeys = [false, false, false, false, false, false, false, false, false, false]
  }

  /**
   * Registra callback para ataque
   */
  public onAttack(callback: () => void): () => void {
    this.onAttackCallbacks.add(callback)
    return () => this.onAttackCallbacks.delete(callback)
  }

  /**
   * Registra callback para pulo
   */
  public onJump(callback: () => void): () => void {
    this.onJumpCallbacks.add(callback)
    return () => this.onJumpCallbacks.delete(callback)
  }

  /**
   * Registra callback para skill
   */
  public onSkill(callback: (skillIndex: number) => void): () => void {
    this.onSkillCallbacks.add(callback)
    return () => this.onSkillCallbacks.delete(callback)
  }
}
