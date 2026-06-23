import type { Message } from '../data/chats'
import { defineMessages, useIntl } from '@i18n'

const chatLabels = defineMessages({
  assistant: { id: 'chat.roleAssistant', defaultMessage: 'Assistant' },
  user: { id: 'chat.roleUser', defaultMessage: 'You' }
})

function ChatMessage({ message }: { message: Message }): React.JSX.Element {
  const { formatMessage } = useIntl()
  const roleLabel =
    message.role === 'assistant'
      ? formatMessage(chatLabels.assistant)
      : formatMessage(chatLabels.user)

  return (
    <div className={`chat-msg chat-msg-${message.role}`}>
      <div className="chat-msg-role">{roleLabel}</div>
      <div className="chat-msg-bubble">
        <div className="chat-msg-content">{message.content}</div>
        <div className="chat-msg-time">{message.time}</div>
      </div>
    </div>
  )
}

export default ChatMessage
