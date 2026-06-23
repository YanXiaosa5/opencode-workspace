import { useState } from 'react'
import SettingToggle from './SettingToggle'
import SettingSelect from './SettingSelect'
import {
  useAppDispatch,
  useAppState
} from '@renderer/state/usereducerandcontext/AppContextProvider'

export interface SettingItem {
  id: string
  label: string
  description: string
  type: 'toggle' | 'select' | 'input'
  defaultValue: boolean | string
  options?: string[]
}

function SettingItemComponent({
  setting,
  onToggle,
  onSelect
}: {
  setting: SettingItem
  onToggle: (id: string, value: boolean) => void
  onSelect: (id: string, value: string) => void
}): React.JSX.Element {
  const [value, setValue] = useState(setting.defaultValue)

  /* 9、在子组件中使用 useAppState 和 useAppDispatch */
  const { theme } = useAppState()
  const dispatch = useAppDispatch()

  const handleToggle = (checked: boolean): void => {
    setValue(checked)
    onToggle(setting.id, checked)

    if (setting.id === 'darkMode') {
      dispatch({ type: 'TOGGLE_THEME' })
    }
  }

  const handleSelect = (newValue: string): void => {
    setValue(newValue)
    onSelect(setting.id, newValue)

    if (setting.id === 'language') {
      dispatch({ type: 'SET_LANGUAGE', payload: newValue === 'zh-CN' ? 'zh' : 'en' })
    }
  }

  return (
    <div className="setting-row">
      <div className="setting-info">
        <h3 className="setting-label">{setting.label}</h3>
        <p className="setting-description">
          {setting.description}
          {theme}
        </p>
      </div>
      <div className="setting-control">
        {setting.type === 'toggle' && (
          <SettingToggle checked={value as boolean} onChange={handleToggle} />
        )}
        {setting.type === 'select' && (
          <SettingSelect
            value={value as string}
            onChange={handleSelect}
            options={setting.options || []}
          />
        )}
      </div>
    </div>
  )
}

export default SettingItemComponent
