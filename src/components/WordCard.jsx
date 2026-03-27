import { Link } from 'react-router-dom'

function getDisplayCopy(word, displayLanguage) {
  const isCreeFirst = displayLanguage === 'cree'

  return {
    title: isCreeFirst ? word.cree : word.english,
    form: word.syllabics || '',
    translation: isCreeFirst ? word.english : word.cree,
  }
}

export default function WordCard({ word, displayLanguage = 'english', onPlayAudio }) {
  const copy = getDisplayCopy(word, displayLanguage)

  return (
    <article className="word-card">
      <div className="word-card-top">
        <div>
          <h3>{copy.title}</h3>
          {copy.form ? <p className="cree-line">{copy.form}</p> : null}
          <p className="definition-text">{copy.translation}</p>
        </div>

        <button className="icon-button icon-soft" onClick={() => onPlayAudio(word)} aria-label={word.audioLabel}>
          🔊
        </button>
      </div>

      <div className="chip-row">
        {word.topicIds.map((topicId) => (
          <span key={topicId} className="chip chip-neutral">
            {topicId === 'animals' ? 'Animals' : topicId === 'kinship' ? 'Kinship' : topicId}
          </span>
        ))}
      </div>

      <div className="card-actions">
        <Link className="secondary-button" to={`/details/${word.id}?lang=${displayLanguage}`}>
          Details
        </Link>

        <Link className="primary-button" to={`/related/${word.id}?lang=${displayLanguage}`}>
          Related Words
        </Link>
      </div>
    </article>
  )
}