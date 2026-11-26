import { useEffect } from 'react'

export default function ConfirmDialog({ isOpen, title, message, confirmText = 'Delete', isPending, onConfirm, onCancel }) {
  useEffect(() => {
    if (!isOpen) return
    function handleEscape(e) {
      if (e.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onCancel])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm" onClick={onCancel}>
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl border border-sand bg-cream p-6 shadow-xl"
      >
        <h2 className="text-lg font-semibold text-ink">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-muted">{message}</p>
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-sand px-5 py-2 text-sm font-medium text-muted transition hover:bg-beige cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="flex min-w-24 items-center justify-center rounded-full bg-accent px-5 py-2 text-sm font-semibold text-cream transition hover:opacity-90 disabled:opacity-60 cursor-pointer"
          >
            {isPending ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-cream border-b-transparent"></span> : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
