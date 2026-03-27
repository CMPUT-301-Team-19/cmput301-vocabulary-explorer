import { createContext, useContext, useMemo, useState } from 'react'
import { getInitialSavedTopics } from './data'

const AppContext = createContext(null)

function makeToast(message, tone = 'success') {
  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    message,
    tone,
  }
}

export function AppProvider({ children }) {
  const [savedTopics, setSavedTopics] = useState(getInitialSavedTopics())
  const [toasts, setToasts] = useState([])

  const notify = (message, tone = 'success') => {
    const toast = makeToast(message, tone)
    setToasts((current) => [...current, toast])
    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== toast.id))
    }, 2800)
  }

  const saveTopic = ({ name, words, note = '' }) => {
    const topicName = name.trim() || 'Untitled topic'
    setSavedTopics((current) => {
      const existing = current.find((topic) => topic.name.toLowerCase() === topicName.toLowerCase())
      if (existing) {
        const merged = Array.from(new Set([...existing.words, ...words]))
        return current.map((topic) =>
          topic.id === existing.id ? { ...topic, words: merged, note: note || topic.note } : topic,
        )
      }
      return [
        {
          id: `topic-${Date.now()}`,
          name: topicName,
          words,
          note,
        },
        ...current,
      ]
    })
    notify(`Saved to “${topicName}”.`)
  }

  const deleteTopic = (topicId) => {
    setSavedTopics((current) => current.filter((topic) => topic.id !== topicId))
    notify('Topic deleted.', 'danger')
  }

  const removeWordFromTopic = (topicId, wordId) => {
    setSavedTopics((current) =>
      current.map((topic) =>
        topic.id === topicId
          ? { ...topic, words: topic.words.filter((id) => id !== wordId) }
          : topic,
      ),
    )
    notify('Word removed from topic.', 'info')
  }

  const value = useMemo(
    () => ({
      savedTopics,
      saveTopic,
      deleteTopic,
      removeWordFromTopic,
      notify,
      toasts,
    }),
    [savedTopics, toasts],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}
