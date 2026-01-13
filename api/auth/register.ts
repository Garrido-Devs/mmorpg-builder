import { sql } from '@vercel/postgres'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import bcrypt from 'bcryptjs'
import { SignJWT } from 'jose'
import { v4 as uuidv4 } from 'uuid'

/**
 * API Route: POST /api/auth/register
 * Cria uma nova conta de usuário
 *
 * Body:
 * - email: string
 * - password: string
 * - name: string
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email, password, name } = req.body

    // Validações
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password and name are required' })
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' })
    }

    if (!email.includes('@')) {
      return res.status(400).json({ error: 'Invalid email format' })
    }

    // Verificar se email já existe
    const { rows: existing } = await sql`
      SELECT id FROM users WHERE email = ${email.toLowerCase()}
    `

    if (existing.length > 0) {
      return res.status(409).json({ error: 'Email already registered' })
    }

    // Hash da senha
    const passwordHash = await bcrypt.hash(password, 12)

    // Criar usuário
    const userId = uuidv4()
    await sql`
      INSERT INTO users (id, email, password_hash, name)
      VALUES (${userId}, ${email.toLowerCase()}, ${passwordHash}, ${name})
    `

    // Gerar JWT
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-change-me')
    const token = await new SignJWT({
      userId,
      email: email.toLowerCase(),
      name,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(secret)

    // Retornar usuário e token
    return res.status(201).json({
      user: {
        id: userId,
        email: email.toLowerCase(),
        name,
        avatarUrl: null,
      },
      token,
    })
  } catch (error) {
    console.error('Register error:', error)
    return res.status(500).json({
      error: 'Failed to create account',
      details: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
