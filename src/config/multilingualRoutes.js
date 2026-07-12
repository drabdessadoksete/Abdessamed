const languageMeta = {
  en: {
    label: 'English',
    locale: 'en-GB',
    notice: 'This is an informational translation. The practice has not confirmed that consultations can be conducted in English. Please contact the practice to arrange communication.',
    labels: { home: 'Home', ortho: 'Invisible orthodontics', implant: 'Dental implants', contact: 'Contact', cta: 'Contact the practice', learn: 'Read the patient guide' },
  },
  es: {
    label: 'Español',
    locale: 'es-ES',
    notice: 'Esta página es una traducción informativa. La clínica no ha confirmado que las consultas puedan realizarse en español. Póngase en contacto con la clínica para organizar la comunicación.',
    labels: { home: 'Inicio', ortho: 'Ortodoncia invisible', implant: 'Implantes dentales', contact: 'Contacto', cta: 'Contactar con la clínica', learn: 'Leer la guía para pacientes' },
  },
  de: {
    label: 'Deutsch',
    locale: 'de-DE',
    notice: 'Diese Seite ist eine informative Übersetzung. Die Praxis hat nicht bestätigt, dass Beratungen auf Deutsch durchgeführt werden können. Bitte kontaktieren Sie die Praxis, um die Kommunikation abzustimmen.',
    labels: { home: 'Startseite', ortho: 'Unsichtbare Kieferorthopädie', implant: 'Zahnimplantate', contact: 'Kontakt', cta: 'Praxis kontaktieren', learn: 'Patientenleitfaden lesen' },
  },
}

const languagePaths = {
  en: { home: '/en/', ortho: '/en/invisible-orthodontics-sete/', implant: '/en/dental-implants-sete/', contact: '/en/contact/' },
  es: { home: '/es/', ortho: '/es/ortodoncia-invisible-sete/', implant: '/es/implantes-dentales-sete/', contact: '/es/contacto/' },
  de: { home: '/de/', ortho: '/de/unsichtbare-kieferorthopaedie-sete/', implant: '/de/zahnimplantate-sete/', contact: '/de/kontakt/' },
}

const localizedContent = {
  en: {
    home: {
      title: 'Dental practice in Sète | Dr Abdessadok',
      description: 'Information in English about dental implants, invisible orthodontics and contacting Dr Abdessadok’s dental practice in Sète, France.',
      eyebrow: 'Dental practice in Sète, France',
      h1: 'Clear dental information before your visit.',
      intro: 'Understand the purpose, main stages and limits of implant and aligner treatment before contacting the practice in Sète.',
      sections: [
        { title: 'Invisible orthodontics', text: 'Assessment of tooth alignment and bite, digital impressions when appropriate, aligner wear, monitoring and retention.', linkType: 'ortho' },
        { title: 'Dental implants', text: 'Clinical assessment, imaging when indicated, alternatives, surgery, healing and long-term maintenance.', linkType: 'implant' },
        { title: 'A local practice', text: 'Appointments take place at 10 boulevard Danièle Casanova, 34200 Sète. The practice does not claim a second location in nearby towns.' },
      ],
    },
    ortho: {
      title: 'Invisible orthodontics in Sète | Patient information',
      description: 'English patient information about clear aligners in Sète: assessment, suitability, daily wear, attachments, limitations and retention.',
      eyebrow: 'Clear aligner treatment',
      h1: 'Invisible orthodontics in Sète: what the assessment should clarify',
      intro: 'Clear aligners can help with some tooth movements, but they are not suitable for every case and are not completely invisible.',
      sections: [
        { title: 'Suitability', text: 'The dentist examines tooth position, bite, gums and the movements required before discussing aligners or alternatives.' },
        { title: 'Daily commitment', text: 'Aligners usually require disciplined wear, removal for meals, careful cleaning and regular monitoring. Attachments may be visible.' },
        { title: 'Retention and limits', text: 'Retention is normally required after active movement. No simulation or treatment plan can guarantee a specific result.' },
      ],
    },
    implant: {
      title: 'Dental implants in Sète | Patient information',
      description: 'English patient information about dental implants in Sète: assessment, alternatives, surgery, healing, risks and maintenance.',
      eyebrow: 'Replacing a missing tooth',
      h1: 'Dental implants in Sète: assessment before treatment',
      intro: 'An implant may support a crown or prosthesis, but suitability depends on oral tissues, general health, anatomy and the restorative plan.',
      sections: [
        { title: 'Assessment and alternatives', text: 'The discussion may include an implant, bridge, removable prosthesis or no immediate replacement, depending on the clinical situation.' },
        { title: 'Surgery and healing', text: 'Local anaesthesia is commonly used. The number of stages and healing time vary and cannot be guaranteed before assessment.' },
        { title: 'Maintenance', text: 'Daily hygiene, professional monitoring and management of risk factors remain important after treatment.' },
      ],
    },
    contact: {
      title: 'Contact the dental practice in Sète | Dr Abdessadok',
      description: 'Address, telephone, email, access and opening hours for Dr Abdessadok’s dental practice in Sète, France.',
      eyebrow: 'Visit the practice in Sète',
      h1: 'Contact and practical information',
      intro: 'For urgent pain, call the practice directly. Do not send sensitive medical information by email.',
      sections: [
        { title: 'Address', text: 'Ground floor, 10 boulevard Danièle Casanova, 34200 Sète, France.' },
        { title: 'Telephone and email', text: '+33 4 22 91 05 94 · drabdessadoksete@gmail.com' },
        { title: 'Opening hours', text: 'Monday, Tuesday, Thursday and Friday: 08:00–12:00 and 14:00–17:00. Wednesday: 08:00–12:00.' },
      ],
    },
  },
  es: {
    home: {
      title: 'Clínica dental en Sète | Dr Abdessadok',
      description: 'Información en español sobre implantes dentales, ortodoncia invisible y contacto con la clínica del Dr Abdessadok en Sète, Francia.',
      eyebrow: 'Clínica dental en Sète, Francia',
      h1: 'Información dental clara antes de su visita.',
      intro: 'Conozca el objetivo, las etapas principales y los límites de los implantes y los alineadores antes de contactar con la clínica de Sète.',
      sections: [
        { title: 'Ortodoncia invisible', text: 'Evaluación de la alineación y la mordida, impresión digital cuando procede, uso de alineadores, controles y retención.', linkType: 'ortho' },
        { title: 'Implantes dentales', text: 'Evaluación clínica, pruebas de imagen cuando están indicadas, alternativas, cirugía, cicatrización y mantenimiento.', linkType: 'implant' },
        { title: 'Una clínica local', text: 'Las citas tienen lugar en el 10 boulevard Danièle Casanova, 34200 Sète. No existe una segunda clínica en las ciudades cercanas.' },
      ],
    },
    ortho: {
      title: 'Ortodoncia invisible en Sète | Información para pacientes',
      description: 'Información en español sobre alineadores transparentes en Sète: evaluación, indicación, uso diario, ataches, límites y retención.',
      eyebrow: 'Tratamiento con alineadores',
      h1: 'Ortodoncia invisible en Sète: qué debe aclarar la evaluación',
      intro: 'Los alineadores pueden realizar determinados movimientos dentales, pero no sirven para todos los casos ni son totalmente invisibles.',
      sections: [
        { title: 'Indicación', text: 'El dentista examina la posición de los dientes, la mordida, las encías y los movimientos necesarios antes de hablar de alineadores o alternativas.' },
        { title: 'Compromiso diario', text: 'El tratamiento exige un uso disciplinado, retirarlos para comer, una higiene cuidadosa y controles regulares. Los ataches pueden ser visibles.' },
        { title: 'Retención y límites', text: 'Después de la fase activa suele ser necesaria una retención. Ninguna simulación puede garantizar un resultado concreto.' },
      ],
    },
    implant: {
      title: 'Implantes dentales en Sète | Información para pacientes',
      description: 'Información en español sobre implantes en Sète: evaluación, alternativas, cirugía, cicatrización, riesgos y mantenimiento.',
      eyebrow: 'Sustituir un diente ausente',
      h1: 'Implantes dentales en Sète: evaluar antes de tratar',
      intro: 'Un implante puede sostener una corona o una prótesis, pero su indicación depende de los tejidos, la salud general, la anatomía y el proyecto protésico.',
      sections: [
        { title: 'Evaluación y alternativas', text: 'Según la situación se puede hablar de implante, puente, prótesis removible o ausencia temporal de tratamiento.' },
        { title: 'Cirugía y cicatrización', text: 'Habitualmente se utiliza anestesia local. El número de etapas y el tiempo de cicatrización varían.' },
        { title: 'Mantenimiento', text: 'La higiene diaria, los controles profesionales y el manejo de factores de riesgo siguen siendo necesarios.' },
      ],
    },
    contact: {
      title: 'Contacto de la clínica dental en Sète | Dr Abdessadok',
      description: 'Dirección, teléfono, correo electrónico, acceso y horarios de la clínica dental del Dr Abdessadok en Sète, Francia.',
      eyebrow: 'Visitar la clínica en Sète',
      h1: 'Contacto e información práctica',
      intro: 'En caso de dolor urgente, llame directamente a la clínica. No envíe información médica sensible por correo electrónico.',
      sections: [
        { title: 'Dirección', text: 'Planta baja, 10 boulevard Danièle Casanova, 34200 Sète, Francia.' },
        { title: 'Teléfono y correo', text: '+33 4 22 91 05 94 · drabdessadoksete@gmail.com' },
        { title: 'Horarios', text: 'Lunes, martes, jueves y viernes: 08:00–12:00 y 14:00–17:00. Miércoles: 08:00–12:00.' },
      ],
    },
  },
  de: {
    home: {
      title: 'Zahnarztpraxis in Sète | Dr Abdessadok',
      description: 'Deutschsprachige Informationen über Zahnimplantate, unsichtbare Kieferorthopädie und den Kontakt zur Praxis von Dr Abdessadok in Sète, Frankreich.',
      eyebrow: 'Zahnarztpraxis in Sète, Frankreich',
      h1: 'Klare Zahninformationen vor Ihrem Besuch.',
      intro: 'Informieren Sie sich über Zweck, Hauptschritte und Grenzen von Implantaten und Alignern, bevor Sie die Praxis in Sète kontaktieren.',
      sections: [
        { title: 'Unsichtbare Kieferorthopädie', text: 'Untersuchung von Zahnstellung und Biss, digitaler Abdruck bei entsprechender Indikation, Tragezeit, Kontrollen und Retention.', linkType: 'ortho' },
        { title: 'Zahnimplantate', text: 'Klinische Untersuchung, Bildgebung bei Indikation, Alternativen, Operation, Heilung und langfristige Nachsorge.', linkType: 'implant' },
        { title: 'Eine Praxis vor Ort', text: 'Termine finden am 10 boulevard Danièle Casanova, 34200 Sète statt. In den Nachbarstädten besteht keine Zweigpraxis.' },
      ],
    },
    ortho: {
      title: 'Unsichtbare Kieferorthopädie in Sète | Patienteninformation',
      description: 'Deutschsprachige Informationen zu transparenten Alignern in Sète: Untersuchung, Eignung, Tragezeit, Attachments, Grenzen und Retention.',
      eyebrow: 'Behandlung mit transparenten Alignern',
      h1: 'Unsichtbare Kieferorthopädie in Sète: Was die Untersuchung klären soll',
      intro: 'Transparente Aligner können bestimmte Zahnbewegungen ermöglichen, sind aber nicht für jeden Fall geeignet und nicht vollständig unsichtbar.',
      sections: [
        { title: 'Eignung', text: 'Zahnstellung, Biss, Zahnfleisch und notwendige Bewegungen werden untersucht, bevor Aligner oder Alternativen besprochen werden.' },
        { title: 'Alltag und Mitarbeit', text: 'Die Behandlung erfordert konsequentes Tragen, Herausnehmen beim Essen, sorgfältige Reinigung und Kontrollen. Attachments können sichtbar sein.' },
        { title: 'Retention und Grenzen', text: 'Nach der aktiven Bewegung ist meist eine Retention nötig. Eine Simulation kann kein bestimmtes Ergebnis garantieren.' },
      ],
    },
    implant: {
      title: 'Zahnimplantate in Sète | Patienteninformation',
      description: 'Deutschsprachige Informationen zu Implantaten in Sète: Untersuchung, Alternativen, Operation, Heilung, Risiken und Nachsorge.',
      eyebrow: 'Einen fehlenden Zahn ersetzen',
      h1: 'Zahnimplantate in Sète: Untersuchung vor der Behandlung',
      intro: 'Ein Implantat kann eine Krone oder Prothese tragen. Die Eignung hängt jedoch von Gewebe, Allgemeingesundheit, Anatomie und prothetischer Planung ab.',
      sections: [
        { title: 'Untersuchung und Alternativen', text: 'Je nach Situation werden Implantat, Brücke, herausnehmbare Prothese oder vorerst keine Versorgung besprochen.' },
        { title: 'Operation und Heilung', text: 'Meist wird örtlich betäubt. Anzahl der Schritte und Heilungszeit sind individuell und können nicht garantiert werden.' },
        { title: 'Nachsorge', text: 'Tägliche Hygiene, professionelle Kontrollen und der Umgang mit Risikofaktoren bleiben wichtig.' },
      ],
    },
    contact: {
      title: 'Kontakt zur Zahnarztpraxis in Sète | Dr Abdessadok',
      description: 'Adresse, Telefon, E-Mail, Zugang und Öffnungszeiten der Zahnarztpraxis von Dr Abdessadok in Sète, Frankreich.',
      eyebrow: 'Besuch der Praxis in Sète',
      h1: 'Kontakt und praktische Informationen',
      intro: 'Bei akuten Schmerzen rufen Sie die Praxis direkt an. Senden Sie keine sensiblen medizinischen Angaben per E-Mail.',
      sections: [
        { title: 'Adresse', text: 'Erdgeschoss, 10 boulevard Danièle Casanova, 34200 Sète, Frankreich.' },
        { title: 'Telefon und E-Mail', text: '+33 4 22 91 05 94 · drabdessadoksete@gmail.com' },
        { title: 'Öffnungszeiten', text: 'Montag, Dienstag, Donnerstag und Freitag: 08:00–12:00 und 14:00–17:00. Mittwoch: 08:00–12:00.' },
      ],
    },
  },
}

const frenchByType = {
  home: '/',
  ortho: '/orthodontie-invisible-sete/',
  implant: '/implantologie/',
  contact: '/contact/',
}

export const multilingualRoutes = Object.entries(languagePaths).flatMap(([language, paths]) => (
  Object.entries(paths).map(([pageType, path]) => ({
    path,
    paths,
    language,
    pageType,
    type: pageType === 'contact' ? 'contact' : pageType === 'home' ? 'localizedHome' : 'treatment',
    ...languageMeta[language],
    ...localizedContent[language][pageType],
    source: 'src/config/multilingualRoutes.js',
  }))
))

export const multilingualRouteByPath = new Map(multilingualRoutes.map((route) => [route.path, route]))

export function getLanguageNavigation(language) {
  return { ...languageMeta[language], paths: languagePaths[language] }
}

export function getAlternatesForPageType(pageType) {
  return [
    { language: 'fr', href: frenchByType[pageType] },
    ...Object.entries(languagePaths).map(([language, paths]) => ({ language, href: paths[pageType] })),
  ]
}

export function routeLanguage(pathname) {
  return multilingualRouteByPath.get(pathname)?.language || 'fr'
}

export function routePageType(pathname) {
  const localized = multilingualRouteByPath.get(pathname)
  if (localized) return localized.pageType
  if (pathname === '/orthodontie-invisible-sete/') return 'ortho'
  if (pathname === '/implantologie/') return 'implant'
  if (pathname === '/contact/') return 'contact'
  return pathname === '/' ? 'home' : null
}

export function equivalentPath(pathname, targetLanguage) {
  const pageType = routePageType(pathname) || 'home'
  return targetLanguage === 'fr' ? frenchByType[pageType] : languagePaths[targetLanguage][pageType]
}
