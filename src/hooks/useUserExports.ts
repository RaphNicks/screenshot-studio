import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export interface UserExport {
  id: string
  file_name: string
  file_url: string
  storage_path: string
  file_size: number | null
  format: 'png' | 'jpeg'
  created_at: string
  expires_at: string
}

interface UseUserExportsResult {
  exports: UserExport[]
  loading: boolean
  error: string | null
  deleteExport: (id: string, storagePath: string) => Promise<void>
  getSignedUrl: (storagePath: string) => Promise<string | null>
  refresh: () => void
}

export function useUserExports(): UseUserExportsResult {
  const { user } = useAuth()
  const [exports, setExports] = useState<UserExport[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  const refresh = useCallback(() => setTick((t) => t + 1), [])

  useEffect(() => {
    if (!user) {
      setExports([])
      setLoading(false)
      return
    }

    const fetchExports = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('exports')
        .select('*')
        .eq('user_id', user.id)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })

      if (error) {
        setError(error.message)
      } else {
        setExports(data as UserExport[])
      }
      setLoading(false)
    }

    fetchExports()
  }, [user, tick])

  const deleteExport = async (id: string, storagePath: string) => {
    // Delete from storage
    await supabase.storage.from('exports').remove([storagePath])
    // Delete from database
    await supabase.from('exports').delete().eq('id', id)
    // Update local state
    setExports((prev) => prev.filter((e) => e.id !== id))
  }

  const getSignedUrl = async (storagePath: string): Promise<string | null> => {
    const { data, error } = await supabase.storage
      .from('exports')
      .createSignedUrl(storagePath, 60 * 60) // 1 hour expiry
    if (error || !data) return null
    return data.signedUrl
  }

  return { exports, loading, error, deleteExport, getSignedUrl, refresh }
}