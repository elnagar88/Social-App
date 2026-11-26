import { useContext, useEffect, useRef, useState } from 'react'
import { FaCog, FaSignOutAlt, FaUser } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import logo from '../../assets/images.png'
import { UserData } from '../../context/UserData'
import useProfile from '../../hooks/useProfile'

const menuItemClass = "flex items-center gap-2.5 w-full rounded-lg px-3 py-2 transition hover:bg-beige"

export default function Navbar() {
  const { Token, logout } = useContext(UserData)
  const { data } = useProfile()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!isMenuOpen) return

    function handleClickOutside(e) {
      if (!menuRef.current.contains(e.target)) setIsMenuOpen(false)
    }
    function handleEscape(e) {
      if (e.key === 'Escape') setIsMenuOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isMenuOpen])

  function closeMenu() {
    setIsMenuOpen(false)
  }

  function signOut() {
    closeMenu()
    logout()
  }

  return <nav className="bg-cream/90 backdrop-blur fixed w-full z-20 top-0 inset-s-0 border-b border-sand">
    <div className="max-w-7xl flex flex-wrap items-center justify-between mx-auto p-4">
      <Link to="/" className="flex items-center gap-3">
        <img src={logo} className="w-11 h-11 rounded-full" alt="Logo" />
        <span className="self-center text-xl text-ink font-semibold whitespace-nowrap">
          Social App
        </span>
      </Link>

      {Token && (
        <div ref={menuRef} className="relative flex items-center">
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            className="flex rounded-full ring-2 ring-beige transition hover:ring-accent/40 focus:outline-none focus:ring-4 focus:ring-accent/30 cursor-pointer"
            id="user-menu-button"
            aria-expanded={isMenuOpen}
            aria-haspopup="menu"
          >
            <span className="sr-only">Open user menu</span>
            <img
              className="w-11 h-11 rounded-full object-cover bg-beige"
              src={data?.photo}
              alt="user photo"
            />
          </button>

          {isMenuOpen && (
            <div
              className="absolute right-0 top-full mt-2 z-50 w-52 overflow-hidden rounded-xl border border-sand bg-cream shadow-lg"
              id="user-dropdown"
            >
              <div className="px-4 py-3 text-sm border-b border-sand">
                <span className="block font-semibold text-ink">{data?.name}</span>
                <span className="block text-muted truncate">{data?.email}</span>
              </div>
              <ul className="p-1.5 text-sm font-medium text-ink" aria-labelledby="user-menu-button">
                <li>
                  <Link to="/profile" onClick={closeMenu} className={menuItemClass}>
                    <FaUser className="text-muted" /> Profile
                  </Link>
                </li>
                <li>
                  <Link to="/settings" onClick={closeMenu} className={menuItemClass}>
                    <FaCog className="text-muted" /> Settings
                  </Link>
                </li>
                <li>
                  <Link to="/login" onClick={signOut} className={`${menuItemClass} text-accent`}>
                    <FaSignOutAlt /> Sign out
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  </nav>
}
