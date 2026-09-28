import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/useAuth'

export default function ProtectedRoute() {
    const {token} = useAuth()
    if(!token)return <Navigate to={"/login"} />
    return <Outlet />
}
