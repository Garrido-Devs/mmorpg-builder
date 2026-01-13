import { useState, useEffect, useCallback } from 'react'
import * as THREE from 'three'

interface TransformEditorProps {
  object: THREE.Object3D
}

/**
 * TransformEditor - Editor de posição, rotação e escala
 */
export function TransformEditor({ object }: TransformEditorProps) {
  const [position, setPosition] = useState({ x: 0, y: 0, z: 0 })
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 })
  const [scale, setScale] = useState({ x: 1, y: 1, z: 1 })
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Sincroniza com o objeto
  useEffect(() => {
    if (!object) return

    const updateTransform = () => {
      setPosition({
        x: Number(object.position.x.toFixed(2)),
        y: Number(object.position.y.toFixed(2)),
        z: Number(object.position.z.toFixed(2)),
      })
      setRotation({
        x: Number(THREE.MathUtils.radToDeg(object.rotation.x).toFixed(1)),
        y: Number(THREE.MathUtils.radToDeg(object.rotation.y).toFixed(1)),
        z: Number(THREE.MathUtils.radToDeg(object.rotation.z).toFixed(1)),
      })
      setScale({
        x: Number(object.scale.x.toFixed(2)),
        y: Number(object.scale.y.toFixed(2)),
        z: Number(object.scale.z.toFixed(2)),
      })
    }

    updateTransform()

    // Atualiza periodicamente enquanto objeto está selecionado (para drag updates)
    const interval = setInterval(updateTransform, 100)
    return () => clearInterval(interval)
  }, [object, object?.uuid])

  const handlePositionChange = useCallback((axis: 'x' | 'y' | 'z', value: string) => {
    const numValue = parseFloat(value) || 0
    setPosition(prev => ({ ...prev, [axis]: numValue }))
    object.position[axis] = numValue
  }, [object])

  const handleRotationChange = useCallback((axis: 'x' | 'y' | 'z', value: string) => {
    const numValue = parseFloat(value) || 0
    setRotation(prev => ({ ...prev, [axis]: numValue }))
    object.rotation[axis] = THREE.MathUtils.degToRad(numValue)
  }, [object])

  const handleScaleChange = useCallback((axis: 'x' | 'y' | 'z', value: string) => {
    const numValue = parseFloat(value) || 1
    setScale(prev => ({ ...prev, [axis]: numValue }))
    object.scale[axis] = numValue
  }, [object])

  return (
    <div className="editor-section">
      <button
        className={`editor-section-header ${isCollapsed ? 'collapsed' : ''}`}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <span className="editor-section-icon">▼</span>
        <span>Transform</span>
      </button>

      {!isCollapsed && (
        <div className="editor-section-content">
          {/* Posição */}
          <div className="editor-property">
            <label className="editor-property-label">Posição</label>
            <div className="editor-vector3">
              <div className="editor-vector3-field">
                <span className="editor-vector3-label x">X</span>
                <input
                  type="number"
                  className="editor-input editor-input-number"
                  value={position.x}
                  onChange={(e) => handlePositionChange('x', e.target.value)}
                  step="0.1"
                />
              </div>
              <div className="editor-vector3-field">
                <span className="editor-vector3-label y">Y</span>
                <input
                  type="number"
                  className="editor-input editor-input-number"
                  value={position.y}
                  onChange={(e) => handlePositionChange('y', e.target.value)}
                  step="0.1"
                />
              </div>
              <div className="editor-vector3-field">
                <span className="editor-vector3-label z">Z</span>
                <input
                  type="number"
                  className="editor-input editor-input-number"
                  value={position.z}
                  onChange={(e) => handlePositionChange('z', e.target.value)}
                  step="0.1"
                />
              </div>
            </div>
          </div>

          {/* Rotação */}
          <div className="editor-property">
            <label className="editor-property-label">Rotação</label>
            <div className="editor-vector3">
              <div className="editor-vector3-field">
                <span className="editor-vector3-label x">X</span>
                <input
                  type="number"
                  className="editor-input editor-input-number"
                  value={rotation.x}
                  onChange={(e) => handleRotationChange('x', e.target.value)}
                  step="1"
                />
              </div>
              <div className="editor-vector3-field">
                <span className="editor-vector3-label y">Y</span>
                <input
                  type="number"
                  className="editor-input editor-input-number"
                  value={rotation.y}
                  onChange={(e) => handleRotationChange('y', e.target.value)}
                  step="1"
                />
              </div>
              <div className="editor-vector3-field">
                <span className="editor-vector3-label z">Z</span>
                <input
                  type="number"
                  className="editor-input editor-input-number"
                  value={rotation.z}
                  onChange={(e) => handleRotationChange('z', e.target.value)}
                  step="1"
                />
              </div>
            </div>
          </div>

          {/* Escala */}
          <div className="editor-property">
            <label className="editor-property-label">Escala</label>
            <div className="editor-vector3">
              <div className="editor-vector3-field">
                <span className="editor-vector3-label x">X</span>
                <input
                  type="number"
                  className="editor-input editor-input-number"
                  value={scale.x}
                  onChange={(e) => handleScaleChange('x', e.target.value)}
                  step="0.1"
                />
              </div>
              <div className="editor-vector3-field">
                <span className="editor-vector3-label y">Y</span>
                <input
                  type="number"
                  className="editor-input editor-input-number"
                  value={scale.y}
                  onChange={(e) => handleScaleChange('y', e.target.value)}
                  step="0.1"
                />
              </div>
              <div className="editor-vector3-field">
                <span className="editor-vector3-label z">Z</span>
                <input
                  type="number"
                  className="editor-input editor-input-number"
                  value={scale.z}
                  onChange={(e) => handleScaleChange('z', e.target.value)}
                  step="0.1"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
