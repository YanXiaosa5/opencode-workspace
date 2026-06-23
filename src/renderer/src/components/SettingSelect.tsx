function SettingSelect({
  value,
  onChange,
  options
}: {
  value: string
  onChange: (value: string) => void
  options: string[]
}): React.JSX.Element {
  return (
    <select className="setting-select" value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  )
}

export default SettingSelect
