import React, { useEffect, useRef, useState } from 'react';
import './Footer.css';

const Footer = () => {
  const footerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const navigationLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const accountLinks = [
    { label: 'Login', href: '/login' },
    { label: 'Sign Up', href: '/login' },
    { label: 'Settings', href: '/settings' },
  ];

  const resourceLinks = [
    { label: 'Support', href: '/contact' },
  ];

  return (
    <footer
      ref={footerRef}
      className={`nethra-footer ${isVisible ? 'nethra-footer--visible' : ''}`}
    >
      {/* Gradient top border */}
      <div className="nethra-footer-glow-border" />

      {/* Floating gradient blobs */}
      <div className="nethra-footer-blob nethra-footer-blob--1" />
      <div className="nethra-footer-blob nethra-footer-blob--2" />
      <div className="nethra-footer-blob nethra-footer-blob--3" />

      <div className="nethra-footer-comp-container">
        {/* Main Footer Content */}
        <div className="nethra-footer-main">

          {/* Brand Section */}
          <div className="nethra-footer-comp-brand">
            <a href="/" className="nethra-footer-comp-logo">
              <div className="nethra-footer-logo-icon">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="16"
                    cy="16"
                    r="14"
                    stroke="url(#footerLogoGrad)"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    d="M10 16C10 16 13 11 16 11C19 11 22 16 22 16C22 16 19 21 16 21C13 21 10 16 10 16Z"
                    stroke="url(#footerLogoGrad)"
                    strokeWidth="1.5"
                    fill="none"
                  />
                  <circle
                    cx="16"
                    cy="16"
                    r="2.5"
                    fill="url(#footerLogoGrad)"
                  />
                  <defs>
                    <linearGradient
                      id="footerLogoGrad"
                      x1="0"
                      y1="0"
                      x2="32"
                      y2="32"
                    >
                      <stop offset="0%" stopColor="#00f5ff" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <span className="nethra-footer-logo-text">Nethra</span>
            </a>

            <p className="nethra-footer-comp-description">
              Your intelligent AI companion — powered by cutting-edge neural
              networks to understand, assist, and inspire. Experience the future
              of conversational AI.
            </p>

            {/* Mini typing indicator */}
            <div className="nethra-footer-typing-indicator">
              <div className="nethra-footer-typing-avatar">
                <svg width="14" height="14" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="14" fill="url(#footerLogoGrad)" opacity="0.3" />
                  <circle cx="16" cy="16" r="2.5" fill="#00f5ff" />
                </svg>
              </div>
              <div className="nethra-footer-typing-bubble">
                <span className="nethra-footer-typing-text">
                  Nethra is ready to chat
                </span>
                <div className="nethra-footer-typing-dots">
                  <span className="nethra-footer-typing-dot" />
                  <span className="nethra-footer-typing-dot" />
                  <span className="nethra-footer-typing-dot" />
                </div>
              </div>
            </div>

            {/* Social Icons */}
            <div className="nethra-footer-comp-socials">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="nethra-footer-comp-social-icon"
                aria-label="Twitter / X"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="nethra-footer-comp-social-icon"
                aria-label="GitHub"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noopener noreferrer"
                className="nethra-footer-comp-social-icon"
                aria-label="Discord"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="nethra-footer-comp-social-icon"
                aria-label="LinkedIn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="nethra-footer-comp-social-icon"
                aria-label="YouTube"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div className="nethra-footer-comp-links">
            {/* Navigation Column */}
            <div className="nethra-footer-comp-column">
              <h4 className="nethra-footer-column-title">Navigation</h4>
              <ul className="nethra-footer-column-list">
                {navigationLinks.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="nethra-footer-comp-link">
                      <span className="nethra-footer-link-arrow">›</span>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Account Column */}
            <div className="nethra-footer-comp-column">
              <h4 className="nethra-footer-column-title">Account</h4>
              <ul className="nethra-footer-column-list">
                {accountLinks.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="nethra-footer-comp-link">
                      <span className="nethra-footer-link-arrow">›</span>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Column */}
            <div className="nethra-footer-comp-column">
              <h4 className="nethra-footer-column-title">Resources</h4>
              <ul className="nethra-footer-column-list">
                {resourceLinks.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="nethra-footer-comp-link">
                      <span className="nethra-footer-link-arrow">›</span>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Column */}
            <div className="nethra-footer-comp-column nethra-footer-cta-column">
              <h4 className="nethra-footer-column-title">Get Started</h4>
              <p className="nethra-footer-cta-text">
                Start chatting with Nethra — your AI assistant that never sleeps.
              </p>
              <a href="/chat" className="nethra-footer-cta-button">
                <span className="nethra-footer-cta-button-text">
                  Launch Nethra
                </span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
              <div className="nethra-footer-newsletter">
                <p className="nethra-footer-newsletter-label">Stay updated</p>
                <div className="nethra-footer-newsletter-input-wrap">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="nethra-footer-newsletter-input"
                    aria-label="Email for newsletter"
                  />
                  <button
                    className="nethra-footer-newsletter-btn"
                    aria-label="Subscribe"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        {/* Bottom Section */}
        <div className="nethra-footer-comp-bottom">
          <div className="nethra-footer-bottom-left">
            <p className="nethra-footer-copyright">
              © {new Date().getFullYear()} Nethra. All rights reserved.
            </p>
          </div>
          <div className="nethra-footer-bottom-right">
            <a href="/privacy" className="nethra-footer-legal-link">Privacy Policy</a>
            <span className="nethra-footer-legal-divider">•</span>
            <a href="/terms" className="nethra-footer-legal-link">Terms of Service</a>
            <span className="nethra-footer-legal-divider">•</span>
            <a href="/cookies" className="nethra-footer-legal-link">Cookie Policy</a>
          </div>
        </div>

        {/* Made By Credit */}
        <div className="nethra-footer-credit">
          <span className="nethra-footer-credit-text">
            Crafted with
            <span className="nethra-footer-credit-heart">passion</span>
            by
          </span>
          <div className="nethra-footer-credit-names">
            <span className="nethra-footer-credit-name">Ankush Kundu</span>
            <span className="nethra-footer-credit-ampersand">&</span>
            <span className="nethra-footer-credit-name">Talib Mansoori</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;