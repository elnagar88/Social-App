export default function FieldError({ error }) {
  if (!error) return ''
  return <p className='mt-1.5 text-sm font-medium text-accent'>{error.message}</p>
}
