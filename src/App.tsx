import { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Footer from './components/Footer'
import Nav from './components/Nav'
import ScrollToTop from './components/ScrollToTop'
import { content } from './content'
import { routes } from './routes'

export default function App() {
  useEffect(() => {
    // Derive head metadata from content.toml so index.html stays a fallback.
    document.title = content.site.title
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', content.site.meta_description)
  }, [])

  return (
    <>
      <ScrollToTop />
      <Nav />
      <main>
        <Routes>
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<route.Component />}
            />
          ))}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
