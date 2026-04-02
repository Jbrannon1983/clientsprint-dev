import express from 'express'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { existsSync } from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 8080

app.use(express.json({ limit: '10mb' }))

// Health check — Railway pings this to confirm the app is alive
app.get('/health', (req, res) => res.status(200).send('OK'))

// Anthropic API proxy
app.post('/api/claude', async (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' })
  }
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey.trim(),
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(req.body),
    })
    const data = await response.json()
    res.status(response.status).json(data)
  } catch (err) {
    console.error('Anthropic error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// Serve React app
const distPath = join(__dirname, 'dist')
if (existsSync(distPath)) {
  app.use(express.static(distPath))
  app.get(/^(?!\/api|\/health).*/, (req, res) => {
    res.sendFile(join(distPath, 'index.html'))
  })
} else {
  app.get('/', (req, res) => res.send('Build not found'))
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`ClientSprint.ai running on port ${PORT}`)
})
