import { useState, useRef, useEffect, type KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import './home-page.css'

const QUICK_TAGS = [
  {
    id: 'website',
    label: '制作网站',
    icon: (
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="8.5" stroke="currentColor" strokeWidth="1.4" />
        <path
          d="M10 1.5C10 1.5 7 5.5 7 10s3 8.5 3 8.5M10 1.5C10 1.5 13 5.5 13 10s-3 8.5-3 8.5M1.5 10h17"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    )
  },
  {
    id: 'analyze',
    label: '数据分析',
    icon: (
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
        <path
          d="M3 15l4-5 3 3 4-6 3 4"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  },
  {
    id: 'code',
    label: '日常项目开发',
    icon: (
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
        <path
          d="M7 7L3 10l4 3M13 7l4 3-4 3M11 5l-2 10"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
]

type Mode = 'smart' | 'expert'

const MODE_CONFIG: Record<Mode, { label: string; desc: string }> = {
  smart: {
    label: '智能模式',
    desc: '自动选择最优策略，适合日常任务'
  },
  expert: {
    label: '专家模式',
    desc: '精细控制模型参数，适合专业场景'
  }
}

/** Mode selector chip + popup */
function ModeSelector(): React.JSX.Element {
  const [currentMode, setCurrentMode] = useState<Mode>('smart')
  const [open, setOpen] = useState(false)
  const popupRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  // Close when clicking outside
  useEffect(() => {
    if (!open) return
    const handle = (e: MouseEvent): void => {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open])

  const handleSelect = (mode: Mode): void => {
    setCurrentMode(mode)
    setOpen(false)
  }

  return (
    <div className="ms-wrap">
      {/* Trigger chip */}
      <button
        ref={triggerRef}
        className={`ms-chip ${open ? 'ms-chip--open' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {/* Lightning / brain icon for smart mode */}
        {currentMode === 'smart' ? (
          <svg
            className="ms-chip-icon"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M9 1L3 9h5l-1 6 7-9H9l1-5z"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg
            className="ms-chip-icon"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <circle cx="8" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.4" />
            <path
              d="M5.5 11.5C6 13 7 14 8 14s2-1 2.5-2.5"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            <path d="M8 2V1M3.5 3.5l-.7-.7M12.5 3.5l.7-.7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        )}
        <span className="ms-chip-label">{MODE_CONFIG[currentMode].label}</span>
        <svg
          className={`ms-chip-arrow ${open ? 'ms-chip-arrow--up' : ''}`}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
        >
          <path
            d="M2.5 4.5L6 8l3.5-3.5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Popup */}
      {open && (
        <div className="ms-popup" ref={popupRef} role="listbox">
          <div className="ms-popup-header">选择对话模式</div>
          {(Object.entries(MODE_CONFIG) as [Mode, { label: string; desc: string }][]).map(
            ([key, cfg]) => (
              <button
                key={key}
                className={`ms-option ${currentMode === key ? 'ms-option--active' : ''}`}
                role="option"
                aria-selected={currentMode === key}
                onClick={() => handleSelect(key)}
              >
                <div className="ms-option-left">
                  {/* Icon */}
                  <div className={`ms-option-icon-wrap ${currentMode === key ? 'ms-option-icon-wrap--active' : ''}`}>
                    {key === 'smart' ? (
                      <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                        <path
                          d="M9 1L3 9h5l-1 6 7-9H9l1-5z"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                        <circle cx="8" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.4" />
                        <path
                          d="M5.5 11.5C6 13 7 14 8 14s2-1 2.5-2.5"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                        />
                        <path d="M8 2V1M3.5 3.5l-.7-.7M12.5 3.5l.7-.7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                      </svg>
                    )}
                  </div>
                  <div className="ms-option-text">
                    <span className="ms-option-label">{cfg.label}</span>
                    <span className="ms-option-desc">{cfg.desc}</span>
                  </div>
                </div>
                {/* Selected checkmark */}
                {currentMode === key && (
                  <svg
                    className="ms-option-check"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M3 8l3.5 3.5L13 4.5"
                      stroke="#3248AF"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>
            )
          )}
        </div>
      )}
    </div>
  )
}

function HomePage(): React.JSX.Element {
  const navigate = useNavigate()
  const [inputValue, setInputValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const userName = localStorage.getItem('userName') || 'User'

  const handleLogout = (): void => {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('userName')
    localStorage.removeItem('userEmail')
    navigate('/login')
  }

  const handleTagClick = (label: string): void => {
    setInputValue(label + ' ')
    textareaRef.current?.focus()
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (inputValue.trim()) {
        console.log('Send:', inputValue)
        setInputValue('')
      }
    }
  }

  return (
    <div className="hp-root">
      {/* ===== Left Sidebar ===== */}
      <aside className="hp-sidebar">
        <div className="hp-sidebar-top">
          {/* macOS window controls */}
          <div className="hp-window-controls">
            <span className="hp-wc hp-wc-close" />
            <span className="hp-wc hp-wc-minimize" />
            <span className="hp-wc hp-wc-zoom" />
          </div>

          {/* Collapse icon */}
          <button className="hp-collapse-btn" title="收起侧边栏">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M13 4L7 10l6 6"
                stroke="#3F434B"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Nav area */}
        <nav className="hp-nav" />

        {/* Bottom user info */}
        <div className="hp-sidebar-bottom">
          <div className="hp-user-info">
            <div className="hp-avatar">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="12" fill="url(#av-grad)" />
                <circle cx="12" cy="9" r="3.5" fill="rgba(255,255,255,0.9)" />
                <path
                  d="M4.5 20C5.5 16.5 8.5 14 12 14s6.5 2.5 7.5 6"
                  stroke="rgba(255,255,255,0.9)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="av-grad" x1="0" y1="0" x2="24" y2="24">
                    <stop stopColor="#F9F9F9" />
                    <stop offset="1" stopColor="#EBEBEB" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="hp-user-text">
              <span className="hp-user-name">{userName}</span>
              <span className="hp-user-plan">Pro plan</span>
            </div>
          </div>

          <div className="hp-user-actions">
            <button className="hp-icon-btn" title="退出登录" onClick={handleLogout}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M6 14H3a1 1 0 01-1-1V3a1 1 0 011-1h3M11 11l3-3-3-3M14 8H6"
                  stroke="#6B7280"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button className="hp-icon-btn" title="设置" onClick={() => navigate('/settings')}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="2" stroke="#6B7280" strokeWidth="1.4" />
                <path
                  d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M3.05 3.05l1.06 1.06M11.89 11.89l1.06 1.06M3.05 12.95l1.06-1.06M11.89 4.11l1.06-1.06"
                  stroke="#6B7280"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* ===== Main Content ===== */}
      <main className="hp-main">
        <div className="hp-center">
          {/* Mode selector chip above heading */}
          <ModeSelector />

          {/* Heading */}
          <h1 className="hp-heading">Agnes 我能为你做什么?</h1>

          {/* Input card */}
          <div className="hp-input-card-wrap">
            <div className="hp-input-card">
              <textarea
                ref={textareaRef}
                className="hp-textarea"
                placeholder="今天想让 Agnes 帮你做什么? @ 引用对话文件，/ 调用技能与指令"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={3}
              />
              <div className="hp-input-footer">
                <div className="hp-input-hints">
                  <span className="hp-hint-tag">@ 引用文件</span>
                  <span className="hp-hint-tag">/ 调用技能</span>
                </div>
                <button
                  className={`hp-send-btn ${inputValue.trim() ? 'hp-send-btn--active' : ''}`}
                  disabled={!inputValue.trim()}
                  onClick={() => {
                    if (inputValue.trim()) {
                      console.log('Send:', inputValue)
                      setInputValue('')
                    }
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path
                      d="M9 15V3M9 3L4 8M9 3l5 5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Quick action tags */}
          <div className="hp-tags">
            {QUICK_TAGS.map((tag) => (
              <button key={tag.id} className="hp-tag" onClick={() => handleTagClick(tag.label)}>
                <span className="hp-tag-icon">{tag.icon}</span>
                <span className="hp-tag-label">{tag.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom disclaimer */}
        <p className="hp-disclaimer">内容由AI生成，请核实重要信息</p>
      </main>
    </div>
  )
}

export default HomePage
