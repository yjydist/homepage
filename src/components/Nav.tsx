import { Link, NavLink } from 'react-router-dom'
import { content } from '../content'
import { routes } from '../routes'

export default function Nav() {
  return (
    <header className="sticky top-0 z-10 border-b border-line bg-paper/90 backdrop-blur">
      <nav className="mx-auto flex max-w-2xl items-baseline justify-between px-6 py-4">
        <Link to="/" className="font-bold">
          {content.site.name}
        </Link>
        <ul className="flex gap-6 text-sm text-muted">
          {routes.map((route) => (
            <li key={route.path}>
              <NavLink
                to={route.path}
                end={route.path === '/'}
                className={({ isActive }) =>
                  `transition-colors hover:text-accent ${
                    isActive ? 'text-ink' : ''
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
