import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Camera, Mail, ArrowLeft, Check } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import Button from '../../components/ui/Button'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback`,
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSent(true)
    }
  }

  return (
    <div className="min-h-screen bg-void flex items-center justify-center px-6 relative overflow-hidden">
      <div className="fixed inset-0 bg-grid-pattern bg-grid opacity-40 -z-10" />
      <div className="fixed inset-0 bg-hero-radial -z-10" />

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center">
              <Camera size={18} className="text-accent-light" />
            </div>
            <span className="font-display font-bold text-xl text-text-primary">
              Screenshot<span className="text-accent">Studio</span>
            </span>
          </Link>
          {!sent ? (
            <>
              <h1 className="font-display font-bold text-3xl text-text-primary mb-2">
                Reset your password
              </h1>
              <p className="text-text-secondary text-sm">
                Enter your email and we'll send a reset link
              </p>
            </>
          ) : (
            <>
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                <Check size={24} className="text-emerald-400" />
              </div>
              <h1 className="font-display font-bold text-2xl text-text-primary mb-2">
                Reset link sent
              </h1>
              <p className="text-text-secondary text-sm">
                Check your inbox at <span className="text-text-primary">{email}</span>
              </p>
            </>
          )}
        </div>

        {!sent && (
          <div className="bg-panel border border-border rounded-2xl p-8 shadow-panel">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}
              <div className="space-y-1.5">
                <label className="text-text-secondary text-xs font-medium">Email address</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-dim" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="w-full bg-surface border border-border rounded-xl pl-10 pr-4 py-3 text-sm text-text-primary placeholder:text-text-dim focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
                  />
                </div>
              </div>
              <Button
                type="submit"
                size="lg"
                loading={loading}
                className="w-full justify-center"
              >
                Send Reset Link
              </Button>
            </form>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-text-secondary hover:text-text-primary text-sm transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}