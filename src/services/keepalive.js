import { supabase } from './supabase'

export async function pingSupabase() {
  try {
    await supabase.from("messages").select("id").limit(1);
  } catch (e) {}
}