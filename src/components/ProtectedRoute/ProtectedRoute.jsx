import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { UserData } from './../../context/UserContext'

export default function ProtectedRoute({ children }) {
    const { Token } = useContext(UserData)
    return Token ? children : <Navigate to="/login" />
}