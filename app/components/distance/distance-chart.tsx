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

interface DistanceChartProps {
  distances: MetricEntry[]
}

const chartConfig = {
  distance: {
    label: 'Distância (km)',
    color: 'var(--color-chart-3)',
  },
} satisfies ChartConfig

export function DistanceChart({ distances }: DistanceChartProps) {
  const [timeRange, setTimeRange] = useState('30d')

  const filteredData = distances
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
      distance: entry.value,
    }))

  if (distances.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Adicione alguns registros para ver o gráfico da sua evolução
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center mb-3">
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger>
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">7 dias</SelectItem>
            <SelectItem value="30d">30 dias</SelectItem>
            <SelectItem value="90d">90 dias</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <ChartContainer
        config={chartConfig}
        className="flex-1 w-full"
      >
        <AreaChart data={filteredData}>
          <defs>
            <linearGradient id="fillDistance" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-distance)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-distance)"
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
            tickFormatter={(value) => `${value}km`}
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
                formatter={(value) => [`${value} km`, 'Distância']}
              />
            }
          />
          <Area
            dataKey="distance"
            type="natural"
            fill="url(#fillDistance)"
            stroke="var(--color-distance)"
            strokeWidth={2}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  )
}