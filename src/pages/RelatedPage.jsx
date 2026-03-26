import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import AppShell from '../components/AppShell'
import Modal from '../components/Modal'
import { getWord } from '../data'
import { useApp } from '../AppContext'

function RelationBubble({ word, position }) {
  return (
    <Link className="relation-bubble" to={`/details/${word.id}`} style={position}>
      <strong>{word.english}</strong>
      <span>{word.cree}</span>
    </Link>
  )
}

const relationPositions = [
  { top: '5%', left: '35%' },
  { top: '52%', left: '3%' },
  { top: '52%', left: '66%' },
  { top: '76%', left: '34%' },
]

export default function RelatedPage() {
  const { wordId } = useParams()
  const { mode, notify, saveTopic } = useApp()
  const [allWordsOpen, setAllWordsOpen] = useState(false)
  const [saveOpen, setSaveOpen] = useState(false)
  const [topicName, setTopicName] = useState('')
  const [filter, setFilter] = useState('all')
  const word = getWord(wordId)

  const allRelations = useMemo(() => {
    if (!word) return []
    return word.relations
      .map((relation) => ({ ...relation, word: getWord(relation.id) }))
      .filter((relation) => relation.word)
  }, [word])

  const filteredRelations = useMemo(() => {
    if (filter === 'all') return allRelations
    return allRelations.filter((relation) => relation.type === filter)
  }, [allRelations, filter])

  const [selectedIds, setSelectedIds] = useState(filteredRelations.slice(0, 3).map((relation) => relation.word.id))

  useEffect(() => {
    setSelectedIds(allRelations.slice(0, 3).map((relation) => relation.word.id))
    setTopicName(`${word?.english || 'Topic'} set`)
  }, [wordId])

  useEffect(() => {
    setSelectedIds((current) => current.filter((id) => filteredRelations.some((relation) => relation.word.id === id)))
  }, [filter])

  if (!word) {
    return (
      <AppShell title="Related Words" showBack>
        <section className="empty-state-card">
          <h2>That word is not in this prototype.</h2>
        </section>
      </AppShell>
    )
  }

  const selectedWords = filteredRelations
    .filter((relation) => selectedIds.includes(relation.word.id))
    .map((relation) => relation.word)

  const toggleWord = (id) => {
    setSelectedIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))
  }

  return (
    <AppShell title="Related Words" showBack>
      <section className="hero-card compact-card">
        <div>
          <p className="eyebrow">Current focus</p>
          <h2>
            {word.english} · {word.cree}
          </h2>
          <p className="muted">{word.shortDefinition}</p>
        </div>
        <div className="chip-row">
          {mode === 'expert' && ['all', ...Array.from(new Set(allRelations.map((relation) => relation.type)))].map((type) => (
            <button
              key={type}
              className={filter === type ? 'chip chip-highlight button-chip' : 'chip chip-neutral button-chip'}
              onClick={() => setFilter(type)}
            >
              {type === 'all' ? 'All links' : type}
            </button>
          ))}
          <button className="icon-button icon-soft" onClick={() => notify(`Audio preview: ${word.cree}`, 'info')}>
            🔊
          </button>
        </div>
      </section>

      <section className="relationship-map-card">
        <div className="focus-bubble">
          <strong>{word.english}</strong>
          <span>{word.cree}</span>
        </div>
        {selectedWords.slice(0, 4).map((relationWord, index) => (
          <RelationBubble key={relationWord.id} word={relationWord} position={relationPositions[index]} />
        ))}
      </section>

      <section className="action-panel">
        <button className="secondary-button" onClick={() => setAllWordsOpen(true)}>
          All Related Words
        </button>
        <Link className="secondary-button" to={`/details/${word.id}`}>
          Open Details
        </Link>
        <button className="primary-button" onClick={() => setSaveOpen(true)}>
          Save Topic
        </button>
      </section>

      <section className="section-block slim-stack">
        {selectedWords.map((relationWord) => {
          const relationMeta = filteredRelations.find((relation) => relation.word.id === relationWord.id)
          return (
            <div key={relationWord.id} className="mini-list-card">
              <div>
                <strong>{relationWord.english}</strong>
                <p className="muted small-copy">{relationWord.cree}</p>
              </div>
              <div className="chip-row compact-chip-row">
                {mode === 'expert' && relationMeta && <span className="chip chip-soft">{relationMeta.type}</span>}
                <Link className="text-button" to={`/details/${relationWord.id}`}>
                  View
                </Link>
              </div>
            </div>
          )
        })}
      </section>

      {allWordsOpen && (
        <Modal title="All Related Words" onClose={() => setAllWordsOpen(false)}>
          <div className="stack-list compact-stack">
            {filteredRelations.map((relation) => (
              <div key={relation.word.id} className="selection-row">
                <div>
                  <strong>{relation.word.english}</strong>
                  <p className="muted small-copy">{relation.word.cree}</p>
                  {mode === 'expert' && <small className="muted">Relation: {relation.type}</small>}
                </div>
                <button className={selectedIds.includes(relation.word.id) ? 'secondary-button small' : 'primary-button small'} onClick={() => toggleWord(relation.word.id)}>
                  {selectedIds.includes(relation.word.id) ? 'Unselect' : 'Select'}
                </button>
              </div>
            ))}
          </div>
        </Modal>
      )}

      {saveOpen && (
        <Modal title="Save Topic" onClose={() => setSaveOpen(false)}>
          <label className="form-field">
            <span>Topic name</span>
            <input value={topicName} onChange={(event) => setTopicName(event.target.value)} />
          </label>
          <div className="preview-box">
            <strong>Words to save</strong>
            <div className="chip-row compact-chip-row">
              {[word, ...selectedWords].map((item) => (
                <span key={item.id} className="chip chip-neutral">
                  {item.english}
                </span>
              ))}
            </div>
          </div>
          <div className="modal-actions">
            <button className="secondary-button" onClick={() => setSaveOpen(false)}>
              Cancel
            </button>
            <button
              className="primary-button"
              onClick={() => {
                saveTopic({ name: topicName, words: [word.id, ...selectedWords.map((item) => item.id)] })
                setSaveOpen(false)
              }}
            >
              Create topic
            </button>
          </div>
        </Modal>
      )}
    </AppShell>
  )
}
