import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Team } from '../../types/team'

const createProjectSchema = z.object({
  teamId: z.string().min(1, 'Selecione um time'),
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  description: z.string().optional(),
  gameTitle: z.string().optional(),
})

type CreateProjectFormData = z.infer<typeof createProjectSchema>

interface CreateProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateProjectFormData) => Promise<void>
  teams: Team[]
  isLoading?: boolean
}

/**
 * CreateProjectModal - Modal para criar novo projeto
 */
export function CreateProjectModal({
  isOpen,
  onClose,
  onSubmit,
  teams,
  isLoading,
}: CreateProjectModalProps) {
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateProjectFormData>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      teamId: teams[0]?.id || '',
    },
  })

  const handleFormSubmit = async (data: CreateProjectFormData) => {
    setError(null)

    try {
      await onSubmit(data)
      reset()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar projeto')
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Criar Novo Projeto</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="modal-body">
            {error && (
              <div className="modal-error">{error}</div>
            )}

            <div className="form-field">
              <label htmlFor="project-team">Time</label>
              <select
                id="project-team"
                {...register('teamId')}
                className={errors.teamId ? 'error' : ''}
              >
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
              {errors.teamId && (
                <span className="form-field-error">{errors.teamId.message}</span>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="project-name">Nome do Projeto</label>
              <input
                id="project-name"
                type="text"
                placeholder="Meu Jogo MMORPG"
                {...register('name')}
                className={errors.name ? 'error' : ''}
              />
              {errors.name && (
                <span className="form-field-error">{errors.name.message}</span>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="project-title">Título do Jogo (opcional)</label>
              <input
                id="project-title"
                type="text"
                placeholder="Título que aparecerá no jogo"
                {...register('gameTitle')}
              />
              <span className="form-field-hint">
                Se não informado, será usado o nome do projeto
              </span>
            </div>

            <div className="form-field">
              <label htmlFor="project-description">Descrição (opcional)</label>
              <textarea
                id="project-description"
                placeholder="Uma breve descrição do projeto..."
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
              {isLoading ? 'Criando...' : 'Criar Projeto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
