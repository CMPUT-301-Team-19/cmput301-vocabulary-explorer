import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import AppShell from '../components/AppShell'
import TopicGraph from '../components/TopicGraph'
import { getTopic, getWordsForTopic } from '../data'
import { useApp } from '../AppContext'

export default function TopicPage() {
  const { topicId } = useParams()
  const navigate = useNavigate()
  const { notify } = useApp()
  const [expanded, setExpanded] = useState(false)
  const topic = getTopic(topicId)
  const words = useMemo(() => getWordsForTopic(topicId), [topicId])

  if (!topic || !topic.prototypeReady) {
    return (
      <AppShell title="Topic" showBack>
        <section className="empty-state-card">
          <h2>That topic is not part of this prototype yet.</h2>
          <button className="primary-button" onClick={() => navigate('/')}>
            Go home
          </button>
        </section>
      </AppShell>
    )
  }

  return (
    <AppShell title={topic.label} showBack>
      {/* <section className="hero-card compact-card">
        <div>
          <p className="eyebrow">Topic view</p>
          <h2>{topic.description}</h2>
          <p className="muted">
            The network starts small on purpose. Tap a word to move into the related-word view.
          </p>
        </div>
        <div className="chip-row">
          <span className="chip chip-highlight">Tap to explore</span>
          <button className="secondary-button small" onClick={() => setExpanded((value) => !value)}>
            {expanded ? 'Show less' : 'Show more'}
          </button>
        </div>
      </section> */}

      <TopicGraph topic={topic} words={words} expanded={expanded} />

      {/* <section className="section-block slim-stack">
        {words.slice(0, expanded ? words.length : 3).map((word) => (
          <div key={word.id} className="mini-list-card">
            <div>
              <strong>{word.english}</strong>
              <p className="muted small-copy">{word.cree}</p>
            </div>
            <div className="mini-actions">
              <Link className="secondary-button small" to={`/details/${word.id}`}>
                Details
              </Link>
              <Link className="primary-button small" to={`/related/${word.id}`}>
                Related Words
              </Link>
            </div>
          </div>
        ))}
      </section> */}
    </AppShell>
  )
}
