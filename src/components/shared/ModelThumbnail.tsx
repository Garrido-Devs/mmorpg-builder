import { useEffect, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

interface ModelThumbnailProps {
  modelPath: string
  size?: number
  className?: string
}

// Cache para thumbnails já geradas
const thumbnailCache = new Map<string, string>()

// Fila de renderização para evitar múltiplos contextos WebGL
let renderQueue: Array<{
  modelPath: string
  size: number
  resolve: (url: string) => void
  reject: (err: Error) => void
}> = []
let isProcessing = false

// Renderer compartilhado (lazy init)
let sharedRenderer: THREE.WebGLRenderer | null = null
let sharedCanvas: HTMLCanvasElement | null = null

function getSharedRenderer(size: number): THREE.WebGLRenderer {
  if (!sharedCanvas) {
    sharedCanvas = document.createElement('canvas')
  }

  if (!sharedRenderer) {
    sharedRenderer = new THREE.WebGLRenderer({
      canvas: sharedCanvas,
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
    })
    sharedRenderer.outputColorSpace = THREE.SRGBColorSpace
  }

  sharedRenderer.setSize(size * 2, size * 2)
  sharedRenderer.setPixelRatio(2)

  return sharedRenderer
}

async function processQueue() {
  if (isProcessing || renderQueue.length === 0) return

  isProcessing = true

  while (renderQueue.length > 0) {
    const item = renderQueue.shift()!

    try {
      const url = await renderThumbnail(item.modelPath, item.size)
      item.resolve(url)
    } catch (err) {
      item.reject(err as Error)
    }

    // Pequeno delay entre renders para não sobrecarregar
    await new Promise(r => setTimeout(r, 10))
  }

  isProcessing = false
}

async function renderThumbnail(modelPath: string, size: number): Promise<string> {
  // Verifica cache primeiro
  if (thumbnailCache.has(modelPath)) {
    return thumbnailCache.get(modelPath)!
  }

  const renderer = getSharedRenderer(size)
  const scene = new THREE.Scene()

  // Camera
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100)
  camera.position.set(2, 1.5, 2)
  camera.lookAt(0, 0.5, 0)

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
  directionalLight.position.set(5, 5, 5)
  scene.add(directionalLight)

  const backLight = new THREE.DirectionalLight(0xffffff, 0.3)
  backLight.position.set(-5, 3, -5)
  scene.add(backLight)

  // Load model
  const loader = new GLTFLoader()
  const gltf = await loader.loadAsync(modelPath)
  const model = gltf.scene

  // Center and scale model
  const box = new THREE.Box3().setFromObject(model)
  const center = box.getCenter(new THREE.Vector3())
  const boxSize = box.getSize(new THREE.Vector3())

  const maxDim = Math.max(boxSize.x, boxSize.y, boxSize.z)
  const scale = 1.5 / maxDim
  model.scale.setScalar(scale)

  model.position.sub(center.multiplyScalar(scale))
  model.position.y = 0

  scene.add(model)

  // Clear and render
  renderer.setClearColor(0x000000, 0)
  renderer.clear()
  renderer.render(scene, camera)

  // Get image data
  const dataUrl = sharedCanvas!.toDataURL('image/png')
  thumbnailCache.set(modelPath, dataUrl)

  // Cleanup scene
  scene.remove(model)
  model.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.geometry?.dispose()
      if (Array.isArray(child.material)) {
        child.material.forEach(m => m.dispose())
      } else {
        child.material?.dispose()
      }
    }
  })

  return dataUrl
}

function queueThumbnail(modelPath: string, size: number): Promise<string> {
  return new Promise((resolve, reject) => {
    renderQueue.push({ modelPath, size, resolve, reject })
    processQueue()
  })
}

export function ModelThumbnail({ modelPath, size = 100, className = '' }: ModelThumbnailProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(thumbnailCache.get(modelPath) || null)
  const [loading, setLoading] = useState(!thumbnailCache.has(modelPath) && !!modelPath)
  const [error, setError] = useState(false)

  useEffect(() => {
    // Se não tem path, mostrar fallback
    if (!modelPath) {
      setLoading(false)
      setError(true)
      return
    }

    // Se já temos em cache, usar direto
    if (thumbnailCache.has(modelPath)) {
      setImageUrl(thumbnailCache.get(modelPath)!)
      setLoading(false)
      return
    }

    // Adiciona na fila de renderização
    setLoading(true)
    queueThumbnail(modelPath, size)
      .then((url) => {
        setImageUrl(url)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error loading model:', modelPath, err)
        setError(true)
        setLoading(false)
      })
  }, [modelPath, size])

  if (error) {
    return (
      <div
        className={`model-thumbnail model-thumbnail-error ${className}`}
        style={{ width: size, height: size }}
      >
        <span>📦</span>
      </div>
    )
  }

  if (loading) {
    return (
      <div
        className={`model-thumbnail model-thumbnail-loading ${className}`}
        style={{ width: size, height: size }}
      >
        <div className="model-thumbnail-spinner" />
      </div>
    )
  }

  return (
    <img
      src={imageUrl!}
      alt="3D Model"
      className={`model-thumbnail ${className}`}
      style={{ width: size, height: size }}
    />
  )
}
