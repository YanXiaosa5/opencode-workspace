import { useState } from 'react'

interface SearchBarProps {
  onSearch?: (value: string) => void
  placeholder?: string
}

function SearchBar({ onSearch, placeholder = '搜索...' }: SearchBarProps): React.JSX.Element {
  const [value, setValue] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const v = e.target.value
    setValue(v)
    onSearch?.(v)
  }

  return (
    <div className="search-bar">
      <svg
        className="search-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
      >
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
      <input
        className="search-input"
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
      />
    </div>
  )
}

export default SearchBar
