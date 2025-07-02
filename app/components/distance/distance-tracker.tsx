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
import { DistanceChart } from '~/components/distance/distance-chart'
import { DistanceForm } from '~/components/distance/distance-form'
import { DistanceTable } from '~/components/distance/distance-table'
import type { MetricEntry } from '~/types'

interface DistanceTrackerProps {
  distances: MetricEntry[]
  loading: boolean
  error: string | null
  hasEntryToday: boolean
  onAddDistance: (distance: number, date: string) => Promise<boolean>
  onDeleteDistance?: (id: number) => Promise<boolean>
}

export function DistanceTracker({
  distances,
  loading,
  error,
  hasEntryToday,
  onAddDistance,
  onDeleteDistance,
}: DistanceTrackerProps) {
  const [open, setOpen] = useState(false)

  return (
    <Card className="gap-0.5 px-0.5 py-3">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Controle de Distância</CardTitle>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DistanceForm
                onSubmit={async (distance, date) => {
                  const success = await onAddDistance(distance, date)
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
            <DistanceChart distances={distances} />
          </TabsContent>
          <TabsContent value="history" className="mt-3">
            <DistanceTable
              distances={distances}
              loading={loading}
              onDeleteDistance={onDeleteDistance}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}