import { sql } from '@vercel/postgres'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import bcrypt from 'bcryptjs'
import { SignJWT } from 'jose'

/**
 * API Route: POST /api/auth/login
 * Autentica um usuário existente
 *
 * Body:
 * - email: string
 * - password: string
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email, password } = req.body

    // Validações
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    // Buscar usuário
    const { rows } = await sql`
      SELECT id, email, password_hash, name, avatar_url
      FROM users
      WHERE email = ${email.toLowerCase()}
    `

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const user = rows[0]

    // Verificar senha
    const isValid = await bcrypt.compare(password, user.password_hash)
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    // Gerar JWT
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-change-me')
    const token = await new SignJWT({
      userId: user.id,
      email: user.email,
      name: user.name,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(secret)

    // Atualizar último login
    await sql`UPDATE users SET updated_at = NOW() WHERE id = ${user.id}`

    // Retornar usuário e token
    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatar_url,
      },
      token,
    })
  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({
      error: 'Failed to login',
      details: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
