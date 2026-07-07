import './settings-page.css'

interface ProfilePanelProps {
  userName: string
  userEmail: string
}

function ProfilePanel({ userName, userEmail }: ProfilePanelProps): React.JSX.Element {
  const initial = (userName[0] || 'U').toUpperCase()

  return (
    <div>
      <h1 className="sp-page-title">个人资料</h1>
      <p className="sp-page-desc">管理你的账户信息与偏好</p>

      <div className="sp-section">
        <div className="sp-profile-card">
          <div className="sp-profile-avatar">{initial}</div>
          <div className="sp-profile-info">
            <span className="sp-profile-name">{userName}</span>
            <span className="sp-profile-email">{userEmail || '未设置邮箱'}</span>
            <span className="sp-profile-plan">Pro plan</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePanel
