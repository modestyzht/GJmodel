import { useState, useRef, useEffect } from 'react'
import Layout from './components/Layout'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import KnowledgePanel from './components/KnowledgePanel'
import ChatInput from './components/ChatInput'
import ChatDisplay from './components/ChatDisplay'
import type { ChatMessage } from './components/ChatDisplay'

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [sessionId, setSessionId] = useState<string | undefined>()
  const [loading, setLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  const handleNewChat = () => {
    setMessages([])
    setSessionId(undefined)
  }

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text: string) => {
    const userMsg: ChatMessage = { role: 'user', content: text }
    const loadingMsg: ChatMessage = { role: 'assistant', content: '', loading: true }
    setMessages((prev) => [...prev, userMsg, loadingMsg])
    setLoading(true)

    try {
      const res = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          message: text,
        }),
      })

      const data = await res.json()

      if (data.session_id && !sessionId) {
        setSessionId(data.session_id)
      }

      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          role: 'assistant',
          content: data.answer || data.summary || '已收到你的问题',
          agent: data.agent,
          cards: data.cards,
          recommendations: data.recommendations,
          suggestedQuestions: data.suggested_questions,
        },
      ])
    } catch {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          role: 'assistant',
          content: '抱歉，智能体服务暂不可用，请确认后端已启动后重试。',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout
      sidebar={<Sidebar onNewChat={handleNewChat} />}
      header={<Header />}
      footer={<ChatInput onSend={sendMessage} disabled={loading} />}
    >
      <div className="flex flex-col flex-1">
        {messages.length === 0 ? (
          <KnowledgePanel onQuickQuestion={sendMessage} />
        ) : (
          <ChatDisplay messages={messages} onQuickQuestion={sendMessage} />
        )}
        <div ref={chatEndRef} />
      </div>
    </Layout>
  )
}
