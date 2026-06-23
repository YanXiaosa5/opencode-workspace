function SettingToggle({
  checked,
  onChange
}: {
  checked: boolean
  onChange: (checked: boolean) => void
}): React.JSX.Element {
  return (
    <div className="toggle-switch" onClick={() => onChange(!checked)}>
      <div className={`toggle-slider ${checked ? 'on' : ''}`}>
        <div className="toggle-knob" />
      </div>
    </div>
  )
}

export default SettingToggle
