import { sql } from '@vercel/postgres'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { jwtVerify } from 'jose'
import Pusher from 'pusher'

/**
 * Helper para verificar autenticação
 */
async function verifyAuth(req: VercelRequest): Promise<{ userId: string } | null> {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) return null

  try {
    const token = authHeader.substring(7)
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-change-me')
    const { payload } = await jwtVerify(token, secret)
    return { userId: payload.userId as string }
  } catch {
    return null
  }
}

/**
 * Verifica acesso ao projeto
 */
async function checkProjectAccess(projectId: string, userId: string): Promise<boolean> {
  const { rows } = await sql`
    SELECT 1
    FROM projects p
    JOIN team_members tm ON p.team_id = tm.team_id
    WHERE p.id = ${projectId} AND tm.user_id = ${userId}
  `
  return rows.length > 0
}

/**
 * Inicializa Pusher se configurado
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
 * API Route: GET/PUT /api/projects/[id]/data
 *
 * GET - Obtém dados específicos do projeto
 *   Query params: type, key (opcional)
 *
 * PUT - Atualiza dados do projeto
 *   Body: { type, key, data, version? }
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const auth = await verifyAuth(req)
  if (!auth) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const projectId = req.query.id as string
  if (!projectId) {
    return res.status(400).json({ error: 'Project ID is required' })
  }

  const hasAccess = await checkProjectAccess(projectId, auth.userId)
  if (!hasAccess) {
    return res.status(403).json({ error: 'No access to this project' })
  }

  if (req.method === 'GET') {
    try {
      const type = req.query.type as string
      const key = req.query.key as string

      let query
      if (type && key) {
        query = sql`
          SELECT id, data_type, data_key, data, version, updated_at
          FROM project_data
          WHERE project_id = ${projectId}
            AND data_type = ${type}
            AND data_key = ${key}
        `
      } else if (type) {
        query = sql`
          SELECT id, data_type, data_key, data, version, updated_at
          FROM project_data
          WHERE project_id = ${projectId}
            AND data_type = ${type}
          ORDER BY data_key
        `
      } else {
        query = sql`
          SELECT id, data_type, data_key, data, version, updated_at
          FROM project_data
          WHERE project_id = ${projectId}
          ORDER BY data_type, data_key
        `
      }

      const { rows } = await query

      return res.status(200).json({
        data: rows.map((r) => ({
          id: r.id,
          type: r.data_type,
          key: r.data_key,
          data: r.data,
          version: r.version,
          updatedAt: r.updated_at,
        })),
      })
    } catch (error) {
      console.error('Get project data error:', error)
      return res.status(500).json({ error: 'Failed to get project data' })
    }
  }

  if (req.method === 'PUT') {
    try {
      const { type, key, data, version } = req.body

      if (!type || !key || data === undefined) {
        return res.status(400).json({ error: 'type, key and data are required' })
      }

      // Verificar versão para conflitos (optimistic locking)
      if (version !== undefined) {
        const { rows: existing } = await sql`
          SELECT version FROM project_data
          WHERE project_id = ${projectId}
            AND data_type = ${type}
            AND data_key = ${key}
        `

        if (existing.length > 0 && existing[0].version > version) {
          return res.status(409).json({
            error: 'Conflict - data was modified by another user',
            currentVersion: existing[0].version,
          })
        }
      }

      // Upsert dados
      const { rows } = await sql`
        INSERT INTO project_data (project_id, data_type, data_key, data, updated_by, version)
        VALUES (${projectId}, ${type}, ${key}, ${JSON.stringify(data)}, ${auth.userId}, 1)
        ON CONFLICT (project_id, data_type, data_key)
        DO UPDATE SET
          data = ${JSON.stringify(data)},
          updated_by = ${auth.userId},
          version = project_data.version + 1,
          updated_at = NOW()
        RETURNING id, version, updated_at
      `

      // Atualizar timestamp do projeto
      await sql`UPDATE projects SET updated_at = NOW() WHERE id = ${projectId}`

      // Notificar outros usuários via Pusher
      const pusher = getPusher()
      if (pusher) {
        await pusher.trigger(`project-${projectId}`, 'data-update', {
          type,
          key,
          data,
          version: rows[0].version,
          updatedAt: rows[0].updated_at,
          updatedBy: auth.userId,
        })
      }

      return res.status(200).json({
        success: true,
        id: rows[0].id,
        version: rows[0].version,
        updatedAt: rows[0].updated_at,
      })
    } catch (error) {
      console.error('Update project data error:', error)
      return res.status(500).json({ error: 'Failed to update project data' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
