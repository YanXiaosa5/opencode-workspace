import { useState, useRef, useEffect } from 'react'
import { mockMessages, type Message } from '../data/chats'
import BackButton from '@renderer/components/BackButton'
import ChatMessage from '@renderer/components/ChatMessage'
import ChatInputBar from '@renderer/components/ChatInputBar'

function ChatRoom(): React.JSX.Element {
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = (text: string): void => {
    const userMsg: Message = {
      id: Date.now(),
      role: 'user',
      content: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    setMessages((prev) => [...prev, userMsg])

    setTimeout(() => {
      const reply: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: `已收到你的消息：「${text}」。这是一个模拟回复。`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages((prev) => [...prev, reply])
    }, 600)
  }

  return (
    <div className="chat-page">
      <div className="chat-header">
        <BackButton />
        <h1>新对话</h1>
      </div>
      <div className="chat-messages" ref={listRef}>
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
      </div>
      <ChatInputBar onSend={handleSend} />
    </div>
  )
}

export default ChatRoom
