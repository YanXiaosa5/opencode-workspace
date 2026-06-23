import { useParams } from 'react-router-dom'
import { mockUsers } from '../data/users'
import BackButton from '@renderer/components/BackButton'
import UserProfileCard from '@renderer/components/UserProfileCard'

function UserDetailView(): React.JSX.Element {
  const { id } = useParams<{ id: string }>()
  const user = mockUsers.find((u) => u.id === Number(id))

  if (!user) {
    return (
      <div className="detail-page">
        <div className="detail-card">
          <p>用户不存在</p>
          <BackButton to="/list">返回列表</BackButton>
        </div>
      </div>
    )
  }

  return (
    <div className="detail-page">
      <UserProfileCard user={user} />
    </div>
  )
}

export default UserDetailView
