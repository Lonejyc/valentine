import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import Database from 'better-sqlite3'
import fs from 'node:fs'

const app = new Hono()
const db = new Database('valentine.sqlite')

// Initialisation de la base de données
db.exec(`
  CREATE TABLE IF NOT EXISTS links (
    id TEXT PRIMARY KEY,
    question TEXT,
    answer TEXT
  )
`)

// Middleware de log
app.use('*', async (c, next) => {
  console.log(`[${c.req.method}] ${c.req.url}`)
  await next()
})

// Configuration CORS
app.use('/api/*', cors({
  origin: ['https://valentine.jocelynmarcilloux.com', 'http://localhost:5173'],
  allowMethods: ['POST', 'GET', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
  credentials: true,
}))

// Helper to generate random ID
const generateId = (length = 6) => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Routes API
app.post('/api/create', async (c) => {
  try {
    const { question, answer } = await c.req.json()
    
    if (!question || !answer) {
      return c.json({ error: 'Question and answer are required' }, 400)
    }

    const id = generateId()
    const stmt = db.prepare('INSERT INTO links (id, question, answer) VALUES (?, ?, ?)')
    stmt.run(id, String(question), String(answer))

    return c.json({ id })
  } catch (error) {
    console.error(error)
    return c.json({ error: 'Internal Server Error' }, 500)
  }
})

app.get('/api/get/:id', (c) => {
  const id = c.req.param('id')
  const stmt = db.prepare('SELECT question, answer FROM links WHERE id = ?')
  const result = stmt.get(id) as { question: string, answer: string } | null

  if (!result) {
    return c.json({ error: 'Not found' }, 404)
  }

  return c.json(result)
})

// Fallback API
app.all('/api/*', (c) => {
  return c.json({ error: 'API route not found' }, 404)
})

// Fichiers statiques
app.get('/*', serveStatic({ root: './dist' }))

// Fallback SPA
app.get('*', (c) => {
  try {
    const html = fs.readFileSync('./dist/index.html', 'utf-8')
    return c.html(html)
  } catch (error) {
    return c.text('Not found', 404)
  }
})

// Lancement du serveur Node
const port = Number(process.env.PORT) || 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})