import { useState, useEffect } from 'react'
import * as THREE from 'three'
import { getEngine } from '../../engine'
import { InspectorPanel } from './panels/InspectorPanel'
import { AssetsPanel } from './panels/AssetsPanel'
import { HierarchyPanel } from './panels/HierarchyPanel'

type TabId = 'inspector' | 'assets' | 'hierarchy'

interface Tab {
  id: TabId
  label: string
  icon: string
}

const TABS: Tab[] = [
  { id: 'inspector', label: 'Inspetor', icon: '⚙' },
  { id: 'assets', label: 'Assets', icon: '📦' },
  { id: 'hierarchy', label: 'Hierarquia', icon: '📋' },
]

interface EditorSidebarProps {
  width: number
  onResize: (width: number) => void
}

/**
 * EditorSidebar - Painel lateral com abas
 */
export function EditorSidebar({ width }: EditorSidebarProps) {
  const [activeTab, setActiveTab] = useState<TabId>('inspector')
  const [selectedObject, setSelectedObject] = useState<THREE.Object3D | null>(null)

  // Escuta seleção de objetos
  useEffect(() => {
    const engine = getEngine()
    const unsubscribe = engine.onObjectSelected(setSelectedObject)
    return unsubscribe
  }, [])

  const renderPanel = () => {
    switch (activeTab) {
      case 'inspector':
        return <InspectorPanel selectedObject={selectedObject} />
      case 'assets':
        return <AssetsPanel />
      case 'hierarchy':
        return <HierarchyPanel selectedObject={selectedObject} />
      default:
        return null
    }
  }

  return (
    <aside className="editor-sidebar" style={{ width }}>
      {/* Abas */}
      <div className="editor-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`editor-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="editor-tab-icon">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Conteúdo do painel */}
      <div className="editor-panel">
        {renderPanel()}
      </div>
    </aside>
  )
}
