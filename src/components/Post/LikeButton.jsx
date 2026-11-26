export default function LikeButton({ isLiked, onLike }) {
  return (
    <button
      type="button"
      onClick={onLike}
      aria-pressed={isLiked}
      className={`group flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium hover:bg-beige transition active:scale-95 cursor-pointer ${isLiked ? 'text-accent' : 'text-ink'}`}
    >
      <svg
        width="17"
        height="17"
        viewBox="0 0 24 24"
        strokeWidth="2"
        className={`stroke-accent transition-all duration-150 ${isLiked ? 'fill-accent scale-110' : 'fill-none group-hover:fill-accent/30'}`}
      >
        <path d="M20.8 4.6c-1.8-1.8-4.7-1.8-6.5 0L12 6.9l-2.3-2.3c-1.8-1.8-4.7-1.8-6.5 0-1.8 1.8-1.8 4.7 0 6.5L12 20.4l8.8-9.3c1.8-1.8 1.8-4.7 0-6.5z" />
      </svg>
      Like
    </button>
  )
}
