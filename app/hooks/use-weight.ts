import { useEffect, useState } from 'react'
import { useAuth } from '~/contexts/auth'
import { supabase } from '~/lib/supabase-client'
import type { MetricEntry } from '~/types'

export function useWeight() {
  const { user } = useAuth()
  const [weights, setWeights] = useState<MetricEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Verificar se já tem registro hoje
  const hasEntryToday = () => {
    const today = new Date().toISOString().split('T')[0]
    return weights.some((entry) => entry.date === today)
  }

  // Buscar dados do peso
  const fetchWeights = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('metrics')
        .select('*')
        .eq('user_id', user.id)
        .eq('type', 'weight')
        .order('date', { ascending: false })

      if (error) throw error
      setWeights(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Adicionar novo peso
  const addWeight = async (weight: number, date: string) => {
    if (!user) return false

    try {
      const { data, error } = await supabase
        .from('metrics')
        .insert([
          {
            value: weight,
            date,
            type: 'weight',
            user_id: user.id,
          },
        ])
        .select()
        .single()

      if (error) throw error

      setWeights((prev) => [data, ...prev])
      return true
    } catch (err: any) {
      setError(err.message)
      return false
    }
  }

  useEffect(() => {
    fetchWeights()
  }, [user])

  return {
    weights,
    loading,
    error,
    hasEntryToday: hasEntryToday(),
    addWeight,
    refetch: fetchWeights,
  }
}
