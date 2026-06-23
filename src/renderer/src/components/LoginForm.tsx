import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import '../assets/login.css'

function LoginForm(): React.JSX.Element {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault()
    localStorage.setItem('isLoggedIn', 'true')
    navigate('/list')
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo" aria-hidden="true">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="22" stroke="url(#logo-grad)" strokeWidth="3" />
              <path
                d="M14 28C14 22.477 18.477 18 24 18s10 4.477 10 10"
                stroke="url(#logo-grad)"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M18 28c0-3.314 2.686-6 6-6s6 2.686 6 6"
                stroke="url(#logo-grad)"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle cx="24" cy="28" r="3" fill="url(#logo-grad)" />
              <defs>
                <linearGradient id="logo-grad" x1="0" y1="0" x2="48" y2="48">
                  <stop stopColor="#6366f1" />
                  <stop offset="1" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1 className="login-title">Echo</h1>
          <p className="login-subtitle">Sign in to your account</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="input-group">
            <label htmlFor="email" className="input-label">
              Email
            </label>
            <div className="input-wrapper">
              <svg
                className="input-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M22 4L12 13 2 4" />
              </svg>
              <input
                id="email"
                type="email"
                className="input-field"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="password" className="input-label">
              Password
            </label>
            <div className="input-wrapper">
              <svg
                className="input-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              <input
                id="password"
                type="password"
                className="input-field"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input type="checkbox" className="checkbox" defaultChecked />
              <span>Remember me</span>
            </label>
            <button type="button" className="link-btn" onClick={() => navigate('/reset-password')}>
              Forgot password?
            </button>
          </div>

          <button type="submit" className="btn-signin">
            Sign in
          </button>
        </form>

        <p className="login-footer">
          Don&apos;t have an account?{' '}
          <button type="button" className="link-btn" onClick={() => navigate('/register')}>
            Sign up
          </button>
        </p>

        <p className="login-agreement">
          By signing in, you are agreeing to the{' '}
          <button type="button" className="link-btn link-muted">
            Terms of Service
          </button>{' '}
          and{' '}
          <button type="button" className="link-btn link-muted">
            Privacy Policy
          </button>
        </p>
      </div>
    </div>
  )
}

export default LoginForm
