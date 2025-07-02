import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '~/components/ui/tabs'
import { WeightChart } from '~/components/weight/weight-chart'
import { WeightForm } from '~/components/weight/weight-form'
import { WeightTable } from '~/components/weight/weight-table'
import type { MetricEntry } from '~/types'

interface WeightTrackerProps {
  weights: MetricEntry[]
  loading: boolean
  error: string | null
  hasEntryToday: boolean
  onAddWeight: (weight: number, date: string) => Promise<boolean>
  onDeleteWeight?: (id: number) => Promise<boolean>
}

export function WeightTracker({ weights, loading, error, hasEntryToday, onAddWeight, onDeleteWeight }: WeightTrackerProps) {

  return (
    <Card>
      <CardHeader>
        <CardTitle>Controle de Peso</CardTitle>
        <CardDescription>
          Gerencie seus registros de peso de forma organizada
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="chart" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="chart">Gráfico</TabsTrigger>
            <TabsTrigger value="form">Registrar</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
          </TabsList>
          <TabsContent value="chart" className="mt-6 min-h-[400px]">
            <WeightChart weights={weights} />
          </TabsContent>
          <TabsContent value="form" className="mt-6 min-h-[400px]">
            <WeightForm 
              onSubmit={onAddWeight}
              error={error}
              hasEntryToday={hasEntryToday}
            />
          </TabsContent>
          <TabsContent value="history" className="mt-6 min-h-[400px]">
            <WeightTable 
              weights={weights}
              loading={loading}
              onDeleteWeight={onDeleteWeight}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}