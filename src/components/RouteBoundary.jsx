import React from 'react'
import { useLocation } from 'react-router-dom'

class RouteErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      <section className="route-error" role="alert">
        <div>
          <span className="section-kicker">Navigation interrompue</span>
          <h1>Cette page n’a pas pu s’afficher.</h1>
          <p>Une nouvelle version du site est peut-être disponible. Rechargez la page pour reprendre votre lecture.</p>
          <div>
            <button type="button" className="btn-primary" onClick={() => window.location.reload()}>Recharger la page</button>
            <a href="/blog/" className="text-link">Revenir aux guides</a>
          </div>
        </div>
      </section>
    )
  }
}

export default function RouteBoundary({ children }) {
  const location = useLocation()
  return <RouteErrorBoundary key={location.key || location.pathname}>{children}</RouteErrorBoundary>
}
