import { sql } from '@vercel/postgres'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { jwtVerify } from 'jose'
import { v4 as uuidv4 } from 'uuid'

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
 * Gera código de convite único
 */
function generateInviteCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

/**
 * API Route: GET/POST /api/teams
 *
 * GET - Lista times do usuário
 * POST - Cria novo time
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const auth = await verifyAuth(req)
  if (!auth) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (req.method === 'GET') {
    // Listar times do usuário
    try {
      const { rows } = await sql`
        SELECT
          t.id,
          t.name,
          t.description,
          t.avatar_url,
          t.invite_code,
          t.created_at,
          tm.role,
          (SELECT COUNT(*) FROM team_members WHERE team_id = t.id)::int as member_count,
          (SELECT COUNT(*) FROM projects WHERE team_id = t.id)::int as project_count
        FROM teams t
        JOIN team_members tm ON t.id = tm.team_id
        WHERE tm.user_id = ${auth.userId}
        ORDER BY tm.joined_at DESC
      `

      return res.status(200).json({
        teams: rows.map((t) => ({
          id: t.id,
          name: t.name,
          description: t.description,
          avatarUrl: t.avatar_url,
          inviteCode: t.invite_code,
          createdAt: t.created_at,
          role: t.role,
          memberCount: t.member_count,
          projectCount: t.project_count,
        })),
      })
    } catch (error) {
      console.error('List teams error:', error)
      return res.status(500).json({ error: 'Failed to list teams' })
    }
  }

  if (req.method === 'POST') {
    // Criar novo time
    try {
      const { name, description } = req.body

      if (!name || name.trim().length < 2) {
        return res.status(400).json({ error: 'Team name must be at least 2 characters' })
      }

      const teamId = uuidv4()
      const inviteCode = generateInviteCode()

      // Criar time
      await sql`
        INSERT INTO teams (id, name, description, owner_id, invite_code)
        VALUES (${teamId}, ${name.trim()}, ${description || null}, ${auth.userId}, ${inviteCode})
      `

      // Adicionar criador como owner
      await sql`
        INSERT INTO team_members (team_id, user_id, role)
        VALUES (${teamId}, ${auth.userId}, 'owner')
      `

      return res.status(201).json({
        team: {
          id: teamId,
          name: name.trim(),
          description: description || null,
          inviteCode,
          role: 'owner',
          memberCount: 1,
          projectCount: 0,
        },
      })
    } catch (error) {
      console.error('Create team error:', error)
      return res.status(500).json({ error: 'Failed to create team' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
