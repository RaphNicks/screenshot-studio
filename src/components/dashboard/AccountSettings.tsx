import { useState } from 'react'
import { User, Mail, Save, CheckCircle } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import Button from '../ui/Button'
import Badge from '../ui/Badge'

export default function AccountSettings() {
  const { profile, refreshProfile } = useAuth()
  const [fullName, setFullName] = useState(profile?.full_name ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSave = async () => {
    if (!profile) return
    setSaving(true)
    setError(null)

    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName })
      .eq('id', profile.id)

    if (error) {
      setError(error.message)
    } else {
      await refreshProfile()
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
    setSaving(false)
  }

  return (
    <div className="bg-panel border border-border rounded-2xl p-6 shadow-inner-top">
      <h3 className="font-display font-semibold text-text-primary mb-5 flex items-center gap-2">
        <User size={16} className="text-accent" />
        Account Settings
      </h3>

      <div className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-text-secondary text-xs font-medium mb-1.5">
            Display Name
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your name"
            className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-dim focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/30 transition-all"
          />
        </div>

        {/* Email — read only */}
        <div>
          <label className="block text-text-secondary text-xs font-medium mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-dim" />
            <input
              type="email"
              value={profile?.email ?? ''}
              disabled
              className="w-full bg-surface/50 border border-border rounded-xl pl-10 pr-4 py-3 text-sm text-text-dim cursor-not-allowed"
            />
          </div>
          <p className="text-text-dim text-xs mt-1">Email cannot be changed here.</p>
        </div>

        {/* Plan */}
        <div>
          <label className="block text-text-secondary text-xs font-medium mb-1.5">
            Current Plan
          </label>
          <div className="flex items-center gap-3 px-4 py-3 bg-surface rounded-xl border border-border">
            <Badge variant={profile?.plan === 'pro' ? 'gold' : 'subtle'}>
              {profile?.plan === 'pro' ? '⚡ Pro' : 'Free'}
            </Badge>
            <span className="text-text-secondary text-xs">
              {profile?.plan === 'pro'
                ? 'Unlimited exports, all features unlocked'
                : '5 exports per day, 1× resolution'}
            </span>
          </div>
        </div>

        {error && (
          <p className="text-red-400 text-xs">{error}</p>
        )}

        <Button
          size="md"
          onClick={handleSave}
          loading={saving}
          leftIcon={saved ? <CheckCircle size={14} /> : <Save size={14} />}
          variant={saved ? 'secondary' : 'primary'}
        >
          {saved ? 'Saved!' : 'Save Changes'}
        </Button>
      </div>
    </div>
  )
}