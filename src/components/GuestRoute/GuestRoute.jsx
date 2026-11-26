import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { UserData } from '../../context/UserData'

export default function GuestRoute({ children }) {
  const { Token } = useContext(UserData)
  return Token ? <Navigate to="/" replace /> : children
}
