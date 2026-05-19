import { v4 as uuid } from 'uuid'
import type { Session, Message } from '../types/index.js'

const sessions = new Map<string, Session>()
const messages = new Map<string, Message[]>()

export function createSession(userId?: string): Session {
  const session: Session = {
    id: uuid(),
    userId,
    title: '新的脆蜜金桔咨询',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  sessions.set(session.id, session)
  messages.set(session.id, [])
  return session
}

export function getSession(sessionId: string): Session | undefined {
  return sessions.get(sessionId)
}

export function getOrCreateSession(sessionId?: string): Session {
  if (sessionId) {
    const existing = sessions.get(sessionId)
    if (existing) return existing
  }
  return createSession()
}

export function listSessions(): Session[] {
  return Array.from(sessions.values()).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )
}

export function addMessage(
  sessionId: string,
  role: 'user' | 'assistant' | 'system',
  content: string,
  extra?: { images?: string[]; agent?: string; intent?: string }
): Message {
  const msg: Message = {
    id: uuid(),
    sessionId,
    role,
    content,
    images: extra?.images,
    agent: extra?.agent,
    intent: extra?.intent,
    createdAt: new Date().toISOString(),
  }

  const sessionMessages = messages.get(sessionId) || []
  sessionMessages.push(msg)
  messages.set(sessionId, sessionMessages)

  // Update session title from first user message
  const session = sessions.get(sessionId)
  if (session && role === 'user' && sessionMessages.filter((m) => m.role === 'user').length === 1) {
    session.title = content.length > 20 ? content.slice(0, 20) + '…' : content
  }

  // Update session timestamp
  if (session) {
    session.updatedAt = new Date().toISOString()
  }

  return msg
}

export function getMessages(sessionId: string): Message[] {
  return messages.get(sessionId) || []
}
