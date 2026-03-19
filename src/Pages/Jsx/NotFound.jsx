import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../Style/NotFound.css';

const NotFound = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(15);
  const [isVisible, setIsVisible] = useState(false);

  // Fade in
  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  // Auto-redirect countdown
  useEffect(() => {
    if (countdown <= 0) {
      navigate('/');
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, navigate]);

  return (
    <div className={`nf-page ${isVisible ? 'nf-page--visible' : ''}`}>
      {/* Background */}
      <div className="nf-bg" aria-hidden="true">
        <div className="nf-bg-blob nf-bg-blob--1" />
        <div className="nf-bg-blob nf-bg-blob--2" />
        <div className="nf-bg-grid" />
        <div className="nf-bg-noise" />
      </div>

      <div className="nf-content">
        {/* Glitch 404 */}
        <div className="nf-code-wrap">
          <h1 className="nf-code" data-text="404">404</h1>
          <div className="nf-code-glow" />
        </div>

        {/* Orb */}
        <div className="nf-orb">
          <div className="nf-orb-core" />
          <div className="nf-orb-ring nf-orb-ring--1" />
          <div className="nf-orb-ring nf-orb-ring--2" />
          {[...Array(6)].map((_, i) => (
            <div key={i} className="nf-orb-particle" style={{ '--i': i }} />
          ))}
        </div>

        <h2 className="nf-title">Lost in the Neural Network</h2>
        <p className="nf-desc">
          The page you're looking for doesn't exist or has been moved.
          Our AI couldn't find any matching neural pathways.
        </p>

        {/* Actions */}
        <div className="nf-actions">
          <Link to="/" className="nf-btn nf-btn--primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1
                1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" />
            </svg>
            <span>Go Home</span>
          </Link>
          <button className="nf-btn nf-btn--ghost" onClick={() => navigate(-1)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <span>Go Back</span>
          </button>
        </div>

        {/* Auto-redirect notice */}
        <p className="nf-redirect">
          Redirecting to home in <span className="nf-countdown">{countdown}</span> seconds
        </p>

        {/* Quick links */}
        <div className="nf-links">
          <span className="nf-links-label">Quick links:</span>
          <div className="nf-links-list">
            <Link to="/" className="nf-link">Home</Link>
            <Link to="/about" className="nf-link">About</Link>
            <Link to="/contact" className="nf-link">Contact</Link>
            <Link to="/chat" className="nf-link">Chat</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;