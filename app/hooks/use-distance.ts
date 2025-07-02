import { useEffect, useState } from 'react'
import { useAuth } from '~/contexts/auth'
import { supabase } from '~/lib/supabase-client'
import type { MetricEntry } from '~/types'

export function useDistance() {
  const { user } = useAuth()
  const [distances, setDistances] = useState<MetricEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Verificar se já tem registro hoje
  const hasEntryToday = () => {
    const today = new Date().toISOString().split('T')[0]
    return distances.some((entry) => entry.date === today)
  }

  // Buscar dados da distância
  const fetchDistances = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('metrics')
        .select('*')
        .eq('user_id', user.id)
        .eq('type', 'distance')
        .order('date', { ascending: false })

      if (error) throw error
      setDistances(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Adicionar nova distância
  const addDistance = async (distance: number, date: string) => {
    if (!user) return false

    try {
      const { data, error } = await supabase
        .from('metrics')
        .insert([
          {
            value: distance,
            date,
            type: 'distance',
            user_id: user.id,
          },
        ])
        .select()
        .single()

      if (error) throw error

      setDistances((prev) => [data, ...prev])
      return true
    } catch (err: any) {
      setError(err.message)
      return false
    }
  }

  useEffect(() => {
    fetchDistances()
  }, [user])

  return {
    distances,
    loading,
    error,
    hasEntryToday: hasEntryToday(),
    addDistance,
    refetch: fetchDistances,
  }
}