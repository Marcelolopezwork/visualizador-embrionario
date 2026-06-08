import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export async function saveCase(data: object): Promise<{ id: string } | null> {
  if (!supabase) return null
  const { data: row, error } = await supabase.from('embryo_cases').insert([data]).select('id').single()
  if (error) { console.error(error); return null }
  return row
}

export async function getCases() {
  if (!supabase) return []
  const { data, error } = await supabase.from('embryo_cases').select('*').order('created_at', { ascending: false })
  if (error) { console.error(error); return [] }
  return data ?? []
}

export async function getCaseById(id: string) {
  if (!supabase) return null
  const { data, error } = await supabase.from('embryo_cases').select('*').eq('id', id).single()
  if (error) { console.error(error); return null }
  return data
}
