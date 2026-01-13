import { useState, useEffect, useCallback } from 'react'
import type { MainMenuScreen, MenuButton } from '../../types/game'

interface MainMenuEditorProps {
  menu: MainMenuScreen
  onUpdate: (menu: MainMenuScreen) => void
  disabled?: boolean
}

const DEFAULT_BUTTON: MenuButton = {
  id: '',
  label: '',
  action: 'play',
  disabled: false,
}

const ACTION_OPTIONS = [
  { value: 'play', label: 'Jogar' },
  { value: 'continue', label: 'Continuar' },
  { value: 'new_game', label: 'Novo Jogo' },
  { value: 'load_game', label: 'Carregar Jogo' },
  { value: 'options', label: 'Opcoes' },
  { value: 'credits', label: 'Creditos' },
  { value: 'quit', label: 'Sair' },
  { value: 'multiplayer', label: 'Multiplayer' },
  { value: 'custom', label: 'Customizado' },
]

/**
 * Editor do menu principal
 */
export function MainMenuEditor({ menu, onUpdate, disabled }: MainMenuEditorProps) {
  const [localMenu, setLocalMenu] = useState<MainMenuScreen>(menu)
  const [editingButton, setEditingButton] = useState<MenuButton | null>(null)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  useEffect(() => {
    setLocalMenu(menu)
  }, [menu])

  const handleChange = useCallback(
    <K extends keyof MainMenuScreen>(key: K, value: MainMenuScreen[K]) => {
      const newMenu = { ...localMenu, [key]: value }
      setLocalMenu(newMenu)
      onUpdate(newMenu)
    },
    [localMenu, onUpdate]
  )

  const addButton = useCallback(() => {
    setEditingButton({ ...DEFAULT_BUTTON, id: `btn_${Date.now()}` })
    setEditingIndex(null)
  }, [])

  const editButton = useCallback((button: MenuButton, index: number) => {
    setEditingButton({ ...button })
    setEditingIndex(index)
  }, [])

  const saveButton = useCallback(() => {
    if (!editingButton) return

    let newButtons: MenuButton[]
    if (editingIndex !== null) {
      newButtons = localMenu.buttons.map((btn, i) =>
        i === editingIndex ? editingButton : btn
      )
    } else {
      newButtons = [...localMenu.buttons, editingButton]
    }

    handleChange('buttons', newButtons)
    setEditingButton(null)
    setEditingIndex(null)
  }, [editingButton, editingIndex, localMenu.buttons, handleChange])

  const removeButton = useCallback(
    (index: number) => {
      const newButtons = localMenu.buttons.filter((_, i) => i !== index)
      handleChange('buttons', newButtons)
    },
    [localMenu.buttons, handleChange]
  )

  const moveButton = useCallback(
    (index: number, direction: 'up' | 'down') => {
      const newIndex = direction === 'up' ? index - 1 : index + 1
      if (newIndex < 0 || newIndex >= localMenu.buttons.length) return

      const newButtons = [...localMenu.buttons]
      const temp = newButtons[index]
      newButtons[index] = newButtons[newIndex]
      newButtons[newIndex] = temp

      handleChange('buttons', newButtons)
    },
    [localMenu.buttons, handleChange]
  )

  return (
    <div className="game-editor-section">
      <h3 className="game-editor-section-title">Menu Principal</h3>

      <div className="game-editor-field">
        <label htmlFor="menu-background">Background (URL)</label>
        <input
          id="menu-background"
          type="text"
          value={localMenu.background || ''}
          onChange={(e) => handleChange('background', e.target.value || null)}
          placeholder="URL da imagem de fundo"
          disabled={disabled}
        />
      </div>

      <div className="game-editor-field">
        <label htmlFor="menu-music">Musica (URL)</label>
        <input
          id="menu-music"
          type="text"
          value={localMenu.music || ''}
          onChange={(e) => handleChange('music', e.target.value || null)}
          placeholder="URL do arquivo de audio"
          disabled={disabled}
        />
      </div>

      <div className="game-editor-field">
        <label>Botoes do Menu</label>
        <div className="game-editor-buttons-list">
          {localMenu.buttons.map((button, index) => (
            <div key={button.id} className="game-editor-button-item">
              <span className="game-editor-button-label">{button.label || '(Sem label)'}</span>
              <span className="game-editor-button-action">
                {ACTION_OPTIONS.find((a) => a.value === button.action)?.label || button.action}
              </span>
              <div className="game-editor-button-actions">
                <button
                  type="button"
                  onClick={() => moveButton(index, 'up')}
                  disabled={disabled || index === 0}
                  title="Mover para cima"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveButton(index, 'down')}
                  disabled={disabled || index === localMenu.buttons.length - 1}
                  title="Mover para baixo"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => editButton(button, index)}
                  disabled={disabled}
                  title="Editar"
                >
                  Editar
                </button>
                <button
                  type="button"
                  className="danger"
                  onClick={() => removeButton(index)}
                  disabled={disabled}
                  title="Remover"
                >
                  X
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="game-editor-add-button"
          onClick={addButton}
          disabled={disabled}
        >
          + Adicionar Botao
        </button>
      </div>

      {/* Modal de edicao de botao */}
      {editingButton && (
        <div className="game-editor-modal-overlay" onClick={() => setEditingButton(null)}>
          <div className="game-editor-modal" onClick={(e) => e.stopPropagation()}>
            <h4>{editingIndex !== null ? 'Editar Botao' : 'Novo Botao'}</h4>

            <div className="game-editor-field">
              <label htmlFor="button-label">Label</label>
              <input
                id="button-label"
                type="text"
                value={editingButton.label}
                onChange={(e) =>
                  setEditingButton({ ...editingButton, label: e.target.value })
                }
                placeholder="Texto do botao"
              />
            </div>

            <div className="game-editor-field">
              <label htmlFor="button-action">Acao</label>
              <select
                id="button-action"
                value={editingButton.action}
                onChange={(e) =>
                  setEditingButton({ ...editingButton, action: e.target.value })
                }
              >
                {ACTION_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="game-editor-field">
              <label htmlFor="button-icon">Icone (opcional)</label>
              <input
                id="button-icon"
                type="text"
                value={editingButton.icon || ''}
                onChange={(e) =>
                  setEditingButton({ ...editingButton, icon: e.target.value || undefined })
                }
                placeholder="URL ou emoji"
              />
            </div>

            <div className="game-editor-field game-editor-field-inline">
              <label htmlFor="button-disabled">Desabilitado</label>
              <input
                id="button-disabled"
                type="checkbox"
                checked={editingButton.disabled || false}
                onChange={(e) =>
                  setEditingButton({ ...editingButton, disabled: e.target.checked })
                }
              />
            </div>

            <div className="game-editor-modal-actions">
              <button type="button" onClick={() => setEditingButton(null)}>
                Cancelar
              </button>
              <button
                type="button"
                className="primary"
                onClick={saveButton}
                disabled={!editingButton.label}
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
