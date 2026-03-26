import { useMemo } from 'react'
import { Link } from 'react-router-dom'

const positions = [
  { top: '10%', left: '41%' },
  { top: '31%', left: '8%' },
  { top: '31%', left: '72%' },
  { top: '67%', left: '18%' },
  { top: '67%', left: '63%' },
]

export default function TopicGraph({ topic, words, expanded }) {
  const nodes = useMemo(() => {
    const visible = expanded ? words : words.slice(0, 4)
    return visible.map((word, index) => ({ ...word, position: positions[index + 1] || positions[0] }))
  }, [words, expanded])

  return (
    <div className="graph-card">
      <div className="topic-center-node">
        <div className="topic-icon">{topic.icon}</div>
        <strong>{topic.label}</strong>
      </div>
      {nodes.map((word) => (
        <Link
          key={word.id}
          to={`/related/${word.id}`}
          className="graph-node"
          style={{ top: word.position.top, left: word.position.left }}
        >
          <span>{word.english}</span>
          <small>{word.cree}</small>
        </Link>
      ))}
    </div>
  )
}
