import { NavLink } from 'react-router-dom'
import { routes } from '../routes'

export default function Nav() {
  return (
    <header className="sticky top-0 z-10 border-b border-line bg-paper/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-2xl items-center justify-center px-6 py-2">
        <ul className="flex flex-wrap items-center justify-center gap-2 text-sm">
          {routes.map((route) => (
            <li key={route.path}>
              <NavLink
                to={route.path}
                end={route.path === '/'}
                className={({ isActive }) =>
                  `inline-flex min-h-[48px] items-center justify-center rounded-full px-3.5 py-2 text-sm transition-all duration-medium ease-standard focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                    isActive
                      ? 'bg-primary-container font-bold text-on-primary-container shadow-xs'
                      : 'text-muted hover:bg-accent/8 hover:text-ink'
                  }`
                }
              >
                {route.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
