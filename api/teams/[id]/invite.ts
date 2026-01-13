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
 * API Route: GET/POST /api/teams/[id]/invite
 *
 * GET - Obtém link de convite atual
 * POST - Gera novo código de convite
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

  // Verificar se usuário é owner ou admin
  const { rows } = await sql`
    SELECT role FROM team_members
    WHERE team_id = ${teamId} AND user_id = ${auth.userId}
  `

  if (rows.length === 0) {
    return res.status(403).json({ error: 'Not a member of this team' })
  }

  const role = rows[0].role
  if (role !== 'owner' && role !== 'admin') {
    return res.status(403).json({ error: 'Only owners and admins can manage invites' })
  }

  if (req.method === 'GET') {
    // Obter código atual
    try {
      const { rows: teamRows } = await sql`
        SELECT invite_code FROM teams WHERE id = ${teamId}
      `

      if (teamRows.length === 0) {
        return res.status(404).json({ error: 'Team not found' })
      }

      const baseUrl = process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3000'

      return res.status(200).json({
        inviteCode: teamRows[0].invite_code,
        inviteLink: `${baseUrl}/join/${teamRows[0].invite_code}`,
      })
    } catch (error) {
      console.error('Get invite error:', error)
      return res.status(500).json({ error: 'Failed to get invite' })
    }
  }

  if (req.method === 'POST') {
    // Gerar novo código
    try {
      const newCode = generateInviteCode()

      await sql`
        UPDATE teams
        SET invite_code = ${newCode}
        WHERE id = ${teamId}
      `

      const baseUrl = process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3000'

      return res.status(200).json({
        inviteCode: newCode,
        inviteLink: `${baseUrl}/join/${newCode}`,
      })
    } catch (error) {
      console.error('Generate invite error:', error)
      return res.status(500).json({ error: 'Failed to generate new invite' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
