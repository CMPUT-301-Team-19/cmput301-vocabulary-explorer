import { useEffect, useRef, useState } from 'react'
import { getAutocompleteSuggestions } from '../data'

export default function SearchField({ value, onChange, onSubmit, placeholder = 'Search English or Cree' }) {
  const [suggestions, setSuggestions] = useState([])
  const wrapperRef = useRef(null)

  useEffect(() => {
    setSuggestions(getAutocompleteSuggestions(value))
  }, [value])

  useEffect(() => {
    const handler = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setSuggestions([])
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const submit = (query) => {
    const next = query.trim()
    if (!next) return
    setSuggestions([])
    onSubmit(next)
  }

  return (
    <div className="search-field" ref={wrapperRef}>
      <div className="search-box">
        <span className="search-icon">⌕</span>
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              submit(value)
            }
          }}
        />
        <button className="primary-button small" onClick={() => submit(value)}>
          Search
        </button>
      </div>
      {suggestions.length > 0 && (
        <div className="suggestion-menu">
          {suggestions.map((suggestion) => (
            <button
              type="button"
              className="suggestion-item"
              key={`${suggestion.kind}-${suggestion.id}`}
              onClick={() => {
                onChange(suggestion.query)
                submit(suggestion.query)
              }}
            >
              <span>{suggestion.label}</span>
              <small>{suggestion.kind === 'topic' ? 'Topic' : 'Word'}</small>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
