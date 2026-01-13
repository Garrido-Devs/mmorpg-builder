import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const createTeamSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  description: z.string().optional(),
})

type CreateTeamFormData = z.infer<typeof createTeamSchema>

interface CreateTeamModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateTeamFormData) => Promise<void>
  isLoading?: boolean
}

/**
 * CreateTeamModal - Modal para criar novo time
 */
export function CreateTeamModal({ isOpen, onClose, onSubmit, isLoading }: CreateTeamModalProps) {
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTeamFormData>({
    resolver: zodResolver(createTeamSchema),
  })

  const handleFormSubmit = async (data: CreateTeamFormData) => {
    setError(null)

    try {
      await onSubmit(data)
      reset()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar time')
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Criar Novo Time</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="modal-body">
            {error && (
              <div className="modal-error">{error}</div>
            )}

            <div className="form-field">
              <label htmlFor="team-name">Nome do Time</label>
              <input
                id="team-name"
                type="text"
                placeholder="Meu Time Incrível"
                {...register('name')}
                className={errors.name ? 'error' : ''}
              />
              {errors.name && (
                <span className="form-field-error">{errors.name.message}</span>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="team-description">Descrição (opcional)</label>
              <textarea
                id="team-description"
                placeholder="Uma breve descrição do time..."
                rows={3}
                {...register('description')}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Criando...' : 'Criar Time'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
