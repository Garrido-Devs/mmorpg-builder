import { useState, useMemo } from 'react'
import { Navbar, SEO } from '@/components/shared'
import { ASSETS } from '@/assets/AssetRegistry'
import type { AssetDefinition } from '@/types'
import '@/styles/landing.css'
import '@/styles/assets.css'

export function Assets() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedAsset, setSelectedAsset] = useState<AssetDefinition | null>(null)

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(ASSETS.map((a) => a.category))
    return Array.from(cats).sort()
  }, [])

  // Filter assets
  const filteredAssets = useMemo(() => {
    return ASSETS.filter((asset) => {
      const matchesSearch =
        search === '' ||
        asset.name.toLowerCase().includes(search.toLowerCase()) ||
        asset.id.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = selectedCategory === null || asset.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [search, selectedCategory])

  // Group by category
  const groupedAssets = useMemo(() => {
    const groups: Record<string, AssetDefinition[]> = {}
    filteredAssets.forEach((asset) => {
      if (!groups[asset.category]) {
        groups[asset.category] = []
      }
      groups[asset.category].push(asset)
    })
    return groups
  }, [filteredAssets])

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'npc':
        return '🧙'
      case 'character':
        return '🧝'
      case 'prop':
        return '🪑'
      case 'item':
        return '⚔️'
      case 'building':
        return '🏠'
      case 'prefab':
        return '📍'
      default:
        return '📦'
    }
  }

  return (
    <div className="landing-page">
      <SEO
        title="Assets"
        description="Biblioteca de assets 3D do MMORPG Builder. Mais de 100 modelos prontos para usar incluindo personagens, inimigos, moveis e itens."
      />
      <Navbar />

      <div className="assets-page">
        <header className="assets-header">
          <h1>Biblioteca de Assets</h1>
          <p>
            +{ASSETS.length} modelos 3D prontos para usar em {categories.length} categorias
          </p>
        </header>

        <div className="assets-layout">
          {/* Sidebar Filters */}
          <aside className="assets-filters">
            <div className="assets-search">
              <input
                type="text"
                placeholder="Buscar assets..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="assets-categories">
              <h3>Categorias</h3>
              <button
                className={`category-btn ${selectedCategory === null ? 'active' : ''}`}
                onClick={() => setSelectedCategory(null)}
              >
                Todas ({ASSETS.length})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat} ({ASSETS.filter((a) => a.category === cat).length})
                </button>
              ))}
            </div>
          </aside>

          {/* Assets Grid */}
          <main className="assets-main">
            {Object.entries(groupedAssets).map(([category, assets]) => (
              <section key={category} className="assets-section">
                <h2>{category}</h2>
                <div className="assets-grid-page">
                  {assets.map((asset) => (
                    <button
                      key={asset.id}
                      className={`asset-card-page ${selectedAsset?.id === asset.id ? 'active' : ''}`}
                      onClick={() => setSelectedAsset(asset)}
                    >
                      <div className="asset-card-icon-page">{getAssetIcon(asset.type)}</div>
                      <div className="asset-card-info">
                        <h4>{asset.name}</h4>
                        <span className="asset-type">{asset.type}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            ))}

            {filteredAssets.length === 0 && (
              <div className="assets-empty">
                <p>Nenhum asset encontrado</p>
              </div>
            )}
          </main>

          {/* Asset Details Panel */}
          {selectedAsset && (
            <aside className="assets-details">
              <div className="assets-details-header">
                <h3>{selectedAsset.name}</h3>
                <button className="close-btn" onClick={() => setSelectedAsset(null)}>
                  ✕
                </button>
              </div>

              <div className="assets-details-preview">
                <div className="asset-preview-icon">{getAssetIcon(selectedAsset.type)}</div>
              </div>

              <div className="assets-details-info">
                <div className="detail-row">
                  <span className="detail-label">ID</span>
                  <code>{selectedAsset.id}</code>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Tipo</span>
                  <span>{selectedAsset.type}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Categoria</span>
                  <span>{selectedAsset.category}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Arquivo</span>
                  <code className="detail-path">{selectedAsset.path}</code>
                </div>
                {selectedAsset.defaultComponents && selectedAsset.defaultComponents.length > 0 && (
                  <div className="detail-row">
                    <span className="detail-label">Componentes Padrao</span>
                    <div className="detail-tags">
                      {selectedAsset.defaultComponents.map((comp) => (
                        <span key={comp} className="detail-tag">
                          {comp}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="assets-details-actions">
                <a href="/editor" className="btn-primary">
                  Usar no Editor
                </a>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  )
}
