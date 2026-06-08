import { X, Crown, Zap, ShieldCheck, Mail, Calendar, Download } from 'lucide-react'
import type { Profile } from '../../context/AuthContext'
import Badge from '../ui/Badge'
import Button from '../ui/Button'

interface UserDrawerProps {
  user: Profile
  onClose: () => void
  onGrant: (userId: string) => Promise<void>
  onRevoke: (userId: string) => Promise<void>
  onDelete: (userId: string) => Promise<void>
}

function InfoRow({ icon, label, value }: {
  icon: React.ReactNode
  label: string
  value: string | number
}) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-border last:border-0">
      <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-text-dim shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-text-dim text-xs mb-0.5">{label}</p>
        <p className="text-text-primary text-sm truncate">{value}</p>
      </div>
    </div>
  )
}

export default function UserDrawer({
  user, onClose, onGrant, onRevoke, onDelete,
}: UserDrawerProps) {
  const isPro = user.plan === 'pro'

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-void/60 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-panel border-l border-border z-50 overflow-y-auto shadow-panel">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-panel z-10">
          <h3 className="font-display font-semibold text-text-primary">User Details</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-text-dim hover:text-text-secondary hover:bg-white/5 transition-all"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-5">
          {/* Avatar + name */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-xl font-bold text-accent-light shrink-0">
              {(user.full_name ?? user.email)[0].toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="font-display font-semibold text-text-primary">
                  {user.full_name || 'No name set'}
                </p>
                {user.is_admin && (
                  <ShieldCheck size={14} className="text-gold" />
                )}
              </div>
              <Badge variant={isPro ? 'gold' : 'subtle'}>
                {isPro ? '⚡ Pro' : 'Free'}
              </Badge>
            </div>
          </div>

          {/* Info rows */}
          <div className="bg-surface rounded-xl border border-border mb-6">
            <InfoRow
              icon={<Mail size={13} />}
              label="Email"
              value={user.email}
            />
            <InfoRow
              icon={<Calendar size={13} />}
              label="Member Since"
              value={new Date(user.created_at).toLocaleDateString('en-US', {
                month: 'long', day: 'numeric', year: 'numeric'
              })}
            />
            <InfoRow
              icon={<Download size={13} />}
              label="Total Exports"
              value={user.export_count ?? 0}
            />
            <InfoRow
              icon={<Crown size={13} />}
              label="Plan"
              value={isPro ? `Pro${user.plan_granted_by ? ` (via ${user.plan_granted_by})` : ''}` : 'Free'}
            />
            {user.plan_granted_at && (
              <InfoRow
                icon={<Calendar size={13} />}
                label="Pro Granted"
                value={new Date(user.plan_granted_at).toLocaleDateString()}
              />
            )}
          </div>

          {/* Plan Actions */}
          <div className="space-y-2.5 mb-4">
            <p className="text-text-dim text-xs font-medium uppercase tracking-wider mb-3">
              Plan Management
            </p>
            {isPro ? (
              <Button
                variant="secondary"
                size="md"
                className="w-full justify-center"
                leftIcon={<Zap size={14} />}
                onClick={async () => { await onRevoke(user.id); onClose() }}
              >
                Revoke Pro Access
              </Button>
            ) : (
              <Button
                variant="gold"
                size="md"
                className="w-full justify-center"
                leftIcon={<Crown size={14} />}
                onClick={async () => { await onGrant(user.id); onClose() }}
              >
                Grant Pro Access
              </Button>
            )}
          </div>

          {/* Danger zone */}
          {!user.is_admin && (
            <div className="border border-red-500/20 rounded-xl p-4 bg-red-500/5">
              <p className="text-red-400 text-xs font-medium mb-3 uppercase tracking-wider">
                Danger Zone
              </p>
              <Button
                variant="secondary"
                size="sm"
                className="w-full justify-center border-red-500/30 text-red-400 hover:bg-red-500/10"
                leftIcon={<X size={13} />}
                onClick={async () => { await onDelete(user.id); onClose() }}
              >
                Delete This Account
              </Button>
              <p className="text-text-dim text-xs mt-2 text-center">
                This action is permanent and cannot be undone.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}