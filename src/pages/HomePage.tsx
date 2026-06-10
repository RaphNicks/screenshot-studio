import { Link } from 'react-router-dom'
import {
  ArrowRight, Zap, Layers, Download, Palette,
  MonitorSmartphone, Shield, Star
} from 'lucide-react'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import GradientText from '../components/ui/GradientText'

const features = [
  {
    icon: <Palette size={20} />,
    title: 'Custom Backgrounds',
    desc: 'Choose from gradients, solid colors, mesh patterns, or upload your own background image.',
  },
  {
    icon: <Layers size={20} />,
    title: 'Padding & Framing',
    desc: 'Fine-tune padding, corner radius, and shadow depth to make every screenshot look intentional.',
  },
  {
    icon: <MonitorSmartphone size={20} />,
    title: 'Device Mockups',
    desc: 'Wrap your screenshot in a browser frame, phone, or window chrome with one click.',
  },
  {
    icon: <Download size={20} />,
    title: 'High-Res Export',
    desc: 'Export as PNG or JPEG at 1x, 2x, or 3x resolution — pixel-perfect every time.',
  },
  {
    icon: <Zap size={20} />,
    title: 'Instant Preview',
    desc: 'Real-time live canvas updates as you tweak. No lag, no re-renders, just flow.',
  },
  {
    icon: <Shield size={20} />,
    title: 'Privacy First',
    desc: 'All processing happens in your browser. Your screenshots never touch a server.',
  },
]

const testimonials = [
  {
    name: 'Aisha Okonkwo',
    role: 'Product Designer',
    avatar: 'AO',
    text: 'Screenshot Studio completely changed how I present my work. The outputs look like I spent an hour in Figma.',
    stars: 5,
  },
  {
    name: 'Marcus Rivera',
    role: 'Indie Hacker',
    avatar: 'MR',
    text: 'I use this for every product launch tweet. The gradient backgrounds make my screenshots pop every single time.',
    stars: 5,
  },
  {
    name: 'Yuki Tanaka',
    role: 'Frontend Engineer',
    avatar: 'YT',
    text: 'Finally a tool that makes dev screenshots look gorgeous without leaving the browser. Absolute must-have.',
    stars: 5,
  },
]

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 bg-void bg-grid-pattern bg-grid -z-10" />
      <div className="fixed inset-0 bg-hero-radial -z-10" />
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] -z-10" />

      {/* Hero */}
      <section className="pt-36 pb-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="opacity-0-init animate-fade-up flex justify-center mb-6">
            <Badge variant="accent" dot>
              Now with 3x resolution export
            </Badge>
          </div>

          <h1 className="opacity-0-init animate-fade-up animate-delay-100 font-display font-800 text-5xl md:text-7xl leading-[1.05] tracking-tight mb-6">
            <span className="text-text-primary">Make your screenshots</span>
            <br />
            <span className="bg-gradient-to-r from-accent-light to-purple-300 bg-clip-text text-transparent">
              look extraordinary
            </span>
          </h1>

          <p className="opacity-0-init animate-fade-up animate-delay-200 text-text-secondary text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            Transform raw screenshots into polished, share-ready visuals in seconds.
            Beautiful backgrounds, perfect framing, zero design skills required.
          </p>

          <div className="opacity-0-init animate-fade-up animate-delay-300 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/studio">
              <Button size="lg" rightIcon={<ArrowRight size={18} />}>
                Open the Studio
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="secondary">
                View Pricing
              </Button>
            </Link>
          </div>

          <p className="opacity-0-init animate-fade-up animate-delay-400 mt-6 text-text-dim text-sm">
            Free to start · No account needed · Export up to 5/day free
          </p>
        </div>

        {/* Hero Visual */}
        <div className="opacity-0-init animate-fade-up animate-delay-500 mt-16 max-w-2xl mx-auto px-4">
          <div className="relative rounded-2xl border border-border overflow-hidden shadow-panel w-full">
            {/* Fake window chrome */}
            <div className="bg-panel border-b border-border px-4 py-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/70 shrink-0" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70 shrink-0" />
              <div className="w-3 h-3 rounded-full bg-green-500/70 shrink-0" />
              <div className="flex-1 mx-2">
                <div className="h-5 w-32 bg-border rounded-md mx-auto" />
              </div>
            </div>
            {/* Canvas preview */}
            <div className="bg-surface p-4 md:p-8 flex items-center justify-center">
              <div
                className="w-full rounded-2xl p-4 md:p-6 flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #1a0533 0%, #0d1a3a 50%, #001a1a 100%)',
                  boxShadow: '0 32px 80px rgba(0,0,0,0.8)',
                }}
              >
                <div className="bg-void/80 backdrop-blur rounded-xl border border-border p-4 md:p-6 w-full font-mono text-xs md:text-sm shadow-inner-top">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-text-dim">~/project</span>
                    <span className="text-accent">$</span>
                  </div>
                  <div className="space-y-1.5">
                    <p><span className="text-accent-light">npm</span> <span className="text-text-secondary">run dev</span></p>
                    <p className="text-text-dim">▶ VITE v5.0.0 ready</p>
                    <p className="text-emerald-400">✓ Local: http://localhost:5173/</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-accent text-sm font-display font-semibold uppercase tracking-widest mb-3">
              Everything you need
            </p>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-text-primary mb-4">
              Built for the details
            </h2>
            <p className="text-text-secondary text-lg max-w-xl mx-auto">
              Every control is designed to get you from "raw grab" to "portfolio-ready" in under a minute.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <div
                key={i}
                className="group relative p-6 rounded-2xl bg-panel border border-border hover:border-accent/30 shadow-inner-top transition-all duration-300 hover:shadow-glow-accent/20"
              >
                <div className="absolute inset-0 bg-card-shine rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-4 group-hover:bg-accent/20 transition-colors">
                    {f.icon}
                  </div>
                  <h3 className="font-display font-semibold text-text-primary mb-2">{f.title}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl md:text-5xl text-text-primary mb-4">
              Loved by creators
            </h2>
            <p className="text-text-secondary text-lg">
              Join thousands of developers, designers, and indie makers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <div key={i} className="p-6 rounded-2xl bg-panel border border-border shadow-inner-top">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.stars }).map((_, s) => (
                    <Star key={s} size={14} className="text-gold fill-gold" />
                  ))}
                </div>
                <p className="text-text-secondary text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-xs font-display font-bold text-accent-light">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-text-primary text-sm font-medium">{t.name}</p>
                    <p className="text-text-dim text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative p-12 rounded-3xl border border-accent/20 bg-panel overflow-hidden shadow-glow-accent/20">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent" />
            <div className="relative">
              <h2 className="font-display font-bold text-4xl md:text-5xl mb-4">
                Ready to{' '}
                <GradientText variant="accent">start creating?</GradientText>
              </h2>
              <p className="text-text-secondary text-lg mb-8 max-w-xl mx-auto">
                Open the studio and turn your first screenshot into something worth sharing.
              </p>
              <Link to="/studio">
                <Button size="lg" rightIcon={<ArrowRight size={18} />}>
                  Launch Screenshot Studio
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6 text-center">
        <p className="text-text-dim text-sm">
          © 2025 ScreenshotStudio · Built with precision by{' '}
          <span className="text-accent">Razid Technologies</span>
        </p>
      </footer>
    </div>
  )
}