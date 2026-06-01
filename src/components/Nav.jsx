import { NavLink } from 'react-router-dom';

const LINKS = [
  { to: '/',           label: '🏠 Hub',        end: true },
  { to: '/helper',     label: '🔍 Reference'          },
  { to: '/collection', label: '📦 Collection'         },
  { to: '/prices',     label: '💰 Prices'             },
  { to: '/board',      label: '⚔️ Board Analyzer'     },
];

export default function Nav() {
  return (
    <header className="nav">
      <div className="nav-inner">
        <NavLink to="/" className="nav-brand">
          <span className="nav-logo">🃏</span>
          <span className="nav-title">MTG Hub</span>
        </NavLink>
        <nav className="nav-links">
          {LINKS.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `nav-link${isActive ? ' nav-link-active' : ''}`}
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
