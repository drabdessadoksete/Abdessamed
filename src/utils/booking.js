const specialties = new Set(['implantologie', 'orthodontie'])

// Keep treatment context in the booking journey, never in analytics parameters.
export function bookingPath(pathname = '/', specialty = '') {
  let selected = specialties.has(specialty) ? specialty : ''
  const path = String(pathname).split(/[?#]/, 1)[0].toLowerCase()

  if (!selected && /implant|dents-manquantes/.test(path)) selected = 'implantologie'
  if (!selected && /orthodont|invisalign|aligneur|contention/.test(path)) selected = 'orthodontie'

  return selected ? `/pre-rendez-vous/?specialite=${selected}` : '/pre-rendez-vous/'
}
