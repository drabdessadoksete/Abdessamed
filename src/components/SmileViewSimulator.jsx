const smileViewUrl = 'https://www.invisalign.fr/SV/1851755'

export default function SmileViewSimulator({ id = 'smileview-simulator' }) {
  return (
    <section className="smileview-tool" id={id} data-reveal-auto aria-labelledby={`${id}-title`}>
      <div className="smileview-tool__intro">
        <div>
          <span className="section-kicker section-kicker--light">Simulation SmileView</span>
          <h3 id={`${id}-title`}>Prenez un selfie et testez une simulation de sourire.</h3>
          <p>Visualisez un aperçu indicatif proposé par Invisalign. Cette simulation ne constitue ni un diagnostic, ni une promesse de résultat.</p>
          <p className="smileview-tool__privacy">Outil officiel hébergé par Invisalign. Il s’ouvre dans un nouvel onglet afin que l’appareil photo fonctionne correctement.</p>
        </div>
        <a
          className="btn-accent"
          href={smileViewUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Prendre un selfie avec l’outil officiel Invisalign SmileView (nouvel onglet)"
        >
          Prendre un selfie
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    </section>
  )
}
