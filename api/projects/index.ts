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
 * API Route: GET/POST /api/projects
 *
 * GET - Lista projetos do usuário (de todos os seus times)
 * POST - Cria novo projeto em um time
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const auth = await verifyAuth(req)
  if (!auth) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (req.method === 'GET') {
    // Listar projetos
    try {
      const { rows } = await sql`
        SELECT
          p.id,
          p.name,
          p.description,
          p.thumbnail_url,
          p.game_title,
          p.game_subtitle,
          p.game_version,
          p.is_public,
          p.is_published,
          p.created_at,
          p.updated_at,
          t.id as team_id,
          t.name as team_name,
          (SELECT COUNT(*) FROM project_data WHERE project_id = p.id)::int as data_count
        FROM projects p
        JOIN teams t ON p.team_id = t.id
        JOIN team_members tm ON t.id = tm.team_id
        WHERE tm.user_id = ${auth.userId}
        ORDER BY p.updated_at DESC
      `

      return res.status(200).json({
        projects: rows.map((p) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          thumbnailUrl: p.thumbnail_url,
          gameTitle: p.game_title,
          gameSubtitle: p.game_subtitle,
          gameVersion: p.game_version,
          isPublic: p.is_public,
          isPublished: p.is_published,
          createdAt: p.created_at,
          updatedAt: p.updated_at,
          teamId: p.team_id,
          teamName: p.team_name,
          dataCount: p.data_count,
        })),
      })
    } catch (error) {
      console.error('List projects error:', error)
      return res.status(500).json({ error: 'Failed to list projects' })
    }
  }

  if (req.method === 'POST') {
    // Criar projeto
    try {
      const { teamId, name, description, gameTitle } = req.body

      if (!teamId) {
        return res.status(400).json({ error: 'Team ID is required' })
      }

      if (!name || name.trim().length < 2) {
        return res.status(400).json({ error: 'Project name must be at least 2 characters' })
      }

      // Verificar se usuário é membro do time
      const { rows: memberRows } = await sql`
        SELECT role FROM team_members
        WHERE team_id = ${teamId} AND user_id = ${auth.userId}
      `

      if (memberRows.length === 0) {
        return res.status(403).json({ error: 'Not a member of this team' })
      }

      const projectId = uuidv4()

      // Criar projeto
      await sql`
        INSERT INTO projects (id, team_id, name, description, game_title)
        VALUES (
          ${projectId},
          ${teamId},
          ${name.trim()},
          ${description || null},
          ${gameTitle || name.trim()}
        )
      `

      // Criar dados iniciais do projeto
      const initialData = [
        {
          type: 'config',
          key: 'game',
          data: {
            title: gameTitle || name.trim(),
            subtitle: '',
            version: '0.1.0',
            genre: [],
            author: '',
          },
        },
        {
          type: 'screen',
          key: 'intro',
          data: {
            enabled: true,
            duration: 3,
            background: '#000000',
            logo: null,
          },
        },
        {
          type: 'screen',
          key: 'loading',
          data: {
            enabled: true,
            background: '#1a1a2e',
            showProgress: true,
            tips: [],
          },
        },
        {
          type: 'screen',
          key: 'main_menu',
          data: {
            background: null,
            music: null,
            buttons: [
              { id: 'play', label: 'Jogar', action: 'start_game' },
              { id: 'settings', label: 'Configurações', action: 'open_settings' },
            ],
          },
        },
        {
          type: 'map',
          key: 'main',
          data: {
            name: 'Mapa Principal',
            width: 100,
            height: 100,
            terrain: 'grass',
            entities: [],
          },
        },
      ]

      for (const item of initialData) {
        await sql`
          INSERT INTO project_data (project_id, data_type, data_key, data, updated_by)
          VALUES (${projectId}, ${item.type}, ${item.key}, ${JSON.stringify(item.data)}, ${auth.userId})
        `
      }

      return res.status(201).json({
        project: {
          id: projectId,
          name: name.trim(),
          description: description || null,
          gameTitle: gameTitle || name.trim(),
          teamId,
        },
      })
    } catch (error) {
      console.error('Create project error:', error)
      return res.status(500).json({ error: 'Failed to create project' })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
