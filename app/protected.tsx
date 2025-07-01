import { Navigate, Outlet } from 'react-router'
import { useAuth } from './contexts/auth'

export default function ProtectedLayout() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Carregando...</div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  return (
    <div className="min-h-screen">
      <Outlet />
    </div>
  )
}
