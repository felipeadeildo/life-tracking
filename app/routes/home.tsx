import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { WeightChart } from '~/components/weight-chart'
import { WeightForm } from '~/components/weight-form'
import { WeightTable } from '~/components/weight-table'
import { useAuth } from '~/contexts/auth'
import { useWeight } from '~/hooks/use-weight'
import type { Route } from './+types/home'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Life Tracking - Home' },
    { name: 'description', content: 'Welcome to Life Tracking' },
  ]
}

export default function Home() {
  const { user, signOut } = useAuth()
  const { weights, loading, error, hasEntryToday, addWeight } = useWeight()

  const handleSignOut = () => {
    try {
      signOut()
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  const handleAddWeight = async (weight: number, date: string) => {
    return await addWeight(weight, date)
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

        {/* Weight Tracking Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weight Chart */}
          <div className="lg:col-span-2">
            <WeightChart weights={weights} />
          </div>

          {/* Weight Form */}
          <Card>
            <CardHeader>
              <CardTitle>Registrar Peso</CardTitle>
              <CardDescription>
                Adicione seu peso diário para acompanhar sua evolução
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {error && (
                  <div className="text-red-500 text-sm">{error}</div>
                )}
                <WeightForm onSubmit={handleAddWeight} disabled={hasEntryToday} />
                {hasEntryToday && (
                  <p className="text-sm text-green-600">
                    ✅ Peso já registrado hoje!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Weight Table */}
          <Card>
            <CardHeader>
              <CardTitle>Histórico Recente</CardTitle>
              <CardDescription>
                Seus últimos registros de peso
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WeightTable weights={weights} loading={loading} />
            </CardContent>
          </Card>
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
