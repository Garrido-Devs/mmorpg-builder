import type { MapData } from '../types'
import { createEmptyMapData } from '../types'

/**
 * MapSerializer - Utilitários para salvar e carregar mapas
 *
 * O formato de mapa inclui:
 * - Metadados (nome, versão, autor)
 * - Configurações (skybox, luzes, fog)
 * - Lista de objetos com componentes
 * - Conexões entre objetos
 */

/**
 * Converte dados do mapa para string JSON
 */
export function serializeMap(data: MapData): string {
  // Atualiza timestamp
  const dataToSave = {
    ...data,
    updatedAt: new Date().toISOString(),
  }

  return JSON.stringify(dataToSave, null, 2)
}

/**
 * Converte string JSON para dados do mapa
 */
export function deserializeMap(json: string): MapData {
  const data = JSON.parse(json)

  // Validação básica
  if (!data.name || !data.version) {
    throw new Error('Formato de mapa inválido: falta nome ou versão')
  }

  // Garante que objects é um array
  if (!Array.isArray(data.objects)) {
    data.objects = []
  }

  // Garante que connections existe
  if (!Array.isArray(data.connections)) {
    data.connections = []
  }

  // Garante que settings existe
  if (!data.settings) {
    data.settings = createEmptyMapData().settings
  }

  return data as MapData
}

/**
 * Baixa os dados do mapa como arquivo JSON
 */
export function downloadMap(data: MapData, filename = 'map.json'): void {
  const json = serializeMap(data)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}

/**
 * Carrega mapa a partir de arquivo selecionado pelo usuário
 */
export function loadMapFromFile(): Promise<MapData> {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'

    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0]
      if (!file) {
        reject(new Error('Nenhum arquivo selecionado'))
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const json = e.target?.result as string
          const data = deserializeMap(json)
          resolve(data)
        } catch (error) {
          reject(error)
        }
      }

      reader.onerror = () => reject(new Error('Erro ao ler arquivo'))
      reader.readAsText(file)
    }

    input.click()
  })
}

/**
 * Salva mapa no localStorage
 */
export function saveMapToStorage(key: string, data: MapData): void {
  const json = serializeMap(data)
  localStorage.setItem(`mmorpg_map_${key}`, json)
}

/**
 * Carrega mapa do localStorage
 */
export function loadMapFromStorage(key: string): MapData | null {
  const json = localStorage.getItem(`mmorpg_map_${key}`)
  if (!json) return null

  try {
    return deserializeMap(json)
  } catch {
    return null
  }
}

/**
 * Lista mapas salvos no localStorage
 */
export function listSavedMaps(): string[] {
  const maps: string[] = []

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith('mmorpg_map_')) {
      maps.push(key.replace('mmorpg_map_', ''))
    }
  }

  return maps
}

/**
 * Remove mapa do localStorage
 */
export function deleteMapFromStorage(key: string): void {
  localStorage.removeItem(`mmorpg_map_${key}`)
}

/**
 * Exporta mapa para formato compacto (para produção)
 */
export function exportMapCompact(data: MapData): string {
  // Remove campos desnecessários para economizar espaço
  const compactData = {
    ...data,
    objects: data.objects.map(obj => ({
      id: obj.id,
      assetId: obj.assetId,
      transform: obj.transform,
      components: obj.components.filter(c => c.enabled),
    })),
  }

  return JSON.stringify(compactData)
}

/**
 * Valida se um mapa está correto
 */
export function validateMap(data: MapData): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data.id) errors.push('Mapa não tem ID')
  if (!data.name) errors.push('Mapa não tem nome')
  if (!data.version) errors.push('Mapa não tem versão')

  // Verifica objetos
  const ids = new Set<string>()
  data.objects.forEach((obj, index) => {
    if (!obj.id) {
      errors.push(`Objeto ${index} não tem ID`)
    } else if (ids.has(obj.id)) {
      errors.push(`ID duplicado: ${obj.id}`)
    } else {
      ids.add(obj.id)
    }

    if (!obj.assetId) {
      errors.push(`Objeto ${obj.id || index} não tem assetId`)
    }
  })

  // Verifica conexões
  data.connections.forEach((conn, index) => {
    if (!ids.has(conn.from)) {
      errors.push(`Conexão ${index}: objeto 'from' não existe: ${conn.from}`)
    }
    if (!ids.has(conn.to)) {
      errors.push(`Conexão ${index}: objeto 'to' não existe: ${conn.to}`)
    }
  })

  return {
    valid: errors.length === 0,
    errors,
  }
}
