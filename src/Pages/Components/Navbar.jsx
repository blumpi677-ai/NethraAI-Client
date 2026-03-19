import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

// ============================================
// ICONS
// ============================================
const Icons = {
  Logo: () => (
    <svg viewBox="0 0 28 28" fill="none" className="nethra-navbar-comp-logo-svg">
      <defs>
        <linearGradient id="nethraLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      <circle cx="14" cy="14" r="12" stroke="url(#nethraLogoGrad)" strokeWidth="1.5" fill="none" />
      <circle cx="14" cy="14" r="7" stroke="url(#nethraLogoGrad)" strokeWidth="1" fill="none" opacity="0.5" />
      <circle cx="14" cy="14" r="3" fill="url(#nethraLogoGrad)" />
      <line x1="14" y1="2" x2="14" y2="6" stroke="url(#nethraLogoGrad)" strokeWidth="1" strokeLinecap="round" />
      <line x1="14" y1="22" x2="14" y2="26" stroke="url(#nethraLogoGrad)" strokeWidth="1" strokeLinecap="round" />
      <line x1="2" y1="14" x2="6" y2="14" stroke="url(#nethraLogoGrad)" strokeWidth="1" strokeLinecap="round" />
      <line x1="22" y1="14" x2="26" y2="14" stroke="url(#nethraLogoGrad)" strokeWidth="1" strokeLinecap="round" />
    </svg>
  ),
  Sparkle: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 1l1.275 3.88a1.33 1.33 0 00.845.845L14 7l-3.88 
        1.275a1.33 1.33 0 00-.845.845L8 13l-1.275-3.88a1.33 1.33 
        0 00-.845-.845L2 7l3.88-1.275a1.33 1.33 0 00.845-.845L8 1z" />
    </svg>
  ),
  ArrowRight: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="8" x2="13" y2="8" />
      <polyline points="9 4 13 8 9 12" />
    </svg>
  ),
  Home: () => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10.5L10 4l7 6.5" />
      <path d="M5 9v7a1 1 0 001 1h3v-4h2v4h3a1 1 0 001-1V9" />
    </svg>
  ),
  Info: () => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="8" />
      <line x1="10" y1="9" x2="10" y2="14" />
      <circle cx="10" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  ),
  Mail: () => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="16" height="12" rx="2" />
      <polyline points="2 4 10 11 18 4" />
    </svg>
  ),
  User: () => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="7" r="4" />
      <path d="M3 18c0-3.5 3.1-6 7-6s7 2.5 7 6" />
    </svg>
  ),
  Zap: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round">
      <polygon points="9 1 2 9 8 9 7 15 14 7 8 7 9 1" />
    </svg>
  ),
  MessageCircle: () => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 9.5a7.38 7.38 0 01-.8 3.3 7.5 7.5 0 01-6.7 4.2 7.38 
        7.38 0 01-3.3-.8L2 18l1.7-5a7.38 7.38 0 01-.7-3.5 7.5 7.5 0 
        014.2-6.7A7.38 7.38 0 0110.5 2h.4A7.48 7.48 0 0118 9.5z" />
    </svg>
  ),
  Settings: () => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="3" />
      <path d="M16.2 12.5a1.4 1.4 0 00.28 1.5l.05.05a1.7 1.7 0 
        01-1.2 2.9 1.7 1.7 0 01-1.2-.5l-.05-.05a1.4 1.4 0 
        00-1.5-.28 1.4 1.4 0 00-.85 1.28v.15a1.7 1.7 0 01-3.4 
        0v-.08a1.4 1.4 0 00-.92-1.28 1.4 1.4 0 00-1.5.28l-.05.05a1.7 
        1.7 0 01-2.4-2.4l.05-.05a1.4 1.4 0 00.28-1.5 1.4 1.4 0 
        00-1.28-.85H2.7a1.7 1.7 0 010-3.4h.08a1.4 1.4 0 001.28-.92 
        1.4 1.4 0 00-.28-1.5L3.73 5.58a1.7 1.7 0 012.4-2.4l.05.05a1.4 
        1.4 0 001.5.28h.07a1.4 1.4 0 00.85-1.28V2.08a1.7 1.7 0 
        013.4 0v.08a1.4 1.4 0 00.85 1.28 1.4 1.4 0 001.5-.28l.05-.05a1.7 
        1.7 0 012.4 2.4l-.05.05a1.4 1.4 0 00-.28 1.5v.07a1.4 1.4 0 
        001.28.85h.15a1.7 1.7 0 010 3.4h-.08a1.4 1.4 0 00-1.28.85z" />
    </svg>
  ),
  LogOut: () => (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17H4a1.5 1.5 0 01-1.5-1.5v-11A1.5 1.5 0 014 3h3" />
      <polyline points="13 14.5 17.5 10 13 5.5" />
      <line x1="17.5" y1="10" x2="7" y2="10" />
    </svg>
  ),
  ChevronDown: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 6 8 10 12 6" />
    </svg>
  ),
};

// ============================================
// TYPING DOTS
// ============================================
const TypingDots = () => (
  <div className="nethra-navbar-comp-typing-dots" aria-hidden="true">
    <span /><span /><span />
  </div>
);

// ============================================
// HELPERS
// ============================================
const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const navLinks = [
  { to: '/', label: 'Home', icon: Icons.Home },
  { to: '/about', label: 'About', icon: Icons.Info },
  { to: '/contact', label: 'Contact', icon: Icons.Mail },
];

// ============================================
// NAVBAR
// ============================================
const Navbar = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navbarRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const dropdownRef = useRef(null);

  // ---- Mount fade-in ----
  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  // ---- Close everything on route change ----
  useEffect(() => {
    setIsMobileOpen(false);
    setIsDropdownOpen(false);
  }, [location.pathname]);

// ---- Scroll handler: translucent on scroll ----
useEffect(() => {
  const onScroll = () => {
    setIsScrolled(window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  return () => window.removeEventListener('scroll', onScroll);
}, []);

  // ---- Body scroll lock ----
  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileOpen]);

  // ---- Outside click: mobile menu ----
  useEffect(() => {
    if (!isMobileOpen) return;
    const handler = (e) => {
      if (
        mobileMenuRef.current && !mobileMenuRef.current.contains(e.target) &&
        navbarRef.current && !navbarRef.current.contains(e.target)
      ) {
        setIsMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [isMobileOpen]);

  // ---- Outside click: dropdown ----
  useEffect(() => {
    if (!isDropdownOpen) return;
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isDropdownOpen]);

  // ---- Escape key ----
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') {
        setIsMobileOpen(false);
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  // ---- Logout handler ----
  const handleLogout = useCallback(() => {
    setIsDropdownOpen(false);
    setIsMobileOpen(false);
    logout();
    navigate('/');
  }, [logout, navigate]);

  const toggleMobile = useCallback(() => setIsMobileOpen((p) => !p), []);
  const toggleDropdown = useCallback(() => setIsDropdownOpen((p) => !p), []);

const navbarClass = [
  'nethra-navbar',
  isVisible && 'nethra-navbar--visible',
  isScrolled && 'nethra-navbar--scrolled',
  isMobileOpen && 'nethra-navbar--menu-open',
].filter(Boolean).join(' ');

  return (
    <>
      <nav className={navbarClass} ref={navbarRef} role="navigation" aria-label="Main">
        <div className="nethra-navbar-comp-container">
          {/* ====== LOGO ====== */}
          <NavLink to="/" className="nethra-navbar-comp-logo" aria-label="Nethra Home">
            <div className="nethra-navbar-comp-logo-icon">
              <Icons.Logo />
              <div className="nethra-navbar-comp-logo-pulse" aria-hidden="true" />
            </div>
            <span className="nethra-navbar-comp-logo-text">Nethra</span>
            <TypingDots />
          </NavLink>

          {/* ====== DESKTOP LINKS ====== */}
          <div className="nethra-navbar-comp-links">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `nethra-navbar-comp-link ${isActive ? 'nethra-navbar-comp-link--active' : ''}`
                }
              >
                <span className="nethra-navbar-comp-link-text">{link.label}</span>
                <span className="nethra-navbar-comp-link-underline" aria-hidden="true" />
              </NavLink>
            ))}
          </div>

          {/* ====== ACTIONS ====== */}
          <div className="nethra-navbar-comp-actions">
            {!isLoading && isAuthenticated ? (
              <>
                {/* Chat Button */}
                <NavLink
                  to="/chat"
                  className="nethra-navbar-comp-button nethra-navbar-comp-button--primary nethra-navbar-comp-chat-btn"
                >
                  <Icons.MessageCircle />
                  <span>Chat</span>
                  <div className="nethra-navbar-comp-button-shimmer" aria-hidden="true" />
                </NavLink>

                {/* Profile Dropdown */}
                <div className="nethra-navbar-comp-profile" ref={dropdownRef}>
                  <button
                    className="nethra-navbar-comp-profile-btn"
                    onClick={toggleDropdown}
                    aria-expanded={isDropdownOpen}
                    aria-haspopup="true"
                    aria-label="Profile menu"
                  >
                    <div className="nethra-navbar-comp-profile-avatar">
                      {getInitials(user?.name)}
                    </div>
                    <div className="nethra-navbar-comp-profile-status" aria-hidden="true" />
                    <Icons.ChevronDown />
                  </button>

                  {/* Dropdown */}
                  <div
                    className={`nethra-navbar-comp-dropdown ${
                      isDropdownOpen ? 'nethra-navbar-comp-dropdown--open' : ''
                    }`}
                    role="menu"
                  >
                    {/* User header */}
                    <div className="nethra-navbar-comp-dropdown-header">
                      <div className="nethra-navbar-comp-dropdown-avatar">
                        {getInitials(user?.name)}
                      </div>
                      <div className="nethra-navbar-comp-dropdown-info">
                        <span className="nethra-navbar-comp-dropdown-name">
                          {user?.name}
                        </span>
                        <span className="nethra-navbar-comp-dropdown-email">
                          {user?.email}
                        </span>
                      </div>
                    </div>

                    <div className="nethra-navbar-comp-dropdown-divider" />

                    {/* Menu items */}
                    <NavLink
                      to="/chat"
                      className="nethra-navbar-comp-dropdown-item"
                      role="menuitem"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <Icons.MessageCircle />
                      <span>Chat</span>
                    </NavLink>

                    <NavLink
                      to="/settings"
                      className="nethra-navbar-comp-dropdown-item"
                      role="menuitem"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <Icons.Settings />
                      <span>Settings</span>
                    </NavLink>

                    <div className="nethra-navbar-comp-dropdown-divider" />

                    <button
                      className="nethra-navbar-comp-dropdown-item nethra-navbar-comp-dropdown-item--danger"
                      role="menuitem"
                      onClick={handleLogout}
                    >
                      <Icons.LogOut />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              </>
            ) : !isLoading ? (
              <>
                <NavLink
                  to="/login"
                  className="nethra-navbar-comp-button nethra-navbar-comp-button--ghost"
                >
                  <Icons.User />
                  <span>Login</span>
                </NavLink>
               
              </>
            ) : null}

            {/* Mobile Toggle — always */}
            <button
              className="nethra-navbar-comp-toggle"
              onClick={toggleMobile}
              aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileOpen}
            >
              <div className={`nethra-navbar-comp-toggle-icon ${isMobileOpen ? 'nethra-navbar-comp-toggle-icon--open' : ''}`}>
                <span /><span /><span />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* ====== MOBILE OVERLAY ====== */}
      <div
        className={`nethra-navbar-comp-mobile-overlay ${isMobileOpen ? 'nethra-navbar-comp-mobile-overlay--open' : ''}`}
        onClick={() => setIsMobileOpen(false)}
        aria-hidden="true"
      />

      {/* ====== MOBILE MENU ====== */}
      <div
        ref={mobileMenuRef}
        className={`nethra-navbar-comp-mobile-menu ${isMobileOpen ? 'nethra-navbar-comp-mobile-menu--open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className="nethra-navbar-comp-mobile-menu-inner">
          {/* Mobile profile header (logged in only) */}
          {isAuthenticated && user && (
            <>
              <div className="nethra-navbar-comp-mobile-profile-header">
                <div className="nethra-navbar-comp-mobile-profile-avatar">
                  {getInitials(user.name)}
                </div>
                <div className="nethra-navbar-comp-mobile-profile-info">
                  <span className="nethra-navbar-comp-mobile-profile-name">
                    {user.name}
                  </span>
                  <span className="nethra-navbar-comp-mobile-profile-email">
                    {user.email}
                  </span>
                </div>
              </div>
              <div className="nethra-navbar-comp-mobile-divider" />
            </>
          )}

          {/* Nav Links */}
          <div className="nethra-navbar-comp-mobile-links">
            {navLinks.map((link, index) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `nethra-navbar-comp-mobile-link ${isActive ? 'nethra-navbar-comp-mobile-link--active' : ''}`
                }
                style={{ '--stagger': `${index * 0.06 + 0.1}s` }}
                onClick={() => setIsMobileOpen(false)}
              >
                <div className="nethra-navbar-comp-mobile-link-icon">
                  <link.icon />
                </div>
                <span>{link.label}</span>
                <Icons.ArrowRight />
              </NavLink>
            ))}

            {/* Chat link (logged in only) */}
            {isAuthenticated && (
              <NavLink
                to="/chat"
                className={({ isActive }) =>
                  `nethra-navbar-comp-mobile-link ${isActive ? 'nethra-navbar-comp-mobile-link--active' : ''}`
                }
                style={{ '--stagger': `${navLinks.length * 0.06 + 0.1}s` }}
                onClick={() => setIsMobileOpen(false)}
              >
                <div className="nethra-navbar-comp-mobile-link-icon">
                  <Icons.MessageCircle />
                </div>
                <span>Chat</span>
                <Icons.ArrowRight />
              </NavLink>
            )}
          </div>

          <div className="nethra-navbar-comp-mobile-divider" />

          {/* Mobile Actions */}
          <div className="nethra-navbar-comp-mobile-actions">
            {isAuthenticated ? (
              <>
                <NavLink
                  to="/settings"
                  className="nethra-navbar-comp-mobile-btn nethra-navbar-comp-mobile-btn--ghost"
                  onClick={() => setIsMobileOpen(false)}
                  style={{ '--stagger': `${(navLinks.length + 1) * 0.06 + 0.15}s` }}
                >
                  <Icons.Settings />
                  <span>Settings</span>
                </NavLink>
                <button
                  className="nethra-navbar-comp-mobile-btn nethra-navbar-comp-mobile-btn--danger"
                  onClick={handleLogout}
                  style={{ '--stagger': `${(navLinks.length + 1) * 0.06 + 0.22}s` }}
                >
                  <Icons.LogOut />
                  <span>Log Out</span>
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className="nethra-navbar-comp-mobile-btn nethra-navbar-comp-mobile-btn--ghost"
                  onClick={() => setIsMobileOpen(false)}
                  style={{ '--stagger': `${navLinks.length * 0.06 + 0.15}s` }}
                >
                  <Icons.User />
                  <span>Login</span>
                </NavLink>
                <NavLink
                  to="/get-started"
                  className="nethra-navbar-comp-mobile-btn nethra-navbar-comp-mobile-btn--primary"
                  onClick={() => setIsMobileOpen(false)}
                  style={{ '--stagger': `${navLinks.length * 0.06 + 0.22}s` }}
                >
                  <Icons.Zap />
                  <span>Try Nethra Free</span>
                  <Icons.ArrowRight />
                </NavLink>
              </>
            )}
          </div>

          {/* Footer */}
          <div
            className="nethra-navbar-comp-mobile-footer"
            style={{ '--stagger': `${navLinks.length * 0.06 + 0.35}s` }}
          >
            <Icons.Sparkle />
            <span>AI-powered conversations</span>
          </div>
        </div>

        <div className="nethra-navbar-comp-mobile-glow" aria-hidden="true" />
      </div>
    </>
  );
};

export default Navbar;