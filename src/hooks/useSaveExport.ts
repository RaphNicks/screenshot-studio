import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

interface SaveExportOptions {
  dataUrl: string
  format: 'png' | 'jpeg'
}

interface SaveExportResult {
  saving: boolean
  saveExport: (opts: SaveExportOptions) => Promise<{ error: string | null; url: string | null }>
}

export function useSaveExport(): SaveExportResult {
  const { user, profile, refreshProfile } = useAuth()
  const [saving, setSaving] = useState(false)

  const saveExport = async ({ dataUrl, format }: SaveExportOptions) => {
    if (!user) return { error: 'Not logged in', url: null }

    setSaving(true)
    try {
      // Convert dataUrl to blob
      const res = await fetch(dataUrl)
      const blob = await res.blob()

      // Build unique file path: userId/timestamp.format
      const timestamp = Date.now()
      const fileName = `export-${timestamp}.${format}`
      const storagePath = `${user.id}/${fileName}`

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('exports')
        .upload(storagePath, blob, {
          contentType: format === 'jpeg' ? 'image/jpeg' : 'image/png',
          upsert: false,
        })

      if (uploadError) throw new Error(uploadError.message)

      // Get file size
      const fileSizeKB = Math.round(blob.size / 1024)

      // Save record to exports table
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 30)

      const { error: dbError } = await supabase
        .from('exports')
        .insert({
          user_id: user.id,
          file_name: fileName,
          file_url: storagePath,
          storage_path: storagePath,
          file_size: fileSizeKB,
          format,
          expires_at: expiresAt.toISOString(),
        })

      if (dbError) throw new Error(dbError.message)

      // Update export count on profile
      await supabase
        .from('profiles')
        .update({ export_count: (profile?.export_count ?? 0) + 1 })
        .eq('id', user.id)

      await refreshProfile()

      return { error: null, url: storagePath }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Upload failed'
      return { error: message, url: null }
    } finally {
      setSaving(false)
    }
  }

  return { saving, saveExport }
}