import { ShieldCheck } from 'lucide-react'
import type { AuditLog as AuditLogType } from '../../hooks/useAdminData'

interface AuditLogProps {
  logs: AuditLogType[]
}

const actionStyles: Record<string, string> = {
  grant_pro: 'text-gold bg-gold/10 border-gold/20',
  revoke_pro: 'text-text-secondary bg-white/5 border-border',
  delete_user: 'text-red-400 bg-red-500/10 border-red-500/20',
}

const actionLabels: Record<string, string> = {
  grant_pro: 'Granted Pro',
  revoke_pro: 'Revoked Pro',
  delete_user: 'Deleted User',
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function AuditLog({ logs }: AuditLogProps) {
  return (
    <div className="bg-panel border border-border rounded-2xl overflow-hidden shadow-inner-top">
      <div className="px-5 py-4 border-b border-border flex items-center gap-2">
        <ShieldCheck size={15} className="text-accent" />
        <h3 className="font-display font-semibold text-text-primary text-sm">
          Audit Log
        </h3>
        <span className="ml-auto text-text-dim text-xs">Last 50 actions</span>
      </div>

      {logs.length === 0 ? (
        <div className="px-5 py-12 text-center text-text-dim text-sm">
          No admin actions recorded yet
        </div>
      ) : (
        <div className="divide-y divide-border max-h-96 overflow-y-auto">
          {logs.map(log => (
            <div key={log.id} className="px-5 py-3 flex items-start gap-3">
              <span className={`shrink-0 mt-0.5 px-2 py-0.5 rounded-full text-xs font-medium border ${
                actionStyles[log.action] ?? 'text-text-secondary bg-white/5 border-border'
              }`}>
                {actionLabels[log.action] ?? log.action}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-text-secondary text-xs">
                  <span className="text-text-primary font-medium">
                    {log.target?.email ?? 'Unknown user'}
                  </span>
                  {log.notes && (
                    <span className="text-text-dim"> · {log.notes}</span>
                  )}
                </p>
                <p className="text-text-dim text-xs mt-0.5">
                  by {log.admin?.email ?? 'Unknown admin'} · {formatTime(log.created_at)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}