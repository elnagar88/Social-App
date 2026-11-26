export default function SubmitButton({ isPending, children }) {
  return (
    <button
      type="submit"
      disabled={isPending}
      className="flex w-full items-center justify-center rounded-full bg-accent py-2.5 text-sm font-semibold text-cream shadow-sm transition hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
    >
      {isPending ? (
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-cream border-b-transparent"></span>
      ) : children}
    </button>
  )
}
