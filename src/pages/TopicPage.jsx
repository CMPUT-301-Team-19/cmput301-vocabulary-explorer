import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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
  const words = useMemo(() => getWordsForTopic(topicId) || [], [topicId])

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
      <TopicGraph topic={topic} words={words} expanded={expanded} />
      
      <section className="hero-card compact-card">

        <div className="explore-category">
          <span>Tap a node to explore related words.</span>
          {/* <span className="chip chip-highlight">{expanded ? 'Expanded network' : 'Compact network'}</span> */}
          <button className="secondary-button small" onClick={() => setExpanded((value) => !value)}>
            {expanded ? 'Show less' : 'Show more'}
          </button>
        </div>
        
      </section>
    </AppShell>
  )
}