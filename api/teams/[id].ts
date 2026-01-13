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
 * Verifica se usuário é membro do time e retorna role
 */
async function getMemberRole(teamId: string, userId: string): Promise<string | null> {
  const { rows } = await sql`
    SELECT role FROM team_members
    WHERE team_id = ${teamId} AND user_id = ${userId}
  `
  return rows.length > 0 ? rows[0].role : null
}

/**
 * API Route: GET/PUT/DELETE /api/teams/[id]
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const auth = await verifyAuth(req)
  if (!auth) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const teamId = req.query.id as string
  if (!teamId) {
    return res.status(400).json({ error: 'Team ID is required' })
  }

  // Verificar se usuário é membro
  const role = await getMemberRole(teamId, auth.userId)
  if (!role) {
    return res.status(403).json({ error: 'Not a member of this team' })
  }

  if (req.method === 'GET') {
    // Obter detalhes do time
    try {
      const { rows: teamRows } = await sql`
        SELECT
          t.id,
          t.name,
          t.description,
          t.avatar_url,
          t.invite_code,
          t.owner_id,
          t.created_at
        FROM teams t
        WHERE t.id = ${teamId}
      `

      if (teamRows.length === 0) {
        return res.status(404).json({ error: 'Team not found' })
      }

      const team = teamRows[0]

      // Buscar membros
      const { rows: members } = await sql`
        SELECT
          u.id,
          u.name,
          u.email,
          u.avatar_url,
          tm.role,
          tm.joined_at
        FROM team_members tm
        JOIN users u ON tm.user_id = u.id
        WHERE tm.team_id = ${teamId}
        ORDER BY tm.joined_at ASC
      `

      // Buscar projetos
      const { rows: projects } = await sql`
        SELECT id, name, description, thumbnail_url, created_at
        FROM projects
        WHERE team_id = ${teamId}
        ORDER BY updated_at DESC
      `

      return res.status(200).json({
        team: {
          id: team.id,
          name: team.name,
          description: team.description,
          avatarUrl: team.avatar_url,
          inviteCode: role === 'owner' || role === 'admin' ? team.invite_code : null,
          ownerId: team.owner_id,
          createdAt: team.created_at,
          currentUserRole: role,
        },
        members: members.map((m) => ({
          id: m.id,
          name: m.name,
          email: m.email,
          avatarUrl: m.avatar_url,
          role: m.role,
          joinedAt: m.joined_at,
        })),
        projects: projects.map((p) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          thumbnailUrl: p.thumbnail_url,
          createdAt: p.created_at,
        })),
      })
    } catch (error) {
      console.error('Get team error:', error)
      return res.status(500).json({ error: 'Failed to get team' })
    }
  }

  if (req.method === 'PUT') {
    // Atualizar time (apenas owner/admin)
    if (role !== 'owner' && role !== 'admin') {
      return res.status(403).json({ error: 'Only owners and admins can update team' })
    }

    try {
      const { name, description, avatarUrl } = req.body

      if (name && name.trim().length < 2) {
        return res.status(400).json({ error: 'Team name must be at least 2 characters' })
      }

      await sql`
        UPDATE teams
        SET
          name = COALESCE(${name?.trim() || null}, name),
          description = COALESCE(${description}, description),
          avatar_url = COALESCE(${avatarUrl}, avatar_url),
          updated_at = NOW()
        WHERE id = ${teamId}
      `

      return res.status(200).json({ success: true })
    } catch (error) {
      console.error('Update team error:', error)
      return res.status(500).json({ error: 'Failed to update team' })
    }
  }

  if (req.method === 'DELETE') {
    // Deletar time (apenas owner)
    if (role !== 'owner') {
      return res.status(403).json({ error: 'Only the owner can delete the team' })
    }

    try {
      await sql`DELETE FROM teams WHERE id = ${teamId}`
      return res.status(200).json({ success: true })
    } catch (error) {
      console.error('Delete team error:', error)
      return res.status(500).json({ error: 'Failed to delete team' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
