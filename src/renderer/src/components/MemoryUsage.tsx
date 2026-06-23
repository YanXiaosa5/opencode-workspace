import { useState, useEffect } from 'react'

interface MemoryInfo {
  residentSet: number
  private: number
  shared: number
}

function formatBytes(bytes: number): string {
  if (bytes >= 1073741824) return (bytes / 1073741824).toFixed(1) + ' GB'
  if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + ' MB'
  if (bytes >= 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return bytes + ' B'
}

export default function MemoryUsage(): React.JSX.Element {
  const [memory, setMemory] = useState<MemoryInfo | null>(null)
  const [alive, setAlive] = useState(true)

  useEffect(() => {
    let mounted = true

    const poll = async (): Promise<void> => {
      try {
        const info = await window.api.getMemoryUsage()
        if (mounted) {
          setMemory(info)
          setAlive(true)
        }
      } catch {
        if (mounted) setAlive(false)
      }
    }

    poll()
    const timer = setInterval(poll, 2000)
    return () => {
      mounted = false
      clearInterval(timer)
    }
  }, [])

  const dotColor = alive ? 'bg-green-400' : 'bg-red-400'

  return (
    <div className="flex items-center gap-2 rounded-xl bg-black/30 px-3 py-1.5 text-xs font-medium text-white/70 backdrop-blur-md">
      <span
        className={`inline-block h-2 w-2 rounded-full ${dotColor} shadow-[0_0_6px_rgba(74,222,128,0.6)]`}
      />
      <span className="tracking-wide">MEM</span>
      <span className="font-mono tabular-nums text-white/90">
        {memory ? formatBytes(memory.residentSet) : '---'}
      </span>
    </div>
  )
}
