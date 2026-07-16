export async function onRequestGet({ request }) {
  const geo = request.cf || {}
  const country = typeof geo.country === 'string' && /^[A-Z]{2}$/.test(geo.country) ? geo.country : null
  const region = typeof geo.regionCode === 'string' && /^[A-Z0-9-]{1,12}$/.test(geo.regionCode.toUpperCase())
    ? geo.regionCode.toUpperCase()
    : null

  return Response.json(
    { country, region },
    {
      headers: {
        'Cache-Control': 'private, max-age=3600',
        'X-Content-Type-Options': 'nosniff',
      },
    },
  )
}
