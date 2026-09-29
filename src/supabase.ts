import { createClient } from '@supabase/supabase-js'

export const SUPABASE_URL = 'https://wuiedibvewelsrrupeyh.supabase.co'
export const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_AcgklpwumKyD20fOPixgZg_yiFTG6kn'

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})
