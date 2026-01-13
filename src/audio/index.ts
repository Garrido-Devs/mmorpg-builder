/**
 * Audio System - Exports
 */

// AudioManager e funcoes de conveniencia
export {
  AudioManager,
  playSound,
  playSoundFromGroup,
  playUISound,
  playMusic,
  stopMusic,
  toggleMute,
} from './AudioManager'

// Sound Registry
export {
  SOUNDS,
  SOUND_GROUPS,
  getSoundById,
  getSoundsByCategory,
  getRandomSound,
  type SoundDefinition,
  type SoundCategory,
  type SoundGroup,
} from './SoundRegistry'

// Hook
export { useAudio } from './useAudio'
