import { Link } from 'react-router-dom'

export default function Notfound() {
  return <>
    <title>Not Found | Social App</title>
    <section className="mx-auto mt-6 mb-10 max-w-md rounded-2xl border border-sand bg-cream p-8 text-center shadow-sm">
      <p className="text-7xl font-black tracking-tight text-accent">404</p>
      <h1 className="mt-3 text-2xl font-bold text-ink">Page not found</h1>
      <p className="mt-2 text-sm text-muted">The page you're looking for doesn't exist or was moved.</p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-cream shadow-sm transition hover:opacity-90"
      >
        Back to Home
      </Link>
    </section>
  </>
}
