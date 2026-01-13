import { useEffect, useState, useCallback } from 'react'
import * as THREE from 'three'
import { getEngine } from '../engine'
import type { GameMode, MapData } from '../types'

/**
 * useGameEngine - Hook para conectar React ao Engine
 *
 * Responsabilidades:
 * - Escutar eventos do engine
 * - Expor estado reativo para componentes React
 * - Fornecer métodos para interagir com o engine
 *
 * Decisão: Hook centraliza toda comunicação React <-> Engine
 * Evita que componentes acessem Engine diretamente
 */
export function useGameEngine() {
  const [mode, setMode] = useState<GameMode>('play')
  const [selectedObject, setSelectedObject] = useState<THREE.Object3D | null>(null)
  const [mapData, setMapData] = useState<MapData | null>(null)

  // Registra listeners do engine
  useEffect(() => {
    const engine = getEngine()

    const unsubMode = engine.onModeChange(setMode)
    const unsubSelect = engine.onObjectSelected(setSelectedObject)
    const unsubMap = engine.onMapUpdate(setMapData)

    // Sincroniza estado inicial
    setMode(engine.getMode())

    return () => {
      unsubMode()
      unsubSelect()
      unsubMap()
    }
  }, [])

  // Método para mudar modo
  const changeMode = useCallback((newMode: GameMode) => {
    const engine = getEngine()
    engine.setMode(newMode)
  }, [])

  return {
    mode,
    selectedObject,
    mapData,
    changeMode,
  }
}
