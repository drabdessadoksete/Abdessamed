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
import logoUrl from './assets/new logo.png'

// Ensure favicon uses the provided logo
const ensureFavicon = () => {
  const existing = document.querySelector("link[rel~='icon']") || document.createElement('link')
  existing.setAttribute('rel', 'icon')
  existing.setAttribute('href', logoUrl)
  if (!existing.parentNode) {
    document.head.appendChild(existing)
  }
}
ensureFavicon()

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
      { path: 'actualities', element: <Actualities /> },
      { path: 'actualities/:id', element: <Article /> },
      { path: 'login', element: <Login /> },
    ]
  },
  { path: '/admin', element: <Admin /> },
  { path: '/admin/actualities', element: <ActualitiesAdmin /> },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <KeepAliveWrapper />
      <RouterProvider router={router} />
    </HelmetProvider>
  </React.StrictMode>
)
