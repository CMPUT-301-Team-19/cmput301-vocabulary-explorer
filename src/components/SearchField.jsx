import { useMemo } from 'react'
import { searchWords } from '../data'

function normalize(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
}

function getSuggestionDisplayLanguage(query, word) {
  const q = normalize(query)
  const english = normalize(word.english)
  const cree = normalize(word.cree)
  const syllabics = normalize(word.syllabics)

  const creeStarts = cree.startsWith(q) || syllabics.startsWith(q)
  const englishStarts = english.startsWith(q)

  if (creeStarts && !englishStarts) return 'cree'
  if (englishStarts && !creeStarts) return 'english'

  const creeIncludes = cree.includes(q) || syllabics.includes(q)
  const englishIncludes = english.includes(q)

  if (creeIncludes && !englishIncludes) return 'cree'
  if (englishIncludes && !creeIncludes) return 'english'

  return 'english'
}

function getSuggestionLabel(query, word) {
  const displayLanguage = getSuggestionDisplayLanguage(query, word)

  return displayLanguage === 'cree'
    ? {
        text: `${word.cree} · ${word.english}`,
        submitValue: word.cree,
      }
    : {
        text: `${word.english} · ${word.cree}`,
        submitValue: word.english,
      }
}

export default function SearchField({
  value,
  onChange,
  onSubmit,
  placeholder = 'Search',
}) {
  const suggestions = useMemo(() => {
    if (!value.trim()) return []
    return searchWords(value).slice(0, 5)
  }, [value])

  return (
    <div className="search-field">
      <form
        className="search-box"
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit(value)
        }}
      >
        <span className="search-icon">⌕</span>
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          aria-label="Search"
        />
        <button type="submit" className="primary-button">
          Search
        </button>
      </form>

      {value.trim() && suggestions.length > 0 && (
        <div className="suggestion-menu">
          {suggestions.map((word) => {
            const suggestion = getSuggestionLabel(value, word)

            return (
              <button
                key={word.id}
                type="button"
                className="suggestion-item"
                onClick={() => onSubmit(suggestion.submitValue)}
              >
                <span>{suggestion.text}</span>
                <span className="muted">Word</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}