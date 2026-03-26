import { Link } from 'react-router-dom'

export default function WordCard({ word, mode, onPlayAudio }) {
  return (
    <article className="word-card">
      <div className="word-card-top">
        <div>
          <h3>{word.english}</h3>
          <p className="cree-line">
            {word.cree} <span>{word.syllabics}</span>
          </p>
        </div>
        <button className="icon-button icon-soft" onClick={() => onPlayAudio(word)} aria-label={word.audioLabel}>
          🔊
        </button>
      </div>
      <p className="definition-text">{word.shortDefinition}</p>
      <div className="chip-row">
        {word.topicIds.map((topicId) => (
          <span key={topicId} className="chip chip-neutral">
            {topicId === 'animals' ? 'Animals' : topicId === 'kinship' ? 'Kinship' : topicId}
          </span>
        ))}
        {mode === 'expert' && <span className="chip chip-soft">{word.grammar.expert}</span>}
      </div>
      <div className="card-actions">
        <Link className="secondary-button" to={`/details/${word.id}`}>
          Details
        </Link>
        <Link className="primary-button" to={`/related/${word.id}`}>
          Related Words
        </Link>
      </div>
    </article>
  )
}
