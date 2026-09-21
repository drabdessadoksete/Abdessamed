import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { Route, Routes } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { MotionConfig } from 'framer-motion'
import App from '../src/App'
import Home from '../src/pages/Home'
import About from '../src/pages/About'
import Services from '../src/pages/Services'
import Gallery from '../src/pages/Gallery'
import BlogHub from '../src/pages/BlogHub'
import Contact from '../src/pages/Contact'
import PreAppointment from '../src/pages/PreAppointment'
import MultilingualPage from '../src/pages/MultilingualPage'
import SeoContentPage from '../src/components/SeoContentPage'
import NotFound from '../src/pages/NotFound'

const corePages = {
  home: Home,
  about: About,
  services: Services,
  gallery: Gallery,
  blog: BlogHub,
  contact: Contact,
  preAppointment: PreAppointment,
  notFound: NotFound,
}

// Build-time only: render the same public components used in the browser. Effects,
// analytics, network requests and form submissions never run during React SSR.
export function renderPublicRoute(route) {
  const context = {}
  const Component = corePages[route.type]
  const element = route.language && route.language !== 'fr'
    ? <MultilingualPage />
    : route.page
      ? <SeoContentPage page={route.page} type={route.type === 'article' ? 'blog' : 'service'} />
      : <Component />
  const html = renderToString(
    <HelmetProvider context={context}>
      <MotionConfig reducedMotion="always">
        <StaticRouter location={route.path}>
          <Routes>
            <Route element={<App />}>
              <Route path={route.path} element={element} />
            </Route>
          </Routes>
        </StaticRouter>
      </MotionConfig>
    </HelmetProvider>,
  )
  return { html, helmet: context.helmet }
}
