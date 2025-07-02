import { zodResolver } from '@hookform/resolvers/zod'
import { AlertTriangle } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '~/components/ui/button'
import { DatePicker } from '~/components/ui/date-picker'
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'

const distanceSchema = z.object({
  distance: z
    .number()
    .min(0.1, 'Distância deve ser maior que 0,1km')
    .max(200, 'Distância deve ser menor que 200km'),
  date: z.date({
    required_error: 'Por favor selecione uma data',
  }),
})

type DistanceFormValues = z.infer<typeof distanceSchema>

interface DistanceFormProps {
  onSubmit: (distance: number, date: string) => Promise<boolean>
  error: string | null
  hasEntryToday: boolean
}

export function DistanceForm({
  onSubmit,
  error,
  hasEntryToday,
}: DistanceFormProps) {
  const [loading, setLoading] = useState(false)

  const form = useForm<DistanceFormValues>({
    resolver: zodResolver(distanceSchema),
    defaultValues: {
      distance: 0,
      date: new Date(),
    },
  })

  const handleSubmit = async (values: DistanceFormValues) => {
    setLoading(true)
    const dateString = values.date.toISOString().split('T')[0]
    const success = await onSubmit(values.distance, dateString)
    if (success) {
      form.reset({
        distance: 0,
        date: new Date(),
      })
    }
    setLoading(false)
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Registrar Distância</DialogTitle>
        <DialogDescription>
          Adicione a distância percorrida para acompanhar sua atividade.
        </DialogDescription>
      </DialogHeader>

      {error && (
        <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">
          {error}
        </div>
      )}

      {hasEntryToday && (
        <div className="flex items-center gap-2 text-amber-600 text-sm bg-amber-50 p-3 rounded-md">
          <AlertTriangle className="h-4 w-4" />
          <span>
            Você já tem um registro hoje. Registrar novamente irá criar uma nova
            entrada.
          </span>
        </div>
      )}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="distance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Distância (km)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="Ex: 5.2"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseFloat(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data</FormLabel>
                <FormControl>
                  <DatePicker
                    date={field.value}
                    onSelect={field.onChange}
                    placeholder="Selecione uma data"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end space-x-2">
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </Form>
    </>
  )
}