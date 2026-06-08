import { Link } from 'react-router-dom'
import { Crown, X, LogIn, Zap } from 'lucide-react'
import Button from './Button'

interface ExportGateModalProps {
  reason: 'limit_reached' | 'not_logged_in'
  onClose: () => void
}

export default function ExportGateModal({ reason, onClose }: ExportGateModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-void/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-panel border border-border rounded-2xl p-8 shadow-panel shadow-inner-top z-10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-text-dim hover:text-text-secondary hover:bg-white/5 transition-all"
        >
          <X size={16} />
        </button>

        {reason === 'not_logged_in' ? (
          <>
            <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-5">
              <LogIn size={24} className="text-accent" />
            </div>
            <div className="text-center mb-6">
              <h2 className="font-display font-bold text-xl text-text-primary mb-2">
                Sign in to export
              </h2>
              <p className="text-text-secondary text-sm leading-relaxed">
                Create a free account to export your screenshots.
                Free accounts get <span className="text-text-primary font-medium">5 exports per day</span>.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link to="/signup" onClick={onClose}>
                <Button size="md" className="w-full justify-center">
                  Create Free Account
                </Button>
              </Link>
              <Link to="/login" onClick={onClose}>
                <Button size="md" variant="secondary" className="w-full justify-center">
                  Sign In
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="w-14 h-14 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-5">
              <Crown size={24} className="text-gold" />
            </div>
            <div className="text-center mb-6">
              <h2 className="font-display font-bold text-xl text-text-primary mb-2">
                Daily limit reached
              </h2>
              <p className="text-text-secondary text-sm leading-relaxed mb-4">
                You've used all <span className="text-text-primary font-medium">5 free exports</span> for today.
                Upgrade to Pro for unlimited exports with no daily cap.
              </p>
              <div className="grid grid-cols-2 gap-3 text-left mb-2">
                {[
                  'Unlimited exports',
                  '1×, 2×, 3× resolution',
                  'PNG & JPEG export',
                  'No watermarks',
                  'Browser mockups',
                  'Priority support',
                ].map((f) => (
                  <div key={f} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                      <Zap size={9} className="text-gold" />
                    </div>
                    <span className="text-text-secondary text-xs">{f}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Link to="/pricing" onClick={onClose}>
                <Button size="md" variant="gold" className="w-full justify-center" leftIcon={<Crown size={14} />}>
                  Upgrade to Pro
                </Button>
              </Link>
              <button
                onClick={onClose}
                className="text-text-dim text-sm hover:text-text-secondary transition-colors"
              >
                Maybe tomorrow
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}