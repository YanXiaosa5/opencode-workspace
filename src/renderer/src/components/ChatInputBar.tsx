import { useState, useRef, useEffect } from 'react'
import {
  IcPlus,
  IcImage,
  IcVideo,
  IcEdit,
  IcMore,
  IcCode,
  IcPpt,
  IcReport,
  IcUpload,
  IcCloud
} from './ChatIcons'

function ChatInputBar({ onSend }: { onSend: (text: string) => void }): React.JSX.Element {
  const [input, setInput] = useState('')
  const [showPlusMenu, setShowPlusMenu] = useState(false)
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const plusRef = useRef<HTMLDivElement>(null)
  const moreRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent): void => {
      if (plusRef.current && !plusRef.current.contains(e.target as Node)) {
        setShowPlusMenu(false)
      }
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setShowMoreMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleSend = (): void => {
    const text = input.trim()
    if (!text) return
    onSend(text)
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="chat-input-footer">
      <div className="chat-input-bar">
        <textarea
          className="chat-input"
          placeholder="输入消息..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={3}
        />
        <div className="chat-input-actions-row">
          <div className="chat-input-left-actions">
            <div className="chat-plus-btn-wrapper" ref={plusRef}>
              <button className="chat-plus-btn" onClick={() => setShowPlusMenu(!showPlusMenu)}>
                <IcPlus />
              </button>
              {showPlusMenu && (
                <div className="chat-dropdown chat-dropdown-up">
                  <div className="chat-dropdown-item" onClick={() => setShowPlusMenu(false)}>
                    <span className="chat-dropdown-icon">
                      <IcUpload />
                    </span>
                    上传文件或图片
                  </div>
                  <div className="chat-dropdown-item" onClick={() => setShowPlusMenu(false)}>
                    <span className="chat-dropdown-icon">
                      <IcCloud />
                    </span>
                    选择云盘文件
                  </div>
                </div>
              )}
            </div>
            <div className="chat-action-bar">
              <button className="chat-action-btn">
                <span className="chat-action-icon">
                  <IcImage />
                </span>
                生成图片
              </button>
              <button className="chat-action-btn">
                <span className="chat-action-icon">
                  <IcVideo />
                </span>
                生成视频
              </button>
              <button className="chat-action-btn">
                <span className="chat-action-icon">
                  <IcEdit />
                </span>
                帮我写作
              </button>
              <div className="chat-more-btn-wrapper" ref={moreRef}>
                <button className="chat-action-btn" onClick={() => setShowMoreMenu(!showMoreMenu)}>
                  <span className="chat-action-icon">
                    <IcMore />
                  </span>
                  更多
                </button>
                {showMoreMenu && (
                  <div className="chat-dropdown chat-dropdown-up">
                    <div className="chat-dropdown-item" onClick={() => setShowMoreMenu(false)}>
                      <span className="chat-dropdown-icon">
                        <IcCode />
                      </span>
                      编程
                    </div>
                    <div className="chat-dropdown-item" onClick={() => setShowMoreMenu(false)}>
                      <span className="chat-dropdown-icon">
                        <IcPpt />
                      </span>
                      ppt生成
                    </div>
                    <div className="chat-dropdown-item" onClick={() => setShowMoreMenu(false)}>
                      <span className="chat-dropdown-icon">
                        <IcReport />
                      </span>
                      报告生成
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <button className="chat-send-btn" onClick={handleSend} disabled={!input.trim()}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatInputBar
