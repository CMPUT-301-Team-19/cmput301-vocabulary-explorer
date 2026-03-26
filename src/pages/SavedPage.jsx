import { Link } from 'react-router-dom'
import { useState } from 'react'
import AppShell from '../components/AppShell'
import Modal from '../components/Modal'
import { getWord } from '../data'
import { useApp } from '../AppContext'

export default function SavedPage() {
  const { savedTopics, deleteTopic, removeWordFromTopic } = useApp()
  const [viewTopic, setViewTopic] = useState(null)
  const [deleteTopicState, setDeleteTopicState] = useState(null)

  return (
    <AppShell title="Saved topics">
      {savedTopics.length === 0 ? (
        <section className="empty-state-card">
          <h2>No topics saved yet.</h2>
          <p>Save a word set from the Related Words screen to see it here.</p>
          <Link className="primary-button" to="/">
            Go home
          </Link>
        </section>
      ) : (
        <div className="stack-list">
          {savedTopics.map((topic) => (
            <article key={topic.id} className="topic-list-card">
              <div>
                <h3>{topic.name}</h3>
                <p className="muted">{topic.words.length} word(s)</p>
                {topic.note && <p className="small-copy muted">{topic.note}</p>}
              </div>
              <div className="card-actions vertical-actions">
                <button className="secondary-button small" onClick={() => setViewTopic(topic)}>
                  View
                </button>
                <button className="danger-button small" onClick={() => setDeleteTopicState(topic)}>
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {viewTopic && (
        <Modal title={viewTopic.name} onClose={() => setViewTopic(null)}>
          <div className="stack-list compact-stack">
            {viewTopic.words.map((wordId) => {
              const word = getWord(wordId)
              if (!word) return null
              return (
                <div key={wordId} className="selection-row">
                  <div>
                    <strong>{word.english}</strong>
                    <p className="muted small-copy">{word.cree}</p>
                  </div>
                  <div className="mini-actions">
                    <Link className="text-button" to={`/details/${word.id}`} onClick={() => setViewTopic(null)}>
                      Details
                    </Link>
                    <button className="danger-button small" onClick={() => removeWordFromTopic(viewTopic.id, word.id)}>
                      Remove
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </Modal>
      )}

      {deleteTopicState && (
        <Modal title="Delete topic?" onClose={() => setDeleteTopicState(null)}>
          <p>
            Are you sure you want to delete <strong>{deleteTopicState.name}</strong>?
          </p>
          <div className="modal-actions">
            <button className="secondary-button" onClick={() => setDeleteTopicState(null)}>
              No
            </button>
            <button
              className="danger-button"
              onClick={() => {
                deleteTopic(deleteTopicState.id)
                setDeleteTopicState(null)
              }}
            >
              Yes, delete
            </button>
          </div>
        </Modal>
      )}
    </AppShell>
  )
}
