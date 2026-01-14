import { sql } from '@vercel/postgres'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { jwtVerify } from 'jose'
import Pusher from 'pusher'

/**
 * Helper para verificar autenticação
 */
async function verifyAuth(req: VercelRequest): Promise<{ userId: string; name: string } | null> {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) return null

  try {
    const token = authHeader.substring(7)
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-change-me')
    const { payload } = await jwtVerify(token, secret)
    return {
      userId: payload.userId as string,
      name: payload.name as string,
    }
  } catch {
    return null
  }
}

/**
 * Inicializa Pusher
 */
function getPusher(): Pusher | null {
  if (!process.env.PUSHER_APP_ID || !process.env.PUSHER_KEY || !process.env.PUSHER_SECRET) {
    return null
  }

  return new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.PUSHER_CLUSTER || 'us2',
    useTLS: true,
  })
}

/**
 * API Route: POST /api/realtime/sync
 *
 * Sincroniza estado do usuário (cursor, seleção) e notifica outros
 *
 * Body:
 * - projectId: string
 * - cursorPosition?: { x, y, z }
 * - selectedElement?: string
 * - action?: 'join' | 'leave' | 'update' | 'scene-change'
 * - sceneChange?: { type: 'add' | 'remove' | 'update', object: MapObjectData }
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const auth = await verifyAuth(req)
  if (!auth) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const { projectId, cursorPosition, selectedElement, action = 'update', sceneChange } = req.body

    if (!projectId) {
      return res.status(400).json({ error: 'Project ID is required' })
    }

    // Verificar acesso ao projeto
    const { rows: access } = await sql`
      SELECT 1
      FROM projects p
      JOIN team_members tm ON p.team_id = tm.team_id
      WHERE p.id = ${projectId} AND tm.user_id = ${auth.userId}
    `

    if (access.length === 0) {
      return res.status(403).json({ error: 'No access to this project' })
    }

    const pusher = getPusher()

    if (action === 'join') {
      // Registrar sessão ativa
      await sql`
        INSERT INTO active_sessions (user_id, project_id, cursor_position, selected_element, is_active, last_ping)
        VALUES (
          ${auth.userId},
          ${projectId},
          ${cursorPosition ? JSON.stringify(cursorPosition) : '{"x":0,"y":0,"z":0}'},
          ${selectedElement || null},
          true,
          NOW()
        )
        ON CONFLICT (user_id, project_id)
        DO UPDATE SET
          is_active = true,
          cursor_position = COALESCE(${cursorPosition ? JSON.stringify(cursorPosition) : null}, active_sessions.cursor_position),
          selected_element = ${selectedElement || null},
          last_ping = NOW()
      `

      // Buscar informações do usuário
      const { rows: userInfo } = await sql`
        SELECT name, avatar_url FROM users WHERE id = ${auth.userId}
      `

      // Notificar outros usuários
      if (pusher) {
        await pusher.trigger(`project-${projectId}`, 'user-joined', {
          userId: auth.userId,
          name: userInfo[0]?.name || auth.name,
          avatarUrl: userInfo[0]?.avatar_url,
          cursorPosition,
        })
      }

      return res.status(200).json({ success: true, action: 'joined' })
    }

    if (action === 'leave') {
      // Marcar sessão como inativa
      await sql`
        UPDATE active_sessions
        SET is_active = false
        WHERE user_id = ${auth.userId} AND project_id = ${projectId}
      `

      // Notificar outros usuários
      if (pusher) {
        await pusher.trigger(`project-${projectId}`, 'user-left', {
          userId: auth.userId,
        })
      }

      return res.status(200).json({ success: true, action: 'left' })
    }

    // Scene-change - notificar mudanças na cena (add/remove/update objetos)
    if (action === 'scene-change' && sceneChange) {
      // Notificar outros usuários
      if (pusher) {
        await pusher.trigger(`project-${projectId}`, 'scene-change', {
          userId: auth.userId,
          changeType: sceneChange.type,
          object: sceneChange.object,
          timestamp: new Date().toISOString(),
        })
      }

      return res.status(200).json({ success: true, action: 'scene-change' })
    }

    // Scene-sync - sincronizar cena completa (quando novo jogador entra)
    if (action === 'scene-sync') {
      const { sceneSync } = req.body
      if (pusher && sceneSync?.objects) {
        await pusher.trigger(`project-${projectId}`, 'scene-sync', {
          userId: auth.userId,
          objects: sceneSync.objects,
          timestamp: new Date().toISOString(),
        })
      }

      return res.status(200).json({ success: true, action: 'scene-sync' })
    }

    // Request-sync - pedir sincronização da cena
    if (action === 'request-sync') {
      if (pusher) {
        await pusher.trigger(`project-${projectId}`, 'request-sync', {
          userId: auth.userId,
        })
      }

      return res.status(200).json({ success: true, action: 'request-sync' })
    }

    // Update - atualizar posição/seleção
    await sql`
      UPDATE active_sessions
      SET
        cursor_position = COALESCE(${cursorPosition ? JSON.stringify(cursorPosition) : null}, cursor_position),
        selected_element = COALESCE(${selectedElement}, selected_element),
        last_ping = NOW()
      WHERE user_id = ${auth.userId} AND project_id = ${projectId}
    `

    // Notificar outros usuários
    if (pusher) {
      await pusher.trigger(`project-${projectId}`, 'user-update', {
        userId: auth.userId,
        cursorPosition,
        selectedElement,
      })
    }

    return res.status(200).json({ success: true, action: 'updated' })
  } catch (error) {
    console.error('Sync error:', error)
    return res.status(500).json({ error: 'Failed to sync' })
  }
}
