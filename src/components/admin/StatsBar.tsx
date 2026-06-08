import { Users, Crown, Zap, Download, TrendingUp } from 'lucide-react'
import type { AdminStats } from '../../hooks/useAdminData'

interface StatsBarProps {
  stats: AdminStats
}

export default function StatsBar({ stats }: StatsBarProps) {
  const cards = [
    {
      label: 'Total Users',
      value: stats.totalUsers,
      icon: <Users size={16} />,
      color: 'text-accent',
      bg: 'bg-accent/10 border-accent/20',
    },
    {
      label: 'Pro Users',
      value: stats.proUsers,
      icon: <Crown size={16} />,
      color: 'text-gold',
      bg: 'bg-gold/10 border-gold/20',
    },
    {
      label: 'Free Users',
      value: stats.freeUsers,
      icon: <Zap size={16} />,
      color: 'text-text-secondary',
      bg: 'bg-white/5 border-border',
    },
    {
      label: 'Total Exports',
      value: stats.totalExports,
      icon: <Download size={16} />,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      label: 'New Today',
      value: stats.newUsersToday,
      icon: <TrendingUp size={16} />,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/20',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
      {cards.map((card) => (
        <div
          key={card.label}
          className="p-4 rounded-xl bg-panel border border-border shadow-inner-top"
        >
          <div className={`w-8 h-8 rounded-lg border flex items-center justify-center mb-3 ${card.bg} ${card.color}`}>
            {card.icon}
          </div>
          <p className="font-display font-bold text-2xl text-text-primary mb-0.5">
            {card.value}
          </p>
          <p className="text-text-dim text-xs">{card.label}</p>
        </div>
      ))}
    </div>
  )
}