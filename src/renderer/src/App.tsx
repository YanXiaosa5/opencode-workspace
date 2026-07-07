import { useState, useEffect, useCallback } from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { IntlProvider, loadMessages, normalizeLocale, getDefaultLocale } from '@i18n'
import type { CompiledMessages } from '@i18n'
import LoginForm from './components/LoginForm'
import HomePage from './components/HomePage'
import SettingsView from './components/SettingsView'

/** Route guard: redirect to /login if not authenticated */
function RequireAuth({ children }: { children: React.ReactNode }): React.JSX.Element {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
  return isLoggedIn ? <>{children}</> : <Navigate to="/login" replace />
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
          <Route path="/login" element={<LoginForm />} />
          <Route
            path="/"
            element={
              <RequireAuth>
                <HomePage />
              </RequireAuth>
            }
          />
          <Route
            path="/settings"
            element={
              <RequireAuth>
                <SettingsView />
              </RequireAuth>
            }
          />
          {/* Fallback: redirect everything else to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </IntlProvider>
  )
}

export default App
