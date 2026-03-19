import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../Style/About.css';
import { Link } from 'react-router-dom';
// ============================================
// CUSTOM HOOK: Intersection Observer
// ============================================
const useInView = (options = {}) => {
  const [isInView, setIsInView] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsInView(true);
          setHasAnimated(true);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px', ...options }
    );

    observer.observe(element);
    return () => observer.unobserve(element);
  }, [hasAnimated, options]);

  return [ref, isInView];
};

// ============================================
// CUSTOM HOOK: Animated Counter
// ============================================
const useCounter = (end, duration = 2000, startCounting = false) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const frameRef = useRef(null);

  useEffect(() => {
    if (!startCounting) return;

    const numericEnd = parseFloat(end.replace(/[^0-9.]/g, ''));
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      countRef.current = eased * numericEnd;
      setCount(countRef.current);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [end, duration, startCounting]);

  const suffix = end.replace(/[0-9.]/g, '');
  const isDecimal = end.includes('.');

  return isDecimal
    ? `${count.toFixed(1)}${suffix}`
    : `${Math.floor(count)}${suffix}`;
};

// ============================================
// CUSTOM HOOK: Mouse Parallax
// ============================================
const useMouseParallax = (intensity = 0.02) => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const ref = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      setOffset({
        x: (e.clientX - centerX) * intensity,
        y: (e.clientY - centerY) * intensity,
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [intensity]);

  return [ref, offset];
};

// ============================================
// ICONS (SVG Components)
// ============================================
const Icons = {
  Sparkles: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 
        1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 
        00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z" />
    </svg>
  ),
  Brain: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 
        2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 
        1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 
        2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 
        0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
    </svg>
  ),
  Zap: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  Shield: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  Heart: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 
        5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 
        1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  Globe: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 
        10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  Users: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Target: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
  Lightbulb: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 
        18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
    </svg>
  ),
  Rocket: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13
        -.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 
        22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  ),
  Code: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  Award: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="7" />
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </svg>
  ),
  MessageCircle: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 
        1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 
        8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 
        0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  ),
  ArrowRight: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  Play: () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  ),
  Twitter: () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214
        -6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 
        6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  LinkedIn: () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852
        -3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561
        h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 
        5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 
        0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 
        0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564
        v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 
        23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271
        V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  GitHub: () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 
        8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726
        -4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756
        -1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 
        1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305
        .762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469
        -2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 
        1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 
        1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 
        3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 
        1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372
        .823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765
        -1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  ),
  Cpu: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
      <rect x="9" y="9" width="6" height="6" />
      <line x1="9" y1="1" x2="9" y2="4" />
      <line x1="15" y1="1" x2="15" y2="4" />
      <line x1="9" y1="20" x2="9" y2="23" />
      <line x1="15" y1="20" x2="15" y2="23" />
      <line x1="20" y1="9" x2="23" y2="9" />
      <line x1="20" y1="14" x2="23" y2="14" />
      <line x1="1" y1="9" x2="4" y2="9" />
      <line x1="1" y1="14" x2="4" y2="14" />
    </svg>
  ),
  Database: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  ),
  Lock: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  ChevronDown: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  Star: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 
        21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  Layers: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  ),
  Wand: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 4V2" />
      <path d="M15 16v-2" />
      <path d="M8 9h2" />
      <path d="M20 9h2" />
      <path d="M17.8 11.8L19 13" />
      <path d="M15 9h0" />
      <path d="M17.8 6.2L19 5" />
      <path d="M3 21l9-9" />
      <path d="M12.2 6.2L11 5" />
    </svg>
  ),
};

// ============================================
// TYPING INDICATOR COMPONENT
// ============================================
const TypingIndicator = () => (
  <div className="nethra-typing-indicator">
    <span></span>
    <span></span>
    <span></span>
  </div>
);

// ============================================
// ANIMATED BACKGROUND
// ============================================
const AnimatedBackground = () => (
  <div className="nethra-bg" aria-hidden="true">
    <div className="nethra-bg-gradient-mesh"></div>
    <div className="nethra-bg-blob nethra-bg-blob-1"></div>
    <div className="nethra-bg-blob nethra-bg-blob-2"></div>
    <div className="nethra-bg-blob nethra-bg-blob-3"></div>
    <div className="nethra-bg-grid"></div>
    <div className="nethra-bg-noise"></div>
    <div className="nethra-bg-particles">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="nethra-bg-particle"
          style={{
            '--delay': `${i * 0.7}s`,
            '--x': `${Math.random() * 100}%`,
            '--duration': `${12 + Math.random() * 12}s`,
            '--size': `${2 + Math.random() * 3}px`,
          }}
        />
      ))}
    </div>
  </div>
);

// ============================================
// SECTION BADGE COMPONENT
// ============================================
const SectionBadge = ({ icon: Icon, text }) => (
  <div className="nethra-badge">
    <div className="nethra-badge-icon">
      <Icon />
    </div>
    <span>{text}</span>
    <div className="nethra-badge-glow"></div>
  </div>
);

// ============================================
// SCROLL PROGRESS INDICATOR
// ============================================
const ScrollProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (window.scrollY / scrollHeight) * 100;
      setProgress(scrolled);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="nethra-scroll-progress">
      <div
        className="nethra-scroll-progress-bar"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

// ============================================
// HERO SECTION
// ============================================
const AboutHero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [parallaxRef, offset] = useMouseParallax(0.015);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      className={`nethra-hero ${isVisible ? 'nethra-hero--visible' : ''}`}
      ref={parallaxRef}
    >
      <div className="nethra-hero-content">
        <SectionBadge icon={Icons.Sparkles} text="About Nethra AI" />

        <h1 className="nethra-hero-title">
          <span className="nethra-hero-title-line">Building the Future of</span>
          <span className="nethra-hero-title-line nethra-gradient-text">
            Intelligent Conversations
          </span>
        </h1>

        <p className="nethra-hero-description">
          We're on a mission to democratize AI-powered communication, making
          advanced conversational intelligence accessible to businesses of all
          sizes. Our team of researchers and engineers is pushing the boundaries
          of what's possible.
        </p>

        <div className="nethra-hero-cta">
          <button className="nethra-btn nethra-btn-primary">
            <span>Meet Our Team</span>
            <Icons.ArrowRight />
          </button>
          <button className="nethra-btn nethra-btn-ghost">
            <div className="nethra-btn-play-icon">
              <Icons.Play />
            </div>
            <span>Watch Our Story</span>
          </button>
        </div>

        <div className="nethra-hero-trust">
          <div className="nethra-hero-trust-avatars">
            {['SC', 'MR', 'EW', 'JK'].map((initials, i) => (
              <div
                key={i}
                className="nethra-hero-trust-avatar"
                style={{ '--i': i }}
              >
                {initials}
              </div>
            ))}
          </div>
          <div className="nethra-hero-trust-text">
            <div className="nethra-hero-trust-stars">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="nethra-hero-trust-star">
                  <Icons.Star />
                </span>
              ))}
            </div>
            <span>Trusted by 50K+ businesses worldwide</span>
          </div>
        </div>
      </div>

      <div className="nethra-hero-visual">
        <div
          className="nethra-hero-orb-container"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px)`,
          }}
        >
          <div className="nethra-orb">
            <div className="nethra-orb-core">
              <div className="nethra-orb-core-inner"></div>
            </div>
            <div className="nethra-orb-ring nethra-orb-ring-1"></div>
            <div className="nethra-orb-ring nethra-orb-ring-2"></div>
            <div className="nethra-orb-ring nethra-orb-ring-3"></div>
            <div className="nethra-orb-particles">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="nethra-orb-particle"
                  style={{ '--i': i }}
                />
              ))}
            </div>
          </div>

          <div className="nethra-hero-floating-cards">
            <div className="nethra-floating-card nethra-floating-card-1">
              <Icons.Brain />
              <span>NLP Engine</span>
            </div>
            <div className="nethra-floating-card nethra-floating-card-2">
              <Icons.Zap />
              <span>Real-time</span>
            </div>
            <div className="nethra-floating-card nethra-floating-card-3">
              <Icons.MessageCircle />
              <span>Multi-modal</span>
            </div>
            <div className="nethra-floating-card nethra-floating-card-4">
              <Icons.Shield />
              <span>Secure</span>
            </div>
          </div>
        </div>

        <div className="nethra-hero-glow-ring"></div>
      </div>
    </section>
  );
};

// ============================================
// STATS SECTION
// ============================================
const StatCard = ({ stat, index }) => {
  const [ref, isInView] = useInView();
  const displayValue = useCounter(stat.value, 2000, isInView);

  return (
    <div
      ref={ref}
      className={`nethra-stat-card ${isInView ? 'nethra-stat-card--visible' : ''}`}
      style={{ '--delay': `${index * 0.12}s` }}
    >
      <div className="nethra-stat-icon-wrap">
        <div className="nethra-stat-icon">
          <stat.icon />
        </div>
        <div className="nethra-stat-icon-glow"></div>
      </div>
      <div className="nethra-stat-value">{displayValue}</div>
      <div className="nethra-stat-label">{stat.label}</div>
      <div className="nethra-stat-bar">
        <div
          className="nethra-stat-bar-fill"
          style={{ '--fill': stat.fill || '80%' }}
        ></div>
      </div>
    </div>
  );
};

const StatsSection = () => {
  const stats = [
    {
      value: '10M+',
      label: 'Conversations Daily',
      icon: Icons.MessageCircle,
      fill: '92%',
    },
    {
      value: '50K+',
      label: 'Active Businesses',
      icon: Icons.Users,
      fill: '85%',
    },
    {
      value: '99.9%',
      label: 'Uptime Guarantee',
      icon: Icons.Shield,
      fill: '99%',
    },
    {
      value: '150+',
      label: 'Countries Served',
      icon: Icons.Globe,
      fill: '78%',
    },
  ];

  return (
    <section className="nethra-stats">
      <div className="nethra-stats-container">
        {stats.map((stat, index) => (
          <StatCard key={index} stat={stat} index={index} />
        ))}
      </div>
    </section>
  );
};

// ============================================
// MISSION SECTION
// ============================================
const MissionSection = () => {
  const [ref, isInView] = useInView();

  return (
    <section
      ref={ref}
      className={`nethra-mission ${isInView ? 'nethra-mission--visible' : ''}`}
    >
      <div className="nethra-mission-grid">
        <div className="nethra-mission-card nethra-mission-card--main">
          <div className="nethra-mission-card-header">
            <div className="nethra-mission-icon nethra-mission-icon--cyan">
              <Icons.Target />
            </div>
            <span className="nethra-mission-label">Our Mission</span>
          </div>
          <h2 className="nethra-mission-title">
            Revolutionizing Human-AI Interaction
          </h2>
          <p className="nethra-mission-text">
            To create conversational experiences that feel natural, intelligent,
            and genuinely helpful. We believe AI should amplify human potential,
            not replace it. Every interaction should leave users feeling
            empowered and understood.
          </p>
          <div className="nethra-mission-highlights">
            {['Natural Language', 'Context-Aware', 'Empathetic AI'].map(
              (item, i) => (
                <span key={i} className="nethra-mission-highlight">
                  <Icons.Sparkles />
                  {item}
                </span>
              )
            )}
          </div>
          <div className="nethra-mission-card-glow"></div>
        </div>

        <div className="nethra-mission-card nethra-mission-card--vision">
          <div className="nethra-mission-icon nethra-mission-icon--purple">
            <Icons.Lightbulb />
          </div>
          <h3 className="nethra-mission-subtitle">Our Vision</h3>
          <p className="nethra-mission-text-sm">
            A world where every business can leverage cutting-edge AI to create
            meaningful, lasting connections with their customers — regardless
            of scale or budget.
          </p>
          <div className="nethra-mission-visual-accent">
            <div className="nethra-mission-dot-grid">
              {[...Array(16)].map((_, i) => (
                <span key={i} className="nethra-mission-dot" />
              ))}
            </div>
          </div>
        </div>

        <div className="nethra-mission-card nethra-mission-card--values">
          <div className="nethra-mission-icon nethra-mission-icon--pink">
            <Icons.Heart />
          </div>
          <h3 className="nethra-mission-subtitle">Our Values</h3>
          <p className="nethra-mission-text-sm">
            Innovation with integrity. We build AI that's ethical, transparent,
            and designed with human well-being at its core. Trust is our
            foundation.
          </p>
          <div className="nethra-mission-progress-rings">
            <svg viewBox="0 0 80 80" className="nethra-mission-ring-svg">
              <circle
                cx="40" cy="40" r="35"
                className="nethra-mission-ring-bg"
              />
              <circle
                cx="40" cy="40" r="35"
                className="nethra-mission-ring-fill"
              />
            </svg>
            <span className="nethra-mission-ring-label">100%</span>
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// STORY TIMELINE SECTION
// ============================================
const TimelineItem = ({ milestone, index, isLast }) => {
  const [ref, isInView] = useInView();

  return (
    <div
      ref={ref}
      className={`nethra-timeline-item ${isInView ? 'nethra-timeline-item--visible' : ''} ${index % 2 === 0 ? 'nethra-timeline-item--left' : 'nethra-timeline-item--right'
        }`}
      style={{ '--delay': `${index * 0.15}s` }}
    >
      <div className="nethra-timeline-connector">
        <div className="nethra-timeline-dot">
          <div className="nethra-timeline-dot-inner"></div>
          <div className="nethra-timeline-dot-pulse"></div>
        </div>
        {!isLast && <div className="nethra-timeline-line-segment"></div>}
      </div>

      <div className="nethra-timeline-card">
        <span className="nethra-timeline-year">{milestone.year}</span>
        <h3 className="nethra-timeline-title">{milestone.title}</h3>
        <p className="nethra-timeline-description">{milestone.description}</p>
        {milestone.achievement && (
          <div className="nethra-timeline-achievement">
            <Icons.Award />
            <span>{milestone.achievement}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const StorySection = () => {
  const [headerRef, headerInView] = useInView();

  const milestones = [
    {
      year: '2020',
      title: 'The Beginning',
      description:
        'Founded by a team of AI researchers and engineers passionate about natural language understanding.',
      achievement: 'Seed Round: $5M',
    },
    {
      year: '2021',
      title: 'First Product Launch',
      description:
        'Released Nethra 1.0, our first conversational AI platform, serving over 1,000 early adopters.',
      achievement: '1K+ Active Users',
    },
    {
      year: '2022',
      title: 'Series A Funding',
      description:
        'Raised $25M to expand our research team and develop advanced language models.',
      achievement: 'Forbes AI 50',
    },
    {
      year: '2023',
      title: 'Global Expansion',
      description:
        'Expanded to 150+ countries with multi-language support and regional data centers.',
      achievement: '100+ Languages',
    },
    {
      year: '2024',
      title: 'Nethra 3.0',
      description:
        'Launched our most advanced AI yet, with unprecedented accuracy and natural conversation flow.',
      achievement: '#1 AI Chatbot Platform',
    },
  ];

  return (
    <section className="nethra-story">
      <div
        ref={headerRef}
        className={`nethra-story-header ${headerInView ? 'nethra-story-header--visible' : ''}`}
      >
        <SectionBadge icon={Icons.Rocket} text="Our Journey" />
        <h2 className="nethra-section-title">
          From Vision to <span className="nethra-gradient-text">Reality</span>
        </h2>
        <p className="nethra-section-desc">
          The story of how we're shaping the future of AI-powered communication
        </p>
      </div>

      <div className="nethra-timeline">
        <div className="nethra-timeline-line" aria-hidden="true"></div>
        {milestones.map((milestone, index) => (
          <TimelineItem
            key={index}
            milestone={milestone}
            index={index}
            isLast={index === milestones.length - 1}
          />
        ))}
      </div>
    </section>
  );
};

// ============================================
// VALUES SECTION
// ============================================
const ValueCard = ({ value, index }) => {
  const [ref, isInView] = useInView();

  const colorMap = [
    'cyan', 'purple', 'pink', 'cyan', 'purple', 'pink',
  ];

  return (
    <div
      ref={ref}
      className={`nethra-value-card ${isInView ? 'nethra-value-card--visible' : ''}`}
      style={{ '--delay': `${index * 0.1}s` }}
    >
      <div className={`nethra-value-icon nethra-value-icon--${colorMap[index]}`}>
        <value.icon />
      </div>
      <h3 className="nethra-value-title">{value.title}</h3>
      <p className="nethra-value-desc">{value.description}</p>
      <div className="nethra-value-number">{String(index + 1).padStart(2, '0')}</div>
      <div className="nethra-value-glow"></div>
    </div>
  );
};

const ValuesSection = () => {
  const [headerRef, headerInView] = useInView();

  const values = [
    {
      icon: Icons.Lightbulb,
      title: 'Innovation First',
      description:
        'We push boundaries and challenge the status quo to create breakthrough AI solutions.',
    },
    {
      icon: Icons.Shield,
      title: 'Trust & Safety',
      description:
        'Security and privacy are non-negotiable. We build AI you can trust completely.',
    },
    {
      icon: Icons.Heart,
      title: 'Human-Centered',
      description:
        'Every feature we build starts with understanding real human needs and pain points.',
    },
    {
      icon: Icons.Globe,
      title: 'Global Mindset',
      description:
        'We design for the world, respecting cultural nuances and local requirements.',
    },
    {
      icon: Icons.Users,
      title: 'Collaborative Spirit',
      description:
        'We believe the best solutions emerge when diverse minds work together.',
    },
    {
      icon: Icons.Award,
      title: 'Excellence Always',
      description:
        'We hold ourselves to the highest standards in everything we create.',
    },
  ];

  return (
    <section className="nethra-values">
      <div
        ref={headerRef}
        className={`nethra-values-header ${headerInView ? 'nethra-values-header--visible' : ''}`}
      >
        <SectionBadge icon={Icons.Heart} text="Core Values" />
        <h2 className="nethra-section-title">
          What <span className="nethra-gradient-text">Drives</span> Us
        </h2>
        <p className="nethra-section-desc">
          The principles that guide every decision we make
        </p>
      </div>

      <div className="nethra-values-grid">
        {values.map((value, index) => (
          <ValueCard key={index} value={value} index={index} />
        ))}
      </div>
    </section>
  );
};

// ============================================
// TEAM SECTION
// ============================================
const TeamCard = ({ member, index }) => {
  const [ref, isInView] = useInView();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      ref={ref}
      className={`nethra-team-card ${isInView ? 'nethra-team-card--visible' : ''}`}
      style={{ '--delay': `${index * 0.1}s` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="nethra-team-avatar-wrap">
        <div className="nethra-team-avatar">
          <span>{member.image}</span>
        </div>
        <div className={`nethra-team-avatar-ring ${isHovered ? 'nethra-team-avatar-ring--active' : ''}`}>
          <svg viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="46" />
          </svg>
        </div>
      </div>

      <div className="nethra-team-info">
        <h3 className="nethra-team-name">{member.name}</h3>
        <span className="nethra-team-role">{member.role}</span>
        <p className="nethra-team-bio">{member.bio}</p>
      </div>

      <div className="nethra-team-social">
        {member.social.twitter && (
          <a href={member.social.twitter} className="nethra-social-link"
            aria-label={`${member.name} Twitter`}>
            <Icons.Twitter />
          </a>
        )}
        {member.social.linkedin && (
          <a href={member.social.linkedin} className="nethra-social-link"
            aria-label={`${member.name} LinkedIn`}>
            <Icons.LinkedIn />
          </a>
        )}
        {member.social.github && (
          <a href={member.social.github} className="nethra-social-link"
            aria-label={`${member.name} GitHub`}>
            <Icons.GitHub />
          </a>
        )}
      </div>
    </div>
  );
};

const TeamSection = () => {
  const [headerRef, headerInView] = useInView();

  const team = [
    {
      name: 'Dr. Sarah Chen',
      role: 'CEO & Co-Founder',
      bio: 'Former AI Research Lead at DeepMind. PhD in Machine Learning from Stanford.',
      image: 'SC',
      social: { twitter: '#', linkedin: '#' },
    },
    {
      name: 'Marcus Rodriguez',
      role: 'CTO & Co-Founder',
      bio: 'Ex-Google Brain. 15+ years in distributed systems and ML infrastructure.',
      image: 'MR',
      social: { twitter: '#', linkedin: '#', github: '#' },
    },
    {
      name: 'Dr. Emily Watson',
      role: 'Head of Research',
      bio: 'Pioneer in conversational AI. Published 50+ papers on NLP and dialogue systems.',
      image: 'EW',
      social: { twitter: '#', linkedin: '#' },
    },
    {
      name: 'James Kim',
      role: 'VP of Engineering',
      bio: 'Built and scaled platforms at Netflix and Stripe. Expert in high-availability systems.',
      image: 'JK',
      social: { linkedin: '#', github: '#' },
    },
    {
      name: 'Aisha Patel',
      role: 'VP of Product',
      bio: 'Former Product Director at Slack. Passionate about human-centered AI design.',
      image: 'AP',
      social: { twitter: '#', linkedin: '#' },
    },
    {
      name: 'David Zhang',
      role: 'Head of AI Ethics',
      bio: 'Leading voice in responsible AI. Previously AI Policy Advisor at UNESCO.',
      image: 'DZ',
      social: { twitter: '#', linkedin: '#' },
    },
  ];

  return (
    <section className="nethra-team">
      <div
        ref={headerRef}
        className={`nethra-team-header ${headerInView ? 'nethra-team-header--visible' : ''}`}
      >
        <SectionBadge icon={Icons.Users} text="Our Team" />
        <h2 className="nethra-section-title">
          Meet the <span className="nethra-gradient-text">Minds</span> Behind Nethra
        </h2>
        <p className="nethra-section-desc">
          World-class researchers, engineers, and visionaries working together
          to build the future
        </p>
      </div>

      <div className="nethra-team-grid">
        {team.map((member, index) => (
          <TeamCard key={index} member={member} index={index} />
        ))}
      </div>
    </section>
  );
};

// ============================================
// TECHNOLOGY SECTION
// ============================================
const TechnologySection = () => {
  const [ref, isInView] = useInView();
  const [activeTab, setActiveTab] = useState(0);

  const technologies = [
    {
      icon: Icons.Brain,
      title: 'Advanced Language Models',
      description:
        'Proprietary LLMs trained on diverse, high-quality datasets for nuanced understanding.',
      color: 'cyan',
    },
    {
      icon: Icons.Cpu,
      title: 'Real-time Processing',
      description:
        'Sub-100ms response times powered by distributed edge computing infrastructure.',
      color: 'purple',
    },
    {
      icon: Icons.Database,
      title: 'Contextual Memory',
      description:
        'Long-term conversation memory that learns and adapts to each unique user.',
      color: 'pink',
    },
    {
      icon: Icons.Lock,
      title: 'Enterprise Security',
      description:
        'SOC 2 Type II certified with end-to-end encryption and data residency options.',
      color: 'cyan',
    },
  ];

  const codeExamples = [
    {
      title: 'Initialize',
      code: `// Initialize Nethra AI
const nethra = new Nethra({
  model: 'nethra-3.0-turbo',
  context: 'conversational',
  memory: true
});`,
    },
    {
      title: 'Chat',
      code: `// Start intelligent conversation
const response = await nethra.chat({
  message: user.input,
  history: conversation.history,
  context: user.preferences
});`,
    },
    {
      title: 'Learn',
      code: `// Continuous learning
await nethra.learn({
  feedback: user.feedback,
  intent: detected.intent,
  satisfaction: score
});`,
    },
  ];

  return (
    <section
      ref={ref}
      className={`nethra-tech ${isInView ? 'nethra-tech--visible' : ''}`}
    >
      <div className="nethra-tech-container">
        <div className="nethra-tech-content">
          <SectionBadge icon={Icons.Code} text="Our Technology" />
          <h2 className="nethra-section-title">
            Powered by{' '}
            <span className="nethra-gradient-text">Cutting-Edge</span> AI
          </h2>
          <p className="nethra-section-desc">
            We combine the latest advances in machine learning with proprietary
            innovations to deliver unmatched performance.
          </p>

          <div className="nethra-tech-list">
            {technologies.map((tech, index) => (
              <div
                key={index}
                className={`nethra-tech-item nethra-tech-item--${tech.color}`}
              >
                <div className="nethra-tech-item-icon">
                  <tech.icon />
                </div>
                <div className="nethra-tech-item-info">
                  <h4 className="nethra-tech-item-title">{tech.title}</h4>
                  <p className="nethra-tech-item-desc">{tech.description}</p>
                </div>
                <div className="nethra-tech-item-arrow">
                  <Icons.ArrowRight />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="nethra-tech-visual">
          <div className="nethra-code-window">
            <div className="nethra-code-header">
              <div className="nethra-code-dots">
                <span className="nethra-code-dot nethra-code-dot--red"></span>
                <span className="nethra-code-dot nethra-code-dot--yellow"></span>
                <span className="nethra-code-dot nethra-code-dot--green"></span>
              </div>
              <div className="nethra-code-tabs">
                {codeExamples.map((example, i) => (
                  <button
                    key={i}
                    className={`nethra-code-tab ${activeTab === i ? 'nethra-code-tab--active' : ''}`}
                    onClick={() => setActiveTab(i)}
                  >
                    {example.title}
                  </button>
                ))}
              </div>
              <span className="nethra-code-filename">nethra.js</span>
            </div>
            <div className="nethra-code-body">
              <div className="nethra-code-line-numbers">
                {codeExamples[activeTab].code.split('\n').map((_, i) => (
                  <span key={i}>{i + 1}</span>
                ))}
              </div>
              <pre className="nethra-code-content">
                <code>{codeExamples[activeTab].code}</code>
              </pre>
              <span className="nethra-code-cursor"></span>
            </div>
          </div>

          <div className="nethra-tech-metrics">
            <div className="nethra-tech-metric">
              <span className="nethra-tech-metric-value">{'<'}100ms</span>
              <span className="nethra-tech-metric-label">Response Time</span>
            </div>
            <div className="nethra-tech-metric">
              <span className="nethra-tech-metric-value">98.7%</span>
              <span className="nethra-tech-metric-label">Accuracy</span>
            </div>
            <div className="nethra-tech-metric">
              <span className="nethra-tech-metric-value">100+</span>
              <span className="nethra-tech-metric-label">Languages</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// TESTIMONIALS SECTION (NEW)
// ============================================
const TestimonialsSection = () => {
  const [headerRef, headerInView] = useInView();
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef(null);

  const testimonials = [
    {
      quote:
        "Nethra transformed our customer support. Response times dropped by 80% while satisfaction scores hit an all-time high.",
      author: 'Rachel Torres',
      role: 'VP of Customer Success',
      company: 'TechFlow',
      rating: 5,
    },
    {
      quote:
        "The most intuitive AI platform we've ever used. Our team was up and running within hours, not weeks.",
      author: 'David Park',
      role: 'CTO',
      company: 'ScaleUp Inc.',
      rating: 5,
    },
    {
      quote:
        "Nethra's contextual understanding is remarkable. It feels like talking to a knowledgeable human, not a bot.",
      author: 'Maria Santos',
      role: 'Head of Digital',
      company: 'GlobalRetail',
      rating: 5,
    },
  ];

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(intervalRef.current);
  }, [testimonials.length]);

  const handleDotClick = useCallback((index) => {
    setActiveIndex(index);
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
  }, [testimonials.length]);

  return (
    <section className="nethra-testimonials">
      <div
        ref={headerRef}
        className={`nethra-testimonials-header ${headerInView ? 'nethra-testimonials-header--visible' : ''
          }`}
      >
        <SectionBadge icon={Icons.MessageCircle} text="Testimonials" />
        <h2 className="nethra-section-title">
          Loved by <span className="nethra-gradient-text">Thousands</span>
        </h2>
        <p className="nethra-section-desc">
          See what industry leaders say about Nethra
        </p>
      </div>

      <div className="nethra-testimonials-carousel">
        <div className="nethra-testimonials-track">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`nethra-testimonial-card ${activeIndex === index ? 'nethra-testimonial-card--active' : ''
                }`}
            >
              <div className="nethra-testimonial-quote-mark">"</div>
              <div className="nethra-testimonial-stars">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="nethra-testimonial-star">
                    <Icons.Star />
                  </span>
                ))}
              </div>
              <blockquote className="nethra-testimonial-quote">
                {testimonial.quote}
              </blockquote>
              <div className="nethra-testimonial-author">
                <div className="nethra-testimonial-avatar">
                  {testimonial.author
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <div className="nethra-testimonial-author-info">
                  <strong>{testimonial.author}</strong>
                  <span>
                    {testimonial.role}, {testimonial.company}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="nethra-testimonials-dots">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`nethra-testimonials-dot ${activeIndex === index ? 'nethra-testimonials-dot--active' : ''
                }`}
              onClick={() => handleDotClick(index)}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================
// FAQ SECTION (NEW)
// ============================================
const FAQItem = ({ question, answer, isOpen, onClick }) => {
  const contentRef = useRef(null);

  return (
    <div className={`nethra-faq-item ${isOpen ? 'nethra-faq-item--open' : ''}`}>
      <button className="nethra-faq-question" onClick={onClick}
        aria-expanded={isOpen}>
        <span>{question}</span>
        <div className="nethra-faq-icon">
          <Icons.ChevronDown />
        </div>
      </button>
      <div
        className="nethra-faq-answer-wrap"
        ref={contentRef}
        style={{
          maxHeight: isOpen
            ? `${contentRef.current?.scrollHeight}px`
            : '0px',
        }}
      >
        <p className="nethra-faq-answer">{answer}</p>
      </div>
    </div>
  );
};

const FAQSection = () => {
  const [headerRef, headerInView] = useInView();
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: 'What makes Nethra different from other AI chatbots?',
      answer:
        'Nethra uses proprietary language models trained specifically for conversational AI, offering superior context understanding, multi-turn dialogue management, and emotional intelligence that competitors lack.',
    },
    {
      question: 'How secure is Nethra for enterprise use?',
      answer:
        'Nethra is SOC 2 Type II certified with end-to-end encryption, GDPR compliance, and data residency options. We undergo regular security audits and offer on-premise deployment for maximum security.',
    },
    {
      question: 'Can Nethra integrate with our existing tools?',
      answer:
        'Yes! Nethra offers 200+ pre-built integrations including Slack, Salesforce, HubSpot, Zendesk, and more. Our REST API and webhooks allow custom integrations with any platform.',
    },
    {
      question: 'What languages does Nethra support?',
      answer:
        'Nethra supports 100+ languages natively with real-time translation. Our language models are trained on multilingual datasets, ensuring cultural nuance and accuracy across all supported languages.',
    },
    {
      question: 'How long does it take to set up Nethra?',
      answer:
        'Most businesses are up and running within hours. Our guided onboarding, pre-built templates, and AI-powered setup assistant make deployment fast and painless. Enterprise setups typically take 1-2 weeks.',
    },
  ];

  return (
    <section className="nethra-faq">
      <div
        ref={headerRef}
        className={`nethra-faq-header ${headerInView ? 'nethra-faq-header--visible' : ''}`}
      >
        <SectionBadge icon={Icons.Lightbulb} text="FAQ" />
        <h2 className="nethra-section-title">
          Frequently <span className="nethra-gradient-text">Asked</span>
        </h2>
        <p className="nethra-section-desc">
          Everything you need to know about Nethra
        </p>
      </div>

      <div className="nethra-faq-list">
        {faqs.map((faq, index) => (
          <FAQItem
            key={index}
            question={faq.question}
            answer={faq.answer}
            isOpen={openIndex === index}
            onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
          />
        ))}
      </div>
    </section>
  );
};

// ============================================
// CTA SECTION
// ============================================
const CTASection = () => {
  const [ref, isInView] = useInView();
  const [chatStep, setChatStep] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const timers = [
      setTimeout(() => setChatStep(1), 500),
      setTimeout(() => setChatStep(2), 1500),
      setTimeout(() => setChatStep(3), 2500),
      setTimeout(() => setChatStep(4), 3500),
    ];

    return () => timers.forEach(clearTimeout);
  }, [isInView]);

  return (
    <section
      ref={ref}
      className={`nethra-cta ${isInView ? 'nethra-cta--visible' : ''}`}
    >
      <div className="nethra-cta-card">
        <div className="nethra-cta-glow nethra-cta-glow-1"></div>
        <div className="nethra-cta-glow nethra-cta-glow-2"></div>

        <div className="nethra-cta-content">
          <h2 className="nethra-cta-title">
            Ready to Experience the
            <span className="nethra-gradient-text"> Future of AI?</span>
          </h2>
          <p className="nethra-cta-desc">
            Join thousands of businesses already transforming their customer
            experience with Nethra's intelligent conversational AI platform.
          </p>
          <div className="nethra-cta-actions">

            <Link to="/login">
              <button className="nethra-btn nethra-btn-primary nethra-btn--lg">
                <span>Start Now</span>
                <Icons.Zap />
              </button>
            </Link>

            <Link to="/contact">
              <button className="nethra-btn nethra-btn-ghost nethra-btn--lg">
                <span>Talk to Sales</span>
                <Icons.MessageCircle />
              </button>
            </Link>
          </div>

        </div>

        <div className="nethra-cta-chat">
          <div className="nethra-chat-window">
            <div className="nethra-chat-window-header">
              <div className="nethra-chat-window-avatar">
                <Icons.Sparkles />
              </div>
              <div className="nethra-chat-window-info">
                <span className="nethra-chat-window-name">Nethra AI</span>
                <span className="nethra-chat-window-status">
                  <span className="nethra-chat-status-dot"></span>
                  Online
                </span>
              </div>
            </div>

            <div className="nethra-chat-messages">
              {chatStep >= 1 && (
                <div className="nethra-chat-msg nethra-chat-msg--bot">
                  <div className="nethra-chat-msg-avatar">
                    <Icons.Sparkles />
                  </div>
                  <div className="nethra-chat-msg-bubble">
                    <p>Hi! I'm Nethra. How can I help you today? 👋</p>
                  </div>
                </div>
              )}

              {chatStep >= 2 && (
                <div className="nethra-chat-msg nethra-chat-msg--user">
                  <div className="nethra-chat-msg-bubble">
                    <p>Tell me about your enterprise plans</p>
                  </div>
                </div>
              )}

              {chatStep >= 3 && chatStep < 4 && (
                <div className="nethra-chat-msg nethra-chat-msg--bot">
                  <div className="nethra-chat-msg-avatar">
                    <Icons.Sparkles />
                  </div>
                  <TypingIndicator />
                </div>
              )}

              {chatStep >= 4 && (
                <div className="nethra-chat-msg nethra-chat-msg--bot">
                  <div className="nethra-chat-msg-avatar">
                    <Icons.Sparkles />
                  </div>
                  <div className="nethra-chat-msg-bubble">
                    <p>
                      Great question! Our Enterprise plan includes unlimited
                      conversations, custom AI training, dedicated support, and
                      advanced analytics. Want me to set up a demo?
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="nethra-chat-input">
              <input type="text" placeholder="Type a message..." readOnly />
              <button className="nethra-chat-send" aria-label="Send message">
                <Icons.ArrowRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// MAIN ABOUT PAGE COMPONENT
// ============================================
const AboutUs = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`nethra-about ${isLoaded ? 'nethra-about--loaded' : ''}`}>
      <ScrollProgress />
      <AnimatedBackground />

      <div className="nethra-about-wrapper">
        <AboutHero />
        <StatsSection />
        <MissionSection />
        <StorySection />
        <ValuesSection />
        <TechnologySection />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
      </div>
    </div>
  );
};

export default AboutUs;