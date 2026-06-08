import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Camera, Menu, X, Sparkles, LogOut, LayoutDashboard, ShieldCheck } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Button from '../ui/Button'

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Studio', path: '/studio' },
  { label: 'Pricing', path: '/pricing' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const { user, profile, signOut } = useAuth()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-void/90 backdrop-blur-xl border-b border-border/60'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center group-hover:bg-accent/30 group-hover:shadow-glow-accent transition-all duration-300">
            <Camera size={16} className="text-accent-light" />
          </div>
          <span className="font-display font-700 text-lg text-text-primary tracking-tight">
            Screenshot<span className="text-accent">Studio</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-text-primary bg-white/5'
                    : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Desktop CTA — auth-aware */}
        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <>
              {profile?.is_admin && (
                <Link
                  to="/admin"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-gold border border-gold/20 bg-gold/5 hover:bg-gold/10 transition-all"
                >
                  <ShieldCheck size={13} />
                  Admin
                </Link>
              )}
              <Link
                to="/dashboard"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all"
              >
                <LayoutDashboard size={14} />
                Dashboard
              </Link>
              {profile?.plan !== 'pro' && (
                <Link to="/pricing">
                  <Button size="sm" leftIcon={<Sparkles size={13} />}>
                    Upgrade
                  </Button>
                </Link>
              )}
              <button
                onClick={signOut}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-red-400 hover:bg-red-500/5 transition-all"
              >
                <LogOut size={14} />
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button size="sm" variant="ghost">Sign In</Button>
              </Link>
              <Link to="/signup">
                <Button size="sm" rightIcon={<Sparkles size={13} />}>
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg border border-border hover:bg-white/5 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-surface/95 backdrop-blur-xl border-b border-border px-6 py-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === link.path
                  ? 'text-text-primary bg-white/5'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Mobile auth section */}
          <div className="border-t border-border mt-2 pt-3 flex flex-col gap-1">
            {user ? (
              <>
                {profile?.is_admin && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-gold"
                  >
                    <ShieldCheck size={14} />
                    Admin Panel
                  </Link>
                )}
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm text-text-secondary hover:text-text-primary"
                >
                  <LayoutDashboard size={14} />
                  Dashboard
                </Link>
                {profile?.plan !== 'pro' && (
                  <Link
                    to="/pricing"
                    className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-lg bg-accent text-white text-sm font-medium mt-1"
                  >
                    <Sparkles size={14} />
                    Upgrade to Pro
                  </Link>
                )}
                <button
                  onClick={signOut}
                  className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm text-red-400 hover:bg-red-500/5 transition-colors"
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-3 rounded-lg text-sm text-text-secondary hover:text-text-primary text-center"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-lg bg-accent text-white text-sm font-medium"
                >
                  <Sparkles size={14} />
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}