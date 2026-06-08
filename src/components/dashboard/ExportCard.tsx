import { useState } from 'react'
import { Trash2, Download, Clock, Image } from 'lucide-react'
import type { UserExport } from '../../hooks/useUserExports'

interface ExportCardProps {
  export_: UserExport
  onDelete: (id: string, storagePath: string) => Promise<void>
  getSignedUrl: (storagePath: string) => Promise<string | null>
}

function getDaysRemaining(expiresAt: string): number {
  const diff = new Date(expiresAt).getTime() - Date.now()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function ExportCard({ export_, onDelete, getSignedUrl }: ExportCardProps) {
  const [deleting, setDeleting] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const daysLeft = getDaysRemaining(export_.expires_at)
  const isExpiringSoon = daysLeft <= 5

  const handleDownload = async () => {
    setDownloading(true)
    const url = await getSignedUrl(export_.storage_path)
    if (url) {
      const link = document.createElement('a')
      link.href = url
      link.download = export_.file_name
      link.click()
    }
    setDownloading(false)
  }

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true)
      setTimeout(() => setConfirmDelete(false), 3000)
      return
    }
    setDeleting(true)
    await onDelete(export_.id, export_.storage_path)
    setDeleting(false)
  }

  return (
    <div className="group relative bg-panel border border-border hover:border-accent/20 rounded-xl overflow-hidden transition-all duration-200 shadow-inner-top">
      {/* Preview area */}
      <div className="h-32 bg-surface flex items-center justify-center border-b border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-20" />
        <div className="relative flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
            <Image size={18} className="text-accent" />
          </div>
          <span className="text-text-dim text-xs font-mono uppercase">
            {export_.format}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-text-primary text-xs font-medium truncate mb-1" title={export_.file_name}>
          {export_.file_name}
        </p>
        <p className="text-text-dim text-xs mb-3">
          {formatDate(export_.created_at)}
          {export_.file_size && ` · ${export_.file_size}KB`}
        </p>

        {/* Expiry indicator */}
        <div className={`flex items-center gap-1.5 mb-3 text-xs ${
          isExpiringSoon ? 'text-amber-400' : 'text-text-dim'
        }`}>
          <Clock size={11} />
          <span>
            {daysLeft === 0
              ? 'Expires today'
              : `${daysLeft} day${daysLeft === 1 ? '' : 's'} left`}
          </span>
        </div>

        {/* Expiry progress bar */}
        <div className="h-1 bg-border rounded-full mb-4 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${
              isExpiringSoon ? 'bg-amber-400' : 'bg-accent'
            }`}
            style={{ width: `${(daysLeft / 30) * 100}%` }}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-accent/10 hover:bg-accent/20 text-accent text-xs font-medium transition-all disabled:opacity-50"
          >
            <Download size={12} />
            {downloading ? 'Getting link...' : 'Download'}
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              confirmDelete
                ? 'bg-red-500 text-white'
                : 'bg-red-500/10 hover:bg-red-500/20 text-red-400'
            }`}
          >
            <Trash2 size={12} />
            {deleting ? '...' : confirmDelete ? 'Confirm' : ''}
          </button>
        </div>
      </div>
    </div>
  )
}