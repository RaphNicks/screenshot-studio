import { useState } from 'react'
import { Link, } from 'react-router-dom'
import { Camera, Mail, Lock, User, ArrowRight, Eye, EyeOff, Check } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/ui/Button'

export default function SignupPage() {
  const { signUp } = useAuth()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const passwordStrength = () => {
    if (password.length === 0) return 0
    let score = 0
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    return score
  }

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong']
  const strengthColor = ['', 'bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-emerald-500']
  const strength = passwordStrength()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setLoading(true)
    const { error } = await signUp(email, password, fullName)
    if (error) {
      setError(error)
      setLoading(false)
    } else {
      setLoading(false)
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-5">
            <Check size={28} className="text-emerald-400" />
          </div>
          <h2 className="font-display font-bold text-2xl text-text-primary mb-3">
            Check your email
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-6">
            We sent a confirmation link to <span className="text-text-primary font-medium">{email}</span>.
            Click it to activate your account, then come back to sign in.
          </p>
          <Link to="/login">
            <Button variant="secondary" size="md">
              Back to Sign In
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-void flex items-center justify-center px-6 relative overflow-hidden">
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
            Create your account
          </h1>
          <p className="text-text-secondary text-sm">
            Free forever · No credit card required
          </p>
        </div>

        {/* Card */}
        <div className="bg-panel border border-border rounded-2xl p-8 shadow-panel">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Full Name */}
            <div className="space-y-1.5">
              <label htmlFor="signup-fullName" className="text-text-secondary text-xs font-medium">Full name</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-dim" />
                <input
                  id="signup-fullName"
                  name="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="Your full name"
                  className="w-full bg-surface border border-border rounded-xl pl-10 pr-4 py-3 text-sm text-text-primary placeholder:text-text-dim focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="signup-email" className="text-text-secondary text-xs font-medium">Email address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-dim" />
                <input
                  id="signup-email"
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
              <label htmlFor="signup-password" className="text-text-secondary text-xs font-medium">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-dim" />
                <input
                  id="signup-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Min. 8 characters"
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

              {/* Password strength */}
              {password.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? strengthColor[strength] : 'bg-border'
                          }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-text-dim">
                    Strength: <span className="text-text-secondary">{strengthLabel[strength]}</span>
                  </p>
                </div>
              )}
            </div>

            <p className="text-center text-text-dim text-xs mt-6 leading-relaxed">
              By signing up you agree to our{' '}
              <Link to="/terms" className="text-accent hover:text-accent-light transition-colors">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/terms" className="text-accent hover:text-accent-light transition-colors">
                Privacy Policy
              </Link>
            </p>

            <Button
              type="submit"
              size="lg"
              loading={loading}
              rightIcon={<ArrowRight size={16} />}
              className="w-full justify-center mt-2"
            >
              Create Account
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-text-secondary text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-accent hover:text-accent-light transition-colors font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}