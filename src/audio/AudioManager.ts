/**
 * AudioManager - Gerenciador de audio do jogo
 * Singleton que controla reproducao de sons e musicas
 */

import { getSoundById, SOUND_GROUPS, type SoundGroup, type SoundCategory } from './SoundRegistry'

interface AudioSettings {
  masterVolume: number
  sfxVolume: number
  musicVolume: number
  uiVolume: number
  muted: boolean
}

const DEFAULT_SETTINGS: AudioSettings = {
  masterVolume: 1,
  sfxVolume: 1,
  musicVolume: 0.5,
  uiVolume: 0.5,
  muted: false,
}

const SETTINGS_KEY = 'mmorpg_audio_settings'

class AudioManagerClass {
  private static instance: AudioManagerClass
  private audioCache: Map<string, HTMLAudioElement> = new Map()
  private currentMusic: HTMLAudioElement | null = null
  private settings: AudioSettings
  private initialized = false

  private constructor() {
    this.settings = this.loadSettings()
  }

  static getInstance(): AudioManagerClass {
    if (!AudioManagerClass.instance) {
      AudioManagerClass.instance = new AudioManagerClass()
    }
    return AudioManagerClass.instance
  }

  /**
   * Inicializa o AudioManager (deve ser chamado apos interacao do usuario)
   */
  init(): void {
    if (this.initialized) return
    this.initialized = true
    console.log('[AudioManager] Inicializado')
  }

  /**
   * Carrega configuracoes do localStorage
   */
  private loadSettings(): AudioSettings {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY)
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) }
      }
    } catch (e) {
      console.warn('[AudioManager] Erro ao carregar configuracoes:', e)
    }
    return { ...DEFAULT_SETTINGS }
  }

  /**
   * Salva configuracoes no localStorage
   */
  private saveSettings(): void {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(this.settings))
    } catch (e) {
      console.warn('[AudioManager] Erro ao salvar configuracoes:', e)
    }
  }

  /**
   * Pre-carrega um som no cache
   */
  preload(soundId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const sound = getSoundById(soundId)
      if (!sound) {
        reject(new Error(`Som nao encontrado: ${soundId}`))
        return
      }

      if (this.audioCache.has(soundId)) {
        resolve()
        return
      }

      const audio = new Audio(sound.path)
      audio.preload = 'auto'

      audio.oncanplaythrough = () => {
        this.audioCache.set(soundId, audio)
        resolve()
      }

      audio.onerror = () => {
        reject(new Error(`Erro ao carregar som: ${soundId}`))
      }

      audio.load()
    })
  }

  /**
   * Pre-carrega varios sons
   */
  async preloadMultiple(soundIds: string[]): Promise<void> {
    await Promise.allSettled(soundIds.map(id => this.preload(id)))
  }

  /**
   * Pre-carrega um grupo de sons
   */
  async preloadGroup(group: SoundGroup): Promise<void> {
    const soundIds = SOUND_GROUPS[group]
    await this.preloadMultiple([...soundIds])
  }

  /**
   * Reproduz um som pelo ID
   */
  play(soundId: string, options?: { volume?: number; loop?: boolean }): HTMLAudioElement | null {
    if (this.settings.muted) return null

    const sound = getSoundById(soundId)
    if (!sound) {
      console.warn(`[AudioManager] Som nao encontrado: ${soundId}`)
      return null
    }

    // Calcula volume final
    const categoryVolume = this.getCategoryVolume(sound.category)
    const soundVolume = options?.volume ?? sound.volume ?? 1
    const finalVolume = this.settings.masterVolume * categoryVolume * soundVolume

    // Usa audio do cache ou cria novo
    let audio: HTMLAudioElement

    if (this.audioCache.has(soundId)) {
      // Clona o audio para permitir multiplas reproducoes simultaneas
      audio = this.audioCache.get(soundId)!.cloneNode() as HTMLAudioElement
    } else {
      audio = new Audio(sound.path)
    }

    audio.volume = Math.max(0, Math.min(1, finalVolume))
    audio.loop = options?.loop ?? sound.loop ?? false

    audio.play().catch(err => {
      console.warn(`[AudioManager] Erro ao reproduzir ${soundId}:`, err)
    })

    return audio
  }

  /**
   * Reproduz um som aleatorio de um grupo
   */
  playFromGroup(group: SoundGroup, options?: { volume?: number }): HTMLAudioElement | null {
    const soundIds = SOUND_GROUPS[group]
    const randomId = soundIds[Math.floor(Math.random() * soundIds.length)]
    return this.play(randomId, options)
  }

  /**
   * Reproduz um som de UI (com volume reduzido)
   */
  playUI(soundId: string): HTMLAudioElement | null {
    return this.play(soundId, { volume: this.settings.uiVolume })
  }

  /**
   * Reproduz musica de fundo (com loop)
   */
  playMusic(soundId: string): void {
    this.stopMusic()

    const audio = this.play(soundId, {
      volume: this.settings.musicVolume,
      loop: true,
    })

    if (audio) {
      this.currentMusic = audio
    }
  }

  /**
   * Para a musica atual
   */
  stopMusic(): void {
    if (this.currentMusic) {
      this.currentMusic.pause()
      this.currentMusic.currentTime = 0
      this.currentMusic = null
    }
  }

  /**
   * Pausa a musica atual
   */
  pauseMusic(): void {
    if (this.currentMusic) {
      this.currentMusic.pause()
    }
  }

  /**
   * Retoma a musica atual
   */
  resumeMusic(): void {
    if (this.currentMusic && this.currentMusic.paused) {
      this.currentMusic.play().catch(() => {})
    }
  }

  /**
   * Para todos os sons
   */
  stopAll(): void {
    this.stopMusic()
    this.audioCache.forEach(audio => {
      audio.pause()
      audio.currentTime = 0
    })
  }

  /**
   * Obtem volume de uma categoria
   */
  private getCategoryVolume(category: SoundCategory): number {
    switch (category) {
      case 'interface':
        return this.settings.uiVolume
      case 'ambient':
        return this.settings.musicVolume
      default:
        return this.settings.sfxVolume
    }
  }

  // ============================================
  // GETTERS E SETTERS DE CONFIGURACAO
  // ============================================

  get masterVolume(): number {
    return this.settings.masterVolume
  }

  set masterVolume(value: number) {
    this.settings.masterVolume = Math.max(0, Math.min(1, value))
    this.saveSettings()
    this.updateMusicVolume()
  }

  get sfxVolume(): number {
    return this.settings.sfxVolume
  }

  set sfxVolume(value: number) {
    this.settings.sfxVolume = Math.max(0, Math.min(1, value))
    this.saveSettings()
  }

  get musicVolume(): number {
    return this.settings.musicVolume
  }

  set musicVolume(value: number) {
    this.settings.musicVolume = Math.max(0, Math.min(1, value))
    this.saveSettings()
    this.updateMusicVolume()
  }

  get uiVolume(): number {
    return this.settings.uiVolume
  }

  set uiVolume(value: number) {
    this.settings.uiVolume = Math.max(0, Math.min(1, value))
    this.saveSettings()
  }

  get muted(): boolean {
    return this.settings.muted
  }

  set muted(value: boolean) {
    this.settings.muted = value
    this.saveSettings()
    if (value) {
      this.pauseMusic()
    } else {
      this.resumeMusic()
    }
  }

  /**
   * Alterna mute
   */
  toggleMute(): boolean {
    this.muted = !this.muted
    return this.muted
  }

  /**
   * Atualiza volume da musica atual
   */
  private updateMusicVolume(): void {
    if (this.currentMusic) {
      this.currentMusic.volume = this.settings.masterVolume * this.settings.musicVolume
    }
  }

  /**
   * Retorna todas as configuracoes
   */
  getSettings(): AudioSettings {
    return { ...this.settings }
  }

  /**
   * Define todas as configuracoes
   */
  setSettings(settings: Partial<AudioSettings>): void {
    this.settings = { ...this.settings, ...settings }
    this.saveSettings()
    this.updateMusicVolume()
  }

  /**
   * Reseta para configuracoes padrao
   */
  resetSettings(): void {
    this.settings = { ...DEFAULT_SETTINGS }
    this.saveSettings()
    this.updateMusicVolume()
  }
}

// Exporta singleton
export const AudioManager = AudioManagerClass.getInstance()

// Exporta funcoes de conveniencia
export const playSound = (soundId: string, options?: { volume?: number; loop?: boolean }) =>
  AudioManager.play(soundId, options)

export const playSoundFromGroup = (group: SoundGroup, options?: { volume?: number }) =>
  AudioManager.playFromGroup(group, options)

export const playUISound = (soundId: string) => AudioManager.playUI(soundId)

export const playMusic = (soundId: string) => AudioManager.playMusic(soundId)

export const stopMusic = () => AudioManager.stopMusic()

export const toggleMute = () => AudioManager.toggleMute()
