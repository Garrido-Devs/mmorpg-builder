/**
 * API utility functions
 */

const API_BASE = '/api'

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: unknown
  headers?: Record<string, string>
}

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * Faz requisição para a API
 */
export async function apiRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {} } = options

  // Adicionar token de autenticação se existir
  const token = localStorage.getItem('auth_token')
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  // Configurar headers
  if (body && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json'
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new ApiError(data.error || 'Request failed', response.status, data)
  }

  return data as T
}

// Auth API
export const authApi = {
  register: (data: { email: string; password: string; name: string }) =>
    apiRequest<{ user: unknown; token: string }>('/auth/register', { method: 'POST', body: data }),

  login: (data: { email: string; password: string }) =>
    apiRequest<{ user: unknown; token: string }>('/auth/login', { method: 'POST', body: data }),

  logout: () => apiRequest<{ success: boolean }>('/auth/logout', { method: 'POST' }),

  me: () => apiRequest<{ user: unknown; teams: unknown[] }>('/auth/me'),
}

// Teams API
export const teamsApi = {
  list: () => apiRequest<{ teams: unknown[] }>('/teams'),

  create: (data: { name: string; description?: string }) =>
    apiRequest<{ team: unknown }>('/teams', { method: 'POST', body: data }),

  get: (id: string) =>
    apiRequest<{ team: unknown; members: unknown[]; projects: unknown[] }>(`/teams/${id}`),

  update: (id: string, data: { name?: string; description?: string; avatarUrl?: string }) =>
    apiRequest<{ success: boolean }>(`/teams/${id}`, { method: 'PUT', body: data }),

  delete: (id: string) => apiRequest<{ success: boolean }>(`/teams/${id}`, { method: 'DELETE' }),

  getInvite: (id: string) => apiRequest<{ inviteCode: string; inviteLink: string }>(`/teams/${id}/invite`),

  regenerateInvite: (id: string) =>
    apiRequest<{ inviteCode: string; inviteLink: string }>(`/teams/${id}/invite`, { method: 'POST' }),

  previewByCode: (code: string) => apiRequest<{ team: unknown }>(`/teams/join/${code}`),

  joinByCode: (code: string) =>
    apiRequest<{ success: boolean; team: unknown }>(`/teams/join/${code}`, { method: 'POST' }),
}

// Projects API
export const projectsApi = {
  list: () => apiRequest<{ projects: unknown[] }>('/projects'),

  create: (data: { teamId: string; name: string; description?: string; gameTitle?: string }) =>
    apiRequest<{ project: unknown }>('/projects', { method: 'POST', body: data }),

  get: (id: string) =>
    apiRequest<{ project: unknown; data: unknown; activeUsers: unknown[] }>(`/projects/${id}`),

  update: (id: string, data: unknown) =>
    apiRequest<{ success: boolean }>(`/projects/${id}`, { method: 'PUT', body: data }),

  delete: (id: string) => apiRequest<{ success: boolean }>(`/projects/${id}`, { method: 'DELETE' }),

  getData: (id: string, type?: string, key?: string) => {
    const params = new URLSearchParams()
    if (type) params.append('type', type)
    if (key) params.append('key', key)
    const query = params.toString() ? `?${params.toString()}` : ''
    return apiRequest<{ data: unknown[] }>(`/projects/${id}/data${query}`)
  },

  updateData: (id: string, data: { type: string; key: string; data: unknown; version?: number }) =>
    apiRequest<{ success: boolean; id: string; version: number }>(`/projects/${id}/data`, {
      method: 'PUT',
      body: data,
    }),
}

// Realtime API
export const realtimeApi = {
  sync: (data: {
    projectId: string
    cursorPosition?: { x: number; y: number; z: number }
    selectedElement?: string
    action?: 'join' | 'leave' | 'update' | 'scene-change' | 'scene-sync' | 'request-sync'
    sceneChange?: {
      type: 'add' | 'remove' | 'update'
      object: unknown
    }
    sceneSync?: {
      objects: unknown[]
    }
  }) => apiRequest<{ success: boolean }>('/realtime/sync', { method: 'POST', body: data }),

  presence: (projectId: string) =>
    apiRequest<{ users: unknown[]; count: number }>(`/realtime/presence?projectId=${projectId}`),
}

export { ApiError }
