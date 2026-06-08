import { Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'

type Status = 'checking' | 'allowed' | 'denied' | 'unauthenticated'

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const [status, setStatus] = useState<Status>('checking')

  useEffect(() => {
    if (loading) return

    if (!user) {
      setStatus('unauthenticated')
      return
    }

    // Fetch admin status directly from DB — bypasses any JWT/state timing issues
    supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          console.error('AdminRoute profile fetch error:', error?.message)
          setStatus('denied')
          return
        }
        console.log('AdminRoute is_admin value:', data.is_admin)
        setStatus(data.is_admin === true ? 'allowed' : 'denied')
      })
  }, [user, loading])

  if (status === 'checking' || loading) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
          <p className="text-text-secondary text-sm">Verifying admin access...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') return <Navigate to="/login" replace />
  if (status === 'denied') return <Navigate to="/" replace />

  return <>{children}</>
}