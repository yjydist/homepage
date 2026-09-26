import { useEffect } from 'react'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
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
    <Box sx={{ display: 'flex', minHeight: '100dvh', flexDirection: 'column', pb: { xs: 'calc(96px + env(safe-area-inset-bottom))', sm: 'calc(80px + env(safe-area-inset-bottom))', md: 0 } }}>
      <ScrollToTop />
      <Link
        href="#main-content"
        sx={(theme) => ({ position: 'fixed', top: 16, left: 16, zIndex: theme.zIndex.tooltip + 1, transform: 'translateY(-160%)', bgcolor: theme.m3.primaryContainer, color: theme.m3.onPrimaryContainer, px: 4, py: 2, borderRadius: 3, '&:focus-visible': { transform: 'translateY(0)', outline: '2px solid', outlineColor: theme.m3.primary, outlineOffset: 2 } })}
      >
        跳到正文
      </Link>
      <Nav />
      <Box component="main" id="main-content" tabIndex={-1} sx={{ flex: 1, minWidth: 0, outline: 'none' }}>
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
      </Box>
      <Footer />
    </Box>
  )
}
