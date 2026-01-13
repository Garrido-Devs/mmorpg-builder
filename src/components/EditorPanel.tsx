import { useState, useCallback, useEffect } from 'react'
import * as THREE from 'three'
import type { AssetDefinition } from '../types'
import { getEngine } from '../engine'
import { AssetPalette } from './AssetPalette'

interface EditorPanelProps {
  selectedObject: THREE.Object3D | null
}

/**
 * EditorPanel - Painel lateral do editor
 *
 * Responsabilidades:
 * - Mostrar paleta de assets
 * - Mostrar propriedades do objeto selecionado
 * - Permitir edição de posição/rotação/escala
 *
 * Decisão: Separado em seções para clareza
 */
type TransformMode = 'translate' | 'rotate' | 'scale'

export function EditorPanel({ selectedObject }: EditorPanelProps) {
  const [activeAsset, setActiveAsset] = useState<AssetDefinition | null>(null)
  const [transformMode, setTransformMode] = useState<TransformMode>('translate')
  const [position, setPosition] = useState({ x: 0, y: 0, z: 0 })
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 })
  const [scale, setScale] = useState({ x: 1, y: 1, z: 1 })

  // Atualiza valores quando objeto é selecionado
  useEffect(() => {
    if (selectedObject) {
      setPosition({
        x: Number(selectedObject.position.x.toFixed(2)),
        y: Number(selectedObject.position.y.toFixed(2)),
        z: Number(selectedObject.position.z.toFixed(2)),
      })
      setRotation({
        x: Number(THREE.MathUtils.radToDeg(selectedObject.rotation.x).toFixed(1)),
        y: Number(THREE.MathUtils.radToDeg(selectedObject.rotation.y).toFixed(1)),
        z: Number(THREE.MathUtils.radToDeg(selectedObject.rotation.z).toFixed(1)),
      })
      setScale({
        x: Number(selectedObject.scale.x.toFixed(2)),
        y: Number(selectedObject.scale.y.toFixed(2)),
        z: Number(selectedObject.scale.z.toFixed(2)),
      })
    }
  }, [selectedObject])

  // Atualiza asset ativo no EditorSystem
  const handleSelectAsset = useCallback((asset: AssetDefinition | null) => {
    setActiveAsset(asset)
    const engine = getEngine()
    engine.editorSystem.setActiveAsset(asset)
  }, [])

  // Muda o modo de transformação (mover/rotacionar/escalar)
  const handleSetTransformMode = useCallback((mode: TransformMode) => {
    setTransformMode(mode)
    const engine = getEngine()
    engine.editorSystem.setTransformMode(mode)
  }, [])

  // Deleta o objeto selecionado
  const handleDelete = useCallback(() => {
    const engine = getEngine()
    engine.editorSystem.deleteSelected()
  }, [])

  // Aplica mudança de posição
  const handlePositionChange = useCallback(
    (axis: 'x' | 'y' | 'z', value: string) => {
      const numValue = parseFloat(value) || 0
      setPosition((prev) => ({ ...prev, [axis]: numValue }))

      if (selectedObject) {
        selectedObject.position[axis] = numValue
      }
    },
    [selectedObject]
  )

  // Aplica mudança de rotação
  const handleRotationChange = useCallback(
    (axis: 'x' | 'y' | 'z', value: string) => {
      const numValue = parseFloat(value) || 0
      setRotation((prev) => ({ ...prev, [axis]: numValue }))

      if (selectedObject) {
        selectedObject.rotation[axis] = THREE.MathUtils.degToRad(numValue)
      }
    },
    [selectedObject]
  )

  // Aplica mudança de escala
  const handleScaleChange = useCallback(
    (axis: 'x' | 'y' | 'z', value: string) => {
      const numValue = parseFloat(value) || 1
      setScale((prev) => ({ ...prev, [axis]: numValue }))

      if (selectedObject) {
        selectedObject.scale[axis] = numValue
      }
    },
    [selectedObject]
  )

  return (
    <div className="editor-panel">
      <div className="editor-panel-header">Editor</div>

      <div className="editor-toolbar">
        <button
          className={`toolbar-button ${transformMode === 'translate' ? 'active' : ''}`}
          title="Mover (G)"
          onClick={() => handleSetTransformMode('translate')}
        >
          ↔
        </button>
        <button
          className={`toolbar-button ${transformMode === 'rotate' ? 'active' : ''}`}
          title="Rotacionar (R)"
          onClick={() => handleSetTransformMode('rotate')}
        >
          ⟳
        </button>
        <button
          className={`toolbar-button ${transformMode === 'scale' ? 'active' : ''}`}
          title="Escalar (S)"
          onClick={() => handleSetTransformMode('scale')}
        >
          ⤢
        </button>
        <div className="toolbar-separator" />
        <button
          className="toolbar-button"
          title="Deletar (Del)"
          onClick={handleDelete}
          disabled={!selectedObject}
        >
          🗑
        </button>
      </div>

      <div className="editor-panel-content">
        {/* Seção de Assets */}
        <div className="editor-section">
          <div className="editor-section-title">Assets</div>
          <AssetPalette
            activeAsset={activeAsset}
            onSelectAsset={handleSelectAsset}
          />
        </div>

        {/* Seção de Propriedades */}
        <div className="editor-section">
          <div className="editor-section-title">Propriedades</div>

          {selectedObject ? (
            <div className="properties-panel">
              <div className="property-row">
                <span className="property-label">ID:</span>
                <span>{selectedObject.userData.entityId || 'N/A'}</span>
              </div>

              {/* Posição */}
              <div className="property-row">
                <span className="property-label">Posição</span>
              </div>
              <div className="property-row">
                <span className="property-label">X</span>
                <div className="property-value">
                  <input
                    type="number"
                    className="property-input"
                    value={position.x}
                    onChange={(e) => handlePositionChange('x', e.target.value)}
                    step="0.1"
                  />
                </div>
              </div>
              <div className="property-row">
                <span className="property-label">Y</span>
                <div className="property-value">
                  <input
                    type="number"
                    className="property-input"
                    value={position.y}
                    onChange={(e) => handlePositionChange('y', e.target.value)}
                    step="0.1"
                  />
                </div>
              </div>
              <div className="property-row">
                <span className="property-label">Z</span>
                <div className="property-value">
                  <input
                    type="number"
                    className="property-input"
                    value={position.z}
                    onChange={(e) => handlePositionChange('z', e.target.value)}
                    step="0.1"
                  />
                </div>
              </div>

              {/* Rotação */}
              <div className="property-row" style={{ marginTop: '12px' }}>
                <span className="property-label">Rotação</span>
              </div>
              <div className="property-row">
                <span className="property-label">X</span>
                <div className="property-value">
                  <input
                    type="number"
                    className="property-input"
                    value={rotation.x}
                    onChange={(e) => handleRotationChange('x', e.target.value)}
                    step="1"
                  />
                </div>
              </div>
              <div className="property-row">
                <span className="property-label">Y</span>
                <div className="property-value">
                  <input
                    type="number"
                    className="property-input"
                    value={rotation.y}
                    onChange={(e) => handleRotationChange('y', e.target.value)}
                    step="1"
                  />
                </div>
              </div>
              <div className="property-row">
                <span className="property-label">Z</span>
                <div className="property-value">
                  <input
                    type="number"
                    className="property-input"
                    value={rotation.z}
                    onChange={(e) => handleRotationChange('z', e.target.value)}
                    step="1"
                  />
                </div>
              </div>

              {/* Escala */}
              <div className="property-row" style={{ marginTop: '12px' }}>
                <span className="property-label">Escala</span>
              </div>
              <div className="property-row">
                <span className="property-label">X</span>
                <div className="property-value">
                  <input
                    type="number"
                    className="property-input"
                    value={scale.x}
                    onChange={(e) => handleScaleChange('x', e.target.value)}
                    step="0.1"
                  />
                </div>
              </div>
              <div className="property-row">
                <span className="property-label">Y</span>
                <div className="property-value">
                  <input
                    type="number"
                    className="property-input"
                    value={scale.y}
                    onChange={(e) => handleScaleChange('y', e.target.value)}
                    step="0.1"
                  />
                </div>
              </div>
              <div className="property-row">
                <span className="property-label">Z</span>
                <div className="property-value">
                  <input
                    type="number"
                    className="property-input"
                    value={scale.z}
                    onChange={(e) => handleScaleChange('z', e.target.value)}
                    step="0.1"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="no-selection">
              Nenhum objeto selecionado
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
