import { useState, useEffect, useCallback } from 'react'
import * as THREE from 'three'
import { getEngine } from '../../../engine'

interface TreeItemProps {
  object: THREE.Object3D
  selectedId: string | null
  onSelect: (obj: THREE.Object3D) => void
  depth?: number
}

function TreeItem({ object, selectedId, onSelect, depth = 0 }: TreeItemProps) {
  const [expanded, setExpanded] = useState(depth < 2)

  // Filtra filhos relevantes (exclui helpers internos)
  const children = object.children.filter(
    child =>
      child.name !== '' &&
      !(child instanceof THREE.GridHelper) &&
      child.type !== 'TransformControlsPlane' &&
      child.type !== 'TransformControlsGizmo'
  )

  const hasChildren = children.length > 0
  const isSelected = object.userData.entityId === selectedId

  // Determina ícone baseado no tipo
  const getIcon = () => {
    if (object.name === 'player') return '🧑'
    if (object.name === 'ground') return '⬜'
    if (object.userData.assetId?.includes('tree')) return '🌲'
    if (object.userData.assetId?.includes('rock')) return '🪨'
    if (object.userData.assetId?.includes('building')) return '🏠'
    if (object.userData.assetId?.includes('npc')) return '🧑'
    if (object.userData.assetId?.includes('door')) return '🚪'
    if (object.type === 'Group') return '📁'
    if (object.type === 'Mesh') return '🔷'
    return '⬜'
  }

  const displayName = object.userData.entityName || object.name || object.type

  return (
    <div>
      <div
        className={`editor-tree-item ${isSelected ? 'selected' : ''}`}
        style={{ paddingLeft: depth * 16 + 8 }}
        onClick={() => onSelect(object)}
      >
        {/* Toggle de expansão */}
        <span
          className="editor-tree-toggle"
          onClick={(e) => {
            e.stopPropagation()
            if (hasChildren) setExpanded(!expanded)
          }}
          style={{ visibility: hasChildren ? 'visible' : 'hidden' }}
        >
          {expanded ? '▼' : '▶'}
        </span>

        {/* Ícone */}
        <span className="editor-tree-icon">{getIcon()}</span>

        {/* Nome */}
        <span className="editor-tree-name">{displayName}</span>
      </div>

      {/* Filhos */}
      {expanded && hasChildren && (
        <div className="editor-tree-children">
          {children.map((child, index) => (
            <TreeItem
              key={child.uuid || index}
              object={child}
              selectedId={selectedId}
              onSelect={onSelect}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface HierarchyPanelProps {
  selectedObject: THREE.Object3D | null
}

/**
 * HierarchyPanel - Árvore de objetos da cena
 */
export function HierarchyPanel({ selectedObject }: HierarchyPanelProps) {
  const [sceneObjects, setSceneObjects] = useState<THREE.Object3D[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  // Atualiza lista de objetos
  useEffect(() => {
    const updateObjects = () => {
      const engine = getEngine()
      const scene = engine.gameScene.scene

      // Filtra objetos relevantes da cena
      const objects = scene.children.filter(
        obj =>
          obj.name !== '' ||
          obj.userData.entityId ||
          obj.type === 'Group'
      )

      setSceneObjects(objects)
    }

    updateObjects()

    // Atualiza periodicamente
    const interval = setInterval(updateObjects, 1000)
    return () => clearInterval(interval)
  }, [])

  // Seleciona objeto
  const handleSelect = useCallback((object: THREE.Object3D) => {
    const engine = getEngine()

    // Só seleciona se tiver entityId (objetos do mapa)
    if (object.userData.entityId) {
      engine.editorSystem.select(object)
    }
  }, [])

  // Filtra objetos pela busca
  const filteredObjects = searchQuery.trim()
    ? sceneObjects.filter(obj => {
        const name = obj.userData.entityName || obj.name || ''
        return name.toLowerCase().includes(searchQuery.toLowerCase())
      })
    : sceneObjects

  const selectedId = selectedObject?.userData.entityId || null

  return (
    <>
      <div className="editor-panel-header">
        <span>Hierarquia</span>
        <span className="editor-badge">{sceneObjects.length}</span>
      </div>

      <div className="editor-panel-content">
        {/* Busca */}
        <div className="editor-search">
          <span className="editor-search-icon">🔍</span>
          <input
            type="text"
            className="editor-input editor-search-input"
            placeholder="Buscar objetos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Árvore */}
        <div className="editor-tree">
          {filteredObjects.map((object, index) => (
            <TreeItem
              key={object.uuid || index}
              object={object}
              selectedId={selectedId}
              onSelect={handleSelect}
            />
          ))}
        </div>

        {/* Sem objetos */}
        {filteredObjects.length === 0 && (
          <div className="editor-empty">
            <div className="editor-empty-icon">📋</div>
            <div className="editor-empty-text">
              {searchQuery ? 'Nenhum objeto encontrado' : 'Cena vazia'}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
