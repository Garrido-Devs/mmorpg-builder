import { sql } from '@vercel/postgres'
import type { VercelRequest, VercelResponse } from '@vercel/node'
import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'

/**
 * API Route: POST /api/migrations/run
 * Executa todas as migrations pendentes
 *
 * Headers requeridos:
 * - x-migration-secret: Chave secreta para autorizar execução
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Verificar chave secreta
  const secret = req.headers['x-migration-secret']
  if (secret !== process.env.MIGRATION_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    // Criar tabela de controle de migrations se não existir
    await sql`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `

    // Buscar migrations já executadas
    const { rows: executed } = await sql`SELECT name FROM migrations`
    const executedNames = new Set(executed.map((r) => r.name))

    // Listar arquivos de migration
    const migrationsDir = join(process.cwd(), 'api', 'migrations')
    const files = readdirSync(migrationsDir)
      .filter((f) => f.endsWith('.sql'))
      .sort()

    const results: { name: string; status: 'executed' | 'skipped' | 'error'; error?: string }[] = []

    for (const file of files) {
      if (executedNames.has(file)) {
        results.push({ name: file, status: 'skipped' })
        continue
      }

      try {
        const sqlContent = readFileSync(join(migrationsDir, file), 'utf-8')

        // Executar migration
        await sql.query(sqlContent)

        // Registrar execução
        await sql`INSERT INTO migrations (name) VALUES (${file})`

        results.push({ name: file, status: 'executed' })
      } catch (error) {
        results.push({
          name: file,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
        })
        // Parar na primeira falha
        break
      }
    }

    return res.status(200).json({
      success: true,
      results,
      summary: {
        executed: results.filter((r) => r.status === 'executed').length,
        skipped: results.filter((r) => r.status === 'skipped').length,
        errors: results.filter((r) => r.status === 'error').length,
      },
    })
  } catch (error) {
    console.error('Migration error:', error)
    return res.status(500).json({
      error: 'Failed to run migrations',
      details: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
