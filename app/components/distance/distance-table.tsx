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
import { ScrollArea } from '~/components/ui/scroll-area'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import type { MetricEntry } from '~/types'

interface DistanceTableProps {
  distances: MetricEntry[]
  loading: boolean
  onDeleteDistance?: (id: number) => Promise<boolean>
}

export function DistanceTable({
  distances,
  loading,
  onDeleteDistance,
}: DistanceTableProps) {
  if (loading) {
    return <div className="text-center py-4">Carregando...</div>
  }

  if (distances.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Nenhum registro encontrado. Adicione sua primeira distância!
      </div>
    )
  }

  const recentDistances = distances

  const handleDelete = async (id: number) => {
    if (onDeleteDistance) {
      await onDeleteDistance(id)
    }
  }

  return (
    <div className="flex flex-col">
      <div className="border rounded-t-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Distância (km)</TableHead>
              <TableHead>Variação</TableHead>
              {onDeleteDistance && <TableHead className="w-16">Ações</TableHead>}
            </TableRow>
          </TableHeader>
        </Table>
      </div>
      <ScrollArea className="flex-1 border-x border-b rounded-b-lg">
        <Table>
          <TableBody>
            {recentDistances.map((entry, index) => {
              const previousDistance = recentDistances[index + 1]?.value
              const difference = previousDistance
                ? entry.value - previousDistance
                : null

              return (
                <TableRow key={entry.id}>
                  <TableCell>
                    {new Date(entry.date).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="font-medium">
                    {entry.value.toFixed(1)} km
                  </TableCell>
                  <TableCell>
                    {difference !== null ? (
                      <span
                        className={
                          difference > 0
                            ? 'text-green-500'
                            : difference < 0
                            ? 'text-red-500'
                            : 'text-gray-500'
                        }
                      >
                        {difference > 0 ? '+' : ''}
                        {difference.toFixed(1)} km
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  {onDeleteDistance && (
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
                              distância? Esta ação não pode ser desfeita.
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
      </ScrollArea>
    </div>
  )
}