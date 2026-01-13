import * as THREE from 'three'

/**
 * Filtra tracks de animação que causam warnings de PropertyBinding
 * Remove tracks que referenciam propriedades/bones inexistentes no modelo
 */
export function filterAnimationClips(
  clips: THREE.AnimationClip[],
  root: THREE.Object3D
): THREE.AnimationClip[] {
  return clips.map(clip => {
    const validTracks = clip.tracks.filter(track => {
      // Extrai o nome do objeto da track (ex: "Armature.position" -> "Armature")
      const trackPath = THREE.PropertyBinding.parseTrackName(track.name)

      // Tenta encontrar o node no modelo
      const node = THREE.PropertyBinding.findNode(root, trackPath.nodeName)

      // Se o node não existe, a track é inválida
      if (!node) {
        return false
      }

      return true
    })

    // Cria novo clip com apenas tracks válidas
    const filteredClip = new THREE.AnimationClip(
      clip.name,
      clip.duration,
      validTracks,
      clip.blendMode
    )

    return filteredClip
  })
}

/**
 * Suprime warnings específicos do THREE.PropertyBinding
 * Útil para evitar spam no console durante desenvolvimento
 */
let originalWarn: typeof console.warn | null = null
const suppressedPatterns = [
  'THREE.PropertyBinding: Trying to update property',
  'THREE.PropertyBinding: Can not bind to',
  'THREE.PropertyBinding: No property',
]

export function suppressPropertyBindingWarnings(): void {
  if (originalWarn) return // Já suprimido

  originalWarn = console.warn

  console.warn = function(...args: unknown[]) {
    const message = args[0]

    // Verifica se é um warning de PropertyBinding
    if (typeof message === 'string') {
      for (const pattern of suppressedPatterns) {
        if (message.includes(pattern)) {
          return // Suprime este warning
        }
      }
    }

    // Permite outros warnings passarem
    originalWarn!.apply(console, args)
  }
}

export function restorePropertyBindingWarnings(): void {
  if (originalWarn) {
    console.warn = originalWarn
    originalWarn = null
  }
}
