import { useState, useCallback, useMemo, useEffect } from 'react'
import type { AssetDefinition } from '../../../types'
import { getAssetsByCategory, searchAssets } from '../../../assets'
import { getEngine } from '../../../engine'
import { thumbnailRenderer } from '../../../utils/ThumbnailRenderer'

// Ícones por categoria
const CATEGORY_ICONS: Record<string, string> = {
  'Personagens': '🧙',
  'Inimigos': '💀',
  'Dungeon - Estrutura': '🧱',
  'Dungeon - Portas': '🚪',
  'Dungeon - Containers': '📦',
  'Dungeon - Iluminação': '🔥',
  'Dungeon - Decoração': '🎨',
  'Móveis - Camas': '🛏️',
  'Móveis - Assentos': '🪑',
  'Móveis - Mesas': '🪵',
  'Móveis - Armários': '🗄️',
  'Móveis - Decoração': '🖼️',
  'Armas': '⚔️',
  'Itens': '🎒',
  'Triggers': '⚡',
  'Natureza': '🌲',
  'Construções': '🏠',
  'NPCs': '🧑',
  'Portais': '🌀',
}

/**
 * AssetThumbnail - Componente que carrega thumbnail assincronamente
 */
function AssetThumbnail({ asset }: { asset: AssetDefinition }) {
  const [thumbnail, setThumbnail] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!asset.path) {
      setThumbnail(null)
      return
    }

    // Verificar cache primeiro
    const cached = thumbnailRenderer.getCachedThumbnail(asset.path)
    if (cached) {
      setThumbnail(cached)
      return
    }

    // Carregar thumbnail
    setLoading(true)
    thumbnailRenderer.generateThumbnail(asset.path)
      .then(url => {
        setThumbnail(url)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [asset.path])

  if (loading) {
    return (
      <div className="editor-asset-preview" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--editor-bg-tertiary)',
      }}>
        <span style={{ fontSize: '16px', opacity: 0.5 }}>⏳</span>
      </div>
    )
  }

  if (thumbnail) {
    return (
      <div className="editor-asset-preview" style={{
        backgroundImage: `url(${thumbnail})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }} />
    )
  }

  // Fallback para emoji
  return (
    <div className="editor-asset-preview">
      {CATEGORY_ICONS[asset.category] || '📦'}
    </div>
  )
}

/**
 * AssetsPanel - Painel de seleção de assets
 */
export function AssetsPanel() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeAsset, setActiveAsset] = useState<AssetDefinition | null>(null)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['Personagens', 'Inimigos'])
  )

  // Assets filtrados
  const displayAssets = useMemo(() => {
    if (searchQuery.trim()) {
      return { 'Resultados': searchAssets(searchQuery) }
    }
    return getAssetsByCategory()
  }, [searchQuery])

  // Seleciona asset para posicionamento
  const handleAssetClick = useCallback((asset: AssetDefinition) => {
    const newActive = activeAsset?.id === asset.id ? null : asset

    setActiveAsset(newActive)

    // Notifica o EditorSystem
    const engine = getEngine()
    engine.editorSystem.setActiveAsset(newActive)
  }, [activeAsset])

  // Toggle categoria
  const toggleCategory = useCallback((category: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev)
      if (next.has(category)) {
        next.delete(category)
      } else {
        next.add(category)
      }
      return next
    })
  }, [])

  return (
    <>
      <div className="editor-panel-header">
        <span>Assets</span>
        <span className="editor-badge">{Object.values(displayAssets).flat().length}</span>
      </div>

      <div className="editor-panel-content">
        {/* Busca */}
        <div className="editor-search">
          <span className="editor-search-icon">🔍</span>
          <input
            type="text"
            className="editor-input editor-search-input"
            placeholder="Buscar assets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Asset ativo */}
        {activeAsset && (
          <div className="editor-section" style={{ marginBottom: '16px' }}>
            <div className="editor-section-content" style={{ padding: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: 48, height: 48, borderRadius: '6px', overflow: 'hidden' }}>
                  <AssetThumbnail asset={activeAsset} />
                </div>
                <div>
                  <div style={{ fontWeight: 500 }}>{activeAsset.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--editor-text-muted)' }}>
                    Clique no mapa para posicionar
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Lista de categorias */}
        {Object.entries(displayAssets).map(([category, assets]) => (
          <div key={category} className="editor-asset-category">
            <button
              className="editor-asset-category-title"
              onClick={() => toggleCategory(category)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                width: '100%',
                textAlign: 'left',
              }}
            >
              <span style={{ transform: expandedCategories.has(category) ? 'rotate(0)' : 'rotate(-90deg)', transition: '150ms' }}>
                ▼
              </span>
              <span>{CATEGORY_ICONS[category] || '📦'}</span>
              <span>{category}</span>
              <span className="editor-badge" style={{ marginLeft: 'auto' }}>
                {assets.length}
              </span>
            </button>

            {expandedCategories.has(category) && (
              <div className="editor-asset-grid">
                {assets.map((asset) => (
                  <button
                    key={asset.id}
                    className={`editor-asset-item ${activeAsset?.id === asset.id ? 'active' : ''}`}
                    onClick={() => handleAssetClick(asset)}
                  >
                    <AssetThumbnail asset={asset} />
                    <div className="editor-asset-name">{asset.name}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Sem resultados */}
        {Object.keys(displayAssets).length === 0 && (
          <div className="editor-empty">
            <div className="editor-empty-icon">🔍</div>
            <div className="editor-empty-text">
              Nenhum asset encontrado
            </div>
          </div>
        )}
      </div>
    </>
  )
}
