import SettingItemComponent, { type SettingItem } from '@renderer/components/SettingItemComponent'
import { SUPPORTED_LOCALES } from '@i18n'

const APPEARANCE_ITEMS: SettingItem[] = [
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
  },
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
  }
]

function AppearancePanel(): React.JSX.Element {
  const handleToggle = (id: string, value: boolean): void => {
    localStorage.setItem(`setting_${id}`, String(value))
  }

  const handleSelect = (id: string, value: string): void => {
    localStorage.setItem(`setting_${id}`, value)
    if (id === 'language') {
      window.dispatchEvent(new CustomEvent('language-changed', { detail: value }))
    }
  }

  return (
    <div>
      <h1 className="sp-page-title">外观</h1>
      <p className="sp-page-desc">自定义应用的视觉风格与语言</p>

      <div className="settings-content">
        <div className="settings-category">
          <h2 className="category-title">主题</h2>
          {APPEARANCE_ITEMS.slice(0, 3).map((item) => (
            <SettingItemComponent
              key={item.id}
              setting={item}
              onToggle={handleToggle}
              onSelect={handleSelect}
            />
          ))}
        </div>

        <div className="settings-category">
          <h2 className="category-title">语言</h2>
          {APPEARANCE_ITEMS.slice(3).map((item) => (
            <SettingItemComponent
              key={item.id}
              setting={item}
              onToggle={handleToggle}
              onSelect={handleSelect}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default AppearancePanel
