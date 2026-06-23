import { useState, useEffect, useCallback, useReducer } from 'react'
import { useNavigate } from 'react-router-dom'
import { SUPPORTED_LOCALES } from '@i18n'
import SettingItemComponent, { type SettingItem } from '@renderer/components/SettingItemComponent'
import { countReducer, initialState } from '@renderer/state/CountReduceer'
import { AppProvider } from '@renderer/state/usereducerandcontext/AppContextProvider'
import AgnesTip from '@renderer/components/AgnesTip'

interface ProcessMemoryInfo {
  residentSet: number
  private: number
  shared: number
}

function buildSettingCategories(): { id: string; title: string; items: SettingItem[] }[] {
  return [
    {
      id: 'appearance',
      title: '外观',
      items: [
        {
          id: 'darkMode',
          label: '深色模式',
          description: '切换应用的主题为深色模式',
          type: 'toggle',
          defaultValue: localStorage.getItem('setting_darkMode') === 'true'
        },
        {
          id: 'fontSize',
          label: '字体大小',
          description: '调整应用内的字体大小',
          type: 'select',
          defaultValue: localStorage.getItem('setting_fontSize') || 'medium',
          options: ['small', 'medium', 'large']
        },
        {
          id: 'themeColor',
          label: '主题颜色',
          description: '选择应用的主要颜色',
          type: 'select',
          defaultValue: localStorage.getItem('setting_themeColor') || 'blue',
          options: ['blue', 'green', 'purple', 'orange']
        }
      ]
    },
    {
      id: 'general',
      title: '通用',
      items: [
        {
          id: 'language',
          label: '语言',
          description: '选择应用显示语言',
          type: 'select',
          defaultValue: (() => {
            const saved = localStorage.getItem('setting_language')
            return SUPPORTED_LOCALES.includes(saved || '') ? saved! : 'zh-CN'
          })(),
          options: SUPPORTED_LOCALES
        },
        {
          id: 'notifications',
          label: '消息通知',
          description: '启用或禁用桌面通知',
          type: 'toggle',
          defaultValue: localStorage.getItem('setting_notifications') !== 'false'
        }
      ]
    },
    {
      id: 'system',
      title: '系统与更新',
      items: [
        {
          id: 'autoUpdate',
          label: '自动更新',
          description: '自动检查并安装应用更新',
          type: 'toggle',
          defaultValue: localStorage.getItem('setting_autoUpdate') !== 'false'
        }
      ]
    }
  ]
}
// 5、在react中使用useReducer来管理计数状态，并在组件中提供按钮来触发不同的操作
function Counter() {
  const [state, dispatch] = useReducer(countReducer, initialState)

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>当前计数: {state.count}</h2>

      <button onClick={() => dispatch({ type: 'increment' })}>加 1</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>减 1</button>
      {/* 新增额外参数 */}
      <button onClick={() => dispatch({ type: 'SET', payload: 100 })}>直接设为 100</button>
    </div>
  )
}

function formatBytes(bytes: number): string {
  if (bytes >= 1073741824) return (bytes / 1073741824).toFixed(1) + ' GB'
  if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + ' MB'
  if (bytes >= 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return bytes + ' B'
}

function SettingsView(): React.JSX.Element {
  const navigate = useNavigate()
  const settingCategories = buildSettingCategories()

  const handleToggle = (id: string, value: boolean): void => {
    console.log(`Toggle ${id}: ${value}`)
    localStorage.setItem(`setting_${id}`, String(value))
  }

  const handleSelect = (id: string, value: string): void => {
    console.log(`Select ${id}: ${value}`)
    localStorage.setItem(`setting_${id}`, value)
    if (id === 'language') {
      window.dispatchEvent(new CustomEvent('language-changed', { detail: value }))
    }
  }

  const [memory, setMemory] = useState<ProcessMemoryInfo | null>(null)
  const [memoryAlive, setMemoryAlive] = useState(true)

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

  const [pingResults, setPingResults] = useState<PingResult[] | null>(null)
  const [pinging, setPinging] = useState(false)

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

  const [saveContent, setSaveContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [showAgnesTip, setShowAgnesTip] = useState(false)

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

  return (
    /* 8、创建AppProvider组件，并传入AppContext.tsx中的AppProvider */
    <AppProvider>
      <div
        className="settings-container"
        style={{ backgroundColor: '#0b61b7', minHeight: '100vh', padding: '24px' }}
      >
        <div className="settings-header">
          <button className="back-button" onClick={() => navigate('/')}>
            ← 返回
          </button>
          <h1 className="settings-title">设置</h1>
        </div>

        <div className="settings-content">
          {settingCategories.map((cat) => (
            <div className="settings-category" key={cat.id}>
              <h2 className="category-title">{cat.title}</h2>
              {cat.items.map((setting) => (
                <SettingItemComponent
                  key={setting.id}
                  setting={setting}
                  onToggle={handleToggle}
                  onSelect={handleSelect}
                />
              ))}
            </div>
          ))}

          {/* 内存占用监听 */}
          <div className="settings-category">
            <h2 className="category-title">内存占用监听</h2>
            <div className="setting-row">
              <div className="setting-info">
                <h3 className="setting-label">进程内存</h3>
                <p className="setting-description">
                  实时查看 Electron 主进程内存占用（每 2 秒刷新）
                </p>
              </div>
              <div className="memory-display">
                <span className={`memory-dot ${memoryAlive ? 'dot-green' : 'dot-red'}`} />
                <div className="memory-stats">
                  <div className="memory-stat">
                    <span className="memory-stat-label">RSS</span>
                    <span className="memory-stat-value">
                      {memory ? formatBytes(memory.residentSet) : '---'}
                    </span>
                  </div>
                  <div className="memory-stat">
                    <span className="memory-stat-label">堆内</span>
                    <span className="memory-stat-value">
                      {memory ? formatBytes(memory.private) : '---'}
                    </span>
                  </div>
                  <div className="memory-stat">
                    <span className="memory-stat-label">共享</span>
                    <span className="memory-stat-value">
                      {memory ? formatBytes(memory.shared) : '---'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 网络延迟测速 */}
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
                    <span
                      className={`ping-result-latency ${r.latency !== null ? (r.latency < 200 ? 'latency-fast' : r.latency < 500 ? 'latency-mid' : 'latency-slow') : 'latency-err'}`}
                    >
                      {r.latency !== null ? `${r.latency} ms` : r.error || '失败'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 保存文件到本地 */}
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
    </AppProvider>
  )
}

export default SettingsView
