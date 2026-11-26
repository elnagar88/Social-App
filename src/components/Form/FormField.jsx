import FieldError from './FieldError'

export default function FormField({ id, label, registration, error, className = '', ...inputProps }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </label>
      <input
        id={id}
        {...registration}
        {...inputProps}
        className="w-full rounded-xl border border-sand bg-white px-4 py-2.5 text-sm text-ink outline-none transition placeholder:text-muted/60 focus:border-accent focus:ring-2 focus:ring-accent/20"
      />
      <FieldError error={error} />
    </div>
  )
}
