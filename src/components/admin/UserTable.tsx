import { useState } from 'react'
import {
  Search, Crown, Zap, Trash2, ShieldCheck,
  ChevronUp, ChevronDown, MoreHorizontal
} from 'lucide-react'
import type { Profile } from '../../context/AuthContext'
import Badge from '../ui/Badge'

interface UserTableProps {
  users: Profile[]
  onGrant: (userId: string) => Promise<void>
  onRevoke: (userId: string) => Promise<void>
  onDelete: (userId: string) => Promise<void>
  onSelect: (user: Profile) => void
}

type SortKey = 'created_at' | 'email' | 'plan' | 'export_count'
type SortDir = 'asc' | 'desc'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function UserTable({
  users, onGrant, onRevoke, onDelete, onSelect,
}: UserTableProps) {
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('created_at')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  const filtered = users
    .filter(u =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.full_name ?? '').toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      let aVal: string | number = a[sortKey] ?? ''
      let bVal: string | number = b[sortKey] ?? ''
      if (typeof aVal === 'string') aVal = aVal.toLowerCase()
      if (typeof bVal === 'string') bVal = bVal.toLowerCase()
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1
      return 0
    })

  const handleAction = async (
    action: () => Promise<void>,
    userId: string
  ) => {
    setActionLoading(userId)
    try {
      await action()
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async (userId: string) => {
    if (confirmDelete !== userId) {
      setConfirmDelete(userId)
      setTimeout(() => setConfirmDelete(null), 3000)
      return
    }
    setConfirmDelete(null)
    await handleAction(() => onDelete(userId), userId)
  }

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <MoreHorizontal size={12} className="text-text-dim" />
    return sortDir === 'asc'
      ? <ChevronUp size={12} className="text-accent" />
      : <ChevronDown size={12} className="text-accent" />
  }

  return (
    <div className="bg-panel border border-border rounded-2xl overflow-hidden shadow-inner-top">
      {/* Search bar */}
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-dim" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full bg-surface border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-dim focus:outline-none focus:border-accent/50 transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {[
                { label: 'User', key: 'email' as SortKey },
                { label: 'Plan', key: 'plan' as SortKey },
                { label: 'Exports', key: 'export_count' as SortKey },
                { label: 'Joined', key: 'created_at' as SortKey },
              ].map(col => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="px-4 py-3 text-left text-xs font-medium text-text-dim uppercase tracking-wider cursor-pointer hover:text-text-secondary transition-colors select-none"
                >
                  <div className="flex items-center gap-1.5">
                    {col.label}
                    <SortIcon col={col.key} />
                  </div>
                </th>
              ))}
              <th className="px-4 py-3 text-right text-xs font-medium text-text-dim uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-text-dim text-sm">
                  No users found
                </td>
              </tr>
            ) : (
              filtered.map(user => (
                <tr
                  key={user.id}
                  className="hover:bg-white/2 transition-colors"
                >
                  {/* User info */}
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onSelect(user)}
                      className="flex items-center gap-3 text-left group"
                    >
                      <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 text-xs font-bold text-accent-light">
                        {(user.full_name ?? user.email)[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-text-primary text-sm font-medium group-hover:text-accent-light transition-colors">
                          {user.full_name || '—'}
                        </p>
                        <p className="text-text-dim text-xs">{user.email}</p>
                      </div>
                      {user.is_admin && (
                        <ShieldCheck size={13} className="text-gold shrink-0" />
                      )}
                    </button>
                  </td>

                  {/* Plan */}
                  <td className="px-4 py-3">
                    <Badge variant={user.plan === 'pro' ? 'gold' : 'subtle'}>
                      {user.plan === 'pro' ? '⚡ Pro' : 'Free'}
                    </Badge>
                  </td>

                  {/* Exports */}
                  <td className="px-4 py-3">
                    <span className="text-text-secondary text-sm font-mono">
                      {user.export_count ?? 0}
                    </span>
                  </td>

                  {/* Joined */}
                  <td className="px-4 py-3">
                    <span className="text-text-dim text-xs">
                      {formatDate(user.created_at)}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {actionLoading === user.id ? (
                        <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          {user.plan === 'free' ? (
                            <button
                              onClick={() => handleAction(() => onGrant(user.id), user.id)}
                              title="Grant Pro"
                              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gold/10 hover:bg-gold/20 text-gold text-xs font-medium transition-all border border-gold/20"
                            >
                              <Crown size={11} />
                              Grant Pro
                            </button>
                          ) : (
                            <button
                              onClick={() => handleAction(() => onRevoke(user.id), user.id)}
                              title="Revoke Pro"
                              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-text-secondary text-xs font-medium transition-all border border-border"
                            >
                              <Zap size={11} />
                              Revoke Pro
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(user.id)}
                            title="Delete user"
                            className={`flex items-center justify-center w-7 h-7 rounded-lg text-xs transition-all ${
                              confirmDelete === user.id
                                ? 'bg-red-500 text-white'
                                : 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20'
                            }`}
                          >
                            <Trash2 size={12} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-border">
        <p className="text-text-dim text-xs">
          {filtered.length} of {users.length} user{users.length !== 1 ? 's' : ''}
          {search && ` matching "${search}"`}
        </p>
      </div>
    </div>
  )
}