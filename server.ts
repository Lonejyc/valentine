import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/bun'
import { Database } from 'bun:sqlite'

const app = new Hono()
const db = new Database('valentine.sqlite')

// Initialize database
db.run(`
  CREATE TABLE IF NOT EXISTS links (
    id TEXT PRIMARY KEY,
    question TEXT,
    answer TEXT
  )
`)

// Middleware
app.use('/api/*', cors())

// Helper to generate random ID
const generateId = (length = 6) => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Routes
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

app.use('/*', serveStatic({ root: './dist' }))



app.get('*', async (c) => {
  const file = Bun.file('./dist/index.html')
  if (await file.exists()) {
    return c.html(await file.text())
  }
})

export default {
  port: 3000,
  fetch: app.fetch,
}