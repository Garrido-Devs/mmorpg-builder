import { useState, useEffect, useCallback } from 'react'
import * as THREE from 'three'
import type { Component, ComponentType } from '../../../types'
import { COMPONENT_DEFINITIONS, getComponentsByCategory, CATEGORY_NAMES } from '../../../data/ComponentDefinitions'
import { ComponentEditor } from '../ComponentEditor'
import { TransformEditor } from '../TransformEditor'
import { getEngine } from '../../../engine'
import { PLAYER_MODELS } from '../../../entities/Player'

interface InspectorPanelProps {
  selectedObject: THREE.Object3D | null
}

/**
 * InspectorPanel - Painel de inspeção de objetos
 *
 * Mostra:
 * - Informações do objeto (nome, ID)
 * - Transform (posição, rotação, escala)
 * - Lista de componentes
 * - Botão para adicionar componentes
 */
export function InspectorPanel({ selectedObject }: InspectorPanelProps) {
  const [objectName, setObjectName] = useState('')
  const [components, setComponents] = useState<Component[]>([])
  const [showAddComponent, setShowAddComponent] = useState(false)
  const [currentPlayerModel, setCurrentPlayerModel] = useState('mage')

  // Verifica se é o player
  const isPlayer = selectedObject?.userData.isPlayer === true

  // Atualiza quando objeto muda
  useEffect(() => {
    if (selectedObject) {
      setObjectName(selectedObject.userData.entityName || selectedObject.name || 'Objeto')
      setComponents(selectedObject.userData.components || [])

      // Se é player, pegar modelo atual
      if (selectedObject.userData.isPlayer) {
        const engine = getEngine()
        setCurrentPlayerModel(engine.player.getCurrentModelId())
      }
    } else {
      setObjectName('')
      setComponents([])
    }
  }, [selectedObject])

  // Troca modelo do player
  const handleChangePlayerModel = useCallback(async (modelId: string) => {
    const engine = getEngine()
    await engine.player.setCharacter(modelId)
    setCurrentPlayerModel(modelId)
  }, [])

  // Adiciona um novo componente
  const handleAddComponent = useCallback((type: ComponentType) => {
    if (!selectedObject) return

    const definition = COMPONENT_DEFINITIONS[type]
    if (!definition) return

    // Cria componente com valores padrão
    const newComponent: Component = {
      id: `${type}_${Date.now()}`,
      type,
      enabled: true,
      ...definition.properties.reduce((acc, prop) => {
        acc[prop.key] = prop.default
        return acc
      }, {} as Record<string, unknown>),
    } as Component

    const updatedComponents = [...components, newComponent]
    setComponents(updatedComponents)

    // Salva no userData do objeto
    selectedObject.userData.components = updatedComponents

    // Atualiza visualização dos componentes
    const engine = getEngine()
    engine.updateObjectComponents(selectedObject)

    setShowAddComponent(false)
  }, [selectedObject, components])

  // Remove um componente
  const handleRemoveComponent = useCallback((componentId: string) => {
    if (!selectedObject) return

    setComponents(prev => {
      const updatedComponents = prev.filter(c => c.id !== componentId)
      selectedObject.userData.components = updatedComponents

      // Atualiza visualização
      const engine = getEngine()
      engine.updateObjectComponents(selectedObject)

      return updatedComponents
    })
  }, [selectedObject])

  // Atualiza um componente
  const handleUpdateComponent = useCallback((componentId: string, updates: Partial<Component>) => {
    if (!selectedObject) return

    setComponents(prev => {
      const updatedComponents = prev.map(c =>
        c.id === componentId ? { ...c, ...updates } as Component : c
      )
      // Salva no userData do objeto
      selectedObject.userData.components = updatedComponents

      // Atualiza visualização
      const engine = getEngine()
      engine.updateObjectComponents(selectedObject)

      return updatedComponents
    })
  }, [selectedObject])

  // Nenhum objeto selecionado
  if (!selectedObject) {
    return (
      <div className="editor-panel-content">
        <div className="editor-empty">
          <div className="editor-empty-icon">◇</div>
          <div className="editor-empty-text">
            Selecione um objeto para<br />ver suas propriedades
          </div>
        </div>
      </div>
    )
  }

  const groupedComponents = getComponentsByCategory()

  return (
    <div className="editor-panel-content">
      {/* Informações do objeto */}
      <div className="editor-section">
        <div className="editor-section-content">
          <div className="editor-property">
            <label className="editor-property-label">Nome</label>
            <div className="editor-property-value">
              <input
                type="text"
                className="editor-input"
                value={objectName}
                onChange={(e) => {
                  setObjectName(e.target.value)
                  if (selectedObject) {
                    selectedObject.userData.entityName = e.target.value
                  }
                }}
              />
            </div>
          </div>
          <div className="editor-property">
            <label className="editor-property-label">ID</label>
            <div className="editor-property-value">
              <input
                type="text"
                className="editor-input"
                value={selectedObject.userData.entityId || 'N/A'}
                disabled
              />
            </div>
          </div>
          <div className="editor-property">
            <label className="editor-property-label">Asset</label>
            <div className="editor-property-value">
              <input
                type="text"
                className="editor-input"
                value={selectedObject.userData.assetId || 'N/A'}
                disabled
              />
            </div>
          </div>
        </div>
      </div>

      {/* Transform */}
      <TransformEditor object={selectedObject} />

      {/* Seleção de Personagem (apenas para Player) */}
      {isPlayer && (
        <div className="editor-section">
          <button
            className="editor-section-header"
            onClick={() => {}}
          >
            <span className="editor-section-icon">▼</span>
            <span>Personagem</span>
          </button>
          <div className="editor-section-content">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {PLAYER_MODELS.map((model) => (
                <button
                  key={model.id}
                  onClick={() => handleChangePlayerModel(model.id)}
                  style={{
                    padding: '8px 4px',
                    border: currentPlayerModel === model.id
                      ? '2px solid var(--editor-accent)'
                      : '1px solid var(--editor-border)',
                    borderRadius: '6px',
                    background: currentPlayerModel === model.id
                      ? 'var(--editor-bg-active)'
                      : 'var(--editor-bg-secondary)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '11px',
                    color: 'var(--editor-text)',
                  }}
                >
                  <span style={{ fontSize: '24px' }}>
                    {model.id.includes('skeleton') ? '💀' : '🧙'}
                  </span>
                  <span>{model.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Componentes */}
      <div className="editor-section">
        <button
          className="editor-section-header"
          onClick={() => {}}
        >
          <span className="editor-section-icon">▼</span>
          <span>Componentes ({components.length})</span>
        </button>
        <div className="editor-section-content" style={{ padding: 0 }}>
          {components.length === 0 ? (
            <div className="editor-empty" style={{ padding: '16px' }}>
              <div className="editor-empty-text">
                Nenhum componente adicionado
              </div>
            </div>
          ) : (
            <div style={{ padding: '8px' }}>
              {components.map((component) => (
                <ComponentEditor
                  key={component.id}
                  component={component}
                  onUpdate={(updates) => handleUpdateComponent(component.id, updates)}
                  onRemove={() => handleRemoveComponent(component.id)}
                />
              ))}
            </div>
          )}

          {/* Botão adicionar componente */}
          <div style={{ padding: '8px', borderTop: '1px solid var(--editor-border)' }}>
            <div className="editor-dropdown">
              <button
                className="editor-btn"
                style={{ width: '100%' }}
                onClick={() => setShowAddComponent(!showAddComponent)}
              >
                + Adicionar Componente
              </button>

              {showAddComponent && (
                <div className="editor-dropdown-menu">
                  {Object.entries(groupedComponents).map(([category, comps]) => (
                    <div key={category}>
                      <div className="editor-dropdown-category">
                        {CATEGORY_NAMES[category] || category}
                      </div>
                      {comps.map((def) => {
                        // Verifica se já tem este componente (se não permite múltiplos)
                        const hasComponent = !def.allowMultiple &&
                          components.some(c => c.type === def.type)

                        return (
                          <button
                            key={def.type}
                            className="editor-dropdown-item"
                            onClick={() => handleAddComponent(def.type)}
                            disabled={hasComponent}
                            style={{ opacity: hasComponent ? 0.5 : 1 }}
                          >
                            <span className="editor-dropdown-item-icon">{def.icon}</span>
                            <span className="editor-dropdown-item-name">{def.name}</span>
                          </button>
                        )
                      })}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
