import { useEffect, useState } from 'react'

export default function GoogleReviews({ placeId = import.meta.env.VITE_GOOGLE_PLACE_ID, mapsLink = import.meta.env.VITE_GOOGLE_MAPS_LINK || 'https://maps.app.goo.gl/UALfaQYvaAV5otoq9' }){
  const [reviews, setReviews] = useState(null)
  const [error, setError] = useState('')
  useEffect(() => {
    const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    if (!key || !placeId) return
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,user_ratings_total,reviews&language=fr&key=${key}`
    fetch(url)
      .then((r) => r.json())
      .then((d) => {
        if (d.status !== 'OK' || !d.result) { setError(''); return }
        setReviews(d.result.reviews || [])
      })
      .catch(() => setError(''))
  }, [placeId])

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold">Avis Google en direct</h3>
        <a href={mapsLink} target="_blank" rel="noopener" className="btn-outline">Voir sur Google</a>
      </div>
      {reviews && reviews.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-6">
          {reviews.slice(0, 6).map((rev, i) => (
            <div key={i} className="card p-6">
              <div className="font-semibold mb-1">{rev.author_name}</div>
              <div className="text-sm text-muted mb-2">{rev.relative_time_description} • {rev.rating}★</div>
              <p className="text-sm">{rev.text}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-6">
          <p className="text-sm text-muted">Cliquez sur le bouton « Voir sur Google ».</p>
        </div>
      )}
    </div>
  )
}
