import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { Database } from 'bun:sqlite'

const app = new Hono()
const db = new Database('valentine.sqlite')

db.query(`
  CREATE TABLE IF NOT EXISTS links (
    id TEXT PRIMARY KEY,
    question TEXT,
    answer TEXT
  )
`).run();

app.use('/*', cors())

app.post('/api/create', async (c) => {
  const body = await c.req.json()
  const { question, answer } = body

  const id = Math.random().toString(36).substring(2, 8);

  db.query('INSERT INTO links (id, question, answer) VALUES (?, ?, ?)').run(id, question, answer);

  return c.json({ id, success: true })
})

app.get('/api/get/:id', (c) => {
  const id = c.req.param('id')
  const entry = db.query('SELECT * FROM links WHERE id = ?').get(id) as any;

  if (!entry) {
    return c.json({ error: "Introuvable" }, 404)
  }

  return c.json(entry)
})

console.log("Server running on http://localhost:3000")

export default {
  port: 3000,
  fetch: app.fetch,
}