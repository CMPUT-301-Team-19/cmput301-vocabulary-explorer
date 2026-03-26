import { useApp } from '../AppContext'

export default function ToastStack() {
  const { toasts } = useApp()

  return (
    <div className="toast-stack" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast ${toast.tone || 'success'}`}>
          {toast.message}
        </div>
      ))}
    </div>
  )
}
