import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Leaf, LayoutDashboard, Lightbulb, Zap, Menu, X } from 'lucide-react';
import './Navbar.css';

const navItems = [
  { to: '/dashboard', label: 'Dashboard',  icon: LayoutDashboard },
  { to: '/insights',  label: 'Insights',   icon: Lightbulb },
  { to: '/actions',   label: 'Actions',    icon: Zap },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => setOpen(false), [pathname]);

  const isLanding = pathname === '/';

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
          {navItems.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
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

        {/* CTA */}
        <div className="navbar__cta">
          <NavLink to="/dashboard" className="btn btn-primary btn-sm">
            My Dashboard
          </NavLink>
        </div>

        {/* Mobile hamburger */}
        <button
          className="navbar__hamburger"
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="navbar__mobile">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `navbar__mobile-link${isActive ? ' navbar__mobile-link--active' : ''}`
              }
            >
              <Icon size={18} strokeWidth={2} />
              {label}
            </NavLink>
          ))}
          <NavLink to="/dashboard" className="btn btn-primary" style={{ marginTop: 8 }}>
            My Dashboard
          </NavLink>
        </div>
      )}
    </header>
  );
}
