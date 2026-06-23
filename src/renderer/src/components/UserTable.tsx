import { useNavigate } from 'react-router-dom'
import type { User } from '../data/users'

function UserTable({ users }: { users: User[] }): React.JSX.Element {
  const navigate = useNavigate()

  return (
    <table className="list-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>姓名</th>
          <th>邮箱</th>
          <th>角色</th>
        </tr>
      </thead>
      <tbody>
        {users.map((item, index) => (
          <tr
            key={item.id}
            className={`${index % 2 === 0 ? 'row-even' : 'row-odd'} row-clickable`}
            onClick={() => navigate(`/user/${item.id}`)}
          >
            <td>{item.id}</td>
            <td>{item.name}</td>
            <td>{item.email}</td>
            <td>{item.role}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default UserTable
