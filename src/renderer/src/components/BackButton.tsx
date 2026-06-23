import { useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'

interface BackButtonProps {
  to?: string
  children?: ReactNode
}

function BackButton({ to = '/', children }: BackButtonProps): React.JSX.Element {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate(to)}
      className="group flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-medium text-white/60 backdrop-blur-sm transition-all duration-300 hover:border-indigo-400/50 hover:bg-white/[0.06] hover:text-white hover:shadow-[0_0_20px_rgba(99,102,241,0.2)]"
    >
      <svg
        className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="15 18 9 12 15 6" />
      </svg>
      {children ?? '返回'}
    </button>
  )
}

export default BackButton
