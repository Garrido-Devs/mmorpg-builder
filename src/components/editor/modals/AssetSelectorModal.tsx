import { useState, useMemo } from 'react'
import { ASSETS, searchAssets } from '../../../assets'
import type { AssetDefinition } from '../../../types'

interface AssetSelectorModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (assetId: string) => void
  title?: string
  filterType?: string // 'effect', 'sound', etc.
}

/**
 * AssetSelectorModal - Modal para selecionar assets
 */
export function AssetSelectorModal({
  isOpen,
  onClose,
  onSelect,
  title = 'Selecionar Asset',
  filterType,
}: AssetSelectorModalProps) {
  const [search, setSearch] = useState('')

  const filteredAssets = useMemo(() => {
    let assets = ASSETS

    // Filtra por tipo se especificado
    if (filterType) {
      assets = assets.filter(a => a.type === filterType || a.category.toLowerCase().includes(filterType.toLowerCase()))
    }

    // Filtra por busca
    if (search) {
      assets = searchAssets(search).filter(a =>
        !filterType || a.type === filterType || a.category.toLowerCase().includes(filterType.toLowerCase())
      )
    }

    return assets
  }, [search, filterType])

  // Agrupa por categoria
  const groupedAssets = useMemo(() => {
    const grouped: Record<string, AssetDefinition[]> = {}
    filteredAssets.forEach(asset => {
      if (!grouped[asset.category]) {
        grouped[asset.category] = []
      }
      grouped[asset.category].push(asset)
    })
    return grouped
  }, [filteredAssets])

  if (!isOpen) return null

  return (
    <div className="editor-modal-overlay" onClick={onClose}>
      <div className="editor-modal" onClick={e => e.stopPropagation()}>
        <div className="editor-modal-header">
          <span className="editor-modal-title">{title}</span>
          <button className="editor-btn editor-btn-icon" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="editor-modal-body">
          {/* Busca */}
          <div className="editor-search" style={{ marginBottom: '16px' }}>
            <span className="editor-search-icon">🔍</span>
            <input
              type="text"
              className="editor-input editor-search-input"
              placeholder="Buscar asset..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              autoFocus
            />
          </div>

          {/* Lista de assets */}
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {Object.entries(groupedAssets).map(([category, assets]) => (
              <div key={category} className="editor-asset-category">
                <div className="editor-asset-category-title">{category}</div>
                <div className="editor-asset-grid">
                  {assets.map(asset => (
                    <button
                      key={asset.id}
                      className="editor-asset-item"
                      onClick={() => {
                        onSelect(asset.id)
                        onClose()
                      }}
                    >
                      <div className="editor-asset-preview">
                        {getCategoryIcon(asset.category)}
                      </div>
                      <div className="editor-asset-name">{asset.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {filteredAssets.length === 0 && (
              <div className="editor-empty">
                <div className="editor-empty-text">Nenhum asset encontrado</div>
              </div>
            )}
          </div>
        </div>

        <div className="editor-modal-footer">
          <button className="editor-btn" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}

function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    'Natureza': '🌲',
    'Construções': '🏠',
    'Portas': '🚪',
    'Containers': '📦',
    'Decoração': '🎨',
    'NPCs': '🧑',
    'Inimigos': '👹',
    'Triggers': '⚡',
    'Portais': '🌀',
    'Iluminação': '💡',
  }
  return icons[category] || '📦'
}
