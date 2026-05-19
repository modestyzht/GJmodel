import { Router, Request, Response } from 'express'
import type { ChatRequest } from '../types/index.js'
import { handleChat } from '../services/agent.service.js'

export const agentRouter = Router()

agentRouter.post('/chat', async (req: Request, res: Response) => {
  try {
    const body = req.body as ChatRequest

    if (!body.message || typeof body.message !== 'string') {
      res.status(400).json({ error: 'message 字段为必填项' })
      return
    }

    if (body.message.length > 2000) {
      res.status(400).json({ error: '消息长度不能超过 2000 字' })
      return
    }

    const response = await handleChat(body)
    res.json(response)
  } catch (err) {
    console.error('Agent chat error:', err)
    res.status(500).json({
      error: '智能体服务暂不可用',
      message: '请稍后重试或联系管理员',
    })
  }
})
