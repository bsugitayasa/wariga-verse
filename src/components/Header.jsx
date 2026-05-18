import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

export default function Header({ theme, onToggleTheme }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Beranda', icon: '🏠' },
    { to: '/app', label: 'Analisis', icon: '✨' },
    { to: '/iklan', label: 'Beriklan', icon: '📢' },
  ];

  return (
    <header className="header">
      <div className="container header__inner">
        <Link to="/" className="header__logo" style={{ textDecoration: 'none' }}>
          <img src="/logo.png" alt="Wariga Verse Logo" className="header__logo-img" />
          <div>
            <div className="header__title text-gradient">Wariga Verse</div>
            <div className="header__subtitle">Divine Guidance & Celestial Wisdom</div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="header__nav" aria-label="Main navigation">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`header__nav-link ${location.pathname === link.to ? 'header__nav-link--active' : ''}`}
            >
              <span className="header__nav-icon">{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="header__actions">
          <div className="text-bali header__mantra" style={{ fontSize: '1rem', color: 'var(--gold)' }}>
            ᬒᬁ ᬲ᭄ᬯᬲ᭄ᬢ᭄ᬬᬲ᭄ᬢᬸ
          </div>

          <button
            onClick={onToggleTheme}
            className="theme-toggle"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? '🌙' : '☀️'}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="header__mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <nav className="header__mobile-nav animate-fade-in" aria-label="Mobile navigation">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`header__mobile-link ${location.pathname === link.to ? 'header__mobile-link--active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
