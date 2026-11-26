import { useState } from 'react'
import useUpdatePost from '../../hooks/useUpdatePost'

export default function EditPostForm({ postId, initialBody, onDone, className = '' }) {
  const [body, setBody] = useState(initialBody ?? '')
  const { mutate: updatePost, isPending } = useUpdatePost()
  const isUnchanged = body.trim() === (initialBody ?? '').trim()

  function save(e) {
    e.preventDefault()
    if (!body.trim() || isUnchanged) return
    updatePost({ postId, body: body.trim() }, { onSuccess: onDone })
  }

  return (
    <form onSubmit={save} className={className}>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={3}
        autoFocus
        className="w-full resize-none rounded-xl border border-sand bg-white px-4 py-3 text-[15px] leading-relaxed text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
      />
      <div className="mt-2 flex justify-end gap-2">
        <button
          type="button"
          onClick={onDone}
          className="rounded-full border border-sand px-4 py-1.5 text-sm font-medium text-muted transition hover:bg-beige cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!body.trim() || isUnchanged || isPending}
          className="flex min-w-20 items-center justify-center rounded-full bg-accent px-4 py-1.5 text-sm font-semibold text-cream transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
        >
          {isPending ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-cream border-b-transparent"></span> : 'Save'}
        </button>
      </div>
    </form>
  )
}
