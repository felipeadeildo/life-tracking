import { useState } from 'react'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
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
import type { MetricEntry } from '~/types'

interface WeightChartProps {
  weights: MetricEntry[]
}

const chartConfig = {
  weight: {
    label: 'Peso (kg)',
    color: 'var(--color-chart-2)',
  },
} satisfies ChartConfig

export function WeightChart({ weights }: WeightChartProps) {
  const [timeRange, setTimeRange] = useState('30d')

  const filteredData = weights
    .filter((entry) => {
      const entryDate = new Date(entry.date)
      const now = new Date()
      const daysToSubtract =
        timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90
      const startDate = new Date(now)
      startDate.setDate(startDate.getDate() - daysToSubtract)
      return entryDate >= startDate
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((entry) => ({
      date: entry.date,
      weight: entry.value,
    }))

  if (weights.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Adicione alguns registros para ver o gráfico da sua evolução
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Evolução do Peso</h3>
          <p className="text-sm text-muted-foreground">
            Acompanhe sua evolução ao longo do tempo
          </p>
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
      </div>
      <ChartContainer
        config={chartConfig}
        className="aspect-auto h-[250px] w-full"
      >
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
    </div>
  )
}
