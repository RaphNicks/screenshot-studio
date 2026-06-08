import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ShieldCheck, RefreshCw, LogOut,
  LayoutGrid, ClipboardList
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useAdminData } from '../hooks/useAdminData'
import StatsBar from '../components/admin/StatsBar'
import UserTable from '../components/admin/UserTable'
import UserDrawer from '../components/admin/UserDrawer'
import AuditLog from '../components/admin/AuditLog'
import Button from '../components/ui/Button'
import GradientText from '../components/ui/GradientText'
import type { Profile } from '../context/AuthContext'

type Tab = 'users' | 'audit'

export default function AdminPage() {
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<Tab>('users')
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null)

  const {
    users, stats, auditLogs, loading, error,
    refresh, grantPro, revokePro, deleteUser,
  } = useAdminData()

  const handleSignOut = async () => {
    await signOut()
    setTimeout(() => navigate('/'), 100)
  }

  return (
    <div className="min-h-screen bg-void pt-24 pb-20 px-6 relative">
      <div className="fixed inset-0 bg-grid-pattern bg-grid opacity-25 -z-10" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-gold/4 rounded-full blur-[120px] -z-10" />

      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck size={18} className="text-gold" />
              <p className="text-gold text-sm font-medium">Admin Portal</p>
            </div>
            <h1 className="font-display font-bold text-3xl text-text-primary">
              <GradientText variant="gold">Screenshot Studio</GradientText> Admin
            </h1>
            <p className="text-text-secondary text-sm mt-1">
              Manage users, plans, and monitor platform activity
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              leftIcon={<RefreshCw size={13} />}
              onClick={refresh}
            >
              Refresh
            </Button>
            <Button
              size="sm"
              variant="ghost"
              leftIcon={<LogOut size={13} />}
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          </div>
        </div>

        {/* Error state */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Loading state */}
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin" />
              <p className="text-text-secondary text-sm">Loading admin data...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Stats */}
            {stats && <StatsBar stats={stats} />}

            {/* Tabs */}
            <div className="flex items-center gap-1 p-1 bg-panel border border-border rounded-xl w-fit mb-6">
              {([
                { id: 'users', label: 'Users', icon: <LayoutGrid size={14} /> },
                { id: 'audit', label: 'Audit Log', icon: <ClipboardList size={14} /> },
              ] as { id: Tab; label: string; icon: React.ReactNode }[]).map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-surface text-text-primary shadow-panel'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                  {tab.id === 'users' && (
                    <span className="px-1.5 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-mono">
                      {users.length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Tab content */}
            {activeTab === 'users' && (
              <UserTable
                users={users}
                onGrant={grantPro}
                onRevoke={revokePro}
                onDelete={deleteUser}
                onSelect={setSelectedUser}
              />
            )}

            {activeTab === 'audit' && (
              <AuditLog logs={auditLogs} />
            )}
          </>
        )}
      </div>

      {/* User detail drawer */}
      {selectedUser && (
        <UserDrawer
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onGrant={grantPro}
          onRevoke={revokePro}
          onDelete={deleteUser}
        />
      )}
    </div>
  )
}