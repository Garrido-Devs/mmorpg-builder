// Script para rodar migrations no Vercel Postgres
// Execute com: node scripts/run-migrations.js

import { sql } from '@vercel/postgres'
import { readFileSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { config } from 'dotenv'

// Carregar .env.local
config({ path: '.env.local' })

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function runMigrations() {
  console.log('Iniciando migrations...\n')

  const migrationsDir = join(__dirname, '..', 'api', 'migrations')
  const files = readdirSync(migrationsDir)
    .filter((f) => f.endsWith('.sql'))
    .sort()

  for (const file of files) {
    console.log(`Executando: ${file}`)
    try {
      const sqlContent = readFileSync(join(migrationsDir, file), 'utf-8')
      await sql.query(sqlContent)
      console.log(`  OK\n`)
    } catch (error) {
      console.error(`  ERRO: ${error.message}\n`)
      // Continua mesmo com erro (tabela pode já existir)
    }
  }

  console.log('Migrations concluídas!')
}

runMigrations()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Erro fatal:', err)
    process.exit(1)
  })
