import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY as string

if (!supabaseServiceKey) {
  console.warn('Missing VITE_SUPABASE_SERVICE_KEY — admin operations will fail')
}

// This client bypasses RLS entirely — only use in admin operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)