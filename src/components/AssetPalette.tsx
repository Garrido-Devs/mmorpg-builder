import { useMemo } from 'react'
import type { AssetDefinition } from '../types'
import { getAssetsByCategory } from '../assets'

interface AssetPaletteProps {
  activeAsset: AssetDefinition | null
  onSelectAsset: (asset: AssetDefinition | null) => void
}

/**
 * AssetPalette - Painel de seleção de assets (versão simplificada)
 */

// Mapa de ícones por categoria
const CATEGORY_ICONS: Record<string, string> = {
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

export function AssetPalette({ activeAsset, onSelectAsset }: AssetPaletteProps) {
  const groupedAssets = useMemo(() => getAssetsByCategory(), [])

  const handleAssetClick = (asset: AssetDefinition) => {
    if (activeAsset?.id === asset.id) {
      onSelectAsset(null)
    } else {
      onSelectAsset(asset)
    }
  }

  return (
    <div className="asset-palette">
      {Object.entries(groupedAssets).map(([category, assets]) => (
        <div key={category} className="asset-category">
          <div className="asset-category-title">
            {CATEGORY_ICONS[category] || '📦'} {category}
          </div>

          <div className="asset-list">
            {assets.map((asset) => (
              <button
                key={asset.id}
                className={`asset-item ${activeAsset?.id === asset.id ? 'active' : ''}`}
                onClick={() => handleAssetClick(asset)}
                title={asset.name}
              >
                <div className="asset-icon">
                  {CATEGORY_ICONS[asset.category] || '📦'}
                </div>
                <div className="asset-name">
                  {asset.name}
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}

      {activeAsset && (
        <div className="editor-section">
          <div className="editor-section-title">Asset Selecionado</div>
          <div className="properties-panel">
            <div className="property-row">
              <span className="property-label">Nome:</span>
              <span>{activeAsset.name}</span>
            </div>
            <div className="property-row">
              <span className="property-label">Categoria:</span>
              <span>{activeAsset.category}</span>
            </div>
            <p style={{ marginTop: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
              Clique no mapa para posicionar
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
