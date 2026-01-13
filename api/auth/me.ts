import { sql } from '@vercel/postgres'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { jwtVerify } from 'jose'

/**
 * API Route: GET /api/auth/me
 * Retorna dados do usuário autenticado
 *
 * Headers:
 * - Authorization: Bearer <token>
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Extrair token do header
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const token = authHeader.substring(7)

    // Verificar JWT
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-change-me')
    const { payload } = await jwtVerify(token, secret)

    const userId = payload.userId as string

    // Buscar dados atualizados do usuário
    const { rows } = await sql`
      SELECT id, email, name, avatar_url, created_at
      FROM users
      WHERE id = ${userId}
    `

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }

    const user = rows[0]

    // Buscar times do usuário
    const { rows: teams } = await sql`
      SELECT t.id, t.name, t.avatar_url, tm.role
      FROM teams t
      JOIN team_members tm ON t.id = tm.team_id
      WHERE tm.user_id = ${userId}
      ORDER BY tm.joined_at DESC
    `

    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatar_url,
        createdAt: user.created_at,
      },
      teams: teams.map((t) => ({
        id: t.id,
        name: t.name,
        avatarUrl: t.avatar_url,
        role: t.role,
      })),
    })
  } catch (error) {
    if ((error as Error).name === 'JWTExpired') {
      return res.status(401).json({ error: 'Token expired' })
    }

    console.error('Auth error:', error)
    return res.status(500).json({
      error: 'Failed to get user',
      details: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
