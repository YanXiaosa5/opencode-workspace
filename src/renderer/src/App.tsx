import { useRef, useState, useEffect, useCallback } from 'react'
import { HashRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { IntlProvider, loadMessages, normalizeLocale, getDefaultLocale } from '@i18n'
import type { CompiledMessages } from '@i18n'
import SearchBar from './components/SearchBar'
import LoginForm from './components/LoginForm'
import ListView from './components/ListView'
import UserDetailView from './components/UserDetailView'
import ChatRoom from './components/ChatRoom'
import SettingsView from './components/SettingsView'

function Home(): React.JSX.Element {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSearch = (value: string): void => {
    console.log('search:', value)
  }

  const handleSelectImage = (): void => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (): void => {
        const img = new Image()
        img.src = reader.result as string
        img.style.maxWidth = '400px'
        img.style.maxHeight = '300px'
        img.style.marginTop = '20px'
        const container = document.getElementById('image-preview')
        if (container) {
          container.innerHTML = ''
          container.appendChild(img)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGoToList = (): void => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
    if (isLoggedIn) {
      navigate('/list')
    } else {
      navigate('/login')
    }
  }

  return (
    <>
      <div className="home-container">
        <SearchBar onSearch={handleSearch} />
        <div className="home-cards">
          <div className="home-card card-list" onClick={handleGoToList}>
            <div className="card-icon">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
            </div>
            <div className="card-title">跳转列表</div>
            <div className="card-desc">查看用户数据</div>
          </div>
          <div className="home-card card-image" onClick={handleSelectImage}>
            <div className="card-icon">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
            <div className="card-title">选择图片</div>
            <div className="card-desc">浏览图片文件</div>
          </div>
          <div className="home-card card-chat" onClick={() => navigate('/chat')}>
            <div className="card-icon">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div className="card-title">发起新对话</div>
            <div className="card-desc">开始聊天交流</div>
          </div>
          <div className="home-card card-settings" onClick={() => navigate('/settings')}>
            <div className="card-icon">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </div>
            <div className="card-title">设置</div>
            <div className="card-desc">应用设置与偏好</div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </div>
      </div>
      <div id="image-preview" />
      <div
        style={{
          position: 'fixed',
          bottom: 32,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 24,
          zIndex: 10
        }}
      >
        <div
          style={{
            color: 'var(--ev-c-text-2)',
            fontSize: 14,
            cursor: 'pointer',
            transition: 'color 200ms'
          }}
          onClick={() => navigate('/login')}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--ev-c-text-1)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--ev-c-text-2)')}
        >
          登录
        </div>
        <div
          style={{
            color: 'var(--ev-c-text-2)',
            fontSize: 14,
            cursor: 'pointer',
            transition: 'color 200ms'
          }}
          onClick={() => window.electron.ipcRenderer.send('open-log-folder')}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--ev-c-text-1)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--ev-c-text-2)')}
        >
          打开本地日志文件夹
        </div>
      </div>
    </>
  )
}

function App(): React.JSX.Element {
  const [locale, setLocale] = useState<string>(() => {
    const saved = localStorage.getItem('setting_language')
    return saved ? normalizeLocale(saved) : getDefaultLocale()
  })
  const [messages, setMessages] = useState<CompiledMessages | null>(null)

  const loadLocale = useCallback(async (loc: string) => {
    const msgs = await loadMessages(loc)
    setMessages(msgs)
  }, [])

  useEffect(() => {
    loadLocale(locale)
  }, [locale, loadLocale])

  useEffect(() => {
    const handler = (e: CustomEvent): void => {
      const newLocale = normalizeLocale(e.detail)
      setLocale(newLocale)
      localStorage.setItem('setting_language', newLocale)
    }
    window.addEventListener('language-changed', handler as EventListener)
    return () => window.removeEventListener('language-changed', handler as EventListener)
  }, [])

  if (!messages) return <></>

  return (
    <IntlProvider locale={locale} messages={messages}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/list" element={<ListView />} />
          <Route path="/user/:id" element={<UserDetailView />} />
          <Route path="/chat" element={<ChatRoom />} />
          <Route path="/settings" element={<SettingsView />} />
        </Routes>
      </HashRouter>
    </IntlProvider>
  )
}

export default App
