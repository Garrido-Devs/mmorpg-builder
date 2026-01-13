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
 * Verifica se usuário tem acesso ao projeto
 */
async function checkProjectAccess(projectId: string, userId: string): Promise<{ hasAccess: boolean; role: string | null }> {
  const { rows } = await sql`
    SELECT tm.role
    FROM projects p
    JOIN team_members tm ON p.team_id = tm.team_id
    WHERE p.id = ${projectId} AND tm.user_id = ${userId}
  `
  return {
    hasAccess: rows.length > 0,
    role: rows.length > 0 ? rows[0].role : null,
  }
}

/**
 * API Route: GET/PUT/DELETE /api/projects/[id]
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

  const { hasAccess, role } = await checkProjectAccess(projectId, auth.userId)
  if (!hasAccess) {
    return res.status(403).json({ error: 'No access to this project' })
  }

  if (req.method === 'GET') {
    // Obter detalhes do projeto
    try {
      const { rows: projectRows } = await sql`
        SELECT
          p.*,
          t.name as team_name
        FROM projects p
        JOIN teams t ON p.team_id = t.id
        WHERE p.id = ${projectId}
      `

      if (projectRows.length === 0) {
        return res.status(404).json({ error: 'Project not found' })
      }

      const project = projectRows[0]

      // Buscar todos os dados do projeto
      const { rows: dataRows } = await sql`
        SELECT
          id,
          data_type,
          data_key,
          data,
          version,
          updated_at
        FROM project_data
        WHERE project_id = ${projectId}
        ORDER BY data_type, data_key
      `

      // Organizar dados por tipo
      const data: Record<string, Record<string, unknown>> = {}
      for (const row of dataRows) {
        if (!data[row.data_type]) {
          data[row.data_type] = {}
        }
        data[row.data_type][row.data_key] = {
          id: row.id,
          data: row.data,
          version: row.version,
          updatedAt: row.updated_at,
        }
      }

      // Buscar usuários ativos no projeto
      const { rows: activeUsers } = await sql`
        SELECT
          s.id,
          s.cursor_position,
          s.selected_element,
          u.name,
          u.avatar_url
        FROM active_sessions s
        JOIN users u ON s.user_id = u.id
        WHERE s.project_id = ${projectId}
          AND s.is_active = true
          AND s.last_ping > NOW() - INTERVAL '5 minutes'
      `

      return res.status(200).json({
        project: {
          id: project.id,
          name: project.name,
          description: project.description,
          thumbnailUrl: project.thumbnail_url,
          gameTitle: project.game_title,
          gameSubtitle: project.game_subtitle,
          gameVersion: project.game_version,
          gameGenre: project.game_genre,
          isPublic: project.is_public,
          isPublished: project.is_published,
          createdAt: project.created_at,
          updatedAt: project.updated_at,
          teamId: project.team_id,
          teamName: project.team_name,
          currentUserRole: role,
        },
        data,
        activeUsers: activeUsers.map((u) => ({
          id: u.id,
          name: u.name,
          avatarUrl: u.avatar_url,
          cursorPosition: u.cursor_position,
          selectedElement: u.selected_element,
        })),
      })
    } catch (error) {
      console.error('Get project error:', error)
      return res.status(500).json({ error: 'Failed to get project' })
    }
  }

  if (req.method === 'PUT') {
    // Atualizar projeto
    try {
      const {
        name,
        description,
        thumbnailUrl,
        gameTitle,
        gameSubtitle,
        gameVersion,
        gameGenre,
        isPublic,
        isPublished,
      } = req.body

      await sql`
        UPDATE projects
        SET
          name = COALESCE(${name?.trim() || null}, name),
          description = COALESCE(${description}, description),
          thumbnail_url = COALESCE(${thumbnailUrl}, thumbnail_url),
          game_title = COALESCE(${gameTitle}, game_title),
          game_subtitle = COALESCE(${gameSubtitle}, game_subtitle),
          game_version = COALESCE(${gameVersion}, game_version),
          game_genre = COALESCE(${gameGenre ? JSON.stringify(gameGenre) : null}::text[], game_genre),
          is_public = COALESCE(${isPublic}, is_public),
          is_published = COALESCE(${isPublished}, is_published),
          updated_at = NOW()
        WHERE id = ${projectId}
      `

      return res.status(200).json({ success: true })
    } catch (error) {
      console.error('Update project error:', error)
      return res.status(500).json({ error: 'Failed to update project' })
    }
  }

  if (req.method === 'DELETE') {
    // Deletar projeto (apenas owner/admin)
    if (role !== 'owner' && role !== 'admin') {
      return res.status(403).json({ error: 'Only owners and admins can delete projects' })
    }

    try {
      await sql`DELETE FROM projects WHERE id = ${projectId}`
      return res.status(200).json({ success: true })
    } catch (error) {
      console.error('Delete project error:', error)
      return res.status(500).json({ error: 'Failed to delete project' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
