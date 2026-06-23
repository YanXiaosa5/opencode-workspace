export interface User {
  id: number
  name: string
  email: string
  role: string
  phone?: string
  department?: string
  joinDate?: string
}

export const mockUsers: User[] = [
  {
    id: 1,
    name: '张三',
    email: 'zhangsan@example.com',
    role: '管理员',
    phone: '138-0000-0001',
    department: '技术部',
    joinDate: '2020-03-15'
  },
  {
    id: 2,
    name: '李四',
    email: 'lisi@example.com',
    role: '编辑',
    phone: '138-0000-0002',
    department: '内容部',
    joinDate: '2021-07-01'
  },
  {
    id: 3,
    name: '王五',
    email: 'wangwu@example.com',
    role: '用户',
    phone: '138-0000-0003',
    department: '市场部',
    joinDate: '2022-01-10'
  },
  {
    id: 4,
    name: '赵六',
    email: 'zhaoliu@example.com',
    role: '用户',
    phone: '138-0000-0004',
    department: '设计部',
    joinDate: '2022-09-20'
  },
  {
    id: 5,
    name: '孙七',
    email: 'sunqi@example.com',
    role: '编辑',
    phone: '138-0000-0005',
    department: '内容部',
    joinDate: '2021-11-05'
  },
  {
    id: 6,
    name: '周八',
    email: 'zhouba@example.com',
    role: '管理员',
    phone: '138-0000-0006',
    department: '技术部',
    joinDate: '2019-06-12'
  },
  {
    id: 7,
    name: '吴九',
    email: 'wujiu@example.com',
    role: '用户',
    phone: '138-0000-0007',
    department: '人事部',
    joinDate: '2023-02-28'
  },
  {
    id: 8,
    name: '郑十',
    email: 'zhengshi@example.com',
    role: '编辑',
    phone: '138-0000-0008',
    department: '设计部',
    joinDate: '2022-04-18'
  }
]
