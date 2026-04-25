import { createClient } from '@supabase/supabase-js'

let _supabase = null

export function getSupabase() {
  if (!_supabase) {
    _supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
      process.env.SUPABASE_SERVICE_KEY || 'placeholder'
    )
  }
  return _supabase
}

export const supabase = new Proxy({}, {
  get(_, prop) {
    return getSupabase()[prop]
  }
})
