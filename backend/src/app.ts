import express from 'express'
import cors from 'cors'
import { agentRouter } from './routes/agent.routes.js'
import { sessionRouter } from './routes/session.routes.js'
import { uploadRouter } from './routes/upload.routes.js'
import { knowledgeRouter } from './routes/knowledge.routes.js'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/agent', agentRouter)
app.use('/api/sessions', sessionRouter)
app.use('/api/upload', uploadRouter)
app.use('/api/knowledge', knowledgeRouter)

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

export default app
