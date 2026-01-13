import { useState, useMemo, useRef, useEffect } from 'react'
import { Navbar, SEO, ModelThumbnail } from '@/components/shared'
import { ASSETS } from '@/assets/AssetRegistry'
import { SOUNDS, type SoundDefinition, type SoundCategory } from '@/audio/SoundRegistry'
import type { AssetDefinition } from '@/types'
import '@/styles/landing.css'
import '@/styles/assets.css'

type AssetTab = 'models' | 'sounds'

export function Assets() {
  const [activeTab, setActiveTab] = useState<AssetTab>('models')
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedAsset, setSelectedAsset] = useState<AssetDefinition | null>(null)
  const [selectedSound, setSelectedSound] = useState<SoundDefinition | null>(null)
  const [playingSound, setPlayingSound] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Stop audio when unmounting or changing tabs
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  // Stop audio when changing tabs
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
      setPlayingSound(null)
    }
    setSelectedCategory(null)
    setSearch('')
  }, [activeTab])

  // Play/Stop sound
  const toggleSound = (sound: SoundDefinition) => {
    if (playingSound === sound.id) {
      // Stop current sound
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      setPlayingSound(null)
    } else {
      // Stop previous sound if any
      if (audioRef.current) {
        audioRef.current.pause()
      }
      // Play new sound
      const audio = new Audio(sound.path)
      audio.volume = sound.volume ?? 1
      audio.onended = () => {
        setPlayingSound(null)
        audioRef.current = null
      }
      audio.play().catch(console.error)
      audioRef.current = audio
      setPlayingSound(sound.id)
    }
  }

  // Get unique categories for 3D models
  const categories = useMemo(() => {
    const cats = new Set(ASSETS.map((a) => a.category))
    return Array.from(cats).sort()
  }, [])

  // Get unique categories for sounds
  const soundCategories = useMemo(() => {
    const cats = new Set(SOUNDS.map((s) => s.category))
    return Array.from(cats).sort()
  }, [])

  // Sound category labels in Portuguese
  const soundCategoryLabels: Record<SoundCategory, string> = {
    battle: 'Batalha',
    interface: 'Interface',
    inventory: 'Inventario',
    npc: 'NPCs',
    world: 'Mundo',
    misc: 'Diversos',
    player: 'Jogador',
    ambient: 'Ambiente',
  }

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

  // Filter sounds
  const filteredSounds = useMemo(() => {
    return SOUNDS.filter((sound) => {
      const matchesSearch =
        search === '' ||
        sound.name.toLowerCase().includes(search.toLowerCase()) ||
        sound.id.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = selectedCategory === null || sound.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [search, selectedCategory])

  // Group sounds by category
  const groupedSounds = useMemo(() => {
    const groups: Record<string, SoundDefinition[]> = {}
    filteredSounds.forEach((sound) => {
      if (!groups[sound.category]) {
        groups[sound.category] = []
      }
      groups[sound.category].push(sound)
    })
    return groups
  }, [filteredSounds])

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
            {activeTab === 'models'
              ? `+${ASSETS.length} modelos 3D prontos para usar em ${categories.length} categorias`
              : `+${SOUNDS.length} sons e efeitos sonoros em ${soundCategories.length} categorias`
            }
          </p>
          <div className="assets-tabs">
            <button
              className={`assets-tab ${activeTab === 'models' ? 'active' : ''}`}
              onClick={() => setActiveTab('models')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                <line x1="12" y1="22.08" x2="12" y2="12"/>
              </svg>
              Modelos 3D
            </button>
            <button
              className={`assets-tab ${activeTab === 'sounds' ? 'active' : ''}`}
              onClick={() => setActiveTab('sounds')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
              </svg>
              Sons
            </button>
          </div>
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
              {activeTab === 'models' ? (
                <>
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
                </>
              ) : (
                <>
                  <button
                    className={`category-btn ${selectedCategory === null ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(null)}
                  >
                    Todos ({SOUNDS.length})
                  </button>
                  {soundCategories.map((cat) => (
                    <button
                      key={cat}
                      className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {soundCategoryLabels[cat as SoundCategory] || cat} ({SOUNDS.filter((s) => s.category === cat).length})
                    </button>
                  ))}
                </>
              )}
            </div>
          </aside>

          {/* Assets Grid */}
          <main className="assets-main">
            {activeTab === 'models' ? (
              <>
                {Object.entries(groupedAssets).map(([category, assets]) => (
                  <section key={category} className="assets-section">
                    <h2>{category}</h2>
                    <div className="assets-grid-page">
                      {assets.map((asset) => (
                        <button
                          key={asset.id}
                          className={`asset-card-page ${selectedAsset?.id === asset.id ? 'active' : ''}`}
                          onClick={() => { setSelectedAsset(asset); setSelectedSound(null) }}
                        >
                          <ModelThumbnail modelPath={asset.path} size={48} />
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
              </>
            ) : (
              <>
                {Object.entries(groupedSounds).map(([category, sounds]) => (
                  <section key={category} className="assets-section">
                    <h2>{soundCategoryLabels[category as SoundCategory] || category}</h2>
                    <div className="assets-grid-page">
                      {sounds.map((sound) => (
                        <button
                          key={sound.id}
                          className={`asset-card-page sound-card ${selectedSound?.id === sound.id ? 'active' : ''} ${playingSound === sound.id ? 'playing' : ''}`}
                          onClick={() => { setSelectedSound(sound); setSelectedAsset(null) }}
                        >
                          <div
                            className="sound-play-btn"
                            onClick={(e) => { e.stopPropagation(); toggleSound(sound) }}
                          >
                            {playingSound === sound.id ? (
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <rect x="6" y="4" width="4" height="16"/>
                                <rect x="14" y="4" width="4" height="16"/>
                              </svg>
                            ) : (
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <polygon points="5 3 19 12 5 21 5 3"/>
                              </svg>
                            )}
                          </div>
                          <div className="asset-card-info">
                            <h4>{sound.name}</h4>
                            <span className="asset-type">{soundCategoryLabels[sound.category] || sound.category}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </section>
                ))}

                {filteredSounds.length === 0 && (
                  <div className="assets-empty">
                    <p>Nenhum som encontrado</p>
                  </div>
                )}
              </>
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
                <ModelThumbnail modelPath={selectedAsset.path} size={160} />
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

          {/* Sound Details Panel */}
          {selectedSound && (
            <aside className="assets-details">
              <div className="assets-details-header">
                <h3>{selectedSound.name}</h3>
                <button className="close-btn" onClick={() => setSelectedSound(null)}>
                  ✕
                </button>
              </div>

              <div className="assets-details-preview sound-preview">
                <button
                  className={`sound-preview-btn ${playingSound === selectedSound.id ? 'playing' : ''}`}
                  onClick={() => toggleSound(selectedSound)}
                >
                  {playingSound === selectedSound.id ? (
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="6" y="4" width="4" height="16"/>
                      <rect x="14" y="4" width="4" height="16"/>
                    </svg>
                  ) : (
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="5 3 19 12 5 21 5 3"/>
                    </svg>
                  )}
                </button>
                <span className="sound-preview-label">
                  {playingSound === selectedSound.id ? 'Clique para parar' : 'Clique para ouvir'}
                </span>
              </div>

              <div className="assets-details-info">
                <div className="detail-row">
                  <span className="detail-label">ID</span>
                  <code>{selectedSound.id}</code>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Categoria</span>
                  <span>{soundCategoryLabels[selectedSound.category] || selectedSound.category}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Volume Padrao</span>
                  <span>{Math.round((selectedSound.volume ?? 1) * 100)}%</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Arquivo</span>
                  <code className="detail-path">{selectedSound.path}</code>
                </div>
              </div>

              <div className="assets-details-actions">
                <a href="/docs" className="btn-primary">
                  Ver Documentacao
                </a>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  )
}
