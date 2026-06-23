import BackButton from '@renderer/components/BackButton'
import type { User } from '../data/users'

function UserProfileCard({ user }: { user: User }): React.JSX.Element {
  const initials = user.name.charAt(0)

  return (
    <div className="detail-card">
      <BackButton to="/list" />

      <div className="detail-header">
        <div className="detail-avatar">{initials}</div>
        <h1 className="detail-name">{user.name}</h1>
        <p className="detail-email">{user.email}</p>
        <span className={`detail-role role-${user.role}`}>{user.role}</span>
      </div>

      <div className="detail-stats">
        <div className="detail-stat">
          <span className="detail-stat-value">{user.id}</span>
          <span className="detail-stat-label">用户ID</span>
        </div>
        <div className="detail-stat">
          <span className="detail-stat-value">{user.role}</span>
          <span className="detail-stat-label">角色</span>
        </div>
        <div className="detail-stat">
          <span className="detail-stat-value">{user.department ?? '-'}</span>
          <span className="detail-stat-label">部门</span>
        </div>
      </div>

      <div className="detail-info">
        <div className="detail-info-row">
          <span className="detail-info-key">邮箱</span>
          <span className="detail-info-val">{user.email}</span>
        </div>
        <div className="detail-info-row">
          <span className="detail-info-key">电话</span>
          <span className="detail-info-val">{user.phone ?? '-'}</span>
        </div>
        <div className="detail-info-row">
          <span className="detail-info-key">部门</span>
          <span className="detail-info-val">{user.department ?? '-'}</span>
        </div>
        <div className="detail-info-row">
          <span className="detail-info-key">入职日期</span>
          <span className="detail-info-val">{user.joinDate ?? '-'}</span>
        </div>
      </div>
    </div>
  )
}

export default UserProfileCard
