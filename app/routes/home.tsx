import { LogOut, User } from 'lucide-react'
import { DistanceTracker } from '~/components/distance/distance-tracker'
import { Avatar, AvatarFallback } from '~/components/ui/avatar'
import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { WeightTracker } from '~/components/weight/weight-tracker'
import { useAuth } from '~/contexts/auth'
import { useDistance } from '~/hooks/use-distance'
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
  const {
    distances,
    loading: distanceLoading,
    error: distanceError,
    hasEntryToday: hasDistanceToday,
    addDistance,
  } = useDistance()

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

  const handleAddDistance = async (distance: number, date: string) => {
    return await addDistance(distance, date)
  }

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="flex h-16 items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-semibold">Life Tracking</h1>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {user?.user_metadata?.full_name?.charAt(0) ||
                      user?.email?.charAt(0) ||
                      'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.user_metadata?.full_name || 'Usuário'}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-sm text-muted-foreground">
                <User className="mr-2 h-4 w-4" />
                Conta criada em{' '}
                {user?.created_at
                  ? new Date(user.created_at).toLocaleDateString('pt-BR')
                  : 'N/A'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WeightTracker
            weights={weights}
            loading={loading}
            error={error}
            hasEntryToday={hasEntryToday}
            onAddWeight={handleAddWeight}
          />
          <DistanceTracker
            distances={distances}
            loading={distanceLoading}
            error={distanceError}
            hasEntryToday={hasDistanceToday}
            onAddDistance={handleAddDistance}
          />
        </div>
      </main>
    </div>
  )
}
