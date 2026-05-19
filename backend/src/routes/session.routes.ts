import { Router, Request, Response } from 'express'
import { createSession, listSessions, getMessages } from '../services/session.service.js'

export const sessionRouter = Router()

sessionRouter.post('/', (_req: Request, res: Response) => {
  const session = createSession()
  res.status(201).json(session)
})

sessionRouter.get('/', (_req: Request, res: Response) => {
  const sessions = listSessions()
  res.json({ sessions })
})

sessionRouter.get('/:id/messages', (req: Request, res: Response) => {
  const id = req.params.id as string
  const msgs = getMessages(id)
  res.json({ messages: msgs })
})
