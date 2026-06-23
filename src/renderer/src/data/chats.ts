export interface Message {
  id: number
  role: 'user' | 'assistant'
  content: string
  time: string
}

export const mockMessages: Message[] = [
  { id: 1, role: 'assistant', content: '你好！有什么可以帮助你的？', time: '10:00' },
  { id: 2, role: 'user', content: '今天天气怎么样？', time: '10:01' },
  { id: 3, role: 'assistant', content: '今天天气晴朗，气温 25°C，适合外出活动。', time: '10:01' },
  { id: 4, role: 'user', content: '帮我写一封邮件', time: '10:05' },
  { id: 5, role: 'assistant', content: '当然可以！请告诉我邮件的内容和收件人信息。', time: '10:05' }
]
