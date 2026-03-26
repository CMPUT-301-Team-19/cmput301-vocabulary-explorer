export default function Modal({ title, onClose, children, wide = false }) {
  return (
    <div className="overlay" role="dialog" aria-modal="true">
      <div className={`modal-card ${wide ? 'modal-wide' : ''}`}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="icon-button" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  )
}
