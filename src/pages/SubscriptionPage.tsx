import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Check, X, Zap, Crown, Building2, ArrowRight, HelpCircle, ChevronDown
} from 'lucide-react'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import GradientText from '../components/ui/GradientText'

// ── Types ──────────────────────────────────────────────────────────────────
type BillingCycle = 'monthly' | 'annual'

interface Plan {
  id: string
  name: string
  icon: React.ReactNode
  badge?: string
  monthlyPrice: number
  annualPrice: number
  description: string
  cta: string
  ctaVariant: 'secondary' | 'primary' | 'gold'
  highlighted: boolean
  features: string[]
  limits: string[]
}

// ── Plans data ─────────────────────────────────────────────────────────────
const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    icon: <Zap size={18} />,
    monthlyPrice: 0,
    annualPrice: 0,
    description: 'For casual use and trying things out.',
    cta: 'Get Started Free',
    ctaVariant: 'secondary',
    highlighted: false,
    features: [
      '5 exports per day',
      '1× resolution only',
      'All background presets',
      'Basic shadow controls',
      'PNG export',
    ],
    limits: [
      'No JPEG export',
      'No 2× / 3× resolution',
      'Watermark on exports',
      'No device mockups',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    icon: <Crown size={18} />,
    badge: 'Most Popular',
    monthlyPrice: 9,
    annualPrice: 7,
    description: 'For creators, developers, and indie makers.',
    cta: 'Start Pro — Free 7 Days',
    ctaVariant: 'primary',
    highlighted: true,
    features: [
      'Unlimited exports',
      '1×, 2×, 3× resolution',
      'PNG & JPEG export',
      'All background presets',
      'Full shadow & padding controls',
      'Browser & device mockups',
      'No watermarks',
      'Priority support',
    ],
    limits: [],
  },
  {
    id: 'team',
    name: 'Team',
    icon: <Building2 size={18} />,
    monthlyPrice: 29,
    annualPrice: 22,
    description: 'For agencies, product teams, and studios.',
    cta: 'Contact Sales',
    ctaVariant: 'gold',
    highlighted: false,
    features: [
      'Everything in Pro',
      'Up to 10 team members',
      'Shared asset library',
      'Custom brand presets',
      'Team usage analytics',
      'SSO & admin controls',
      'Dedicated account manager',
      'SLA & uptime guarantee',
    ],
    limits: [],
  },
]

// ── FAQ Data ───────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. There are no lock-ins. Cancel from your account dashboard at any time and you keep access until the end of your billing period.',
  },
  {
    q: 'Is there a free trial for Pro?',
    a: 'Every new Pro sign-up gets a 7-day free trial with full access. No credit card required to start.',
  },
  {
    q: 'Do my screenshots leave my device?',
    a: 'Never. All image processing is handled entirely in your browser using the html-to-image library. We never receive your images.',
  },
  {
    q: 'What happens to my exports when I downgrade?',
    a: 'Your previously downloaded files are yours forever. After downgrading, future exports will be subject to the Free plan limits.',
  },
  {
    q: 'Do you offer student or non-profit discounts?',
    a: 'Yes — reach out to our support team with verification and we will apply a 50% discount to the Pro plan.',
  },
]

// ── FAQ Item ───────────────────────────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left gap-4 group"
      >
        <span className="text-text-primary font-medium group-hover:text-accent-light transition-colors">
          {q}
        </span>
        <ChevronDown
          size={16}
          className={`text-text-dim shrink-0 transition-transform duration-300 ${open ? 'rotate-180 text-accent' : ''}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? 'max-h-48 pb-5 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="text-text-secondary text-sm leading-relaxed">{a}</p>
      </div>
    </div>
  )
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function SubscriptionPage() {
  const [billing, setBilling] = useState<BillingCycle>('annual')

  const annualSavings = (plan: Plan) =>
    Math.round(((plan.monthlyPrice - plan.annualPrice) / plan.monthlyPrice) * 100)

  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 bg-void bg-grid-pattern bg-grid -z-10 opacity-60" />
      <div className="fixed inset-0 bg-hero-radial -z-10" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-accent/4 rounded-full blur-[140px] -z-10" />

      <div className="max-w-6xl mx-auto px-6 pt-32 pb-24">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-5">
            <Badge variant="gold" dot>Upgrade anytime · Cancel anytime</Badge>
          </div>
          <h1 className="font-display font-800 text-5xl md:text-6xl leading-tight tracking-tight mb-4">
            Simple, honest
            <br />
            <GradientText variant="gold">pricing</GradientText>
          </h1>
          <p className="text-text-secondary text-lg max-w-xl mx-auto mb-10">
            Start free. Upgrade when you need more. No hidden fees, no usage traps.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-3 p-1 rounded-xl bg-panel border border-border">
            <button
              onClick={() => setBilling('monthly')}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                billing === 'monthly'
                  ? 'bg-surface text-text-primary shadow-panel'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling('annual')}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                billing === 'annual'
                  ? 'bg-surface text-text-primary shadow-panel'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Annual
              <span className="px-2 py-0.5 rounded-full bg-gold/10 text-gold border border-gold/20 text-xs font-medium">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Plan Cards */}
        <div className="grid md:grid-cols-3 gap-5 mb-20">
          {PLANS.map((plan) => {
            const price = billing === 'annual' ? plan.annualPrice : plan.monthlyPrice
            const savings = plan.monthlyPrice > 0 ? annualSavings(plan) : 0

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-2xl border transition-all duration-300 ${
                  plan.highlighted
                    ? 'bg-panel border-accent/40 shadow-glow-accent/20 shadow-panel scale-[1.02]'
                    : 'bg-panel border-border hover:border-accent/20'
                }`}
              >
                {/* Shine */}
                {plan.highlighted && (
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/8 via-transparent to-transparent rounded-2xl pointer-events-none" />
                )}

                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 rounded-full bg-accent text-white text-xs font-display font-semibold shadow-glow-accent/40">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="p-7 flex flex-col flex-1">
                  {/* Plan Header */}
                  <div className="flex items-center gap-2.5 mb-1">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      plan.highlighted
                        ? 'bg-accent/20 border border-accent/30 text-accent-light'
                        : plan.id === 'team'
                        ? 'bg-gold/10 border border-gold/20 text-gold'
                        : 'bg-white/5 border border-border text-text-secondary'
                    }`}>
                      {plan.icon}
                    </div>
                    <span className="font-display font-bold text-text-primary">{plan.name}</span>
                  </div>

                  {/* Price */}
                  <div className="mt-5 mb-2">
                    <div className="flex items-end gap-1.5">
                      <span className="font-display font-800 text-4xl text-text-primary">
                        {price === 0 ? 'Free' : `$${price}`}
                      </span>
                      {price > 0 && (
                        <span className="text-text-dim text-sm mb-1">/mo</span>
                      )}
                    </div>
                    {billing === 'annual' && savings > 0 && (
                      <p className="text-gold text-xs mt-0.5">
                        {savings}% saved vs monthly
                      </p>
                    )}
                  </div>

                  <p className="text-text-secondary text-sm mb-6 leading-relaxed">
                    {plan.description}
                  </p>

                  {/* CTA */}
                  <Link to={plan.id === 'free' ? '/studio' : '#'} className="block mb-6">
                    <Button
                      variant={plan.ctaVariant}
                      size="md"
                      className="w-full justify-center"
                      rightIcon={<ArrowRight size={14} />}
                    >
                      {plan.cta}
                    </Button>
                  </Link>

                  {/* Divider */}
                  <div className="border-t border-border mb-5" />

                  {/* Features */}
                  <ul className="space-y-2.5 flex-1">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                          plan.highlighted
                            ? 'bg-accent/20 text-accent'
                            : plan.id === 'team'
                            ? 'bg-gold/10 text-gold'
                            : 'bg-white/5 text-text-dim'
                        }`}>
                          <Check size={10} />
                        </div>
                        <span className="text-text-secondary text-sm">{f}</span>
                      </li>
                    ))}
                    {plan.limits.map((l, i) => (
                      <li key={`limit-${i}`} className="flex items-start gap-2.5">
                        <div className="mt-0.5 w-4 h-4 rounded-full bg-white/5 flex items-center justify-center shrink-0 text-text-dim">
                          <X size={10} />
                        </div>
                        <span className="text-text-dim text-sm line-through decoration-text-dim/50">{l}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>

        {/* Trust Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {[
            { value: '50K+', label: 'Exports daily' },
            { value: '4.9★', label: 'Average rating' },
            { value: '0 servers', label: 'Touch your images' },
            { value: '7 days', label: 'Free trial' },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-5 rounded-xl bg-panel border border-border">
              <p className="font-display font-bold text-2xl text-text-primary mb-0.5">{stat.value}</p>
              <p className="text-text-dim text-xs">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <HelpCircle size={18} className="text-accent" />
            <h2 className="font-display font-bold text-2xl text-text-primary">
              Frequently asked questions
            </h2>
          </div>
          <div className="bg-panel border border-border rounded-2xl px-7">
            {FAQS.map((faq, i) => (
              <FaqItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}