import { sql } from '@vercel/postgres'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { jwtVerify } from 'jose'

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
 * API Route: GET /api/realtime/presence
 *
 * Retorna usuários ativos em um projeto
 *
 * Query:
 * - projectId: string
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const auth = await verifyAuth(req)
  if (!auth) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const projectId = req.query.projectId as string

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

    // Limpar sessões inativas (mais de 5 minutos sem ping)
    await sql`
      UPDATE active_sessions
      SET is_active = false
      WHERE project_id = ${projectId}
        AND is_active = true
        AND last_ping < NOW() - INTERVAL '5 minutes'
    `

    // Buscar usuários ativos
    const { rows } = await sql`
      SELECT
        s.user_id,
        s.cursor_position,
        s.selected_element,
        s.last_ping,
        u.name,
        u.avatar_url
      FROM active_sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.project_id = ${projectId}
        AND s.is_active = true
        AND s.last_ping > NOW() - INTERVAL '5 minutes'
      ORDER BY s.last_ping DESC
    `

    return res.status(200).json({
      users: rows.map((u) => ({
        id: u.user_id,
        name: u.name,
        avatarUrl: u.avatar_url,
        cursorPosition: u.cursor_position,
        selectedElement: u.selected_element,
        lastPing: u.last_ping,
        isCurrentUser: u.user_id === auth.userId,
      })),
      count: rows.length,
    })
  } catch (error) {
    console.error('Presence error:', error)
    return res.status(500).json({ error: 'Failed to get presence' })
  }
}
