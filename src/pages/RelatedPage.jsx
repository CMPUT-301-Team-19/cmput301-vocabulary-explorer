import { useEffect, useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import AppShell from '../components/AppShell'
import Modal from '../components/Modal'
import { getWord } from '../data'
import { useApp } from '../AppContext'

function getDisplayText(word, displayLanguage) {
  const isCreeFirst = displayLanguage === 'cree'

  return {
    title: isCreeFirst ? word.cree : word.english,
    form: word.syllabics || '',
    translation: isCreeFirst ? word.english : word.cree,
  }
}

function RelationBubble({ word, position, displayLanguage }) {
  const text = getDisplayText(word, displayLanguage)
  const cree = word.cree || word.english
  const english = word.english || word.cree
  const form = word.syllabics || ''

  return (
    <Link className="relation-bubble" to={`/related/${word.id}?lang=${displayLanguage}`} style={position}>
      <strong>{cree}</strong>
      {form ? <small>{form}</small> : null}
      <span>{english}</span>
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
  const [searchParams] = useSearchParams()
  const displayLanguage = searchParams.get('lang') === 'cree' ? 'cree' : 'english'

  const { notify, saveTopic } = useApp()
  const [allWordsOpen, setAllWordsOpen] = useState(false)
  const [saveOpen, setSaveOpen] = useState(false)
  const [topicName, setTopicName] = useState('')

  const word = getWord(wordId)

  const allRelations = useMemo(() => {
    if (!word) return []
    return word.relations
      .map((relation) => ({ ...relation, word: getWord(relation.id) }))
      .filter((relation) => relation.word)
  }, [word])

  const [selectedIds, setSelectedIds] = useState([])

  useEffect(() => {
    setSelectedIds(allRelations.slice(0, 3).map((relation) => relation.word.id))
    setTopicName(`${displayLanguage === 'cree' ? word?.cree : word?.english || 'Topic'} set`)
  }, [wordId, allRelations, word, displayLanguage])

  if (!word) {
    return (
      <AppShell title="Related Words" showBack>
        <section className="empty-state-card">
          <h2>That word is not in this prototype.</h2>
        </section>
      </AppShell>
    )
  }

  const selectedWords = allRelations
    .filter((relation) => selectedIds.includes(relation.word.id))
    .map((relation) => relation.word)

  const toggleWord = (id) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )
  }

  const focusText = getDisplayText(word, displayLanguage)
  const focusCree = word.cree || word.english
  const focusEnglish = word.english || word.cree
  const focusForm = word.syllabics || ''

  return (
    <AppShell title="Related Words" showBack>
      <section className="hero-card compact-card">
        <div>
          <p className="eyebrow">Current focus</p>
          <h2>{focusCree}</h2>
          {focusForm ? <p className="muted">{focusForm}</p> : null}
          <p className="muted">{focusEnglish}</p>
        </div>

        <div className="chip-row">
          <button
            className="icon-button icon-soft"
            onClick={() => notify(`Audio preview: ${word.cree}`, 'info')}
            aria-label="Play audio preview"
          >
            🔊
          </button>
        </div>
      </section>

      <section className="relationship-map-card">
        <div className="focus-bubble">
          <strong>{focusCree}</strong>
          {focusForm ? <small>{focusForm}</small> : null}
          <span>{focusEnglish}</span>
        </div>

        {selectedWords.slice(0, 4).map((relationWord, index) => (
          <RelationBubble
            key={relationWord.id}
            word={relationWord}
            position={relationPositions[index]}
            displayLanguage={displayLanguage}
          />
        ))}
      </section>

      <section className="action-panel">
        <button className="secondary-button" onClick={() => setAllWordsOpen(true)}>
          All Related Words
        </button>

        <Link className="secondary-button" to={`/details/${word.id}?lang=${displayLanguage}`}>
          Open Details
        </Link>

        <button className="primary-button" onClick={() => setSaveOpen(true)}>
          Save Topic
        </button>
      </section>

      {allWordsOpen && (
        <Modal title="All Related Words" onClose={() => setAllWordsOpen(false)}>
          <div className="stack-list compact-stack">
            {allRelations.map((relation) => {
              const relationText = getDisplayText(relation.word, displayLanguage)

              return (
                <div key={relation.word.id} className="selection-row">
                  <Link
                    className="selection-link"
                    to={`/related/${relation.word.id}?lang=${displayLanguage}`}
                    onClick={() => setAllWordsOpen(false)}
                  >
                    <strong>{relationText.title}</strong>
                    {relationText.form ? <p className="muted small-copy">{relationText.form}</p> : null}
                    <p className="muted small-copy">{relationText.translation}</p>
                  </Link>

                  <div className="mini-actions">
                    <button
                      className={
                        selectedIds.includes(relation.word.id)
                          ? 'secondary-button small'
                          : 'primary-button small'
                      }
                      onClick={() => toggleWord(relation.word.id)}
                    >
                      {selectedIds.includes(relation.word.id) ? 'Unselect' : 'Select'}
                    </button>
                  </div>
                </div>
              )
            })}
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
              {[word, ...selectedWords].map((item) => {
                const itemText = getDisplayText(item, displayLanguage)
                return (
                  <span key={item.id} className="chip chip-neutral">
                    {itemText.title}
                  </span>
                )
              })}
            </div>
          </div>

          <div className="modal-actions">
            <button className="secondary-button" onClick={() => setSaveOpen(false)}>
              Cancel
            </button>

            <button
              className="primary-button"
              onClick={() => {
                saveTopic({
                  name: topicName,
                  words: [word.id, ...selectedWords.map((item) => item.id)],
                })
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