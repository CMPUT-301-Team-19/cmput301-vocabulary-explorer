import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import AppShell from '../components/AppShell'
import { getWord } from '../data'
import { useApp } from '../AppContext'

export default function DetailsPage() {
  const { wordId } = useParams()
  const { mode, notify, saveTopic } = useApp()
  const word = getWord(wordId)
  const defaultForm = word?.forms?.[0]?.key || null
  const [activeForm, setActiveForm] = useState(defaultForm)

  const selectedForm = useMemo(() => {
    if (!word?.forms?.length) return null
    return word.forms.find((form) => form.key === activeForm) || word.forms[0]
  }, [word, activeForm])

  if (!word) {
    return (
      <AppShell title="Details" showBack>
        <section className="empty-state-card">
          <h2>That word is not in this prototype.</h2>
        </section>
      </AppShell>
    )
  }

  return (
    <AppShell title="Details" showBack>
      <section className="detail-hero-card">
        <div>
          <p className="eyebrow">Word details</p>
          <h2>{word.cree}</h2>
          <p className="muted">
            {word.english} · {word.syllabics}
          </p>
        </div>
        <div className="detail-hero-actions">
          <button className="icon-button icon-soft" onClick={() => notify(`Audio preview: ${word.cree}`, 'info')}>
            🔊
          </button>
          <button
            className="primary-button small"
            onClick={() => saveTopic({ name: 'My study list', words: [word.id] })}
          >
            Save word
          </button>
        </div>
      </section>

      <section className="section-card">
        <h3>Meaning</h3>
        <p>{word.shortDefinition}</p>
        <p className="muted">{word.description}</p>
      </section>

      {word.forms.length > 0 && (
        <section className="section-card">
          <h3>Quick possessor view</h3>
          <div className="segment-control">
            {word.forms.map((form) => (
              <button
                key={form.key}
                className={selectedForm?.key === form.key ? 'segment-active' : 'segment'}
                onClick={() => setActiveForm(form.key)}
              >
                {form.label}
              </button>
            ))}
          </div>
          <div className="form-preview">
            <strong>{selectedForm?.value}</strong>
            <p className="muted">This keeps the kinship forms visible without opening a dense grammar table.</p>
          </div>
        </section>
      )}

      <section className="section-card">
        <h3>Example</h3>
        <p>{word.example}</p>
      </section>

      <section className="section-card">
        <h3>{mode === 'expert' ? 'Grammar and notes' : 'Word notes'}</h3>
        <p>{mode === 'expert' ? word.grammar.expert : word.grammar.learner}</p>
      </section>

      <section className="section-card">
        <div className="section-header-inline">
          <h3>Related next steps</h3>
          <Link className="text-button" to={`/related/${word.id}`}>
            Open Related Words
          </Link>
        </div>
        <div className="chip-row compact-chip-row">
          {word.relations.slice(0, 4).map((relation) => {
            const relatedWord = getWord(relation.id)
            if (!relatedWord) return null
            return (
              <Link key={relation.id} className="chip chip-neutral chip-link" to={`/details/${relatedWord.id}`}>
                {relatedWord.english}
              </Link>
            )
          })}
        </div>
      </section>
    </AppShell>
  )
}
