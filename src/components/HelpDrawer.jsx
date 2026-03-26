import Modal from './Modal'

export default function HelpDrawer({ help, onClose }) {
  if (!help) return null

  return (
    <Modal title={help.title} onClose={onClose}>
      <div className="help-panel">
        <p className="muted">Quick hints for this screen.</p>
        <ul className="help-list">
          {help.tips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </div>
    </Modal>
  )
}
