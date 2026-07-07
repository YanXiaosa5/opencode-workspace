import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import './login-page.css'

function LoginForm(): React.JSX.Element {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAgnesLogin = (): void => {
    setShowForm(true)
    setError('')
  }

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      setError('请输入邮箱和密码')
      return
    }
    setLoading(true)
    setError('')
    // Simulate async login
    await new Promise((r) => setTimeout(r, 800))
    localStorage.setItem('isLoggedIn', 'true')
    localStorage.setItem('userEmail', email)
    localStorage.setItem('userName', email.split('@')[0])
    setLoading(false)
    navigate('/')
  }

  return (
    <div className="lp-root">
      {/* Left sidebar */}
      <aside className="lp-sidebar">
        <div className="lp-window-controls">
          <span className="lp-wc lp-wc-close" />
          <span className="lp-wc lp-wc-minimize" />
          <span className="lp-wc lp-wc-zoom" />
        </div>
      </aside>

      {/* Right content */}
      <main className="lp-main">
        <div className="lp-card">
          {/* Logo */}
          <div className="lp-logo-wrap">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="23" stroke="url(#ag-grad)" strokeWidth="2" />
              <path
                d="M14 30C14 23.373 18.477 18 24 18s10 5.373 10 12"
                stroke="url(#ag-grad)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M18 30c0-3.314 2.686-6 6-6s6 2.686 6 6"
                stroke="url(#ag-grad)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="24" cy="30" r="3" fill="url(#ag-grad)" />
              <defs>
                <linearGradient id="ag-grad" x1="0" y1="0" x2="48" y2="48">
                  <stop stopColor="#3248AF" />
                  <stop offset="1" stopColor="#6C84E8" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Title */}
          <h1 className="lp-title">欢迎使用 Agnes</h1>

          {/* Buttons / Form */}
          <div className="lp-actions">
            {!showForm ? (
              <>
                <button className="lp-btn-primary" onClick={handleAgnesLogin}>
                  使用 Agnes 账号继续
                </button>
                <button className="lp-btn-secondary">使用其他方式登录</button>
              </>
            ) : (
              <form className="lp-form" onSubmit={handleSubmit} noValidate>
                <div className="lp-input-group">
                  <label className="lp-label" htmlFor="lp-email">
                    邮箱
                  </label>
                  <input
                    id="lp-email"
                    type="email"
                    className="lp-input"
                    placeholder="请输入邮箱地址"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    autoFocus
                  />
                </div>
                <div className="lp-input-group">
                  <label className="lp-label" htmlFor="lp-password">
                    密码
                  </label>
                  <input
                    id="lp-password"
                    type="password"
                    className="lp-input"
                    placeholder="请输入密码"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                </div>
                {error && <p className="lp-error">{error}</p>}
                <button type="submit" className="lp-btn-primary" disabled={loading}>
                  {loading ? '登录中...' : '登录'}
                </button>
                <button
                  type="button"
                  className="lp-btn-back"
                  onClick={() => {
                    setShowForm(false)
                    setError('')
                  }}
                >
                  返回
                </button>
              </form>
            )}
          </div>

          {/* Footer */}
          <p className="lp-footer">
            <span>New to Agnes AI?&nbsp;</span>
            <button type="button" className="lp-link">
              Create an account
            </button>
          </p>
        </div>
      </main>
    </div>
  )
}

export default LoginForm
