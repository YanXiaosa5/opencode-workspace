import { useNavigate, useSearchParams } from 'react-router-dom'
import { AppProvider } from '@renderer/state/usereducerandcontext/AppContextProvider'
import './settings-page.css'
import ProfilePanel from '@renderer/components/ProfilePanel'
import AppearancePanel from '@renderer/components/AppearancePanel'
import OtherPanel from '@renderer/components/OtherPanel'

type Tab = 'profile' | 'appearance' | 'other'

const NAV_ITEMS: { id: Tab; label: string; icon: React.JSX.Element }[] = [
  {
    id: 'profile',
    label: '个人资料',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="6.5" r="3" stroke="currentColor" strokeWidth="1.4" />
        <path
          d="M2.5 16c0-3.59 2.91-6.5 6.5-6.5s6.5 2.91 6.5 6.5"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    )
  },
  {
    id: 'appearance',
    label: '外观',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="9" cy="9" r="2" stroke="currentColor" strokeWidth="1.4" />
        <path d="M9 2.5V5M9 13v2.5M2.5 9H5M13 9h2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    )
  },
  {
    id: 'other',
    label: '其他',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="1.5" fill="currentColor" />
        <circle cx="3.5" cy="9" r="1.5" fill="currentColor" />
        <circle cx="14.5" cy="9" r="1.5" fill="currentColor" />
      </svg>
    )
  }
]

function SettingsView(): React.JSX.Element {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = (searchParams.get('tab') as Tab) || 'profile'

  const userName = localStorage.getItem('userName') || 'User'
  const userEmail = localStorage.getItem('userEmail') || ''

  const setTab = (tab: Tab): void => {
    setSearchParams({ tab })
  }

  return (
    <AppProvider>
      <div className="sp-root">
        {/* ===== Left Sidebar ===== */}
        <aside className="sp-sidebar">
          <div className="sp-sidebar-header">
            <button className="sp-back-btn" onClick={() => navigate('/')}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M10 3L5 8l5 5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              返回
            </button>
          </div>

          <nav className="sp-nav">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                className={`sp-nav-item${activeTab === item.id ? ' sp-nav-item--active' : ''}`}
                onClick={() => setTab(item.id)}
              >
                <span className="sp-nav-icon">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* ===== Right Content ===== */}
        <main className="sp-content">
          {activeTab === 'profile' && (
            <ProfilePanel userName={userName} userEmail={userEmail} />
          )}
          {activeTab === 'appearance' && <AppearancePanel />}
          {activeTab === 'other' && <OtherPanel />}
        </main>
      </div>
    </AppProvider>
  )
}

export default SettingsView
