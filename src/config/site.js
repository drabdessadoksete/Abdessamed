export const site = {
  url: 'https://cabinetdentairesete.fr',
  practiceName: 'Cabinet Dentaire Dr. Abdessadok',
  dentistName: 'Dr Abdessamed Abdessadok',
  telephone: '+33422910594',
  telephoneDisplay: '04 22 91 05 94',
  email: 'drabdessadoksete@gmail.com',
  mapLink: 'https://maps.app.goo.gl/UALfaQYvaAV5otoq9',
  mapEmbedUrl: 'https://maps.google.com/maps?q=RDC%2C%2010%20Bd%20Dani%C3%A8le%20Casanova%2C%2034200%20S%C3%A8te&t=&z=16&ie=UTF8&iwloc=&output=embed',
  address: {
    streetAddress: 'RDC, 10 Bd Danièle Casanova',
    addressLocality: 'Sète',
    postalCode: '34200',
    addressCountry: 'FR',
  },
  coordinates: { latitude: 43.402, longitude: 3.7 },
  openingHours: [
    { days: ['Monday', 'Tuesday', 'Thursday', 'Friday'], opens: '08:00', closes: '12:00' },
    { days: ['Monday', 'Tuesday', 'Thursday', 'Friday'], opens: '14:00', closes: '17:00' },
    { days: ['Wednesday'], opens: '08:00', closes: '12:00' },
  ],
  qualifications: [
    'Docteur en Chirurgie Dentaire (UFR Toulouse)',
    'D.U. Implantologie, Chirurgie et Réhabilitation Orale (Université Montpellier-Nîmes)',
    'A.E.U. Imagerie 3D (UFR Nice)',
    'Aptitude à l’utilisation du MEOPA',
  ],
  consultationLanguages: ['fr'],
  areaServed: ['Sète', 'Bassin de Thau', 'Mèze', 'Frontignan', 'Marseillan', 'Balaruc-les-Bains', 'Agde'],
  profiles: [
    'https://share.google/nd3kQPUbq8Rs5tZ3y',
    'https://www.doctolib.fr/dentiste/sete/abdessamed-abdessadok-levallois-perret',
  ],
}

export function trailingSlash(pathname = '/') {
  const [path, suffix = ''] = pathname.split(/(?=[?#])/)
  if (!path || path === '/') return `/${suffix}`
  if (/\.[a-z0-9]+$/i.test(path)) return pathname
  return `${path.replace(/\/+$/, '')}/${suffix}`
}

export function absoluteUrl(pathname = '/') {
  return `${site.url}${trailingSlash(pathname)}`
}

export const postalAddressSchema = {
  '@type': 'PostalAddress',
  ...site.address,
}

export const openingHoursSchema = site.openingHours.map((hours) => ({
  '@type': 'OpeningHoursSpecification',
  dayOfWeek: hours.days,
  opens: hours.opens,
  closes: hours.closes,
}))

export const dentistSchema = {
  '@type': 'Dentist',
  '@id': `${site.url}/#dentist`,
  name: site.practiceName,
  employee: { '@id': `${site.url}/#dentist-person` },
  url: `${site.url}/`,
  telephone: site.telephone,
  email: site.email,
  image: `${site.url}/android-chrome-512x512.png`,
  address: postalAddressSchema,
  geo: { '@type': 'GeoCoordinates', ...site.coordinates },
  openingHoursSpecification: openingHoursSchema,
  sameAs: site.profiles,
  priceRange: '€€',
}

export const dentistPersonSchema = {
  '@type': 'Person',
  '@id': `${site.url}/#dentist-person`,
  name: site.dentistName,
  jobTitle: 'Chirurgien-dentiste',
  worksFor: { '@id': `${site.url}/#organization` },
  hasCredential: site.qualifications.map((credentialCategory) => ({ '@type': 'EducationalOccupationalCredential', credentialCategory })),
}

export const organizationSchema = {
  '@type': 'Organization',
  '@id': `${site.url}/#organization`,
  name: site.practiceName,
  url: `${site.url}/`,
  logo: `${site.url}/android-chrome-512x512.png`,
  sameAs: site.profiles,
}
