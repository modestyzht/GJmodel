import { Router, Request, Response } from 'express'
import type { KnowledgeSearchRequest } from '../types/index.js'
import { searchKnowledge } from '../services/knowledge.service.js'

export const knowledgeRouter = Router()

knowledgeRouter.post('/search', (req: Request, res: Response) => {
  const { query, top_k = 5, tags } = req.body as KnowledgeSearchRequest

  if (!query || typeof query !== 'string') {
    res.status(400).json({ error: 'query 字段为必填项' })
    return
  }

  const documents = searchKnowledge(query, top_k, tags)
  res.json({ documents })
})
