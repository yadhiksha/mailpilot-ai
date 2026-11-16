import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { initDatabase, threadRepository } from './config/db.js'
import { isGeminiConfigured } from './config/gemini.js'
import { threadRouter } from './routes/threadRoutes.js'
import { aiRouter } from './routes/aiRoutes.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config()
dotenv.config({ path: path.resolve(process.cwd(), 'server/.env') })
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const app = express()
const PORT = process.env.PORT || 5000

// Middlewares
app.use(cors())
app.use(express.json())

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    geminiConfigured: isGeminiConfigured(),
    databaseStorage: threadRepository.isUsingMongo() ? 'mongodb' : 'in-memory-temporary',
  })
})

// Mount API routes
app.use('/api/threads', threadRouter)
app.use('/api/ai', aiRouter)

// Serve compiled React frontend in production if client/dist exists
const clientDistPath = path.resolve(__dirname, '../../client/dist')
const altClientDistPath = path.resolve(process.cwd(), 'client/dist')
const resolvedDist = fs.existsSync(clientDistPath)
  ? clientDistPath
  : fs.existsSync(altClientDistPath)
  ? altClientDistPath
  : null

if (resolvedDist) {
  app.use(express.static(resolvedDist))
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next()
    }
    res.sendFile(path.join(resolvedDist, 'index.html'))
  })
}

// Error Handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[Server Error]', err)
  res.status(500).json({ success: false, error: err.message || 'Internal Server Error' })
})

// Start Server
async function startServer() {
  await initDatabase()

  app.listen(PORT, () => {
    console.log(`\n======================================================`)
    console.log(`🚀 MailPilot AI Backend Engine listening on port ${PORT}`)
    console.log(`📡 Base URL: http://127.0.0.1:${PORT}`)
    console.log(`🤖 Gemini API: ${isGeminiConfigured() ? '✓ Configured & Active' : '⚠ Missing (add GEMINI_API_KEY in server/.env)'}`)
    console.log(`💾 Database: ${threadRepository.isUsingMongo() ? '✓ MongoDB Connected' : 'ℹ In-Memory Store Active (Temporary prototype)'}`)
    console.log(`======================================================\n`)
  })
}

startServer().catch((err) => {
  console.error('Fatal Server Startup Error:', err)
  process.exit(1)
})
