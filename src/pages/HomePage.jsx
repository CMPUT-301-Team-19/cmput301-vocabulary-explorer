import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../components/AppShell'
import SearchField from '../components/SearchField'
import { TOPICS } from '../data'
import { useApp } from '../AppContext'

export default function HomePage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const { notify } = useApp()

  return (
    <AppShell title="Vocabulary Explorer">
      <section className="hero-card">
        {/* <div>
          <p className="eyebrow">Browse or search</p>
        </div> */}
        <SearchField
          value={query}
          onChange={setQuery}
          onSubmit={(value) => navigate(`/search?q=${encodeURIComponent(value)}`)}
        />
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Browse Topics</p>
            <h2>Start from a familiar theme</h2>
          </div>
        </div>
        <div className="topic-grid">
          {TOPICS.map((topic) => (
            <button
              key={topic.id}
              className={`topic-card ${topic.prototypeReady ? '' : 'disabled-card'}`}
              onClick={() => {
                if (!topic.prototypeReady) {
                  notify(`${topic.label} is planned for a later prototype round.`, 'info')
                  return
                }
                navigate(`/topic/${topic.id}`)
              }}
            >
              <span className="topic-emoji" aria-hidden="true">
                {topic.icon}
              </span>
              <strong>{topic.label}</strong>
              <p>{topic.description}</p>
              {!topic.prototypeReady && <span className="chip chip-neutral">Prototype later</span>}
            </button>
          ))}
        </div>
      </section>
    </AppShell>
  )
}
