import { useState } from 'react'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '~/components/ui/chart'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import type { WeightEntry } from '~/types'

interface WeightChartProps {
  weights: WeightEntry[]
}

const chartConfig = {
  weight: {
    label: 'Peso (kg)',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig

export function WeightChart({ weights }: WeightChartProps) {
  const [timeRange, setTimeRange] = useState('30d')

  // Filtrar dados baseado no período selecionado
  const filteredData = weights
    .filter((entry) => {
      const entryDate = new Date(entry.date)
      const now = new Date()
      const daysToSubtract = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90
      const startDate = new Date(now)
      startDate.setDate(startDate.getDate() - daysToSubtract)
      return entryDate >= startDate
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(entry => ({
      date: entry.date,
      weight: entry.weight,
    }))

  if (weights.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Evolução do Peso</CardTitle>
          <CardDescription>Acompanhe sua evolução ao longo do tempo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            Adicione alguns registros para ver o gráfico da sua evolução
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Evolução do Peso</CardTitle>
          <CardDescription>
            Acompanhe sua evolução ao longo do tempo
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Últimos 7 dias</SelectItem>
            <SelectItem value="30d">Últimos 30 dias</SelectItem>
            <SelectItem value="90d">Últimos 90 dias</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillWeight" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-weight)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-weight)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString('pt-BR', {
                  month: 'short',
                  day: 'numeric',
                })
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value}kg`}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('pt-BR', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  }}
                  formatter={(value) => [`${value} kg`, 'Peso']}
                />
              }
            />
            <Area
              dataKey="weight"
              type="natural"
              fill="url(#fillWeight)"
              stroke="var(--color-weight)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}