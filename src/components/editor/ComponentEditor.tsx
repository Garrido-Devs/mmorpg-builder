import { useState, useCallback } from 'react'
import type { Component, ComponentPropertyDefinition } from '../../types'
import { COMPONENT_DEFINITIONS } from '../../data/ComponentDefinitions'
import { AssetSelectorModal } from './modals/AssetSelectorModal'
import { ScriptSelectorModal } from './modals/ScriptSelectorModal'

interface ComponentEditorProps {
  component: Component
  onUpdate: (updates: Partial<Component>) => void
  onRemove: () => void
}

/**
 * ComponentEditor - Editor individual de componente
 *
 * Renderiza campos de edição baseado na definição do componente
 */
export function ComponentEditor({ component, onUpdate, onRemove }: ComponentEditorProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [assetModal, setAssetModal] = useState<{ open: boolean; key: string; filterType?: string }>({ open: false, key: '' })
  const [scriptModal, setScriptModal] = useState<{ open: boolean; key: string }>({ open: false, key: '' })
  const definition = COMPONENT_DEFINITIONS[component.type]

  if (!definition) {
    return (
      <div className="editor-component">
        <div className="editor-component-header">
          <span className="editor-component-icon">❓</span>
          <span className="editor-component-name">Componente Desconhecido</span>
        </div>
      </div>
    )
  }

  // Agrupa propriedades por grupo
  const groupedProperties = definition.properties.reduce((acc, prop) => {
    const group = prop.group || 'Geral'
    if (!acc[group]) acc[group] = []
    acc[group].push(prop)
    return acc
  }, {} as Record<string, ComponentPropertyDefinition[]>)

  const handlePropertyChange = useCallback((key: string, value: unknown) => {
    onUpdate({ [key]: value } as Partial<Component>)
  }, [onUpdate])

  const renderProperty = (prop: ComponentPropertyDefinition) => {
    const value = (component as unknown as Record<string, unknown>)[prop.key] ?? prop.default

    switch (prop.type) {
      case 'string':
        return (
          <input
            type="text"
            className="editor-input"
            value={String(value)}
            onChange={(e) => handlePropertyChange(prop.key, e.target.value)}
            placeholder={prop.description}
          />
        )

      case 'number':
        return (
          <input
            type="number"
            className="editor-input editor-input-number"
            value={Number(value)}
            onChange={(e) => handlePropertyChange(prop.key, parseFloat(e.target.value) || 0)}
            min={prop.min}
            max={prop.max}
            step={prop.step || 1}
          />
        )

      case 'boolean':
        return (
          <label className="editor-checkbox">
            <input
              type="checkbox"
              checked={Boolean(value)}
              onChange={(e) => handlePropertyChange(prop.key, e.target.checked)}
            />
            <span>{prop.name}</span>
          </label>
        )

      case 'select':
        return (
          <select
            className="editor-input editor-select"
            value={String(value)}
            onChange={(e) => handlePropertyChange(prop.key, e.target.value)}
          >
            {prop.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )

      case 'color':
        return (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="color"
              className="editor-color-input"
              value={String(value)}
              onChange={(e) => handlePropertyChange(prop.key, e.target.value)}
            />
            <input
              type="text"
              className="editor-input"
              value={String(value)}
              onChange={(e) => handlePropertyChange(prop.key, e.target.value)}
              style={{ flex: 1 }}
            />
          </div>
        )

      case 'vector3':
        const vec = value as { x: number; y: number; z: number }
        return (
          <div className="editor-vector3">
            <div className="editor-vector3-field">
              <span className="editor-vector3-label x">X</span>
              <input
                type="number"
                className="editor-input editor-input-number"
                value={vec?.x || 0}
                onChange={(e) => handlePropertyChange(prop.key, { ...vec, x: parseFloat(e.target.value) || 0 })}
                step="0.1"
              />
            </div>
            <div className="editor-vector3-field">
              <span className="editor-vector3-label y">Y</span>
              <input
                type="number"
                className="editor-input editor-input-number"
                value={vec?.y || 0}
                onChange={(e) => handlePropertyChange(prop.key, { ...vec, y: parseFloat(e.target.value) || 0 })}
                step="0.1"
              />
            </div>
            <div className="editor-vector3-field">
              <span className="editor-vector3-label z">Z</span>
              <input
                type="number"
                className="editor-input editor-input-number"
                value={vec?.z || 0}
                onChange={(e) => handlePropertyChange(prop.key, { ...vec, z: parseFloat(e.target.value) || 0 })}
                step="0.1"
              />
            </div>
          </div>
        )

      case 'script':
        return (
          <div style={{ display: 'flex', gap: '4px' }}>
            <input
              type="text"
              className="editor-input"
              value={String(value || '')}
              onChange={(e) => handlePropertyChange(prop.key, e.target.value)}
              placeholder="ID do script"
              style={{ flex: 1 }}
            />
            <button
              className="editor-btn editor-btn-icon"
              title="Selecionar Script"
              onClick={() => setScriptModal({ open: true, key: prop.key })}
            >
              📁
            </button>
          </div>
        )

      case 'asset':
        return (
          <div style={{ display: 'flex', gap: '4px' }}>
            <input
              type="text"
              className="editor-input"
              value={String(value || '')}
              onChange={(e) => handlePropertyChange(prop.key, e.target.value)}
              placeholder="ID do asset"
              style={{ flex: 1 }}
            />
            <button
              className="editor-btn editor-btn-icon"
              title="Selecionar Asset"
              onClick={() => setAssetModal({ open: true, key: prop.key, filterType: prop.filterType })}
            >
              📁
            </button>
          </div>
        )

      case 'array':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '11px', color: 'var(--editor-text-muted)' }}>
              {Array.isArray(value) ? `${(value as unknown[]).length} itens` : '0 itens'}
            </span>
            <button className="editor-btn editor-btn-sm">Editar Lista</button>
          </div>
        )

      case 'object':
        return (
          <button className="editor-btn editor-btn-sm" style={{ width: '100%' }}>
            Editar Objeto
          </button>
        )

      default:
        return (
          <input
            type="text"
            className="editor-input"
            value={String(value)}
            onChange={(e) => handlePropertyChange(prop.key, e.target.value)}
          />
        )
    }
  }

  return (
    <>
    <div className="editor-component">
      <div
        className="editor-component-header"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <span className="editor-component-icon">{definition.icon}</span>
        <span className="editor-component-name">{definition.name}</span>

        <input
          type="checkbox"
          className="editor-component-toggle"
          checked={component.enabled}
          onChange={(e) => {
            e.stopPropagation()
            onUpdate({ enabled: e.target.checked })
          }}
          onClick={(e) => e.stopPropagation()}
          title="Ativar/Desativar"
        />

        <div className="editor-component-actions">
          <button
            className="editor-btn editor-btn-icon editor-btn-sm"
            onClick={(e) => {
              e.stopPropagation()
              onRemove()
            }}
            title="Remover"
          >
            🗑
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="editor-component-content">
          {Object.entries(groupedProperties).map(([group, props]) => (
            <div key={group} style={{ marginBottom: '12px' }}>
              {Object.keys(groupedProperties).length > 1 && (
                <div style={{
                  fontSize: '10px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  color: 'var(--editor-text-muted)',
                  marginBottom: '8px',
                }}>
                  {group}
                </div>
              )}

              {props.map((prop) => (
                <div key={prop.key} className="editor-property">
                  {prop.type !== 'boolean' && (
                    <label className="editor-property-label" title={prop.description}>
                      {prop.name}
                    </label>
                  )}
                  <div className="editor-property-value">
                    {renderProperty(prop)}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>

    {/* Modals */}
    <AssetSelectorModal
      isOpen={assetModal.open}
      onClose={() => setAssetModal({ open: false, key: '' })}
      onSelect={(assetId) => handlePropertyChange(assetModal.key, assetId)}
      title="Selecionar Asset"
      filterType={assetModal.filterType}
    />

    <ScriptSelectorModal
      isOpen={scriptModal.open}
      onClose={() => setScriptModal({ open: false, key: '' })}
      onSelect={(scriptId) => handlePropertyChange(scriptModal.key, scriptId)}
      title="Selecionar Script"
    />
    </>
  )
}
