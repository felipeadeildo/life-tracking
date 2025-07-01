import { zodResolver } from '@hookform/resolvers/zod'
import { AlertTriangle } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '~/components/ui/button'
import { DatePicker } from '~/components/ui/date-picker'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

const weightSchema = z.object({
  weight: z
    .number()
    .min(30, 'Peso deve ser maior que 30kg')
    .max(300, 'Peso deve ser menor que 300kg'),
  date: z.date({
    required_error: 'Por favor selecione uma data',
  }),
})

type WeightFormValues = z.infer<typeof weightSchema>

interface WeightFormProps {
  onSubmit: (weight: number, date: string) => Promise<boolean>
  error: string | null
  hasEntryToday: boolean
}

export function WeightForm({
  onSubmit,
  error,
  hasEntryToday,
}: WeightFormProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const form = useForm<WeightFormValues>({
    resolver: zodResolver(weightSchema),
    defaultValues: {
      weight: 0,
      date: new Date(),
    },
  })

  const handleSubmit = async (values: WeightFormValues) => {
    setLoading(true)
    const dateString = values.date.toISOString().split('T')[0]
    const success = await onSubmit(values.weight, dateString)
    if (success) {
      setOpen(false)
      form.reset({
        weight: 0,
        date: new Date(),
      })
    }
    setLoading(false)
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Registrar Peso</h3>
        <p className="text-sm text-muted-foreground">
          Adicione seu peso diário para acompanhar sua evolução
        </p>
      </div>

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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="w-full">
            {hasEntryToday ? 'Registrar Novamente' : 'Adicionar Peso'}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Registrar Peso</DialogTitle>
            <DialogDescription>
              Adicione seu peso para acompanhar sua evolução.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Peso (kg)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="Ex: 70.5"
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
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
