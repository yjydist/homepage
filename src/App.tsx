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
    // min-h-dvh + flex-col + flex-1 main pins the footer to the viewport
    // bottom even when the page content is shorter than the screen.
    <div className="flex min-h-dvh flex-col">
      <ScrollToTop />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-sm focus:bg-paper focus:px-4 focus:py-2 focus:text-sm focus:text-accent focus:shadow-xs focus:outline-2 focus:outline-offset-2 focus:outline-accent"
      >
        跳到正文
      </a>
      <Nav />
      <main id="main-content" tabIndex={-1} className="flex-1">
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
    </div>
  )
}
