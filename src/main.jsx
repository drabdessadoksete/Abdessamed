import KeepAliveWrapper from './KeepAliveWrapper'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import './styles/index.css'
import App from './App'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import Gallery from './pages/Gallery'
import Contact from './pages/Contact'
import Admin from './pages/Admin'
import Actualities from './pages/Actualities'
import Article from './pages/Article'
import ActualitiesAdmin from './pages/ActualitiesAdmin'
import Login from './pages/Login'
import SeoServicePage from './pages/SeoServicePage'
import SeoBlogPage from './pages/SeoBlogPage'
import BlogHub from './pages/BlogHub'
import PreAppointment from './pages/PreAppointment'
import AdminGuard from './components/AdminGuard'
import { blogPages, servicePages } from './data/seoContent'

const seoServiceRoutes = servicePages.map((page) => ({ path: page.path, element: <SeoServicePage /> }))
const seoBlogRoutes = blogPages.map((page) => ({ path: page.path, element: <SeoBlogPage /> }))

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'services', element: <Services /> },
      { path: 'gallery', element: <Gallery /> },
      { path: 'contact', element: <Contact /> },
      { path: 'pre-rendez-vous', element: <PreAppointment /> },
      { path: 'blog', element: <BlogHub /> },
      { path: 'actualities', element: <Actualities /> },
      { path: 'actualities/:id', element: <Article /> },
      { path: 'login', element: <Login /> },
      ...seoServiceRoutes,
      ...seoBlogRoutes,
    ]
  },
  { path: '/admin', element: <AdminGuard><Admin /></AdminGuard> },
  { path: '/admin/actualities', element: <AdminGuard><ActualitiesAdmin /></AdminGuard> },
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <KeepAliveWrapper />
      <RouterProvider router={router} />
    </HelmetProvider>
  </React.StrictMode>
)
