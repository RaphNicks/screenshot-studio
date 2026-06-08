import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Camera, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/ui/Button'

export default function LoginPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await signIn(email, password)
    if (error) {
      setError(error)
      setLoading(false)
    } else {
      setLoading(false)
      // Give auth state time to update in context
      setTimeout(() => {
        navigate(from, { replace: true })
      }, 100)
    }
  }

  return (
    <div className="min-h-screen bg-void flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 bg-grid-pattern bg-grid opacity-40 -z-10" />
      <div className="fixed inset-0 bg-hero-radial -z-10" />

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center">
              <Camera size={18} className="text-accent-light" />
            </div>
            <span className="font-display font-bold text-xl text-text-primary">
              Screenshot<span className="text-accent">Studio</span>
            </span>
          </Link>
          <h1 className="font-display font-bold text-3xl text-text-primary mb-2">
            Welcome back
          </h1>
          <p className="text-text-secondary text-sm">
            Sign in to access your account and saved exports
          </p>
        </div>

        {/* Card */}
        <div className="bg-panel border border-border rounded-2xl p-8 shadow-panel">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error */}
            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="login-email" className="text-text-secondary text-xs font-medium">
                Email address
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-dim" />
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full bg-surface border border-border rounded-xl pl-10 pr-4 py-3 text-sm text-text-primary placeholder:text-text-dim focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="login-password" className="text-text-secondary text-xs font-medium">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-accent text-xs hover:text-accent-light transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-dim" />
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-surface border border-border rounded-xl pl-10 pr-10 py-3 text-sm text-text-primary placeholder:text-text-dim focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-dim hover:text-text-secondary transition-colors"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              size="lg"
              loading={loading}
              rightIcon={<ArrowRight size={16} />}
              className="w-full justify-center mt-2"
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-text-secondary text-sm">
              Don't have an account?{' '}
              <Link to="/signup" className="text-accent hover:text-accent-light transition-colors font-medium">
                Create one free
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-text-dim text-xs mt-6">
          By signing in you agree to our{' '}
          <span className="text-text-secondary">Terms of Service</span> and{' '}
          <span className="text-text-secondary">Privacy Policy</span>
        </p>
      </div>
    </div>
  )
}