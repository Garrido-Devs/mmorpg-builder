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
 * API Route: GET/POST /api/teams/join/[code]
 *
 * GET - Obtém informações do time pelo código de convite (pré-visualização)
 * POST - Entra no time usando o código
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const inviteCode = req.query.code as string
  if (!inviteCode) {
    return res.status(400).json({ error: 'Invite code is required' })
  }

  if (req.method === 'GET') {
    // Pré-visualizar time (não requer auth)
    try {
      const { rows } = await sql`
        SELECT
          t.id,
          t.name,
          t.description,
          t.avatar_url,
          (SELECT COUNT(*) FROM team_members WHERE team_id = t.id)::int as member_count,
          (SELECT name FROM users WHERE id = t.owner_id) as owner_name
        FROM teams t
        WHERE t.invite_code = ${inviteCode.toUpperCase()}
      `

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Invalid invite code' })
      }

      const team = rows[0]

      return res.status(200).json({
        team: {
          id: team.id,
          name: team.name,
          description: team.description,
          avatarUrl: team.avatar_url,
          memberCount: team.member_count,
          ownerName: team.owner_name,
        },
      })
    } catch (error) {
      console.error('Preview team error:', error)
      return res.status(500).json({ error: 'Failed to get team info' })
    }
  }

  if (req.method === 'POST') {
    // Entrar no time (requer auth)
    const auth = await verifyAuth(req)
    if (!auth) {
      return res.status(401).json({ error: 'Unauthorized - please login first' })
    }

    try {
      // Buscar time pelo código
      const { rows: teamRows } = await sql`
        SELECT id, name FROM teams
        WHERE invite_code = ${inviteCode.toUpperCase()}
      `

      if (teamRows.length === 0) {
        return res.status(404).json({ error: 'Invalid invite code' })
      }

      const team = teamRows[0]

      // Verificar se já é membro
      const { rows: existing } = await sql`
        SELECT id FROM team_members
        WHERE team_id = ${team.id} AND user_id = ${auth.userId}
      `

      if (existing.length > 0) {
        return res.status(409).json({ error: 'Already a member of this team' })
      }

      // Adicionar como membro
      await sql`
        INSERT INTO team_members (team_id, user_id, role)
        VALUES (${team.id}, ${auth.userId}, 'member')
      `

      return res.status(200).json({
        success: true,
        team: {
          id: team.id,
          name: team.name,
        },
        message: `Successfully joined ${team.name}`,
      })
    } catch (error) {
      console.error('Join team error:', error)
      return res.status(500).json({ error: 'Failed to join team' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
