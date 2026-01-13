import { useState, useCallback } from 'react'
import type {
  Project,
  ProjectWithData,
  CreateProjectData,
  UpdateProjectData,
  ProjectDataItem,
} from '../types/project'
import { projectsApi, ApiError } from '../utils/api'

/**
 * Hook para gerenciar projetos
 */
export function useProject() {
  const [projects, setProjects] = useState<Project[]>([])
  const [currentProject, setCurrentProject] = useState<ProjectWithData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Listar projetos do usuário
  const fetchProjects = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await projectsApi.list()
      setProjects(response.projects as Project[])
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load projects')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Obter detalhes de um projeto
  const fetchProject = useCallback(async (id: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await projectsApi.get(id)
      const project: ProjectWithData = {
        ...(response.project as Project),
        data: response.data as ProjectWithData['data'],
        activeUsers: response.activeUsers as ProjectWithData['activeUsers'],
      }
      setCurrentProject(project)
      return project
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load project')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Criar novo projeto
  const createProject = useCallback(async (data: CreateProjectData): Promise<Project | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await projectsApi.create(data)
      const project = response.project as Project
      setProjects((prev) => [project, ...prev])
      return project
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to create project')
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Atualizar projeto
  const updateProject = useCallback(
    async (id: string, data: UpdateProjectData) => {
      setIsLoading(true)
      setError(null)

      try {
        await projectsApi.update(id, data)

        // Atualizar lista local
        setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)))

        // Atualizar projeto atual se for o mesmo
        if (currentProject?.id === id) {
          setCurrentProject((prev) => (prev ? { ...prev, ...data } : prev))
        }

        return true
      } catch (err) {
        setError(err instanceof ApiError ? err.message : 'Failed to update project')
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [currentProject?.id]
  )

  // Deletar projeto
  const deleteProject = useCallback(
    async (id: string) => {
      setIsLoading(true)
      setError(null)

      try {
        await projectsApi.delete(id)
        setProjects((prev) => prev.filter((p) => p.id !== id))

        if (currentProject?.id === id) {
          setCurrentProject(null)
        }

        return true
      } catch (err) {
        setError(err instanceof ApiError ? err.message : 'Failed to delete project')
        return false
      } finally {
        setIsLoading(false)
      }
    },
    [currentProject?.id]
  )

  // Obter dados específicos do projeto
  const getProjectData = useCallback(
    async <T = unknown>(type: string, key?: string): Promise<ProjectDataItem<T>[] | null> => {
      if (!currentProject) return null

      try {
        const response = await projectsApi.getData(currentProject.id, type, key)
        return response.data as ProjectDataItem<T>[]
      } catch (err) {
        setError(err instanceof ApiError ? err.message : 'Failed to get project data')
        return null
      }
    },
    [currentProject]
  )

  // Atualizar dados do projeto
  const updateProjectData = useCallback(
    async <T = unknown>(
      type: string,
      key: string,
      data: T,
      version?: number
    ): Promise<{ success: boolean; version?: number }> => {
      if (!currentProject) return { success: false }

      try {
        const response = await projectsApi.updateData(currentProject.id, {
          type,
          key,
          data,
          version,
        })

        // Atualizar dados locais
        setCurrentProject((prev) => {
          if (!prev) return prev

          const newData = { ...prev.data }
          if (!newData[type]) newData[type] = {}
          newData[type][key] = {
            id: response.id,
            data,
            version: response.version,
            updatedAt: new Date().toISOString(),
          }

          return { ...prev, data: newData }
        })

        return { success: true, version: response.version }
      } catch (err) {
        if (err instanceof ApiError && err.status === 409) {
          // Conflito de versão
          return { success: false }
        }
        setError(err instanceof ApiError ? err.message : 'Failed to update project data')
        return { success: false }
      }
    },
    [currentProject]
  )

  return {
    projects,
    currentProject,
    isLoading,
    error,
    fetchProjects,
    fetchProject,
    createProject,
    updateProject,
    deleteProject,
    getProjectData,
    updateProjectData,
    setCurrentProject,
    clearError: () => setError(null),
  }
}
