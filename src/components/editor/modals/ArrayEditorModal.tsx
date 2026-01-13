import { useState, useCallback } from 'react'

interface ArrayEditorModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (items: unknown[]) => void
  title?: string
  items: unknown[]
  itemType?: 'string' | 'number' | 'object'
}

/**
 * ArrayEditorModal - Modal para editar arrays
 *
 * Permite adicionar, remover e editar itens de um array
 */
export function ArrayEditorModal({
  isOpen,
  onClose,
  onSave,
  title = 'Editar Lista',
  items: initialItems,
  itemType = 'string',
}: ArrayEditorModalProps) {
  const [items, setItems] = useState<unknown[]>(initialItems || [])
  const [newItem, setNewItem] = useState('')

  const handleAdd = useCallback(() => {
    if (!newItem.trim() && itemType === 'string') return

    let valueToAdd: unknown = newItem
    if (itemType === 'number') {
      valueToAdd = parseFloat(newItem) || 0
    } else if (itemType === 'object') {
      try {
        valueToAdd = JSON.parse(newItem)
      } catch {
        valueToAdd = { value: newItem }
      }
    }

    setItems(prev => [...prev, valueToAdd])
    setNewItem('')
  }, [newItem, itemType])

  const handleRemove = useCallback((index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index))
  }, [])

  const handleEdit = useCallback((index: number, value: unknown) => {
    setItems(prev => prev.map((item, i) => i === index ? value : item))
  }, [])

  const handleMoveUp = useCallback((index: number) => {
    if (index === 0) return
    setItems(prev => {
      const newItems = [...prev]
      const temp = newItems[index]
      newItems[index] = newItems[index - 1]
      newItems[index - 1] = temp
      return newItems
    })
  }, [])

  const handleMoveDown = useCallback((index: number) => {
    setItems(prev => {
      if (index === prev.length - 1) return prev
      const newItems = [...prev]
      const temp = newItems[index]
      newItems[index] = newItems[index + 1]
      newItems[index + 1] = temp
      return newItems
    })
  }, [])

  const handleSave = useCallback(() => {
    onSave(items)
    onClose()
  }, [items, onSave, onClose])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAdd()
    }
  }, [handleAdd])

  if (!isOpen) return null

  return (
    <div className="editor-modal-overlay" onClick={onClose}>
      <div className="editor-modal" onClick={e => e.stopPropagation()} style={{ minWidth: '500px' }}>
        <div className="editor-modal-header">
          <span className="editor-modal-title">{title}</span>
          <button className="editor-btn editor-btn-icon" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="editor-modal-body">
          {/* Adicionar novo item */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <input
              type={itemType === 'number' ? 'number' : 'text'}
              className="editor-input"
              placeholder={
                itemType === 'number'
                  ? 'Digite um número...'
                  : itemType === 'object'
                    ? 'JSON ou texto...'
                    : 'Digite um valor...'
              }
              value={newItem}
              onChange={e => setNewItem(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{ flex: 1 }}
              autoFocus
            />
            <button className="editor-btn editor-btn-primary" onClick={handleAdd}>
              + Adicionar
            </button>
          </div>

          {/* Lista de itens */}
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {items.length === 0 ? (
              <div className="editor-empty" style={{ padding: '24px' }}>
                <div className="editor-empty-icon">📝</div>
                <div className="editor-empty-text">
                  Lista vazia.<br />
                  Adicione itens acima.
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {items.map((item, index) => (
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
                    <span style={{
                      width: '24px',
                      height: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'var(--editor-bg-primary)',
                      borderRadius: '4px',
                      fontSize: '10px',
                      color: 'var(--editor-text-muted)',
                    }}>
                      {index + 1}
                    </span>

                    {itemType === 'string' ? (
                      <input
                        type="text"
                        className="editor-input"
                        value={String(item)}
                        onChange={e => handleEdit(index, e.target.value)}
                        style={{ flex: 1 }}
                      />
                    ) : itemType === 'number' ? (
                      <input
                        type="number"
                        className="editor-input editor-input-number"
                        value={Number(item)}
                        onChange={e => handleEdit(index, parseFloat(e.target.value) || 0)}
                        style={{ flex: 1 }}
                      />
                    ) : (
                      <input
                        type="text"
                        className="editor-input"
                        value={typeof item === 'object' ? JSON.stringify(item) : String(item)}
                        onChange={e => {
                          try {
                            handleEdit(index, JSON.parse(e.target.value))
                          } catch {
                            handleEdit(index, e.target.value)
                          }
                        }}
                        style={{ flex: 1, fontFamily: 'var(--editor-font-mono)' }}
                      />
                    )}

                    <div style={{ display: 'flex', gap: '2px' }}>
                      <button
                        className="editor-btn editor-btn-icon editor-btn-sm"
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                        title="Mover para cima"
                      >
                        ▲
                      </button>
                      <button
                        className="editor-btn editor-btn-icon editor-btn-sm"
                        onClick={() => handleMoveDown(index)}
                        disabled={index === items.length - 1}
                        title="Mover para baixo"
                      >
                        ▼
                      </button>
                      <button
                        className="editor-btn editor-btn-icon editor-btn-sm"
                        onClick={() => handleRemove(index)}
                        title="Remover"
                        style={{ color: 'var(--editor-error)' }}
                      >
                        🗑
                      </button>
                    </div>
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
            {items.length} {items.length === 1 ? 'item' : 'itens'} na lista
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
