import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Crown, LogOut, ShieldCheck, LayoutGrid,
  Settings, TrendingUp, Image, Plus, X
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useUserExports } from '../hooks/useUserExports'
import { useCheckout } from '../hooks/useCheckout'
import ExportCard from '../components/dashboard/ExportCard'
import AccountSettings from '../components/dashboard/AccountSettings'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import GradientText from '../components/ui/GradientText'

type Tab = 'exports' | 'settings'

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="p-5 rounded-xl bg-panel border border-border shadow-inner-top text-center">
      <p className="font-display font-bold text-2xl text-text-primary mb-0.5">{value}</p>
      <p className="text-text-dim text-xs">{label}</p>
      {sub && <p className="text-accent text-xs mt-0.5">{sub}</p>}
    </div>
  )
}

export default function DashboardPage() {
  const { profile, signOut, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<Tab>('exports')
  const [showUpgradeSuccess, setShowUpgradeSuccess] = useState(false)

  const { exports, loading, deleteExport, getSignedUrl, refresh } = useUserExports()
  const { startCheckout, loading: checkoutLoading } = useCheckout()

  const isPro = profile?.plan === 'pro'

  // Check for upgrade success redirect from Lemon Squeezy
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('upgraded') === 'true') {
      setShowUpgradeSuccess(true)
      window.history.replaceState({}, '', '/dashboard')
      refreshProfile()
    }
  }, [])

  const handleSignOut = async () => {
    await signOut()
    setTimeout(() => navigate('/'), 100)
  }

  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      })
    : '—'

  const daysActive = profile?.created_at
    ? Math.max(1, Math.floor(
        (Date.now() - new Date(profile.created_at).getTime()) / 86400000
      ))
    : 0

  return (
    <div className="min-h-screen bg-void pt-24 pb-20 px-6 relative">
      <div className="fixed inset-0 bg-grid-pattern bg-grid opacity-25 -z-10" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent/5 rounded-full blur-[100px] -z-10" />

      <div className="max-w-5xl mx-auto">

        {/* Upgrade success banner */}
        {showUpgradeSuccess && (
          <div className="mb-6 p-4 rounded-2xl bg-gold/10 border border-gold/30 flex items-center gap-3">
            <Crown size={18} className="text-gold shrink-0" />
            <div className="flex-1">
              <p className="text-gold font-display font-semibold">
                Welcome to Pro! 🎉
              </p>
              <p className="text-gold/70 text-sm">
                Your account has been upgraded. All Pro features are now unlocked.
              </p>
            </div>
            <button
              onClick={() => setShowUpgradeSuccess(false)}
              className="text-gold/50 hover:text-gold transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <p className="text-text-dim text-sm mb-1">Your dashboard</p>
            <h1 className="font-display font-bold text-3xl text-text-primary">
              {profile?.full_name
                ? <><GradientText variant="accent">{profile.full_name}</GradientText> 👋</>
                : 'Welcome back 👋'}
            </h1>
            <p className="text-text-secondary text-sm mt-1">
              {profile?.email} · Member since {memberSince}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {profile?.is_admin && (
              <Link to="/admin">
                <Button size="sm" variant="gold" leftIcon={<ShieldCheck size={13} />}>
                  Admin Panel
                </Button>
              </Link>
            )}
            <Link to="/studio">
              <Button size="sm" variant="secondary" leftIcon={<Plus size={13} />}>
                New Export
              </Button>
            </Link>
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

        {/* Plan Banner */}
        <div className={`relative p-5 rounded-2xl border mb-8 overflow-hidden ${
          isPro ? 'border-gold/30 bg-panel' : 'border-border bg-panel'
        }`}>
          {isPro && (
            <div className="absolute inset-0 bg-gradient-to-br from-gold/8 via-transparent to-transparent pointer-events-none" />
          )}
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                isPro ? 'bg-gold/10 border border-gold/20' : 'bg-white/5 border border-border'
              }`}>
                <Crown size={18} className={isPro ? 'text-gold' : 'text-text-dim'} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-display font-semibold text-text-primary">
                    {isPro ? 'Pro Plan' : 'Free Plan'}
                  </span>
                  <Badge variant={isPro ? 'gold' : 'subtle'}>
                    {isPro ? 'Active' : 'Limited'}
                  </Badge>
                </div>
                <p className="text-text-dim text-xs">
                  {isPro
                    ? 'Unlimited exports · 1×, 2×, 3× resolution · No watermarks · All formats'
                    : '5 exports/day · 1× resolution only · PNG export only'}
                </p>
              </div>
            </div>

            {isPro ? (
              <a
                href="https://app.lemonsqueezy.com/my-orders"
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0"
              >
                <Button size="sm" variant="secondary">
                  Manage Billing
                </Button>
              </a>
            ) : (
              <Button
                size="sm"
                leftIcon={<Crown size={13} />}
                onClick={startCheckout}
                loading={checkoutLoading}
                className="shrink-0"
              >
                Upgrade to Pro
              </Button>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Exports" value={profile?.export_count ?? 0} />
          <StatCard label="Saved Images" value={exports.length} sub="last 30 days" />
          <StatCard label="Days Active" value={daysActive} />
          <StatCard label="Plan" value={isPro ? 'Pro ⚡' : 'Free'} />
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 bg-panel border border-border rounded-xl w-fit mb-6">
          {([
            { id: 'exports', label: 'Saved Exports', icon: <LayoutGrid size={14} /> },
            { id: 'settings', label: 'Account Settings', icon: <Settings size={14} /> },
          ] as { id: Tab; label: string; icon: React.ReactNode }[]).map((tab) => (
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
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'exports' && (
          <div>
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
              </div>
            ) : exports.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-panel/50 p-16 text-center">
                <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-4">
                  <Image size={22} className="text-accent" />
                </div>
                <p className="text-text-primary font-display font-medium mb-2">
                  No saved exports yet
                </p>
                <p className="text-text-dim text-sm mb-6 max-w-xs mx-auto">
                  When you export and save a screenshot from the Studio, it will appear here for 30 days.
                </p>
                <Link to="/studio">
                  <Button size="sm" leftIcon={<Plus size={14} />}>
                    Open Studio
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-text-secondary text-sm">
                    <span className="text-text-primary font-medium">{exports.length}</span> saved export{exports.length !== 1 ? 's' : ''} · auto-delete after 30 days
                  </p>
                  <button
                    onClick={refresh}
                    className="text-text-dim hover:text-text-secondary text-xs flex items-center gap-1 transition-colors"
                  >
                    <TrendingUp size={12} />
                    Refresh
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {exports.map((exp) => (
                    <ExportCard
                      key={exp.id}
                      export_={exp}
                      onDelete={deleteExport}
                      getSignedUrl={getSignedUrl}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-lg">
            <AccountSettings />
          </div>
        )}

      </div>
    </div>
  )
}