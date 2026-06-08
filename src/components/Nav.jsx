import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { socialEnabled } from '../lib/supabase';

const MAIN_LINKS = [
  { to: '/',            label: '🏠 Hub',        end: true },
  { to: '/helper',      label: '🃏 Helper'                },
  { to: '/collection',  label: '📦 Collection'            },
  { to: '/prices',      label: '💰 Prices'                },
  { to: '/board-state', label: '⚔️ Board State'           },
  { to: '/combos',      label: '💥 Combos'                },
  { to: '/mtgle',       label: '🎮 MTGLE'                 },
];

const SOCIAL_LINKS = [
  { to: '/feed',    label: '📰 Feed'    },
  { to: '/trading', label: '🔄 Trading' },
  { to: '/friends', label: '👥 Friends' },
];

export default function Nav() {
  const { user, profile, signOut } = useAuth();

  return (
    <header className="nav">
      <div className="nav-inner">
        <NavLink to="/" className="nav-brand">
          <span className="nav-logo">🃏</span>
          <span className="nav-title">MTG Hub</span>
        </NavLink>

        <nav className="nav-links">
          {MAIN_LINKS.map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) => `nav-link${isActive ? ' nav-link-active' : ''}`}>
              {label}
            </NavLink>
          ))}

          {socialEnabled && (
            <>
              <span className="nav-divider" />
              {SOCIAL_LINKS.map(({ to, label }) => (
                <NavLink key={to} to={to}
                  className={({ isActive }) => `nav-link${isActive ? ' nav-link-active' : ''}`}>
                  {label}
                </NavLink>
              ))}
            </>
          )}
        </nav>

        <div className="nav-auth">
          {socialEnabled && (
            user
              ? (
                <div className="nav-user">
                  <span className="nav-username">@{profile?.username ?? '…'}</span>
                  <button className="nav-signout" onClick={signOut}>Sign out</button>
                </div>
              )
              : (
                <Link to="/login" className="nav-login-btn">Sign In</Link>
              )
          )}
        </div>
      </div>
    </header>
  );
}
