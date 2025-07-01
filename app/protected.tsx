import { Outlet } from 'react-router'
import { AuthProvider, useAuth } from './contexts/auth'

export default function ProtectedLayout() {
  return (
    <AuthProvider>
      <Layout />
    </AuthProvider>
  )
}

function Layout() {
  const data = useAuth()
  if (data === null || data.isLoading) {
    return <div className="text-2xl">Carregando...</div>
  }

  const { user, session } = data

  return (
    <div className="min-h-screen">
      <p>Session: {JSON.stringify(session)}</p>
      <p>User: {JSON.stringify(user)}</p>
      <Outlet />
    </div>
  )
}
