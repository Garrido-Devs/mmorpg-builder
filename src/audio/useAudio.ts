/**
 * useAudio - Hook para usar o sistema de audio em componentes React
 */

import { useCallback, useEffect, useState } from 'react'
import { AudioManager } from './AudioManager'
import type { SoundGroup } from './SoundRegistry'

interface UseAudioReturn {
  // Reproducao
  play: (soundId: string, options?: { volume?: number; loop?: boolean }) => void
  playFromGroup: (group: SoundGroup, options?: { volume?: number }) => void
  playUI: (soundId: string) => void
  playMusic: (soundId: string) => void
  stopMusic: () => void
  stopAll: () => void

  // Configuracoes
  masterVolume: number
  setMasterVolume: (value: number) => void
  sfxVolume: number
  setSfxVolume: (value: number) => void
  musicVolume: number
  setMusicVolume: (value: number) => void
  uiVolume: number
  setUIVolume: (value: number) => void
  muted: boolean
  toggleMute: () => void
}

/**
 * Hook para controlar audio no jogo
 */
export function useAudio(): UseAudioReturn {
  const [masterVolume, setMasterVolumeState] = useState(AudioManager.masterVolume)
  const [sfxVolume, setSfxVolumeState] = useState(AudioManager.sfxVolume)
  const [musicVolume, setMusicVolumeState] = useState(AudioManager.musicVolume)
  const [uiVolume, setUIVolumeState] = useState(AudioManager.uiVolume)
  const [muted, setMutedState] = useState(AudioManager.muted)

  // Inicializa AudioManager no primeiro uso
  useEffect(() => {
    AudioManager.init()
  }, [])

  // Reproducao
  const play = useCallback((soundId: string, options?: { volume?: number; loop?: boolean }) => {
    AudioManager.play(soundId, options)
  }, [])

  const playFromGroup = useCallback((group: SoundGroup, options?: { volume?: number }) => {
    AudioManager.playFromGroup(group, options)
  }, [])

  const playUI = useCallback((soundId: string) => {
    AudioManager.playUI(soundId)
  }, [])

  const playMusic = useCallback((soundId: string) => {
    AudioManager.playMusic(soundId)
  }, [])

  const stopMusic = useCallback(() => {
    AudioManager.stopMusic()
  }, [])

  const stopAll = useCallback(() => {
    AudioManager.stopAll()
  }, [])

  // Setters de volume
  const setMasterVolume = useCallback((value: number) => {
    AudioManager.masterVolume = value
    setMasterVolumeState(value)
  }, [])

  const setSfxVolume = useCallback((value: number) => {
    AudioManager.sfxVolume = value
    setSfxVolumeState(value)
  }, [])

  const setMusicVolume = useCallback((value: number) => {
    AudioManager.musicVolume = value
    setMusicVolumeState(value)
  }, [])

  const setUIVolume = useCallback((value: number) => {
    AudioManager.uiVolume = value
    setUIVolumeState(value)
  }, [])

  const toggleMute = useCallback(() => {
    const newMuted = AudioManager.toggleMute()
    setMutedState(newMuted)
  }, [])

  return {
    // Reproducao
    play,
    playFromGroup,
    playUI,
    playMusic,
    stopMusic,
    stopAll,

    // Configuracoes
    masterVolume,
    setMasterVolume,
    sfxVolume,
    setSfxVolume,
    musicVolume,
    setMusicVolume,
    uiVolume,
    setUIVolume: setUIVolume,
    muted,
    toggleMute,
  }
}

/**
 * Hook simplificado para sons de UI
 */
export function useUISound() {
  useEffect(() => {
    AudioManager.init()
  }, [])

  const playClick = useCallback(() => {
    AudioManager.playFromGroup('uiClick')
  }, [])

  const playOpen = useCallback(() => {
    AudioManager.playUI('ui_open')
  }, [])

  const playClose = useCallback(() => {
    AudioManager.playUI('ui_close')
  }, [])

  const playConfirm = useCallback(() => {
    AudioManager.playUI('ui_confirm')
  }, [])

  return {
    playClick,
    playOpen,
    playClose,
    playConfirm,
  }
}

/**
 * Hook para sons de combate
 */
export function useCombatSound() {
  useEffect(() => {
    AudioManager.init()
  }, [])

  const playAttack = useCallback(() => {
    AudioManager.playFromGroup('attack')
  }, [])

  const playMagic = useCallback(() => {
    AudioManager.play('magic1')
  }, [])

  const playSpell = useCallback(() => {
    AudioManager.play('spell')
  }, [])

  const playSwordDraw = useCallback(() => {
    AudioManager.playFromGroup('swordUnsheathe')
  }, [])

  return {
    playAttack,
    playMagic,
    playSpell,
    playSwordDraw,
  }
}

/**
 * Hook para sons de inventario
 */
export function useInventorySound() {
  useEffect(() => {
    AudioManager.init()
  }, [])

  const playCoin = useCallback(() => {
    AudioManager.playFromGroup('coin')
  }, [])

  const playEquipArmor = useCallback(() => {
    AudioManager.play('armor_light')
  }, [])

  const playEquipChainmail = useCallback(() => {
    const sounds = ['chainmail1', 'chainmail2']
    AudioManager.play(sounds[Math.floor(Math.random() * sounds.length)])
  }, [])

  const playPotion = useCallback(() => {
    AudioManager.play('bottle')
  }, [])

  const playCloth = useCallback(() => {
    AudioManager.play('cloth')
  }, [])

  const playMetal = useCallback(() => {
    const sounds = ['metal_small1', 'metal_small2', 'metal_small3']
    AudioManager.play(sounds[Math.floor(Math.random() * sounds.length)])
  }, [])

  const playWood = useCallback(() => {
    AudioManager.play('wood_small')
  }, [])

  return {
    playCoin,
    playEquipArmor,
    playEquipChainmail,
    playPotion,
    playCloth,
    playMetal,
    playWood,
  }
}
