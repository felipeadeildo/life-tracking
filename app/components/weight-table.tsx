import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import type { WeightEntry } from '~/types'

interface WeightTableProps {
  weights: WeightEntry[]
  loading: boolean
}

export function WeightTable({ weights, loading }: WeightTableProps) {
  if (loading) {
    return <div className="text-center py-4">Carregando...</div>
  }

  if (weights.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Nenhum registro encontrado. Adicione seu primeiro peso!
      </div>
    )
  }

  // Mostrar apenas os últimos 10 registros
  const recentWeights = weights.slice(0, 10)

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Data</TableHead>
          <TableHead>Peso (kg)</TableHead>
          <TableHead>Variação</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {recentWeights.map((entry, index) => {
          const previousWeight = recentWeights[index + 1]?.weight
          const difference = previousWeight ? entry.weight - previousWeight : null
          
          return (
            <TableRow key={entry.id}>
              <TableCell>
                {new Date(entry.date).toLocaleDateString('pt-BR')}
              </TableCell>
              <TableCell className="font-medium">
                {entry.weight.toFixed(1)} kg
              </TableCell>
              <TableCell>
                {difference !== null ? (
                  <span className={difference > 0 ? 'text-red-500' : difference < 0 ? 'text-green-500' : 'text-gray-500'}>
                    {difference > 0 ? '+' : ''}{difference.toFixed(1)} kg
                  </span>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}