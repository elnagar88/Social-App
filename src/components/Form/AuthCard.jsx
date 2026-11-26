import { Link } from 'react-router-dom'

export default function AuthCard({ title, subtitle, footerText, footerLinkText, footerLinkTo, children }) {
  return (
    <div className="mx-auto mt-3 mb-8 w-full max-w-md rounded-2xl border border-sand bg-cream p-6 shadow-sm sm:p-8">
      <h1 className="text-center text-3xl font-bold tracking-tight text-ink">{title}</h1>
      <p className="mt-1.5 text-center text-sm text-muted">{subtitle}</p>
      <div className="mt-6">{children}</div>
      <p className="mt-5 text-center text-sm text-muted">
        {footerText}{' '}
        <Link to={footerLinkTo} className="font-semibold text-accent hover:underline">{footerLinkText}</Link>
      </p>
    </div>
  )
}
