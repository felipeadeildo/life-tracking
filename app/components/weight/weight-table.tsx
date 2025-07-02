import { Trash2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '~/components/ui/alert-dialog'
import { Button } from '~/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import type { MetricEntry } from '~/types'

interface WeightTableProps {
  weights: MetricEntry[]
  loading: boolean
  onDeleteWeight?: (id: number) => Promise<boolean>
}

export function WeightTable({
  weights,
  loading,
  onDeleteWeight,
}: WeightTableProps) {
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

  const recentWeights = weights.slice(0, 10)

  const handleDelete = async (id: number) => {
    if (onDeleteWeight) {
      await onDeleteWeight(id)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Histórico Recente</h3>
        <p className="text-sm text-muted-foreground">
          Seus últimos registros de peso
        </p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Peso (kg)</TableHead>
            <TableHead>Variação</TableHead>
            {onDeleteWeight && <TableHead className="w-16">Ações</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentWeights.map((entry, index) => {
            const previousWeight = recentWeights[index + 1]?.value
            const difference = previousWeight
              ? entry.value - previousWeight
              : null

            return (
              <TableRow key={entry.id}>
                <TableCell>
                  {new Date(entry.date).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell className="font-medium">
                  {entry.value.toFixed(1)} kg
                </TableCell>
                <TableCell>
                  {difference !== null ? (
                    <span
                      className={
                        difference > 0
                          ? 'text-red-500'
                          : difference < 0
                          ? 'text-green-500'
                          : 'text-gray-500'
                      }
                    >
                      {difference > 0 ? '+' : ''}
                      {difference.toFixed(1)} kg
                    </span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </TableCell>
                {onDeleteWeight && (
                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Confirmar exclusão
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir este registro de
                            peso? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(entry.id)}
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                )}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
