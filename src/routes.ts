import type { ComponentType } from 'react'
import AboutPage from './pages/AboutPage'
import ActivityPage from './pages/ActivityPage'
import ExperiencePage from './pages/ExperiencePage'
import ReposPage from './pages/ReposPage'

export interface AppRoute {
  path: string
  label: string
  icon: string
  Component: ComponentType
}

// Single source of truth for pages: adding a page = one entry here plus
// one component file. Nav renders from this list automatically.
export const routes: AppRoute[] = [
  { path: '/', label: '关于', icon: 'person', Component: AboutPage },
  { path: '/repos', label: '仓库', icon: 'folder', Component: ReposPage },
  { path: '/activity', label: '动态', icon: 'monitoring', Component: ActivityPage },
  { path: '/experience', label: '经历', icon: 'work', Component: ExperiencePage },
]
