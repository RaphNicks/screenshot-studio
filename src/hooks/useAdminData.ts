import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { supabaseAdmin } from '../lib/supabaseAdmin'
import type { Profile } from '../context/AuthContext'

export interface AdminStats {
  totalUsers: number
  proUsers: number
  freeUsers: number
  totalExports: number
  newUsersToday: number
}

export interface AuditLog {
  id: string
  admin_id: string
  action: string
  target_user_id: string | null
  notes: string | null
  created_at: string
  admin?: { email: string; full_name: string | null }
  target?: { email: string; full_name: string | null }
}

interface UseAdminDataResult {
  users: Profile[]
  stats: AdminStats | null
  auditLogs: AuditLog[]
  loading: boolean
  error: string | null
  refresh: () => void
  grantPro: (userId: string) => Promise<void>
  revokePro: (userId: string) => Promise<void>
  deleteUser: (userId: string) => Promise<void>
}

export function useAdminData(): UseAdminDataResult {
  const [users, setUsers] = useState<Profile[]>([])
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  const refresh = useCallback(() => setTick(t => t + 1), [])

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true)
      setError(null)

      try {
        // Fetch all users via admin client (bypasses RLS)
        const { data: usersData, error: usersError } = await supabaseAdmin
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false })

        if (usersError) throw new Error(usersError.message)

        const allUsers = usersData as Profile[]
        setUsers(allUsers)

        // Compute stats
        const startOfDay = new Date()
        startOfDay.setHours(0, 0, 0, 0)

        const proCount = allUsers.filter(u => u.plan === 'pro').length
        const newToday = allUsers.filter(
          u => new Date(u.created_at) >= startOfDay
        ).length
        const totalExports = allUsers.reduce(
          (sum, u) => sum + (u.export_count ?? 0), 0
        )

        setStats({
          totalUsers: allUsers.length,
          proUsers: proCount,
          freeUsers: allUsers.length - proCount,
          totalExports,
          newUsersToday: newToday,
        })

        // Fetch audit logs via admin client
        const { data: logsData, error: logsError } = await supabaseAdmin
          .from('admin_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50)

        if (!logsError && logsData) {
          const enriched = logsData.map((log) => {
            const admin = allUsers.find(u => u.id === log.admin_id)
            const target = allUsers.find(u => u.id === log.target_user_id)
            return {
              ...log,
              admin: admin
                ? { email: admin.email, full_name: admin.full_name }
                : undefined,
              target: target
                ? { email: target.email, full_name: target.full_name }
                : undefined,
            }
          })
          setAuditLogs(enriched as AuditLog[])
        }

      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load admin data')
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [tick])

  // logAction uses regular supabase so it captures the logged-in admin's identity
  const logAction = async (
    action: string,
    targetUserId: string,
    notes?: string
  ) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabaseAdmin.from('admin_logs').insert({
      admin_id: user.id,
      action,
      target_user_id: targetUserId,
      notes: notes ?? null,
    })
  }

  const grantPro = async (userId: string) => {
    const { error } = await supabaseAdmin
      .from('profiles')
      .update({
        plan: 'pro',
        plan_granted_by: 'admin',
        plan_granted_at: new Date().toISOString(),
      })
      .eq('id', userId)

    if (error) throw new Error(error.message)
    await logAction('grant_pro', userId, 'Manually granted by admin')
    refresh()
  }

  const revokePro = async (userId: string) => {
    const { error } = await supabaseAdmin
      .from('profiles')
      .update({
        plan: 'free',
        plan_granted_by: null,
        plan_granted_at: null,
        plan_expires_at: null,
      })
      .eq('id', userId)

    if (error) throw new Error(error.message)
    await logAction('revoke_pro', userId, 'Manually revoked by admin')
    refresh()
  }

  const deleteUser = async (userId: string) => {
    // Use admin client to delete from auth.users
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)
    if (error) throw new Error(error.message)
    await logAction('delete_user', userId, 'Deleted by admin')
    refresh()
  }

  return {
    users, stats, auditLogs, loading, error,
    refresh, grantPro, revokePro, deleteUser,
  }
}