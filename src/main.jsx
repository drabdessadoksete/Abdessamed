import KeepAliveWrapper from './KeepAliveWrapper'
import React, { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import './styles/index.css'
import './styles/authority.css'
import App from './App'
import AdminGuard from './components/AdminGuard'
import { multilingualRoutes } from './config/multilingualRoutes'

const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Services = lazy(() => import('./pages/Services'))
const Gallery = lazy(() => import('./pages/Gallery'))
const Contact = lazy(() => import('./pages/Contact'))
const Admin = lazy(() => import('./pages/Admin'))
const Article = lazy(() => import('./pages/Article'))
const ActualitiesAdmin = lazy(() => import('./pages/ActualitiesAdmin'))
const Login = lazy(() => import('./pages/Login'))
const SeoServicePage = lazy(() => import('./pages/SeoServicePage'))
const SeoBlogPage = lazy(() => import('./pages/SeoBlogPage'))
const BlogHub = lazy(() => import('./pages/BlogHub'))
const PreAppointment = lazy(() => import('./pages/PreAppointment'))
const NotFound = lazy(() => import('./pages/NotFound'))
const MultilingualPage = lazy(() => import('./pages/MultilingualPage'))

function load(Component) {
  return (
    <Suspense fallback={<div className="route-loading" role="status"><span>Chargement…</span></div>}>
      <Component />
    </Suspense>
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
  { path: '/admin/', element: <AdminGuard>{load(Admin)}</AdminGuard> },
  { path: '/admin/actualities/', element: <AdminGuard>{load(ActualitiesAdmin)}</AdminGuard> },
], {
  future: { v7_startTransition: true, v7_relativeSplatPath: true },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <KeepAliveWrapper />
      <RouterProvider router={router} />
    </HelmetProvider>
  </React.StrictMode>,
)
