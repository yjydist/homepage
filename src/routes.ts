import type { ComponentType } from 'react'
import AboutPage from './pages/AboutPage'
import ActivityPage from './pages/ActivityPage'
import ExperiencePage from './pages/ExperiencePage'
import ReposPage from './pages/ReposPage'

export interface AppRoute {
  path: string
  label: string
  Component: ComponentType
}

// Single source of truth for pages: adding a page = one entry here plus
// one component file. Nav renders from this list automatically.
export const routes: AppRoute[] = [
  { path: '/', label: 'About', Component: AboutPage },
  { path: '/repos', label: 'Repos', Component: ReposPage },
  { path: '/activity', label: 'Activity', Component: ActivityPage },
  { path: '/experience', label: 'Experience', Component: ExperiencePage },
]
