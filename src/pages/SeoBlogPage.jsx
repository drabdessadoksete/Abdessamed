import { useLocation } from 'react-router-dom'
import SeoContentPage from '../components/SeoContentPage'
import { getPageByUrl } from '../data/seoContent'

export default function SeoBlogPage() {
  const { pathname } = useLocation()
  const page = getPageByUrl(pathname)

  if (!page) return null

  return <SeoContentPage page={page} type="blog" />
}
