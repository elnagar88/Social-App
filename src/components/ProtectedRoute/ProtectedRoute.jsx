import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { UserData } from './../../context/UserData'

export default function ProtectedRoute({ children }) {
    const { Token } = useContext(UserData)
    return Token ? children : <Navigate to="/login" />
}