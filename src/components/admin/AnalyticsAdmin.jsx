import { useCallback, useEffect, useRef, useState } from 'react'
import {
  getAnalyticsDashboard,
  getAnalyticsHeatmap,
  getAnalyticsVisitorJourney,
  getAnalyticsVisitors,
  pruneAnalytics,
} from '../../services/analytics'

const panel = 'rounded-[1.4rem] border border-[#dfe7e2] bg-white shadow-[0_18px_55px_rgba(28,49,42,.07)]'
const number = new Intl.NumberFormat('fr-FR')
const percent = new Intl.NumberFormat('fr-FR', { style: 'percent', maximumFractionDigits: 1 })
const regionNames = typeof Intl.DisplayNames === 'function' ? new Intl.DisplayNames(['fr'], { type: 'region' }) : null

const periods = [
  { key: '24h', label: '24 heures', milliseconds: 24 * 60 * 60 * 1000 },
  { key: '7d', label: '7 jours', milliseconds: 7 * 24 * 60 * 60 * 1000 },
  { key: '30d', label: '30 jours', milliseconds: 30 * 24 * 60 * 60 * 1000 },
  { key: '90d', label: '3 mois', milliseconds: 90 * 24 * 60 * 60 * 1000 },
  { key: '365d', label: '1 an', milliseconds: 365 * 24 * 60 * 60 * 1000 },
]

const sourceLabels = {
  direct: 'Accès direct', google: 'Google', bing: 'Bing', facebook: 'Facebook', instagram: 'Instagram',
  doctolib: 'Doctolib', newsletter: 'E-mail / newsletter', referral: 'Autre site', campaign: 'Campagne', other: 'Autre',
}
const deviceLabels = { desktop: 'Ordinateur', mobile: 'Mobile', tablet: 'Tablette', other: 'Autre' }
const osLabels = { ios: 'iOS', android: 'Android', windows: 'Windows', macos: 'macOS', linux: 'Linux', chromeos: 'ChromeOS', other: 'Autre' }
const browserLabels = { chrome: 'Chrome', safari: 'Safari', firefox: 'Firefox', edge: 'Edge', samsung: 'Samsung Internet', other: 'Autre' }
const clickLabels = { phone: 'Téléphone', email: 'E-mail', map: 'Itinéraire', appointment: 'Pré-rendez-vous', contact: 'Contact / formulaire', navigation: 'Navigation', treatment: 'Pages de soins', outbound: 'Lien externe', other: 'Autre' }
const conversionLabels = { contact: 'Message envoyé', pre_appointment: 'Pré-rendez-vous envoyé', other: 'Autre conversion' }

const emptyData = {
  granularity: 'hour',
  summary: { visitors: 0, sessions: 0, pageviews: 0, clicks: 0, conversions: 0 },
  timeline: [], pages: [],
  dimensions: { source: [], device: [], os: [], browser: [], country: [], region: [], element: [], click_kind: [], conversion: [] },
}

function rangeFor(periodKey) {
  const period = periods.find((item) => item.key === periodKey) || periods[2]
  const to = new Date()
  return { from: new Date(to.getTime() - period.milliseconds), to }
}

function Icon({ name, className = 'h-5 w-5' }) {
  const paths = {
    sessions: <><circle cx="8" cy="8" r="3" /><path d="M2.5 20c.5-4 2.4-6 5.5-6s5 2 5.5 6M16 4.5a3 3 0 0 1 0 6M16 14c3 0 5 2 5.5 6" /></>,
    views: <><path d="M2 12s3.7-6 10-6 10 6 10 6-3.7 6-10 6S2 12 2 12Z" /><circle cx="12" cy="12" r="2.5" /></>,
    click: <><path d="m5 3 6.7 16 2.3-6 6-2.3L5 3Z" /><path d="m14 14 5 5" /></>,
    conversion: <><path d="M20 6 9 17l-5-5" /></>,
    refresh: <><path d="M20 6v5h-5M4 18v-5h5" /><path d="M6.1 9A7 7 0 0 1 18.5 6L20 11M4 13l1.5 5A7 7 0 0 0 18 15" /></>,
    privacy: <><path d="M12 22s8-3.5 8-10V5l-8-3-8 3v7c0 6.5 8 10 8 10Z" /><path d="m9 12 2 2 4-5" /></>,
  }
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">{paths[name]}</svg>
}

export default function AnalyticsAdmin() {
  const [period, setPeriod] = useState('30d')
  const [activeRange, setActiveRange] = useState(() => rangeFor('30d'))
  const [data, setData] = useState(emptyData)
  const [visitors, setVisitors] = useState([])
  const [selectedVisitor, setSelectedVisitor] = useState('')
  const [journey, setJourney] = useState(null)
  const [journeyLoading, setJourneyLoading] = useState(false)
  const [heatmap, setHeatmap] = useState({ points: [], elements: [], clickKinds: [] })
  const [selectedPage, setSelectedPage] = useState('/')
  const [heatDevice, setHeatDevice] = useState('desktop')
  const [heatKind, setHeatKind] = useState('')
  const [loading, setLoading] = useState(true)
  const [heatLoading, setHeatLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [updatedAt, setUpdatedAt] = useState(null)
  const mounted = useRef(true)
  const dashboardRequest = useRef(0)
  const heatmapRequest = useRef(0)
  const journeyRequest = useRef(0)

  const loadDashboard = useCallback(async ({ prune = false, quiet = false } = {}) => {
    const requestId = ++dashboardRequest.current
    if (!quiet) setLoading(true)
    if (prune) setRefreshing(true)
    setError('')
    const nextRange = rangeFor(period)
    try {
      if (prune) await pruneAnalytics()
      const [nextData, nextVisitors] = await Promise.all([
        getAnalyticsDashboard(nextRange.from, nextRange.to),
        getAnalyticsVisitors(nextRange.from, nextRange.to),
      ])
      if (!mounted.current || requestId !== dashboardRequest.current) return
      const normalized = { ...emptyData, ...nextData, summary: { ...emptyData.summary, ...nextData?.summary }, dimensions: { ...emptyData.dimensions, ...nextData?.dimensions } }
      setData(normalized)
      setVisitors(nextVisitors)
      setActiveRange(nextRange)
      setSelectedPage((current) => normalized.pages.some((page) => page.page_path === current) ? current : normalized.pages[0]?.page_path || '/')
      setSelectedVisitor((current) => nextVisitors.some((visitor) => visitor.visitorId === current) ? current : nextVisitors[0]?.visitorId || '')
      setUpdatedAt(new Date())
    } catch {
      if (mounted.current && requestId === dashboardRequest.current) setError('Les statistiques n’ont pas pu être chargées. Vérifiez que la migration Analytics est déployée.')
    } finally {
      if (mounted.current && requestId === dashboardRequest.current) { setLoading(false); setRefreshing(false) }
    }
  }, [period])

  const loadHeatmap = useCallback(async () => {
    if (!selectedPage) return
    const requestId = ++heatmapRequest.current
    setHeatLoading(true)
    try {
      const result = await getAnalyticsHeatmap({
        from: activeRange.from, to: activeRange.to, pagePath: selectedPage,
        device: heatDevice || null, clickKind: heatKind || null,
      })
      if (mounted.current && requestId === heatmapRequest.current) setHeatmap(result || { points: [], elements: [], clickKinds: [] })
    } catch {
      if (mounted.current && requestId === heatmapRequest.current) setHeatmap({ points: [], elements: [], clickKinds: [] })
    } finally {
      if (mounted.current && requestId === heatmapRequest.current) setHeatLoading(false)
    }
  }, [activeRange, selectedPage, heatDevice, heatKind])

  useEffect(() => {
    mounted.current = true
    loadDashboard()
    return () => { mounted.current = false }
  }, [loadDashboard])

  useEffect(() => { loadHeatmap() }, [loadHeatmap])

  useEffect(() => {
    if (!selectedVisitor) {
      setJourney(null)
      return undefined
    }
    const requestId = ++journeyRequest.current
    setJourneyLoading(true)
    getAnalyticsVisitorJourney(selectedVisitor, activeRange.from, activeRange.to)
      .then((result) => {
        if (mounted.current && requestId === journeyRequest.current) setJourney(result)
      })
      .catch(() => {
        if (mounted.current && requestId === journeyRequest.current) setJourney(null)
      })
      .finally(() => {
        if (mounted.current && requestId === journeyRequest.current) setJourneyLoading(false)
      })
    return undefined
  }, [activeRange, selectedVisitor])

  useEffect(() => {
    const timer = window.setInterval(() => loadDashboard({ quiet: true }), 30000)
    return () => window.clearInterval(timer)
  }, [loadDashboard])

  const summary = data.summary
  const clickRate = summary.pageviews ? summary.clicks / summary.pageviews : 0
  const conversionRate = summary.sessions ? summary.conversions / summary.sessions : 0
  const cards = [
    { label: 'Visiteurs uniques', value: summary.visitors, icon: 'sessions', detail: 'Navigateurs consentis distincts', tone: 'bg-[#e8f2ed] text-[#214e3e]' },
    { label: 'Sessions', value: summary.sessions, icon: 'sessions', detail: '30 min d’inactivité = nouvelle session', tone: 'bg-[#eef3ee] text-[#3d6656]' },
    { label: 'Pages vues', value: summary.pageviews, icon: 'views', detail: `${summary.sessions ? (summary.pageviews / summary.sessions).toFixed(1).replace('.', ',') : '0'} par session`, tone: 'bg-[#edf1f5] text-[#476274]' },
    { label: 'Clics', value: summary.clicks, icon: 'click', detail: `${percent.format(clickRate)} des pages vues`, tone: 'bg-[#f5f0e5] text-[#856938]' },
    { label: 'Conversions', value: summary.conversions, icon: 'conversion', detail: `${percent.format(conversionRate)} des sessions`, tone: 'bg-[#f3edf4] text-[#745578]' },
  ]

  return (
    <div className="space-y-6">
      <section className={`${panel} flex flex-col gap-5 p-4 sm:p-5 xl:flex-row xl:items-center xl:justify-between`}>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Période d’analyse">
          {periods.map((item) => <button key={item.key} type="button" onClick={() => setPeriod(item.key)} className={`min-h-10 rounded-xl px-3.5 text-xs font-black transition ${period === item.key ? 'bg-[#214e3e] text-white shadow-sm' : 'border border-[#dfe7e2] bg-[#fafbf9] text-[#5d6b65] hover:border-[#aabbb2]'}`}>{item.label}</button>)}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 text-xs font-bold text-[#718079]"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />Live · 30 s{updatedAt ? ` · ${updatedAt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}` : ''}</span>
          <button type="button" disabled={refreshing} onClick={() => loadDashboard({ prune: true })} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#d8e1dc] bg-white px-4 text-sm font-black text-[#263a33] transition hover:border-[#b7c8c0] disabled:opacity-50"><Icon name="refresh" className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />Rafraîchir</button>
        </div>
      </section>

      {error ? <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">{error}</p> : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
        {cards.map((card) => <article key={card.label} className={`${panel} flex items-center gap-4 p-5`}><span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${card.tone}`}><Icon name={card.icon} /></span><div className="min-w-0"><p className="text-3xl font-black tracking-[-.05em]">{loading ? '—' : number.format(card.value || 0)}</p><h2 className="mt-0.5 text-xs font-black text-[#53625b]">{card.label}</h2><p className="mt-1 truncate text-[.68rem] text-[#8a9690]">{card.detail}</p></div></article>)}
      </div>

      <div className="grid gap-6 2xl:grid-cols-[1.55fr_.75fr]">
        <section className={`${panel} overflow-hidden p-5 sm:p-7`}>
          <SectionTitle title="Évolution de l’audience" subtitle={`Sessions et pages vues · ${periods.find((item) => item.key === period)?.label.toLowerCase()}`} />
          <div className="mt-6"><TimelineChart rows={data.timeline} granularity={data.granularity} loading={loading} /></div>
        </section>
        <section className={`${panel} p-5 sm:p-7`}>
            <SectionTitle title="Pages les plus vues" subtitle="Vues et visiteurs distincts sur la période" />
            <div className="mt-5 space-y-2.5">
            {data.pages.length ? data.pages.slice(0, 8).map((page, index) => <button type="button" key={page.page_path} onClick={() => setSelectedPage(page.page_path)} className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${selectedPage === page.page_path ? 'border-[#a8bdb3] bg-[#f3f7f4]' : 'border-[#e5ebe7] hover:bg-[#fafbf9]'}`}><span className="w-5 text-center text-[.65rem] font-black text-[#a0aaa5]">{index + 1}</span><span className="min-w-0 flex-1"><strong className="block truncate text-xs">{pageLabel(page.page_path)}</strong><span className="mt-0.5 block text-[.64rem] font-semibold text-[#89958f]">{number.format(page.visitors || 0)} visiteur{Number(page.visitors) !== 1 ? 's' : ''}</span></span><strong className="text-sm">{number.format(page.pageviews)} vues</strong></button>) : <Empty label="Aucune page vue sur cette période." />}
          </div>
        </section>
      </div>

      <section className={`${panel} overflow-hidden`}>
        <div className="border-b border-[#e4eae6] p-5 sm:p-7">
          <SectionTitle title="Parcours des visiteurs uniques" subtitle="Identifiants pseudonymes propres à un navigateur consentant · jamais reliés aux formulaires ou aux dossiers patients" />
        </div>
        <div className="grid min-h-[30rem] lg:grid-cols-[.72fr_1.28fr]">
          <div className="max-h-[42rem] overflow-y-auto border-b border-[#e4eae6] p-3 lg:border-b-0 lg:border-r">
            {visitors.length ? visitors.map((visitor) => (
              <button key={visitor.visitorId} type="button" onClick={() => setSelectedVisitor(visitor.visitorId)} className={`mb-2 w-full rounded-2xl border p-4 text-left transition ${selectedVisitor === visitor.visitorId ? 'border-[#9bb5a8] bg-[#edf5f0] shadow-sm' : 'border-[#e3e9e5] bg-white hover:bg-[#fafbf9]'}`}>
                <span className="flex items-center justify-between gap-3"><strong className="text-sm">{visitor.label}</strong><time className="text-[.64rem] font-bold text-[#89958f]">{formatDateTime(visitor.lastSeen)}</time></span>
                <span className="mt-2 block truncate text-xs font-semibold text-[#586860]">{pageLabel(visitor.entryPage)} → {pageLabel(visitor.lastPage)}</span>
                <span className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[.66rem] font-bold text-[#7b8982]"><span>{number.format(visitor.sessions)} session{Number(visitor.sessions) !== 1 ? 's' : ''}</span><span>{number.format(visitor.pageviews)} pages</span><span>{number.format(visitor.clicks)} clics</span></span>
              </button>
            )) : <Empty label="Les visiteurs uniques apparaîtront ici après le déploiement du nouveau suivi et leur consentement." />}
          </div>
          <div className="p-5 sm:p-7">
            <VisitorJourney journey={journey} loading={journeyLoading} />
          </div>
        </div>
      </section>

      <section className={`${panel} overflow-hidden`}>
        <div className="border-b border-[#e4eae6] p-5 sm:p-7">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <SectionTitle title="Carte de chaleur contextualisée" subtitle="Clics consentis superposés à la vraie mise en page, sans enregistrement vidéo ni contenu saisi." />
            <div className="grid gap-2 sm:grid-cols-3">
              <Select label="Page" value={selectedPage} onChange={setSelectedPage} options={(data.pages.length ? data.pages : [{ page_path: '/' }]).map((item) => ({ value: item.page_path, label: pageLabel(item.page_path) }))} />
              <Select label="Mise en page" value={heatDevice} onChange={setHeatDevice} options={['desktop', 'tablet', 'mobile'].map((value) => ({ value, label: deviceLabels[value] }))} />
              <Select label="Type de clic" value={heatKind} onChange={setHeatKind} options={[{ value: '', label: 'Tous' }, ...Object.entries(clickLabels).map(([value, label]) => ({ value, label }))]} />
            </div>
          </div>
        </div>
        <div className="grid gap-0 xl:grid-cols-[1.25fr_.75fr]">
          <div className="border-b border-[#e4eae6] p-5 sm:p-7 xl:border-b-0 xl:border-r">
            <Heatmap points={heatmap.points || []} loading={heatLoading} pagePath={selectedPage} device={heatDevice} />
          </div>
          <div className="p-5 sm:p-7">
            <SectionTitle title="Boutons les plus cliqués" subtitle={`Sur ${pageLabel(selectedPage)} · carte limitée aux 90 derniers jours`} />
            <div className="mt-5"><RankedList rows={heatmap.elements || []} metric="clicks" labeler={elementLabel} empty="Aucun clic enregistré sur cette page." /></div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-2 2xl:grid-cols-3">
        <BreakdownCard title="Origine des visites" subtitle="Sessions par source" rows={data.dimensions.source} metric="sessions" labeler={(value) => sourceLabels[value] || value} />
        <BreakdownCard title="Types d’appareil" subtitle="Sessions consenties" rows={data.dimensions.device} metric="sessions" labeler={(value) => deviceLabels[value] || value} />
        <BreakdownCard title="Systèmes" subtitle="Systèmes d’exploitation" rows={data.dimensions.os} metric="sessions" labeler={(value) => osLabels[value] || value} />
        <BreakdownCard title="Navigateurs" subtitle="Navigateurs utilisés" rows={data.dimensions.browser} metric="sessions" labeler={(value) => browserLabels[value] || value} />
        <BreakdownCard title="Pays" subtitle="Les volumes inférieurs à 5 sont regroupés" rows={data.dimensions.country} metric="sessions" labeler={countryLabel} />
        <BreakdownCard title="Régions" subtitle="Zone approximative, si disponible" rows={data.dimensions.region} metric="sessions" labeler={(value) => value === 'unknown' ? 'Non disponible' : value === 'other' ? 'Autres / volume faible' : value} />
        <BreakdownCard title="Actions" subtitle="Types de clics" rows={data.dimensions.click_kind} metric="clicks" labeler={(value) => clickLabels[value] || value} />
        <BreakdownCard title="Conversions" subtitle="Formulaires transmis avec succès" rows={data.dimensions.conversion} metric="conversions" labeler={(value) => conversionLabels[value] || value} />
        <BreakdownCard title="Éléments cliqués" subtitle="Tous les boutons et liens" rows={data.dimensions.element} metric="clicks" labeler={elementLabel} />
      </div>

      <aside className="flex flex-col gap-4 rounded-[1.4rem] border border-[#d6e4dc] bg-[#edf5f0] p-5 text-[#254237] sm:flex-row sm:items-center sm:p-6">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-[#214e3e] shadow-sm"><Icon name="privacy" /></span>
        <div><h2 className="text-sm font-black">Parcours pseudonymes, séparés des données patients</h2><p className="mt-1 text-xs leading-5 text-[#60736a]">Un identifiant aléatoire est créé uniquement après consentement puis haché côté serveur. Aucun nom, téléphone, message, contenu de formulaire ou IP n’est stocké ici, et aucun rapprochement n’est fait avec les rendez-vous. Parcours : 13 mois maximum. Coordonnées de clics : 90 jours.</p></div>
      </aside>
    </div>
  )
}

function SectionTitle({ title, subtitle }) {
  return <div><h2 className="text-lg font-black tracking-[-.02em] sm:text-xl">{title}</h2><p className="mt-1 text-xs leading-5 text-[#718079]">{subtitle}</p></div>
}

function Empty({ label }) {
  return <div className="flex min-h-36 items-center justify-center rounded-2xl border border-dashed border-[#cbd8d1] bg-[#fafbf9] p-5 text-center text-xs font-medium text-[#84918b]">{label}</div>
}

function Select({ label, value, onChange, options }) {
  return <label className="block"><span className="mb-1.5 block text-[.62rem] font-black uppercase tracking-[.12em] text-[#718079]">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="min-h-10 w-full min-w-36 rounded-xl border border-[#d8e1dc] bg-[#fbfcfa] px-3 text-xs font-bold text-[#263a33] outline-none focus:border-[#856938] focus:ring-4 focus:ring-[#856938]/10">{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
}

function TimelineChart({ rows, granularity, loading }) {
  if (loading) return <div className="h-64 animate-pulse rounded-2xl bg-[#f3f6f4]" />
  if (!rows.length) return <Empty label="Les premières visites consenties apparaîtront ici." />
  const width = 760
  const height = 250
  const pad = { left: 16, right: 14, top: 18, bottom: 35 }
  const max = Math.max(1, ...rows.flatMap((row) => [Number(row.pageviews), Number(row.sessions), Number(row.visitors)]))
  const x = (index) => pad.left + (index / Math.max(1, rows.length - 1)) * (width - pad.left - pad.right)
  const y = (value) => height - pad.bottom - (Number(value) / max) * (height - pad.top - pad.bottom)
  const points = (metric) => rows.map((row, index) => `${x(index)},${y(row[metric])}`).join(' ')
  const ticks = [0, Math.floor((rows.length - 1) / 2), rows.length - 1].filter((value, index, values) => values.indexOf(value) === index)

  return <div><div className="mb-4 flex flex-wrap gap-4 text-[.68rem] font-black text-[#65726c]"><span className="inline-flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full bg-[#214e3e]" />Pages vues</span><span className="inline-flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full bg-[#c09850]" />Sessions</span><span className="inline-flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full bg-[#607c9c]" />Visiteurs uniques</span></div><svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img" aria-label="Évolution des pages vues, sessions et visiteurs uniques"><defs><linearGradient id="analytics-area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#214e3e" stopOpacity=".2" /><stop offset="1" stopColor="#214e3e" stopOpacity="0" /></linearGradient></defs>{[0, .25, .5, .75, 1].map((step) => <line key={step} x1={pad.left} x2={width - pad.right} y1={pad.top + step * (height - pad.top - pad.bottom)} y2={pad.top + step * (height - pad.top - pad.bottom)} stroke="#e6ece8" strokeWidth="1" />)}<polygon points={`${x(0)},${height - pad.bottom} ${points('pageviews')} ${x(rows.length - 1)},${height - pad.bottom}`} fill="url(#analytics-area)" /><polyline points={points('pageviews')} fill="none" stroke="#214e3e" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" /><polyline points={points('sessions')} fill="none" stroke="#c09850" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" /><polyline points={points('visitors')} fill="none" stroke="#607c9c" strokeWidth="2.5" strokeDasharray="5 5" strokeLinejoin="round" strokeLinecap="round" />{ticks.map((index) => <text key={index} x={x(index)} y={height - 8} textAnchor={index === 0 ? 'start' : index === rows.length - 1 ? 'end' : 'middle'} fill="#7b8982" fontSize="11" fontWeight="700">{formatChartDate(rows[index].bucket_start, granularity)}</text>)}</svg></div>
}

const previewWidths = { desktop: 1440, tablet: 768, mobile: 390, other: 1024 }

function Heatmap({ points, loading, pagePath, device }) {
  const frameRef = useRef(null)
  const containerRef = useRef(null)
  const baseWidth = previewWidths[device] || previewWidths.desktop
  const [frameHeight, setFrameHeight] = useState(device === 'mobile' ? 4200 : 3600)
  const [scale, setScale] = useState(0.5)

  const measureFrame = useCallback(() => {
    const frame = frameRef.current
    const container = containerRef.current
    if (container) setScale(Math.min(1, container.clientWidth / baseWidth))
    try {
      const root = frame?.contentDocument?.documentElement
      const body = frame?.contentDocument?.body
      const height = Math.max(root?.scrollHeight || 0, body?.scrollHeight || 0, 900)
      if (height) setFrameHeight(height)
    } catch {
      // The same-origin production preview is expected; keep a safe fallback.
    }
  }, [baseWidth])

  useEffect(() => {
    setFrameHeight(device === 'mobile' ? 4200 : 3600)
    const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(measureFrame) : null
    if (containerRef.current) observer?.observe(containerRef.current)
    if (!observer) window.addEventListener('resize', measureFrame)
    measureFrame()
    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', measureFrame)
    }
  }, [device, pagePath, measureFrame])

  const max = Math.max(1, ...points.map((point) => Number(point.clicks)))
  const total = points.reduce((sum, point) => sum + Number(point.clicks), 0)
  const previewSrc = `${pagePath}${pagePath.includes('?') ? '&' : '?'}analytics-preview=1`
  const scaledWidth = Math.round(baseWidth * scale)
  const scaledHeight = Math.max(520, Math.round(frameHeight * scale))

  return <div><div ref={containerRef} className="relative max-h-[52rem] overflow-y-auto overflow-x-hidden rounded-2xl border border-[#dce6e1] bg-[#e8eeea] p-2" aria-label={`Carte de chaleur contextualisée, ${number.format(total)} clics`}><div className="relative mx-auto origin-top-left overflow-hidden bg-white shadow-sm" style={{ width: scaledWidth, height: scaledHeight }}><iframe ref={frameRef} src={previewSrc} title={`Prévisualisation de ${pageLabel(pagePath)}`} tabIndex="-1" aria-hidden="true" className="pointer-events-none absolute left-0 top-0 border-0 bg-white" style={{ width: baseWidth, height: frameHeight, transform: `scale(${scale})`, transformOrigin: 'top left' }} onLoad={() => { measureFrame(); window.setTimeout(measureFrame, 600); window.setTimeout(measureFrame, 2200) }} />{points.map((point) => { const ratio = Number(point.clicks) / max; const size = 30 + Math.sqrt(ratio) * 46; return <span key={`${point.x_ratio}-${point.y_ratio}`} title={`${number.format(point.clicks)} clic${Number(point.clicks) !== 1 ? 's' : ''}`} className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-red-500/40" style={{ left: `${Number(point.x_ratio) / 100}%`, top: `${Number(point.y_ratio) / 100}%`, width: size, height: size, background: 'radial-gradient(circle, rgba(198,42,35,.95) 0 12%, rgba(239,117,35,.78) 30%, rgba(247,190,52,.46) 55%, rgba(247,190,52,0) 76%)', boxShadow: '0 0 18px rgba(226,83,35,.42)' }} /> })}{loading ? <span className="absolute inset-x-3 top-3 z-20 rounded-xl bg-white/90 px-4 py-3 text-center text-xs font-black text-[#52635c] shadow-sm backdrop-blur">Actualisation des clics…</span> : null}</div></div><div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-[#718079]"><span>{deviceLabels[device] || device} · aperçu non interactif</span><span>{number.format(total)} clic{total !== 1 ? 's' : ''} représenté{total !== 1 ? 's' : ''}</span></div></div>
}

function VisitorJourney({ journey, loading }) {
  if (loading) return <div className="h-80 animate-pulse rounded-2xl bg-[#f3f6f4]" />
  if (!journey?.events?.length) return <Empty label="Sélectionnez un visiteur pour voir son parcours pseudonyme." />

  return <div><div className="flex flex-col gap-3 border-b border-[#e4eae6] pb-5 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-[.65rem] font-black uppercase tracking-[.14em] text-[#856938]">Parcours pseudonyme</p><h3 className="mt-1 text-xl font-black">{journey.label}</h3><p className="mt-1 text-xs text-[#718079]">Du {formatDateTime(journey.summary?.first_seen)} au {formatDateTime(journey.summary?.last_seen)}</p></div><div className="flex flex-wrap gap-2 text-[.68rem] font-black"><span className="rounded-full bg-[#edf5f0] px-3 py-1.5 text-[#214e3e]">{number.format(journey.summary?.sessions || 0)} sessions</span><span className="rounded-full bg-[#eef2f5] px-3 py-1.5 text-[#526b7d]">{number.format(journey.summary?.pageviews || 0)} pages</span><span className="rounded-full bg-[#f6f0e5] px-3 py-1.5 text-[#856938]">{number.format(journey.summary?.clicks || 0)} clics</span></div></div><ol className="mt-5 max-h-[32rem] space-y-2 overflow-y-auto pr-1">{journey.events.map((event, index) => <li key={`${event.occurredAt}-${event.sessionId}-${index}`} className="flex gap-3 rounded-xl border border-[#e5ebe7] bg-[#fbfcfa] p-3"><span className={`mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full ${event.event === 'conversion' ? 'bg-violet-500' : event.event === 'click' ? 'bg-amber-500' : event.event === 'session_start' ? 'bg-sky-500' : 'bg-emerald-600'}`} /><span className="min-w-0 flex-1"><span className="flex flex-wrap items-center justify-between gap-2"><strong className="text-xs">{journeyEventLabel(event)}</strong><time className="text-[.64rem] font-bold text-[#8a9690]">{formatDateTime(event.occurredAt)}</time></span><span className="mt-1 block truncate text-[.7rem] font-semibold text-[#65746d]">{pageLabel(event.pagePath)} · session {event.sessionId}</span></span></li>)}</ol></div>
}

function BreakdownCard({ title, subtitle, rows = [], metric, labeler }) {
  return <section className={`${panel} p-5 sm:p-6`}><SectionTitle title={title} subtitle={subtitle} /><div className="mt-5"><RankedList rows={rows} metric={metric} labeler={labeler} empty="Aucune donnée sur cette période." /></div></section>
}

function RankedList({ rows = [], metric, labeler, empty }) {
  const visible = rows.slice(0, 9)
  const max = Math.max(1, ...visible.map((row) => Number(row[metric] || 0)))
  if (!visible.length) return <Empty label={empty} />
  return <div className="space-y-3">{visible.map((row) => { const value = Number(row[metric] || 0); return <div key={row.value}><div className="mb-1.5 flex items-center justify-between gap-3"><span className="truncate text-xs font-bold text-[#45564e]">{labeler(row.value)}</span><strong className="text-xs text-[#17231f]">{number.format(value)}</strong></div><div className="h-1.5 overflow-hidden rounded-full bg-[#edf1ef]"><div className="h-full rounded-full bg-[linear-gradient(90deg,#214e3e,#9b7d46)]" style={{ width: `${Math.max(3, (value / max) * 100)}%` }} /></div></div> })}</div>
}

function pageLabel(path) {
  if (typeof path !== 'string' || !path) return 'Page inconnue'
  if (path === '/') return 'Accueil'
  return path.replace(/^\/+|\/+$/g, '').replaceAll('-', ' ').replaceAll('/', ' › ')
}

function journeyEventLabel(event) {
  if (event.event === 'session_start') return 'Nouvelle session'
  if (event.event === 'page_view') return 'Page consultée'
  if (event.event === 'conversion') return `Conversion · ${conversionLabels[event.conversionKind] || 'Formulaire envoyé'}`
  if (event.event === 'click') return `Clic · ${elementLabel(event.element)}`
  return 'Activité'
}

function formatDateTime(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}

function elementLabel(value) {
  const known = { phone: 'Appeler le cabinet', email: 'Envoyer un e-mail', map: 'Ouvrir la carte', doctolib: 'Doctolib', submit_contact: 'Envoyer le formulaire de contact', submit_pre_appointment: 'Envoyer le pré-rendez-vous', button_menu: 'Menu mobile', button_language: 'Sélecteur de langue', button_other: 'Autre bouton', button_submit: 'Bouton de formulaire', link_home: 'Lien vers l’accueil', other: 'Autre élément' }
  if (known[value]) return known[value]
  return value.replace(/^link_/, 'Lien · ').replaceAll('_', ' ')
}

function countryLabel(value) {
  if (value === 'unknown') return 'Non disponible'
  if (value === 'other') return 'Autres / volume faible'
  try { return regionNames?.of(value) || value } catch { return value }
}

function formatChartDate(value, granularity) {
  const date = new Date(value)
  if (granularity === 'hour') return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
}
