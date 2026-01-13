import { useState, useCallback } from 'react'

interface ObjectEditorModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: Record<string, unknown>) => void
  title?: string
  data: Record<string, unknown>
}

/**
 * ObjectEditorModal - Modal para editar objetos (key-value pairs)
 *
 * Permite adicionar, remover e editar propriedades de um objeto
 */
export function ObjectEditorModal({
  isOpen,
  onClose,
  onSave,
  title = 'Editar Objeto',
  data: initialData,
}: ObjectEditorModalProps) {
  const [entries, setEntries] = useState<Array<{ key: string; value: string; type: 'string' | 'number' | 'boolean' }>>(
    Object.entries(initialData || {}).map(([key, value]) => ({
      key,
      value: typeof value === 'object' ? JSON.stringify(value) : String(value),
      type: typeof value === 'number' ? 'number' : typeof value === 'boolean' ? 'boolean' : 'string',
    }))
  )
  const [newKey, setNewKey] = useState('')
  const [newValue, setNewValue] = useState('')
  const [newType, setNewType] = useState<'string' | 'number' | 'boolean'>('string')

  const handleAdd = useCallback(() => {
    if (!newKey.trim()) return

    // Verifica se a chave já existe
    if (entries.some(e => e.key === newKey)) {
      alert('Esta chave já existe!')
      return
    }

    setEntries(prev => [...prev, { key: newKey, value: newValue, type: newType }])
    setNewKey('')
    setNewValue('')
    setNewType('string')
  }, [newKey, newValue, newType, entries])

  const handleRemove = useCallback((index: number) => {
    setEntries(prev => prev.filter((_, i) => i !== index))
  }, [])

  const handleKeyChange = useCallback((index: number, key: string) => {
    setEntries(prev => prev.map((entry, i) =>
      i === index ? { ...entry, key } : entry
    ))
  }, [])

  const handleValueChange = useCallback((index: number, value: string) => {
    setEntries(prev => prev.map((entry, i) =>
      i === index ? { ...entry, value } : entry
    ))
  }, [])

  const handleTypeChange = useCallback((index: number, type: 'string' | 'number' | 'boolean') => {
    setEntries(prev => prev.map((entry, i) =>
      i === index ? { ...entry, type } : entry
    ))
  }, [])

  const handleSave = useCallback(() => {
    const result: Record<string, unknown> = {}

    entries.forEach(({ key, value, type }) => {
      if (!key) return

      if (type === 'number') {
        result[key] = parseFloat(value) || 0
      } else if (type === 'boolean') {
        result[key] = value === 'true' || value === '1'
      } else {
        // Tenta parsear como JSON
        try {
          result[key] = JSON.parse(value)
        } catch {
          result[key] = value
        }
      }
    })

    onSave(result)
    onClose()
  }, [entries, onSave, onClose])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAdd()
    }
  }, [handleAdd])

  if (!isOpen) return null

  return (
    <div className="editor-modal-overlay" onClick={onClose}>
      <div className="editor-modal" onClick={e => e.stopPropagation()} style={{ minWidth: '600px' }}>
        <div className="editor-modal-header">
          <span className="editor-modal-title">{title}</span>
          <button className="editor-btn editor-btn-icon" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="editor-modal-body">
          {/* Adicionar nova propriedade */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <input
              type="text"
              className="editor-input"
              placeholder="Chave..."
              value={newKey}
              onChange={e => setNewKey(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{ width: '140px' }}
              autoFocus
            />
            <select
              className="editor-input editor-select"
              value={newType}
              onChange={e => setNewType(e.target.value as 'string' | 'number' | 'boolean')}
              style={{ width: '100px' }}
            >
              <option value="string">Texto</option>
              <option value="number">Número</option>
              <option value="boolean">Booleano</option>
            </select>
            <input
              type={newType === 'number' ? 'number' : 'text'}
              className="editor-input"
              placeholder="Valor..."
              value={newValue}
              onChange={e => setNewValue(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{ flex: 1 }}
            />
            <button className="editor-btn editor-btn-primary" onClick={handleAdd}>
              + Adicionar
            </button>
          </div>

          {/* Lista de propriedades */}
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {entries.length === 0 ? (
              <div className="editor-empty" style={{ padding: '24px' }}>
                <div className="editor-empty-icon">📋</div>
                <div className="editor-empty-text">
                  Objeto vazio.<br />
                  Adicione propriedades acima.
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {entries.map((entry, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px',
                      background: 'var(--editor-bg-tertiary)',
                      borderRadius: '4px',
                    }}
                  >
                    <input
                      type="text"
                      className="editor-input"
                      value={entry.key}
                      onChange={e => handleKeyChange(index, e.target.value)}
                      placeholder="Chave"
                      style={{ width: '140px', fontWeight: 500 }}
                    />
                    <span style={{ color: 'var(--editor-text-muted)' }}>:</span>
                    <select
                      className="editor-input editor-select"
                      value={entry.type}
                      onChange={e => handleTypeChange(index, e.target.value as 'string' | 'number' | 'boolean')}
                      style={{ width: '100px' }}
                    >
                      <option value="string">Texto</option>
                      <option value="number">Número</option>
                      <option value="boolean">Booleano</option>
                    </select>

                    {entry.type === 'boolean' ? (
                      <select
                        className="editor-input editor-select"
                        value={entry.value === 'true' || entry.value === '1' ? 'true' : 'false'}
                        onChange={e => handleValueChange(index, e.target.value)}
                        style={{ flex: 1 }}
                      >
                        <option value="true">true</option>
                        <option value="false">false</option>
                      </select>
                    ) : (
                      <input
                        type={entry.type === 'number' ? 'number' : 'text'}
                        className={`editor-input ${entry.type === 'number' ? 'editor-input-number' : ''}`}
                        value={entry.value}
                        onChange={e => handleValueChange(index, e.target.value)}
                        placeholder="Valor"
                        style={{ flex: 1 }}
                      />
                    )}

                    <button
                      className="editor-btn editor-btn-icon editor-btn-sm"
                      onClick={() => handleRemove(index)}
                      title="Remover"
                      style={{ color: 'var(--editor-error)' }}
                    >
                      🗑
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{
            marginTop: '12px',
            padding: '8px',
            background: 'var(--editor-bg-primary)',
            borderRadius: '4px',
            fontSize: '11px',
            color: 'var(--editor-text-muted)',
          }}>
            {entries.length} {entries.length === 1 ? 'propriedade' : 'propriedades'} no objeto
          </div>
        </div>

        <div className="editor-modal-footer">
          <button className="editor-btn" onClick={onClose}>
            Cancelar
          </button>
          <button className="editor-btn editor-btn-primary" onClick={handleSave}>
            Salvar
          </button>
        </div>
      </div>
    </div>
  )
}
