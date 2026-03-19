import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../Style/Auth.css';

// ============================================
// ICONS (same as before — abbreviated for space)
// ============================================
const Icons = {
  Eye: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  ),
  EyeOff: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ),
  Mail: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" /><polyline points="2 4 12 13 22 4" />
    </svg>
  ),
  Lock: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  ),
  User: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Sparkles: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z" />
    </svg>
  ),
  ArrowRight: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  Shield: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  Check: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  AlertCircle: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  Brain: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A2.5 2.5 0 0112 4.5v15a2.5 2.5 0 01-4.96.44 2.5 2.5 0 01-2.96-3.08 3 3 0 01-.34-5.58 2.5 2.5 0 011.32-4.24 2.5 2.5 0 011.98-3A2.5 2.5 0 019.5 2z" />
      <path d="M14.5 2A2.5 2.5 0 0012 4.5v15a2.5 2.5 0 004.96.44 2.5 2.5 0 002.96-3.08 3 3 0 00.34-5.58 2.5 2.5 0 00-1.32-4.24 2.5 2.5 0 00-1.98-3A2.5 2.5 0 0014.5 2z" />
    </svg>
  ),
  MessageCircle: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
    </svg>
  ),
  Globe: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </svg>
  ),
  Loader: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="nethra-auth-spinner-svg">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  ),
};

// ============================================
// TYPING INDICATOR
// ============================================
const TypingDots = () => (
  <div className="nethra-auth-typing-dots" aria-hidden="true">
    <span /><span /><span />
  </div>
);

// ============================================
// TOAST
// ============================================
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 4500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className={`nethra-auth-toast nethra-auth-toast--${type}`}>
      <div className="nethra-auth-toast-icon">
        {type === 'success' ? <Icons.Check /> : <Icons.AlertCircle />}
      </div>
      <span className="nethra-auth-toast-msg">{message}</span>
      <button className="nethra-auth-toast-close" onClick={onClose} aria-label="Close">×</button>
    </div>
  );
};

// ============================================
// PASSWORD STRENGTH
// ============================================
const getPasswordStrength = (pw) => {
  if (!pw) return { score: 0, label: '', color: '' };
  let s = 0;
  if (pw.length >= 6) s++;
  if (pw.length >= 10) s++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^a-zA-Z\d]/.test(pw)) s++;
  const levels = [
    { label: '', color: '' },
    { label: 'Very Weak', color: 'var(--error)' },
    { label: 'Weak', color: 'var(--warning)' },
    { label: 'Fair', color: '#eab308' },
    { label: 'Strong', color: 'var(--success)' },
    { label: 'Very Strong', color: '#06b6d4' },
  ];
  return { score: s, ...levels[Math.min(s, 5)] };
};

const PasswordStrength = ({ password }) => {
  const strength = getPasswordStrength(password);
  if (!password) return null;
  return (
    <div className="nethra-auth-pw-strength">
      <div className="nethra-auth-pw-bars">
        {[1, 2, 3, 4, 5].map((l) => (
          <div key={l} className={`nethra-auth-pw-bar ${strength.score >= l ? 'nethra-auth-pw-bar--active' : ''}`} style={{ '--bar-color': strength.color }} />
        ))}
      </div>
      <span className="nethra-auth-pw-label" style={{ color: strength.color }}>{strength.label}</span>
    </div>
  );
};

// ============================================
// INPUT
// ============================================
const AuthInput = ({ icon: Icon, type = 'text', label, name, value, onChange, placeholder, error, autoComplete, showToggle = false }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const inputType = showToggle ? (showPw ? 'text' : 'password') : type;

  return (
    <div className={`nethra-auth-field ${isFocused ? 'nethra-auth-field--focus' : ''} ${error ? 'nethra-auth-field--error' : ''} ${value ? 'nethra-auth-field--filled' : ''}`}>
      <label className="nethra-auth-label" htmlFor={name}>{label}</label>
      <div className="nethra-auth-input-wrap">
        <div className="nethra-auth-input-icon" aria-hidden="true"><Icon /></div>
        <input
          id={name} name={name} type={inputType} value={value} onChange={onChange}
          placeholder={placeholder} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)}
          autoComplete={autoComplete} className="nethra-auth-input"
          aria-invalid={!!error} aria-describedby={error ? `${name}-error` : undefined}
        />
        {showToggle && (
          <button type="button" className="nethra-auth-input-toggle" onClick={() => setShowPw(!showPw)}
            aria-label={showPw ? 'Hide password' : 'Show password'} tabIndex={-1}>
            {showPw ? <Icons.EyeOff /> : <Icons.Eye />}
          </button>
        )}
        <div className="nethra-auth-input-glow" aria-hidden="true" />
      </div>
      {error && (
        <span className="nethra-auth-error" id={`${name}-error`} role="alert">
          <Icons.AlertCircle />{error}
        </span>
      )}
    </div>
  );
};

// ============================================
// LEFT VISUAL PANEL
// ============================================
const AuthVisual = ({ isLogin }) => (
  <div className="nethra-auth-visual" aria-hidden="true">
    <div className="nethra-auth-visual-bg">
      <div className="nethra-auth-visual-blob nethra-auth-visual-blob--1" />
      <div className="nethra-auth-visual-blob nethra-auth-visual-blob--2" />
      <div className="nethra-auth-visual-blob nethra-auth-visual-blob--3" />
      <div className="nethra-auth-visual-grid" />
      <div className="nethra-auth-visual-noise" />
    </div>
    <div className="nethra-auth-visual-content">
      <div className="nethra-auth-visual-logo">
        <div className="nethra-auth-visual-logo-orb">
          <div className="nethra-auth-visual-logo-core" />
          <div className="nethra-auth-visual-logo-ring nethra-auth-visual-logo-ring--1" />
          <div className="nethra-auth-visual-logo-ring nethra-auth-visual-logo-ring--2" />
          {[...Array(6)].map((_, i) => (
            <div key={i} className="nethra-auth-visual-logo-particle" style={{ '--i': i }} />
          ))}
        </div>
      </div>
      <h1 className="nethra-auth-visual-title">
        <span className="nethra-auth-visual-title-gradient">Nethra</span>
        <TypingDots />
      </h1>
      <p className="nethra-auth-visual-subtitle">
        {isLogin ? 'Welcome back! Your AI assistant is ready.' : 'Join thousands using intelligent conversations.'}
      </p>
      <div className="nethra-auth-visual-features">
        {[
          { icon: Icons.Brain, text: 'Advanced NLP Engine' },
          { icon: Icons.MessageCircle, text: 'Natural Conversations' },
          { icon: Icons.Shield, text: 'Enterprise Security' },
          { icon: Icons.Globe, text: '100+ Languages' },
        ].map((f, i) => (
          <div key={i} className="nethra-auth-visual-feature" style={{ '--delay': `${i * 0.12}s` }}>
            <div className="nethra-auth-visual-feature-icon"><f.icon /></div>
            <span>{f.text}</span>
          </div>
        ))}
      </div>
      <div className="nethra-auth-visual-chat">
        <div className="nethra-auth-visual-chat-msg nethra-auth-visual-chat-msg--bot">
          <div className="nethra-auth-visual-chat-avatar"><Icons.Sparkles /></div>
          <div className="nethra-auth-visual-chat-bubble"><p>Hi! I'm Nethra. Ready to assist you 24/7 ✨</p></div>
        </div>
      </div>
    </div>
    <div className="nethra-auth-visual-particles">
      {[...Array(12)].map((_, i) => (
        <div key={i} className="nethra-auth-visual-particle" style={{
          '--x': `${Math.random() * 100}%`, '--delay': `${i * 0.8}s`,
          '--duration': `${10 + Math.random() * 10}s`, '--size': `${2 + Math.random() * 3}px`,
        }} />
      ))}
    </div>
  </div>
);

// ============================================
// MAIN AUTH COMPONENT (USES CONTEXT)
// ============================================
const Auth = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const formRef = useRef(null);

  // Mount animation
  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (!auth.isLoading && auth.isAuthenticated) {
      navigate(location.state?.from?.pathname || '/', { replace: true });
    }
  }, [auth.isAuthenticated, auth.isLoading, navigate, location]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    setErrors((p) => {
      if (p[name]) { const n = { ...p }; delete n[name]; return n; }
      return p;
    });
  }, []);

  const validate = useCallback(() => {
    const errs = {};
    if (!isLogin && !formData.name.trim()) errs.name = 'Name is required';
    if (!formData.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = 'Enter a valid email';
    if (!formData.password) errs.password = 'Password is required';
    else if (formData.password.length < 6) errs.password = 'Min 6 characters';
    if (!isLogin) {
      if (!formData.confirmPassword) errs.confirmPassword = 'Confirm your password';
      else if (formData.password !== formData.confirmPassword) errs.confirmPassword = 'Passwords don\'t match';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [formData, isLogin]);

  // ========== KEY CHANGE: uses auth context ==========
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setToast(null);

    try {
      if (isLogin) {
        await auth.login(formData.email, formData.password);
      } else {
        await auth.signup(formData.name, formData.email, formData.password);
      }

      setToast({
        type: 'success',
        message: isLogin ? 'Welcome back! Redirecting...' : 'Account created! Redirecting...',
      });

      // Context already updated → Navbar re-renders automatically
      // The useEffect above handles redirect
    } catch (err) {
      setToast({
        type: 'error',
        message: err.message || 'Something went wrong.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [formData, isLogin, auth, validate]);

  const toggleMode = useCallback(() => {
    setIsTransitioning(true);
    setErrors({});
    setToast(null);
    setTimeout(() => {
      setIsLogin((p) => !p);
      setFormData({ name: '', email: '', password: '', confirmPassword: '' });
      setTimeout(() => setIsTransitioning(false), 50);
    }, 250);
  }, []);

  // Don't render form if already authenticated (prevents flash)
  if (!auth.isLoading && auth.isAuthenticated) return null;

  return (
    <div className={`nethra-auth ${isVisible ? 'nethra-auth--visible' : ''}`}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="nethra-auth-container">
        <AuthVisual isLogin={isLogin} />

        <div className="nethra-auth-card-section">
          <div className={`nethra-auth-card ${isTransitioning ? 'nethra-auth-card--transitioning' : ''}`}>
            <div className="nethra-auth-card-glow" aria-hidden="true" />

            <div className="nethra-auth-mobile-logo">
              <div className="nethra-auth-mobile-logo-icon"><Icons.Sparkles /></div>
              <span className="nethra-auth-mobile-logo-text">Nethra</span>
              <TypingDots />
            </div>

            <div className="nethra-auth-header">
              <h2 className="nethra-auth-title">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
              <p className="nethra-auth-subtitle">
                {isLogin ? 'Sign in to continue with Nethra AI' : 'Start your AI journey with Nethra'}
              </p>
            </div>

            <form ref={formRef} className="nethra-auth-form" onSubmit={handleSubmit} noValidate>
              {!isLogin && (
                <AuthInput icon={Icons.User} label="Full Name" name="name" value={formData.name}
                  onChange={handleChange} placeholder="John Doe" error={errors.name} autoComplete="name" />
              )}

              <AuthInput icon={Icons.Mail} type="email" label="Email Address" name="email" value={formData.email}
                onChange={handleChange} placeholder="you@example.com" error={errors.email} autoComplete="email" />

              <AuthInput icon={Icons.Lock} type="password" label="Password" name="password" value={formData.password}
                onChange={handleChange} placeholder="••••••••" error={errors.password}
                autoComplete={isLogin ? 'current-password' : 'new-password'} showToggle />

              {!isLogin && <PasswordStrength password={formData.password} />}

              {!isLogin && (
                <AuthInput icon={Icons.Shield} type="password" label="Confirm Password" name="confirmPassword"
                  value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••"
                  error={errors.confirmPassword} autoComplete="new-password" showToggle />
              )}

              {isLogin && (
                <div className="nethra-auth-forgot">
                  <a href="/forgot-password" className="nethra-auth-forgot-link">Forgot password?</a>
                </div>
              )}

              <button type="submit" className="nethra-auth-submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="nethra-auth-spinner"><Icons.Loader /></div>
                    <span>{isLogin ? 'Signing in...' : 'Creating account...'}</span>
                  </>
                ) : (
                  <>
                    <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                    <Icons.ArrowRight />
                  </>
                )}
                <div className="nethra-auth-submit-shimmer" aria-hidden="true" />
              </button>
            </form>

            <div className="nethra-auth-divider"><span>or</span></div>

            <div className="nethra-auth-switch">
              <span className="nethra-auth-switch-text">
                {isLogin ? "Don't have an account?" : 'Already have an account?'}
              </span>
              <button type="button" className="nethra-auth-switch-btn" onClick={toggleMode}>
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </div>

            <div className="nethra-auth-security">
              <Icons.Lock /><span>Secured with 256-bit encryption</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;