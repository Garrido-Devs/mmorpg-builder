import type { VercelRequest, VercelResponse } from '@vercel/node'

/**
 * API Route: POST /api/auth/logout
 * Invalida a sessão do usuário
 *
 * Nota: Como usamos JWT stateless, o logout é feito no cliente
 * removendo o token. Esta rota existe para consistência da API
 * e pode ser usada para invalidar tokens no futuro (blacklist).
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // No futuro, podemos adicionar o token a uma blacklist no Redis/KV
  // Por enquanto, apenas retornamos sucesso

  return res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  })
}
