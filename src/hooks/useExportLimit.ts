import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

const FREE_DAILY_LIMIT = 5

interface ExportLimitResult {
  canExport: boolean
  exportsToday: number
  remaining: number
  isPro: boolean
  isLoggedIn: boolean
  recordExport: () => Promise<void>
  loading: boolean
}

export function useExportLimit(): ExportLimitResult {
  const { user, profile, refreshProfile } = useAuth()
  const [exportsToday, setExportsToday] = useState(0)
  const [loading, setLoading] = useState(true)

  const isPro = profile?.plan === 'pro'
  const isLoggedIn = !!user

  useEffect(() => {
    if (!user) {
      // For logged-out users, use localStorage to track daily exports
      const stored = localStorage.getItem('ss_exports_today')
      if (stored) {
        const parsed = JSON.parse(stored)
        const isToday = new Date(parsed.date).toDateString() === new Date().toDateString()
        setExportsToday(isToday ? parsed.count : 0)
      }
      setLoading(false)
      return
    }

    // For logged-in users, count today's exports from DB
    const fetchTodayExports = async () => {
      const startOfDay = new Date()
      startOfDay.setHours(0, 0, 0, 0)

      const { count } = await supabase
        .from('exports')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', startOfDay.toISOString())

      setExportsToday(count ?? 0)
      setLoading(false)
    }

    fetchTodayExports()
  }, [user])

  const recordExport = async () => {
    if (!user) {
      // Track in localStorage for logged-out users
      const newCount = exportsToday + 1
      localStorage.setItem('ss_exports_today', JSON.stringify({
        date: new Date().toISOString(),
        count: newCount,
      }))
      setExportsToday(newCount)
      return
    }

    // Increment export_count on profile
    await supabase
      .from('profiles')
      .update({ export_count: (profile?.export_count ?? 0) + 1 })
      .eq('id', user.id)

    await refreshProfile()
    setExportsToday((prev) => prev + 1)
  }

  const remaining = isPro ? Infinity : Math.max(0, FREE_DAILY_LIMIT - exportsToday)
  const canExport = isPro || exportsToday < FREE_DAILY_LIMIT

  return { canExport, exportsToday, remaining, isPro, isLoggedIn, recordExport, loading }
}