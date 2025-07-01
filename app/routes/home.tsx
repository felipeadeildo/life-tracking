import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { useAuth } from '~/contexts/auth'
import type { Route } from './+types/home'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Life Tracking - Home' },
    { name: 'description', content: 'Welcome to Life Tracking' },
  ]
}

export default function Home() {
  const { user, signOut } = useAuth()

  const handleSignOut = () => {
    try {
      signOut()
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">
              Bem-vindo ao Life Tracking! 👋
            </h1>
            <p className="mt-1">Gerencie sua vida de forma organizada</p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            Sair
          </Button>
        </div>

        {/* User Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Suas Informações</CardTitle>
            <CardDescription>Dados da sua conta</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Nome</label>
                <p className="">
                  {user?.user_metadata?.full_name || 'Não informado'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <p className="">{user?.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Conta criada em</label>
                <p className="">
                  {user?.created_at
                    ? new Date(user.created_at).toLocaleDateString('pt-BR')
                    : 'N/A'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium">Último login</label>
                <p className="">
                  {user?.last_sign_in_at
                    ? new Date(user.last_sign_in_at).toLocaleDateString('pt-BR')
                    : 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
