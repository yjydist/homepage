import AppBar from '@mui/material/AppBar'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import Box from '@mui/material/Box'
import ButtonBase from '@mui/material/ButtonBase'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import { NavLink, useLocation } from 'react-router-dom'
import { content } from '../content'
import { routes } from '../routes'
import Icon from './Icon'

export default function Nav() {
  const { pathname } = useLocation()

  return (
    <>
      <AppBar
        component="header"
        position="sticky"
        elevation={0}
        sx={(theme) => ({
          display: { xs: 'none', md: 'block' },
          bgcolor: theme.swiss.background,
          color: theme.swiss.text.primary,
          borderBottom: `2px solid ${theme.swiss.text.primary}`,
        })}
      >
        <Container maxWidth="lg">
          <Box component="nav" aria-label="主导航" sx={{ minHeight: 76, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
            <Typography variant="h3" component="span" sx={{ fontSize: 18, fontWeight: 700, whiteSpace: 'nowrap' }}>
              {content.site.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {routes.map((route) => {
                const selected = pathname === route.path
                return (
                  <ButtonBase
                    key={route.path}
                    component={NavLink}
                    to={route.path}
                    end={route.path === '/'}
                    aria-label={route.label}
                    sx={(theme) => ({
                      minHeight: 48,
                      px: 4,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 2,
                      color: selected ? theme.swiss.accent : theme.swiss.text.secondary,
                      fontWeight: selected ? 700 : 500,
                      fontSize: 14,
                      textDecoration: 'none',
                      transition: theme.transitions.create('color', { duration: theme.transitions.duration.short }),
                      '&:hover': { color: selected ? theme.swiss.accent : theme.swiss.text.primary },
                      '&:focus-visible': { outline: `2px solid ${theme.swiss.accent}`, outlineOffset: 2 },
                    })}
                  >
                    <Icon name={route.icon} filled={selected} size={21} />
                    {route.label}
                  </ButtonBase>
                )
              })}
            </Box>
          </Box>
        </Container>
      </AppBar>

      <BottomNavigation
        component="nav"
        aria-label="主导航"
        showLabels
        value={pathname}
        sx={(theme) => ({
          display: { xs: 'flex', md: 'none' },
          position: 'fixed',
          zIndex: theme.zIndex.appBar,
          left: 0,
          right: 0,
          bottom: 0,
          height: { xs: 'calc(96px + env(safe-area-inset-bottom))', sm: 'calc(80px + env(safe-area-inset-bottom))' },
          pb: 'env(safe-area-inset-bottom)',
          px: { xs: 1, sm: 4 },
          alignItems: 'stretch',
          bgcolor: theme.swiss.background,
          borderTop: `1px solid ${theme.swiss.text.primary}`,
        })}
      >
        {routes.map((route) => {
          const selected = pathname === route.path
          return (
            <BottomNavigationAction
              key={route.path}
              component={NavLink}
              to={route.path}
              value={route.path}
              label={route.label}
              showLabel
              icon={
                <Box
                  className="nav-indicator"
                  sx={{
                    width: 64,
                    height: 32,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon name={route.icon} filled={selected} size={24} />
                </Box>
              }
              sx={(theme) => ({
                minWidth: 0,
                maxWidth: 'none',
                minHeight: 80,
                py: 2,
                gap: { xs: 1, sm: 2 },
                flexDirection: { xs: 'column', sm: 'row' },
                color: theme.swiss.text.secondary,
                '&.Mui-selected': { color: theme.swiss.text.primary },
                '& .MuiBottomNavigationAction-label': { fontSize: 12, fontWeight: selected ? 700 : 500, lineHeight: 1.4, whiteSpace: 'nowrap' },
                '& .MuiBottomNavigationAction-label.Mui-selected': { fontSize: 12 },
                '&:focus-visible': { outline: `2px solid ${theme.swiss.accent}`, outlineOffset: -4 },
              })}
            />
          )
        })}
      </BottomNavigation>
    </>
  )
}
