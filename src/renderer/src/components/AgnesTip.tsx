import { useEffect } from 'react'

interface AgnesTipProps {
  isOpen: boolean
  onClose: () => void
}

function AgnesTip({ isOpen, onClose }: AgnesTipProps): React.JSX.Element | null {
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />
      <div
        className="relative flex flex-col items-center overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-[#1e1e24]"
        style={{ width: 586, maxWidth: '90vw' }}
      >
        <div
          className="pointer-events-none absolute -inset-20 opacity-15"
          style={{
            background: 'radial-gradient(ellipse at 50% 0%, #3b82f6 0%, transparent 70%)',
            filter: 'blur(80px)'
          }}
        />
        <div className="relative flex w-full flex-col items-center px-10 pb-10 pt-12">
          <div className="mb-8 flex h-[186px] w-[221px] items-center justify-center">
            <svg width="140" height="140" viewBox="0 0 140 140" fill="none">
              <rect width="140" height="140" rx="32" fill="#EFF6FF" className="dark:opacity-10" />
              <path
                d="M70 30C48.46 30 31 47.46 31 69v18c0 5.52 4.48 10 10 10h6v-28c0-12.7 10.3-23 23-23s23 10.3 23 23v28h6c5.52 0 10-4.48 10-10V69c0-21.54-17.46-39-39-39z"
                fill="#3B82F6"
                opacity="0.2"
              />
              <path
                d="M60 95c0 5.52 4.48 10 10 10s10-4.48 10-10"
                stroke="#3B82F6"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M54 69c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM86 69c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
                fill="#3B82F6"
              />
              <path
                d="M50 47l8 6M90 47l-8 6"
                stroke="#93C5FD"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <h2 className="mb-3 text-center text-2xl font-bold text-gray-900 dark:text-white">
            欢迎使用 Agnes
          </h2>
          <p className="mb-8 text-center text-base leading-relaxed text-gray-500 dark:text-gray-400">
            Agnes 是你的智能 AI 助手，可以帮助你完成代码编写、问题解答、
            <br />
            文档整理等日常开发工作。立即开始体验吧！
          </p>
          <div className="mb-4 flex w-full flex-col gap-3">
            <button
              onClick={onClose}
              className="w-full cursor-pointer rounded-xl bg-blue-600 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              知道了
            </button>
            <button
              onClick={onClose}
              className="w-full cursor-pointer rounded-xl px-6 py-3 text-sm font-medium text-gray-400 transition-colors hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            >
              关闭提醒
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AgnesTip
