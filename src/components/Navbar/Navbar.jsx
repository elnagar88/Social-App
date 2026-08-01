import { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../assets/images.png'
import { UserData } from '../../context/UserContext'
import useProfile from './../../hooks/useProfile'

export default function Navbar() {
  const {Token,setToken} = useContext(UserData)
  const {data} = useProfile()
  function signOut(){
    setToken(null),
    localStorage.removeItem('userToken')
  }

  return <nav className="bg-[#FFFAF3] fixed w-full z-20 top-0 inset-s-0 border-b border-default">
  <div className="max-w-7xl flex flex-wrap items-center justify-between mx-auto p-4">
    <Link
      to={"/"}
      className="flex items-center space-x-3 rtl:space-x-reverse"
    >
      <img
        src={logo}
        className="w-11 h-11 rounded-full"
        alt="Logo"
      />
      <span className="self-center text-xl text-heading font-semibold whitespace-nowrap">
        Social App
      </span>
    </Link>
    <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
      <button
        type="button"
        className="flex text-sm bg-neutral-primary rounded-full md:me-0 focus:ring-4 focus:ring-neutral-tertiary"
        id="user-menu-button"
        aria-expanded="false"
        data-dropdown-toggle="user-dropdown"
        data-dropdown-placement="bottom"
      >
        <span className="sr-only">Open user menu</span>
        {
          Token?<img
          className="w-11 h-11 rounded-full object-cover"
          src={data?.photo}
          alt="user photo"
        />:''
        }
      </button>
      {/* Dropdown menu */}
      <div
        className="z-50 hidden bg-neutral-primary-medium border border-default-medium rounded-base shadow-lg w-44"
        id="user-dropdown"
      >
        <div className="px-4 py-3 text-sm border-b border-default">
          <span className="block text-heading font-medium">{data?.name}</span>
          <span className="block text-body truncate">{data?.email}</span>
        </div>
        <ul
          className="p-2 text-sm text-body font-medium"
          aria-labelledby="user-menu-button"
        >
          <li>
            <Link
              to="/profile"
              className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded"
            >
              Profile
            </Link>
          </li>
          <li>
            <Link
              to="/settings"
              className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded"
            >
              Settings
            </Link>
          </li>
          <li>
            <Link
              className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded"
              onClick={signOut}
              to='/login'
            >
              Sign out
            </Link>
          </li>
        </ul>
      </div>

    </div>
    <div
      className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
      id="navbar-user"
    >

    </div>
  </div>
</nav>

}
