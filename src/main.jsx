import React, { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import './styles/index.css'
import './styles/authority.css'
import App from './App'
import Home from './pages/Home'
import RouteBoundary from './components/RouteBoundary'
import { multilingualRoutes } from './config/multilingualRoutes'

function lazyWithRecovery(importer) {
  return lazy(async () => {
    const recoveryKey = `route-chunk-recovery:${window.location.pathname}`

    try {
      const module = await importer()
      window.sessionStorage.removeItem(recoveryKey)
      return module
    } catch (error) {
      if (!window.sessionStorage.getItem(recoveryKey)) {
        window.sessionStorage.setItem(recoveryKey, '1')
        window.location.reload()
        return new Promise(() => {})
      }
      throw error
    }
  })
}

const About = lazyWithRecovery(() => import('./pages/About'))
const Services = lazyWithRecovery(() => import('./pages/Services'))
const Gallery = lazyWithRecovery(() => import('./pages/Gallery'))
const Contact = lazyWithRecovery(() => import('./pages/Contact'))
const Admin = lazyWithRecovery(() => import('./pages/Admin'))
const Article = lazyWithRecovery(() => import('./pages/Article'))
const ActualitiesAdmin = lazyWithRecovery(() => import('./pages/ActualitiesAdmin'))
const Login = lazyWithRecovery(() => import('./pages/Login'))
const SeoServicePage = lazyWithRecovery(() => import('./pages/SeoServicePage'))
const SeoBlogPage = lazyWithRecovery(() => import('./pages/SeoBlogPage'))
const BlogHub = lazyWithRecovery(() => import('./pages/BlogHub'))
const PreAppointment = lazyWithRecovery(() => import('./pages/PreAppointment'))
const NotFound = lazyWithRecovery(() => import('./pages/NotFound'))
const MultilingualPage = lazyWithRecovery(() => import('./pages/MultilingualPage'))
const AdminGuard = lazyWithRecovery(() => import('./components/AdminGuard'))

function load(Component) {
  return (
    <RouteBoundary>
      <Suspense fallback={<div className="route-loading" role="status"><span>Chargement de la page…</span></div>}>
        <Component />
      </Suspense>
    </RouteBoundary>
  )
}

function loadAdmin(Component) {
  return (
    <RouteBoundary>
      <Suspense fallback={<div className="route-loading" role="status"><span>Vérification de la session…</span></div>}>
        <AdminGuard>
          <Component />
        </AdminGuard>
      </Suspense>
    </RouteBoundary>
  )
}

const localizedRoutes = multilingualRoutes.map((route) => ({
  path: route.path.replace(/^\/+|\/+$/g, ''),
  element: load(MultilingualPage),
}))

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: load(Home) },
      { path: 'about', element: load(About) },
      { path: 'services', element: load(Services) },
      { path: 'gallery', element: load(Gallery) },
      { path: 'contact', element: load(Contact) },
      { path: 'pre-rendez-vous', element: load(PreAppointment) },
      { path: 'blog', element: load(BlogHub) },
      { path: 'actualities', element: <Navigate to="/blog/" replace /> },
      { path: 'actualities/:id', element: load(Article) },
      { path: 'login', element: load(Login) },
      ...localizedRoutes,
      { path: 'blog/:slug', element: load(SeoBlogPage) },
      { path: ':slug', element: load(SeoServicePage) },
      { path: '*', element: load(NotFound) },
    ],
  },
  { path: '/admin/', element: loadAdmin(Admin) },
  { path: '/admin/actualities/', element: loadAdmin(ActualitiesAdmin) },
], {
  future: { v7_startTransition: true, v7_relativeSplatPath: true },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  </React.StrictMode>,
)
