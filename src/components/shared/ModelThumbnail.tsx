import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

interface ModelThumbnailProps {
  modelPath: string
  size?: number
  className?: string
}

// Cache para evitar recarregar modelos
const modelCache = new Map<string, THREE.Group>()
const thumbnailCache = new Map<string, string>()

export function ModelThumbnail({ modelPath, size = 100, className = '' }: ModelThumbnailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
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

    // Se já temos a imagem em cache, não precisa renderizar
    if (thumbnailCache.has(modelPath)) {
      setImageUrl(thumbnailCache.get(modelPath)!)
      setLoading(false)
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return

    // Setup Three.js
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
    })
    renderer.setSize(size * 2, size * 2) // 2x para melhor qualidade
    renderer.setPixelRatio(2)
    renderer.outputColorSpace = THREE.SRGBColorSpace

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

    const loadModel = async () => {
      try {
        let model: THREE.Group

        if (modelCache.has(modelPath)) {
          model = modelCache.get(modelPath)!.clone()
        } else {
          const gltf = await loader.loadAsync(modelPath)
          model = gltf.scene
          modelCache.set(modelPath, model.clone())
        }

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

        // Render
        renderer.render(scene, camera)

        // Get image data
        const dataUrl = canvas.toDataURL('image/png')
        thumbnailCache.set(modelPath, dataUrl)
        setImageUrl(dataUrl)
        setLoading(false)

        // Cleanup
        scene.remove(model)
        renderer.dispose()
      } catch (err) {
        console.error('Error loading model:', modelPath, err)
        setError(true)
        setLoading(false)
      }
    }

    loadModel()

    return () => {
      renderer.dispose()
    }
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
        <canvas ref={canvasRef} style={{ display: 'none' }} />
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
