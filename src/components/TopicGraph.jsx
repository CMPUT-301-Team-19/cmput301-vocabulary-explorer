import { useMemo } from 'react'
import { Link } from 'react-router-dom'

const positions = [
  { top: '18%', left: '18%', level: 'primary' },
  { top: '16%', left: '68%', level: 'primary' },
  { top: '68%', left: '18%', level: 'primary' },
  { top: '68%', left: '68%', level: 'primary' },
  { top: '84%', left: '32%', level: 'secondary' },
  { top: '84%', left: '78%', level: 'secondary' },
]

const lines = [
  { x1: '50%', y1: '50%', x2: '22%', y2: '22%' },
  { x1: '50%', y1: '50%', x2: '72%', y2: '20%' },
  { x1: '50%', y1: '50%', x2: '22%', y2: '72%' },
  { x1: '50%', y1: '50%', x2: '72%', y2: '72%' },
  { x1: '22%', y1: '72%', x2: '34%', y2: '86%' },
  { x1: '72%', y1: '72%', x2: '80%', y2: '86%' },
]

export default function TopicGraph({ topic, words, expanded }) {
  const safeWords = Array.isArray(words) ? words : []

  const visibleWords = useMemo(() => {
    return expanded ? safeWords.slice(0, 6) : safeWords.slice(0, 4)
  }, [safeWords, expanded])

  const visibleLines = expanded ? lines : lines.slice(0, 4)

  return (
    <div className="graph-card graph-card-topic">
      <svg className="graph-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {visibleLines.map((line, index) => (
          <line
            key={index}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>

      <div className="topic-center-node">
        <div className="topic-icon">{topic.icon}</div>
        <strong>{topic.label}</strong>
      </div>

      {visibleWords.map((word, index) => {
        const position = positions[index]
        if (!position) return null

        return (
          <Link
            key={word.id}
            to={`/related/${word.id}`}
            className={`graph-node ${position.level === 'secondary' ? 'graph-node-secondary' : ''}`}
            style={{ top: position.top, left: position.left }}
          >
            <span>{word.english}</span>
            <small>{word.cree}</small>
          </Link>
        )
      })}
    </div>
  )
}
