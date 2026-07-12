import { useLocation } from 'react-router-dom'
import SeoContentPage from '../components/SeoContentPage'
import { getPageByUrl } from '../data/seoContent'
import NotFound from './NotFound'

export default function SeoBlogPage() {
  const { pathname } = useLocation()
  const page = getPageByUrl(pathname)

  if (!page) return <NotFound />

  return <SeoContentPage page={page} type="blog" />
}
