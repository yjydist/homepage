import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Reset scroll to top on every route change. */
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    // 'instant' overrides the site-wide scroll-behavior: smooth so route
    // changes do not trigger a slow animated scroll.
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])

  return null
}
