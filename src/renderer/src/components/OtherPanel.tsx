import { useState, useEffect, useCallback, useReducer } from 'react'
import SettingItemComponent, { type SettingItem } from '@renderer/components/SettingItemComponent'
import { countReducer, initialState } from '@renderer/state/CountReduceer'
import AgnesTip from '@renderer/components/AgnesTip'

const OTHER_ITEMS: SettingItem[] = [
  {
    id: 'notifications',
    label: '消息通知',
    description: '启用或禁用桌面通知',
    type: 'toggle',
    defaultValue: localStorage.getItem('setting_notifications') !== 'false'
  },
  {
    id: 'autoUpdate',
    label: '自动更新',
    description: '自动检查并安装应用更新',
    type: 'toggle',
    defaultValue: localStorage.getItem('setting_autoUpdate') !== 'false'
  }
]

interface ProcessMemoryInfo {
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

function Counter(): React.JSX.Element {
  const [state, dispatch] = useReducer(countReducer, initialState)
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>当前计数: {state.count}</h2>
      <button onClick={() => dispatch({ type: 'increment' })}>加 1</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>减 1</button>
      <button onClick={() => dispatch({ type: 'SET', payload: 100 })}>直接设为 100</button>
    </div>
  )
}

function OtherPanel(): React.JSX.Element {
  const [memory, setMemory] = useState<ProcessMemoryInfo | null>(null)
  const [memoryAlive, setMemoryAlive] = useState(true)
  const [pingResults, setPingResults] = useState<PingResult[] | null>(null)
  const [pinging, setPinging] = useState(false)
  const [saveContent, setSaveContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [showAgnesTip, setShowAgnesTip] = useState(false)

  useEffect(() => {
    let mounted = true
    const poll = async (): Promise<void> => {
      try {
        const info = await window.api.getMemoryUsage()
        if (mounted) {
          setMemory(info)
          setMemoryAlive(true)
        }
      } catch {
        if (mounted) setMemoryAlive(false)
      }
    }
    poll()
    const timer = setInterval(poll, 2000)
    return () => {
      mounted = false
      clearInterval(timer)
    }
  }, [])

  const handlePing = useCallback(async (): Promise<void> => {
    setPinging(true)
    setPingResults(null)
    try {
      const results = await window.api.pingHosts()
      setPingResults(results)
    } catch {
      setPingResults([])
    } finally {
      setPinging(false)
    }
  }, [])

  const handleSaveFile = useCallback(async (): Promise<void> => {
    setSaving(true)
    setSaveMessage('')
    try {
      const result = await window.api.saveFile(saveContent, 'document.txt')
      if (result.success) {
        setSaveMessage('文件已保存到: ' + result.filePath)
      } else if (result.canceled) {
        setSaveMessage('已取消保存')
      }
    } catch (err: unknown) {
      setSaveMessage('保存失败: ' + (err instanceof Error ? err.message : String(err)))
    } finally {
      setSaving(false)
    }
  }, [saveContent])

  const handleToggle = (id: string, value: boolean): void => {
    localStorage.setItem(`setting_${id}`, String(value))
  }

  return (
    <div>
        <h1 className="sp-page-title">其他</h1>
        <p className="sp-page-desc">通知、系统更新与调试工具</p>

        <div className="settings-content">
          {/* 通用设置 */}
          <div className="settings-category">
            <h2 className="category-title">通用</h2>
            {OTHER_ITEMS.map((item) => (
              <SettingItemComponent
                key={item.id}
                setting={item}
                onToggle={handleToggle}
                onSelect={() => {}}
              />
            ))}
          </div>

          {/* 内存监听 */}
          <div className="settings-category">
            <h2 className="category-title">内存占用监听</h2>
            <div className="setting-row">
              <div className="setting-info">
                <h3 className="setting-label">进程内存</h3>
                <p className="setting-description">实时查看 Electron 主进程内存占用（每 2 秒刷新）</p>
              </div>
              <div className="memory-display">
                <span className={`memory-dot ${memoryAlive ? 'dot-green' : 'dot-red'}`} />
                <div className="memory-stats">
                  <div className="memory-stat">
                    <span className="memory-stat-label">RSS</span>
                    <span className="memory-stat-value">{memory ? formatBytes(memory.residentSet) : '---'}</span>
                  </div>
                  <div className="memory-stat">
                    <span className="memory-stat-label">堆内</span>
                    <span className="memory-stat-value">{memory ? formatBytes(memory.private) : '---'}</span>
                  </div>
                  <div className="memory-stat">
                    <span className="memory-stat-label">共享</span>
                    <span className="memory-stat-value">{memory ? formatBytes(memory.shared) : '---'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 网络测速 */}
          <div className="settings-category">
            <h2 className="category-title">网络延迟测速</h2>
            <div className="setting-row">
              <div className="setting-info">
                <h3 className="setting-label">Ping 检测</h3>
                <p className="setting-description">测量到各节点的 TCP 连接延迟</p>
              </div>
              <div className="ping-control">
                <button className="ping-button" onClick={handlePing} disabled={pinging}>
                  {pinging ? '测速中...' : '开始测速'}
                </button>
              </div>
            </div>
            {pingResults && (
              <div className="ping-results">
                {pingResults.map((r) => (
                  <div className="ping-result-row" key={r.name}>
                    <span className="ping-result-name">{r.name}</span>
                    <span className="ping-result-host">{r.host}</span>
                    <span className={`ping-result-latency ${r.latency !== null ? (r.latency < 200 ? 'latency-fast' : r.latency < 500 ? 'latency-mid' : 'latency-slow') : 'latency-err'}`}>
                      {r.latency !== null ? `${r.latency} ms` : r.error || '失败'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 文件保存 */}
          <div className="settings-category">
            <h2 className="category-title">保存文件到本地</h2>
            <div className="setting-row" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
              <div className="setting-info" style={{ marginBottom: 8 }}>
                <h3 className="setting-label">文件内容</h3>
                <p className="setting-description">输入要保存到本地的文本内容</p>
              </div>
              <textarea
                className="save-textarea"
                rows={4}
                value={saveContent}
                onChange={(e) => setSaveContent(e.target.value)}
                placeholder="在此输入文件内容..."
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
                <button
                  className="save-button"
                  onClick={handleSaveFile}
                  disabled={saving || !saveContent.trim()}
                >
                  {saving ? '保存中...' : '选择路径并保存'}
                </button>
                {saveMessage && <span className="save-message">{saveMessage}</span>}
              </div>
            </div>
          </div>

          <Counter />

          {/* Agnes 提示 */}
          <div className="settings-category">
            <h2 className="category-title">Agnes 提示</h2>
            <div className="setting-row">
              <div className="setting-info">
                <h3 className="setting-label">Agnes 欢迎弹窗</h3>
                <p className="setting-description">点击按钮查看 Agnes 助手的欢迎提示</p>
              </div>
              <div className="setting-control">
                <button
                  className="cursor-pointer rounded-lg border border-white/10 bg-white/5 px-5 py-2 text-sm font-semibold text-white/80 transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white"
                  onClick={() => setShowAgnesTip(true)}
                >
                  显示提示
                </button>
              </div>
            </div>
          </div>

          <AgnesTip isOpen={showAgnesTip} onClose={() => setShowAgnesTip(false)} />
        </div>
    </div>
  )
}

export default OtherPanel
