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
 * API Route: POST /api/realtime/auth
 *
 * Autentica conexão Pusher para canais privados/presence
 *
 * Body (form-urlencoded by Pusher client):
 * - socket_id: string
 * - channel_name: string
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const auth = await verifyAuth(req)
  if (!auth) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const pusher = getPusher()
  if (!pusher) {
    return res.status(500).json({ error: 'Pusher not configured' })
  }

  try {
    const { socket_id, channel_name } = req.body

    if (!socket_id || !channel_name) {
      return res.status(400).json({ error: 'socket_id and channel_name are required' })
    }

    // Para canais de presence, incluir dados do usuário
    if (channel_name.startsWith('presence-')) {
      const presenceData = {
        user_id: auth.userId,
        user_info: {
          name: auth.name,
        },
      }

      const authResponse = pusher.authorizeChannel(socket_id, channel_name, presenceData)
      return res.status(200).json(authResponse)
    }

    // Para canais privados, apenas autorizar
    if (channel_name.startsWith('private-') || channel_name.startsWith('project-')) {
      const authResponse = pusher.authorizeChannel(socket_id, channel_name)
      return res.status(200).json(authResponse)
    }

    return res.status(403).json({ error: 'Unauthorized channel' })
  } catch (error) {
    console.error('Pusher auth error:', error)
    return res.status(500).json({ error: 'Failed to authorize' })
  }
}
