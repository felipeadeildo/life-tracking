import { Plus } from 'lucide-react'
import { useState } from 'react'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
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

export function WeightTracker({
  weights,
  loading,
  error,
  hasEntryToday,
  onAddWeight,
  onDeleteWeight,
}: WeightTrackerProps) {
  const [open, setOpen] = useState(false)

  return (
    <Card className="gap-0.5 px-0.5 py-3">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Controle de Peso</CardTitle>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <WeightForm
                onSubmit={async (weight, date) => {
                  const success = await onAddWeight(weight, date)
                  if (success) setOpen(false)
                  return success
                }}
                error={error}
                hasEntryToday={hasEntryToday}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <Tabs defaultValue="chart" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chart">Gráfico</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
          </TabsList>
          <TabsContent value="chart" className="mt-3">
            <WeightChart weights={weights} />
          </TabsContent>
          <TabsContent value="history" className="mt-3">
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
