import { supabase } from './supabase'

const requireAnalyticsClient = () => {
  if (!supabase) throw new Error('Supabase is not configured')
  return supabase
}

export async function ingestAnalytics(payload) {
  if (!supabase) return false
  const { data, error } = await supabase.functions.invoke('analytics-ingest', { body: payload })
  if (error || !data?.ok) return false
  return true
}

export async function getAnalyticsDashboard(from, to) {
  const { data, error } = await requireAnalyticsClient().rpc('get_web_analytics_dashboard', {
    p_from: from.toISOString(),
    p_to: to.toISOString(),
  })
  if (error) throw error
  return data
}

export async function getAnalyticsHeatmap({ from, to, pagePath, device = null, clickKind = null }) {
  const { data, error } = await requireAnalyticsClient().rpc('get_web_analytics_heatmap', {
    p_from: from.toISOString(),
    p_to: to.toISOString(),
    p_page_path: pagePath,
    p_device: device || null,
    p_click_kind: clickKind || null,
  })
  if (error) throw error
  return data
}

export async function pruneAnalytics() {
  const { data, error } = await requireAnalyticsClient().rpc('prune_web_analytics')
  if (error) throw error
  return data
}
