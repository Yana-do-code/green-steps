import { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Leaf, Home, Lightbulb, Zap, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const navItems = [
  { to: '/',         label: 'Home',     icon: Home },
  { to: '/insights', label: 'Insights', icon: Lightbulb },
  { to: '/actions',  label: 'Actions',  icon: Zap },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const isLanding = pathname === '/';

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className={`navbar${scrolled || !isLanding ? ' navbar--solid' : ''}`}>
      <nav className="navbar__inner container">
        {/* Logo */}
        <NavLink to="/" className="navbar__logo">
          <div className="navbar__logo-icon">
            <Leaf size={20} strokeWidth={2.5} />
          </div>
          <span className="navbar__logo-text">GreenSteps</span>
        </NavLink>

        {/* Desktop links */}
        <ul className="navbar__links">
          {navItems
            .filter(({ to }) => to === '/' || user)
            .map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `navbar__link${isActive ? ' navbar__link--active' : ''}`
                  }
                >
                  <Icon size={16} strokeWidth={2} />
                  {label}
                </NavLink>
              </li>
            ))}
        </ul>

        {/* CTA / User area */}
        <div className="navbar__cta">
          {user ? (
            <>
              <NavLink to="/dashboard" className="btn btn-primary btn-sm">
                My Dashboard
              </NavLink>
              <button
                className="btn btn-secondary btn-sm navbar__logout"
                onClick={handleLogout}
                title="Sign out"
              >
                <LogOut size={15} />
                {user.name.split(' ')[0]}
              </button>
            </>
          ) : (
            <NavLink to="/login" className="btn btn-primary btn-sm">
              Get Started
            </NavLink>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="navbar__hamburger"
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div id="mobile-menu" className="navbar__mobile">
          {navItems
            .filter(({ to }) => to === '/' || user)
            .map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `navbar__mobile-link${isActive ? ' navbar__mobile-link--active' : ''}`
                }
              >
                <Icon size={18} strokeWidth={2} />
                {label}
              </NavLink>
            ))}
          {user ? (
            <>
              <NavLink to="/dashboard" className="btn btn-primary" style={{ marginTop: 8 }}>
                My Dashboard
              </NavLink>
              <button className="btn btn-secondary" style={{ marginTop: 8 }} onClick={handleLogout}>
                <LogOut size={15} /> Sign Out
              </button>
            </>
          ) : (
            <NavLink to="/login" className="btn btn-primary" style={{ marginTop: 8 }}>
              Get Started
            </NavLink>
          )}
        </div>
      )}
    </header>
  );
}
