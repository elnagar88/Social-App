import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full border-t border-sand bg-cream">
      <div className="w-full max-w-7xl mx-auto p-4 md:py-6">
        <span className="block text-sm text-muted text-center">
          © 2026{" "}
          <Link to="/" className="font-medium text-ink hover:text-accent transition">
            Social App™
          </Link>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  )
}
