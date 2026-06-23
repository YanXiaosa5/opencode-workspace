import { useEffect, useState } from 'react'
import { mockUsers } from '../data/users'
import BackButton from '@renderer/components/BackButton'
import UserTable from '@renderer/components/UserTable'
import Pagination from '@renderer/components/Pagination'

const PAGE_SIZE = 5

function ListView(): React.JSX.Element {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(mockUsers.length / PAGE_SIZE)
  const startIndex = (currentPage - 1) * PAGE_SIZE
  const pageData = mockUsers.slice(startIndex, startIndex + PAGE_SIZE)

  useEffect(() => {
    console.log('ListPage rendered (每次渲染/更新都触发)')
  })

  useEffect(() => {
    console.log('(整个生命周期只走这一次)')
  }, [])

  useEffect(() => {
    console.log('currentPage changed')
  }, [currentPage])

  useEffect(() => {
    console.log('ListPage mounted')
    return () => {
      console.log('ListPage unmounted')
    }
  }, [])

  return (
    <div className="list-page">
      <div className="list-header">
        <BackButton />
        <h1>用户列表</h1>
      </div>
      <UserTable users={pageData} />
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  )
}

export default ListView
