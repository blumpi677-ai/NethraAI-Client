import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../Style/Contact.css';
import { Link } from 'react-router-dom';
// ============================================
// ICONS (SVG Components)
// ============================================
const Icons = {
  Send: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
  Mail: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  Phone: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  MapPin: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Clock: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  MessageCircle: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  ),
  ChevronDown: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  Check: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Twitter: () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  LinkedIn: () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  GitHub: () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  ),
  Discord: () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
    </svg>
  ),
  Sparkles: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z" />
    </svg>
  ),
  Zap: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  User: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Bot: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v4" />
      <line x1="8" y1="16" x2="8" y2="16" />
      <line x1="16" y1="16" x2="16" y2="16" />
    </svg>
  ),
  ArrowRight: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  ),
  Shield: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  Globe: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  Headphones: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    </svg>
  ),
  FileText: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  Heart: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  AlertCircle: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  ExternalLink: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  ),
  Layers: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  ),
  Star: () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
};

// ============================================
// TYPING INDICATOR
// ============================================
const TypingIndicator = () => (
  <div className="nethra-contact-page-comp-typing-indicator">
    <span></span>
    <span></span>
    <span></span>
  </div>
);

// ============================================
// ANIMATED BACKGROUND
// ============================================
const AnimatedBackground = () => (
  <div className="nethra-contact-page-comp-bg">
    <div className="nethra-contact-page-comp-bg__gradient-mesh"></div>
    <div className="nethra-contact-page-comp-bg__blob nethra-contact-page-comp-bg__blob--1"></div>
    <div className="nethra-contact-page-comp-bg__blob nethra-contact-page-comp-bg__blob--2"></div>
    <div className="nethra-contact-page-comp-bg__blob nethra-contact-page-comp-bg__blob--3"></div>
    <div className="nethra-contact-page-comp-bg__blob nethra-contact-page-comp-bg__blob--4"></div>
    <div className="nethra-contact-page-comp-bg__grid"></div>
    <div className="nethra-contact-page-comp-bg__noise"></div>
    <div className="nethra-contact-page-comp-bg__scanlines"></div>
  </div>
);

// ============================================
// GLASS CARD (Reusable)
// ============================================
const GlassCard = ({ children, className = '', glow = false, hover = true }) => (
  <div className={`nethra-contact-page-comp-glass-card ${hover ? 'nethra-contact-page-comp-glass-card--hover' : ''} ${glow ? 'nethra-contact-page-comp-glass-card--glow' : ''} ${className}`}>
    {children}
  </div>
);

// ============================================
// SECTION TAG (Reusable)
// ============================================
const SectionTag = ({ icon: Icon, text }) => (
  <span className="nethra-contact-page-comp-section-tag">
    <Icon />
    <span>{text}</span>
  </span>
);

// ============================================
// HERO SECTION
// ============================================
const ContactHero = () => {
  const chatMessages = [
    { type: 'user', text: "Hi! I'd like to learn more about Nethra's enterprise features.", delay: 600 },
    { type: 'bot', text: "Hello! I'd be happy to help you explore our enterprise solutions. What specific features are you most interested in?", delay: 900 },
    { type: 'user', text: "Mainly the multi-modal AI and custom integrations.", delay: 1200 },
    { type: 'bot', text: "Great choices! Our enterprise plan includes dedicated model fine-tuning, custom API endpoints, SSO integration, and priority support. Want me to connect you with our team?", delay: 1500 },
  ];

  return (
    <section className="nethra-contact-section-hero">
      <div className="nethra-contact-section-hero__container">
        <div className="nethra-contact-section-hero__content">
          <SectionTag icon={Icons.MessageCircle} text="Get in Touch" />

          <h1 className="nethra-contact-section-hero__title">
            Let's Start a
            <span className="nethra-contact-page-comp-gradient-text"> Conversation</span>
          </h1>

          <p className="nethra-contact-section-hero__description">
            Whether you have a question about features, pricing, enterprise solutions,
            or anything else — our team is ready to answer all your questions.
            We typically respond within 2 hours.
          </p>

          <div className="nethra-contact-section-hero__stats">
            <GlassCard className="nethra-contact-section-hero__stats-card" hover={false}>
              <div className="nethra-contact-page-comp-stat">
                <span className="nethra-contact-page-comp-stat__value">{'<'}2h</span>
                <span className="nethra-contact-page-comp-stat__label">Avg Response</span>
              </div>
              <div className="nethra-contact-page-comp-stat__divider"></div>
              <div className="nethra-contact-page-comp-stat">
                <span className="nethra-contact-page-comp-stat__value">24/7</span>
                <span className="nethra-contact-page-comp-stat__label">AI Support</span>
              </div>
              <div className="nethra-contact-page-comp-stat__divider"></div>
              <div className="nethra-contact-page-comp-stat">
                <span className="nethra-contact-page-comp-stat__value">98%</span>
                <span className="nethra-contact-page-comp-stat__label">Satisfaction</span>
              </div>
              <div className="nethra-contact-page-comp-stat__divider"></div>
              <div className="nethra-contact-page-comp-stat">
                <span className="nethra-contact-page-comp-stat__value">12</span>
                <span className="nethra-contact-page-comp-stat__label">Global Offices</span>
              </div>
            </GlassCard>
          </div>

          {/* Quick Action Buttons */}
          <div className="nethra-contact-section-hero__actions">
            <a href="#contact-form" className="nethra-contact-page-comp-btn nethra-contact-page-comp-btn--primary">
              <Icons.Send />
              <span>Send a Message</span>
            </a>
            <a href="#live-chat" className="nethra-contact-page-comp-btn nethra-contact-page-comp-btn--glass">
              <Icons.Bot />
              <span>Chat with AI</span>
            </a>
          </div>
        </div>

        <div className="nethra-contact-section-hero__visual">
          <GlassCard className="nethra-contact-page-comp-chat-preview" hover={false} glow>
            <div className="nethra-contact-page-comp-chat-preview__header">
              <div className="nethra-contact-page-comp-chat-preview__dots">
                <span></span><span></span><span></span>
              </div>
              <div className="nethra-contact-page-comp-chat-preview__status">
                <span className="nethra-contact-page-comp-chat-preview__status-dot"></span>
                <span>Nethra AI — Online</span>
              </div>
            </div>

            <div className="nethra-contact-page-comp-chat-preview__messages">
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`nethra-contact-page-comp-chat-bubble nethra-contact-page-comp-chat-bubble--${msg.type}`}
                  style={{ animationDelay: `${msg.delay}ms` }}
                >
                  {msg.type === 'bot' && (
                    <div className="nethra-contact-page-comp-chat-bubble__avatar">
                      <Icons.Sparkles />
                    </div>
                  )}
                  <div className="nethra-contact-page-comp-chat-bubble__content">
                    <p>{msg.text}</p>
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              <div className="nethra-contact-page-comp-chat-bubble nethra-contact-page-comp-chat-bubble--bot nethra-contact-page-comp-chat-bubble--typing">
                <div className="nethra-contact-page-comp-chat-bubble__avatar">
                  <Icons.Sparkles />
                </div>
                <TypingIndicator />
              </div>
            </div>

            <div className="nethra-contact-page-comp-chat-preview__input">
              <input type="text" placeholder="Type your message..." disabled />
              <button className="nethra-contact-page-comp-chat-preview__send" disabled>
                <Icons.Send />
              </button>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="nethra-contact-section-hero__scroll">
        <div className="nethra-contact-section-hero__scroll-mouse">
          <div className="nethra-contact-section-hero__scroll-wheel"></div>
        </div>
        <span>Scroll to explore</span>
      </div>
    </section>
  );
};

// ============================================
// CONTACT CHANNELS SECTION
// ============================================
const ContactChannels = () => {
  const channels = [
    {
      icon: Icons.Mail,
      title: 'Email Us',
      description: 'Send us a detailed inquiry and our team will respond within 2 business hours.',
      contact: 'hello@nethra.ai',
      link: 'mailto:hello@nethra.ai',
      linkText: 'Send an email',
      color: 'cyan',
      badge: 'Most Popular'
    },
    {
      icon: Icons.Phone,
      title: 'Call Us',
      description: 'Speak directly with our team for urgent matters or complex discussions.',
      contact: '+1 (555) 123-4567',
      link: 'tel:+15551234567',
      linkText: 'Make a call',
      color: 'purple',
      badge: null
    },
    {
      icon: Icons.Bot,
      title: 'AI Chat',
      description: 'Get instant answers 24/7 from our Nethra AI assistant.',
      contact: 'Available now',
      link: '#live-chat',
      linkText: 'Start chatting',
      color: 'pink',
      badge: '24/7'
    },
    {
      icon: Icons.MapPin,
      title: 'Visit Us',
      description: 'Schedule a meeting at our Innovation Hub in San Francisco.',
      contact: '123 AI Innovation Hub, SF, CA 94105',
      link: '#',
      linkText: 'Get directions',
      color: 'cyan',
      badge: null
    },
    {
      icon: Icons.Headphones,
      title: 'Enterprise Support',
      description: 'Priority support channel for enterprise and business plan customers.',
      contact: 'enterprise@nethra.ai',
      link: 'mailto:enterprise@nethra.ai',
      linkText: 'Contact enterprise',
      color: 'purple',
      badge: 'Priority'
    },
    {
      icon: Icons.Clock,
      title: 'Working Hours',
      description: 'Our human team is available Monday through Friday, PST timezone.',
      contact: 'Mon – Fri: 9:00 AM – 6:00 PM PST',
      link: null,
      linkText: null,
      color: 'pink',
      badge: null
    }
  ];

  return (
    <section className="nethra-contact-section-channels">
      <div className="nethra-contact-section-channels__container">
        <div className="nethra-contact-section-channels__header">
          <SectionTag icon={Icons.Globe} text="Multiple Channels" />
          <h2 className="nethra-contact-page-comp-section-title">
            Choose How You
            <span className="nethra-contact-page-comp-gradient-text"> Connect</span>
          </h2>
          <p className="nethra-contact-page-comp-section-subtitle">
            We're available across multiple channels to ensure you can reach us however is most convenient for you.
          </p>
        </div>

        <div className="nethra-contact-section-channels__grid">
          {channels.map((channel, index) => (
            <GlassCard
              key={index}
              className={`nethra-contact-page-comp-channel-card nethra-contact-page-comp-channel-card--${channel.color}`}
              glow
            >
              {channel.badge && (
                <span className={`nethra-contact-page-comp-channel-card__badge nethra-contact-page-comp-channel-card__badge--${channel.color}`}>
                  {channel.badge}
                </span>
              )}
              <div className={`nethra-contact-page-comp-channel-card__icon nethra-contact-page-comp-channel-card__icon--${channel.color}`}>
                <channel.icon />
              </div>
              <h3 className="nethra-contact-page-comp-channel-card__title">{channel.title}</h3>
              <p className="nethra-contact-page-comp-channel-card__desc">{channel.description}</p>
              <span className="nethra-contact-page-comp-channel-card__contact">{channel.contact}</span>
              {channel.link && (
                <a href={channel.link} className={`nethra-contact-page-comp-channel-card__link nethra-contact-page-comp-channel-card__link--${channel.color}`}>
                  <span>{channel.linkText}</span>
                  <Icons.ArrowRight />
                </a>
              )}
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================
// CONTACT FORM SECTION
// ============================================
const ContactFormSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    category: '',
    priority: 'normal',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [charCount, setCharCount] = useState(0);

  const categories = [
    { value: '', label: 'Select a category' },
    { value: 'general', label: '💬 General Inquiry' },
    { value: 'sales', label: '💰 Sales & Pricing' },
    { value: 'support', label: '🔧 Technical Support' },
    { value: 'partnership', label: '🤝 Partnership' },
    { value: 'enterprise', label: '🏢 Enterprise Solutions' },
    { value: 'feedback', label: '💡 Product Feedback' },
    { value: 'bug', label: '🐛 Bug Report' },
    { value: 'feature', label: '✨ Feature Request' }
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'green' },
    { value: 'normal', label: 'Normal', color: 'cyan' },
    { value: 'high', label: 'High', color: 'orange' },
    { value: 'urgent', label: 'Urgent', color: 'red' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'message') setCharCount(value.length);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const API_BASE = (() => {
        try {
          if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL)
            return import.meta.env.VITE_API_URL.replace('/auth', '/contact');
        } catch (e) { }
        return 'http://localhost:5000/api/contact';
      })();

      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          // Show first error
          const firstError = Object.values(data.errors)[0];
          alert(firstError);
        } else {
          alert(data.message || 'Failed to send message');
        }
        return;
      }

      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: '', email: '', company: '',
          subject: '', category: '', priority: 'normal', message: '',
        });
        setCharCount(0);
      }, 4000);
    } catch (err) {
      console.error('Contact form error:', err);
      alert('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <section className="nethra-contact-section-form" id="contact-form">
        <div className="nethra-contact-section-form__container">
          <GlassCard className="nethra-contact-page-comp-success-card" glow>
            <div className="nethra-contact-page-comp-success-card__icon">
              <Icons.Check />
            </div>
            <h2 className="nethra-contact-page-comp-success-card__title">Message Sent Successfully!</h2>
            <p className="nethra-contact-page-comp-success-card__desc">
              Thank you for reaching out. Our team has received your message and will get back to you
              within 2 business hours. Check your email for a confirmation.
            </p>
            <div className="nethra-contact-page-comp-success-card__info">
              <div className="nethra-contact-page-comp-success-card__info-item">
                <Icons.Mail />
                <span>Confirmation sent to {formData.email || 'your email'}</span>
              </div>
              <div className="nethra-contact-page-comp-success-card__info-item">
                <Icons.Clock />
                <span>Expected response within 2 hours</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>
    );
  }

  return (
    <section className="nethra-contact-section-form" id="contact-form">
      <div className="nethra-contact-section-form__container">
        <div className="nethra-contact-section-form__layout">
          {/* Form */}
          <GlassCard className="nethra-contact-page-comp-form-card" hover={false} glow>
            <div className="nethra-contact-page-comp-form-card__header">
              <h2 className="nethra-contact-page-comp-form-card__title">Send us a Message</h2>
              <p className="nethra-contact-page-comp-form-card__subtitle">
                Fill out the form below and our team will get back to you shortly.
                All fields marked with * are required.
              </p>
            </div>

            <form className="nethra-contact-page-comp-form" onSubmit={handleSubmit}>
              {/* Row 1: Name + Email */}
              <div className="nethra-contact-page-comp-form__row">
                <div className={`nethra-contact-page-comp-form__group ${focusedField === 'name' ? 'nethra-contact-page-comp-form__group--focused' : ''} ${formData.name ? 'nethra-contact-page-comp-form__group--has-value' : ''}`}>
                  <label htmlFor="name" className="nethra-contact-page-comp-form__label">
                    <Icons.User />
                    <span>Full Name *</span>
                  </label>
                  <input
                    type="text" id="name" name="name" value={formData.name}
                    onChange={handleChange} onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="John Doe" required className="nethra-contact-page-comp-form__input"
                  />
                  <div className="nethra-contact-page-comp-form__glow-line"></div>
                </div>

                <div className={`nethra-contact-page-comp-form__group ${focusedField === 'email' ? 'nethra-contact-page-comp-form__group--focused' : ''} ${formData.email ? 'nethra-contact-page-comp-form__group--has-value' : ''}`}>
                  <label htmlFor="email" className="nethra-contact-page-comp-form__label">
                    <Icons.Mail />
                    <span>Email Address *</span>
                  </label>
                  <input
                    type="email" id="email" name="email" value={formData.email}
                    onChange={handleChange} onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="john@example.com" required className="nethra-contact-page-comp-form__input"
                  />
                  <div className="nethra-contact-page-comp-form__glow-line"></div>
                </div>
              </div>

              {/* Row 2: Company + Category */}
              <div className="nethra-contact-page-comp-form__row">
                <div className={`nethra-contact-page-comp-form__group ${focusedField === 'company' ? 'nethra-contact-page-comp-form__group--focused' : ''} ${formData.company ? 'nethra-contact-page-comp-form__group--has-value' : ''}`}>
                  <label htmlFor="company" className="nethra-contact-page-comp-form__label">
                    <Icons.Globe />
                    <span>Company</span>
                  </label>
                  <input
                    type="text" id="company" name="company" value={formData.company}
                    onChange={handleChange} onFocus={() => setFocusedField('company')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Your company name" className="nethra-contact-page-comp-form__input"
                  />
                  <div className="nethra-contact-page-comp-form__glow-line"></div>
                </div>

                <div className={`nethra-contact-page-comp-form__group ${focusedField === 'category' ? 'nethra-contact-page-comp-form__group--focused' : ''} ${formData.category ? 'nethra-contact-page-comp-form__group--has-value' : ''}`}>
                  <label htmlFor="category" className="nethra-contact-page-comp-form__label">
                    <Icons.Layers />
                    <span>Category *</span>
                  </label>
                  <div className="nethra-contact-page-comp-form__select-wrapper">
                    <select
                      id="category" name="category" value={formData.category}
                      onChange={handleChange} onFocus={() => setFocusedField('category')}
                      onBlur={() => setFocusedField(null)}
                      required className="nethra-contact-page-comp-form__select"
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                    <div className="nethra-contact-page-comp-form__select-arrow">
                      <Icons.ChevronDown />
                    </div>
                  </div>
                  <div className="nethra-contact-page-comp-form__glow-line"></div>
                </div>
              </div>

              {/* Row 3: Subject */}
              <div className={`nethra-contact-page-comp-form__group nethra-contact-page-comp-form__group--full ${focusedField === 'subject' ? 'nethra-contact-page-comp-form__group--focused' : ''} ${formData.subject ? 'nethra-contact-page-comp-form__group--has-value' : ''}`}>
                <label htmlFor="subject" className="nethra-contact-page-comp-form__label">
                  <Icons.FileText />
                  <span>Subject *</span>
                </label>
                <input
                  type="text" id="subject" name="subject" value={formData.subject}
                  onChange={handleChange} onFocus={() => setFocusedField('subject')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Brief summary of your inquiry" required className="nethra-contact-page-comp-form__input"
                />
                <div className="nethra-contact-page-comp-form__glow-line"></div>
              </div>

              {/* Priority Selector */}
              <div className="nethra-contact-page-comp-form__group nethra-contact-page-comp-form__group--full">
                <label className="nethra-contact-page-comp-form__label">
                  <Icons.AlertCircle />
                  <span>Priority Level</span>
                </label>
                <div className="nethra-contact-page-comp-form__priority-group">
                  {priorities.map(p => (
                    <label
                      key={p.value}
                      className={`nethra-contact-page-comp-form__priority nethra-contact-page-comp-form__priority--${p.color} ${formData.priority === p.value ? 'nethra-contact-page-comp-form__priority--active' : ''}`}
                    >
                      <input type="radio" name="priority" value={p.value} checked={formData.priority === p.value} onChange={handleChange} />
                      <span>{p.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div className={`nethra-contact-page-comp-form__group nethra-contact-page-comp-form__group--full ${focusedField === 'message' ? 'nethra-contact-page-comp-form__group--focused' : ''} ${formData.message ? 'nethra-contact-page-comp-form__group--has-value' : ''}`}>
                <div className="nethra-contact-page-comp-form__label-row">
                  <label htmlFor="message" className="nethra-contact-page-comp-form__label">
                    <Icons.MessageCircle />
                    <span>Your Message *</span>
                  </label>
                  <span className={`nethra-contact-page-comp-form__char-count ${charCount > 1800 ? 'nethra-contact-page-comp-form__char-count--warn' : ''}`}>
                    {charCount}/2000
                  </span>
                </div>
                <textarea
                  id="message" name="message" value={formData.message}
                  onChange={handleChange} onFocus={() => setFocusedField('message')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Tell us more about your inquiry. The more detail you provide, the better we can help..."
                  required rows={6} maxLength={2000} className="nethra-contact-page-comp-form__textarea"
                ></textarea>
                <div className="nethra-contact-page-comp-form__glow-line"></div>
              </div>

              {/* Prompt Suggestions */}
              <div className="nethra-contact-page-comp-form__suggestions">
                <span className="nethra-contact-page-comp-form__suggestions-label">Quick prompts:</span>
                <div className="nethra-contact-page-comp-form__suggestions-list">
                  {[
                    "I need help with pricing for my team",
                    "I want to integrate Nethra with my app",
                    "I'd like to schedule a demo",
                    "I found a bug I want to report"
                  ].map((prompt, i) => (
                    <button
                      key={i} type="button"
                      className="nethra-contact-page-comp-form__suggestion-chip"
                      onClick={() => {
                        setFormData(prev => ({ ...prev, message: prompt }));
                        setCharCount(prompt.length);
                      }}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className={`nethra-contact-page-comp-form__submit ${isSubmitting ? 'nethra-contact-page-comp-form__submit--loading' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="nethra-contact-page-comp-spinner"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Icons.Send />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </GlassCard>

          {/* Sidebar */}
          <div className="nethra-contact-section-form__sidebar">
            {/* Social Links */}
            <GlassCard className="nethra-contact-page-comp-sidebar-card" glow>
              <h3 className="nethra-contact-page-comp-sidebar-card__title">Connect on Social</h3>
              <p className="nethra-contact-page-comp-sidebar-card__desc">
                Follow us for updates, tips, and community discussions.
              </p>
              <div className="nethra-contact-page-comp-social-links">
                {[
                  { icon: Icons.Twitter, label: 'Twitter / X', handle: '@nethra_ai', color: 'cyan' },
                  { icon: Icons.LinkedIn, label: 'LinkedIn', handle: 'Nethra AI', color: 'purple' },
                  { icon: Icons.GitHub, label: 'GitHub', handle: 'nethra-ai', color: 'pink' },
                  { icon: Icons.Discord, label: 'Discord', handle: 'Nethra Community', color: 'cyan' },
                ].map((social, i) => (
                  <a key={i} href="#" className={`nethra-contact-page-comp-social-link nethra-contact-page-comp-social-link--${social.color}`}>
                    <div className="nethra-contact-page-comp-social-link__icon">
                      <social.icon />
                    </div>
                    <div className="nethra-contact-page-comp-social-link__info">
                      <span className="nethra-contact-page-comp-social-link__name">{social.label}</span>
                      <span className="nethra-contact-page-comp-social-link__handle">{social.handle}</span>
                    </div>
                    <Icons.ExternalLink />
                  </a>
                ))}
              </div>
            </GlassCard>

            {/* Quick Help */}
            <GlassCard className="nethra-contact-page-comp-sidebar-card" glow>
              <h3 className="nethra-contact-page-comp-sidebar-card__title">Quick Resources</h3>
              <div className="nethra-contact-page-comp-quick-links">
                {[
                  { icon: Icons.FileText, text: 'Documentation', desc: 'Guides & API reference' },
                  { icon: Icons.Layers, text: 'Knowledge Base', desc: 'Tutorials & examples' },
                  { icon: Icons.Shield, text: 'Status Page', desc: 'System health & uptime' },
                  { icon: Icons.Heart, text: 'Community Forum', desc: 'Ask & share with others' },
                ].map((link, i) => (
                  <a key={i} href="#" className="nethra-contact-page-comp-quick-link">
                    <div className="nethra-contact-page-comp-quick-link__icon">
                      <link.icon />
                    </div>
                    <div className="nethra-contact-page-comp-quick-link__text">
                      <span className="nethra-contact-page-comp-quick-link__title">{link.text}</span>
                      <span className="nethra-contact-page-comp-quick-link__desc">{link.desc}</span>
                    </div>
                    <Icons.ArrowRight />
                  </a>
                ))}
              </div>
            </GlassCard>

            {/* Trust Badges */}
            <GlassCard className="nethra-contact-page-comp-sidebar-card nethra-contact-page-comp-sidebar-card--trust" hover={false}>
              <div className="nethra-contact-page-comp-trust-badges">
                <div className="nethra-contact-page-comp-trust-badge">
                  <Icons.Shield />
                  <span>SOC 2 Certified</span>
                </div>
                <div className="nethra-contact-page-comp-trust-badge">
                  <Icons.Globe />
                  <span>GDPR Compliant</span>
                </div>
                <div className="nethra-contact-page-comp-trust-badge">
                  <Icons.Zap />
                  <span>99.9% Uptime</span>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// LIVE CHAT CTA SECTION
// ============================================
const LiveChatCTA = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="nethra-contact-section-live-chat" id="live-chat">
      <div className="nethra-contact-section-live-chat__container">
        <GlassCard
          className="nethra-contact-page-comp-live-chat-card"
          hover={false} glow
        >
          <div className="nethra-contact-page-comp-live-chat-card__bg-glow"></div>

          <div
            className="nethra-contact-page-comp-live-chat-card__content"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="nethra-contact-page-comp-live-chat-card__icon-wrapper">
              <div className="nethra-contact-page-comp-live-chat-card__icon">
                <Icons.Bot />
              </div>
              <div className="nethra-contact-page-comp-live-chat-card__pulse"></div>
              <div className="nethra-contact-page-comp-live-chat-card__pulse nethra-contact-page-comp-live-chat-card__pulse--delay"></div>
            </div>

            <div className="nethra-contact-page-comp-live-chat-card__text">
              <h3>Need Instant Help?</h3>
              <p>
                Chat with Nethra AI assistant right now for immediate answers.
                Available 24/7 with no wait time — powered by the same neural engine that drives our platform.
              </p>
            </div>
            <Link
              to="/chat"
              className="nethra-contact-page-comp-btn nethra-contact-page-comp-btn--primary nethra-contact-page-comp-btn--lg"
              style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
            >
              <span>Start Live Chat</span>
              <Icons.MessageCircle />
            </Link>
          </div>

          {/* Floating particles */}
          <div className={`nethra-contact-page-comp-live-chat-card__particles ${isHovered ? 'nethra-contact-page-comp-live-chat-card__particles--active' : ''}`}>
            {[...Array(8)].map((_, i) => (
              <div key={i} className="nethra-contact-page-comp-live-chat-card__particle" />
            ))}
          </div>
        </GlassCard>
      </div>
    </section>
  );
};

// ============================================
// FAQ SECTION
// ============================================
const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "What is Nethra and how can it help my business?",
      answer: "Nethra is an advanced multi-modal AI platform designed to revolutionize how teams work. It combines natural language processing, computer vision, and creative generation into a single unified interface. Whether you need intelligent customer support, code generation, content creation, or image synthesis — Nethra adapts to your workflow with four specialized modes: Normal, Thinking, Fast, and Generate."
    },
    {
      question: "How quickly can I expect a response to my inquiry?",
      answer: "Our team typically responds within 2 hours during business hours (Mon–Fri, 9 AM–6 PM PST). For urgent matters, you can use our live chat for immediate AI-powered assistance, or enterprise customers have access to priority support with a dedicated account manager and a guaranteed 30-minute response SLA."
    },
    {
      question: "Do you offer custom enterprise solutions?",
      answer: "Absolutely! Our enterprise plan includes custom model fine-tuning, dedicated infrastructure, white-label options, SSO/SAML integration, advanced analytics, custom API rate limits, on-premise deployment options, and a dedicated customer success manager. We work with teams ranging from 10 to 10,000+ users."
    },
    {
      question: "What kind of support do you provide?",
      answer: "We provide full free support ."
    },
    {
      question: "How does Nethra handle data privacy and security?",
      answer: "Security is foundational to Nethra. We're SOC 2 Type II certified, GDPR and CCPA compliant, and use end-to-end 256-bit AES encryption. Your data is never used to train our models. We offer data residency options across 12 global regions, and enterprise customers can opt for on-premise deployment for maximum control."
    },
  ];

  return (
    <section className="nethra-contact-section-faq">
      <div className="nethra-contact-section-faq__container">
        <div className="nethra-contact-section-faq__header">
          <SectionTag icon={Icons.Sparkles} text="FAQ" />
          <h2 className="nethra-contact-page-comp-section-title">
            Frequently Asked
            <span className="nethra-contact-page-comp-gradient-text"> Questions</span>
          </h2>
          <p className="nethra-contact-page-comp-section-subtitle">
            Quick answers to common questions about Nethra. Can't find what you're looking for?
            Feel free to reach out to our team directly.
          </p>
        </div>

        <div className="nethra-contact-section-faq__list">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`nethra-contact-page-comp-faq-item ${openIndex === index ? 'nethra-contact-page-comp-faq-item--open' : ''}`}
            >
              <button
                className="nethra-contact-page-comp-faq-item__trigger"
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
              >
                <span className="nethra-contact-page-comp-faq-item__number">0{index + 1}</span>
                <span className="nethra-contact-page-comp-faq-item__question">{faq.question}</span>
                <div className="nethra-contact-page-comp-faq-item__icon">
                  <Icons.ChevronDown />
                </div>
              </button>
              <div className="nethra-contact-page-comp-faq-item__content">
                <p className="nethra-contact-page-comp-faq-item__answer">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="nethra-contact-section-faq__footer">
          <p>Still have questions?</p>
          <a href="#contact-form" className="nethra-contact-page-comp-btn nethra-contact-page-comp-btn--glass">
            <Icons.Send />
            <span>Send us a message</span>
          </a>
        </div>
      </div>
    </section>
  );
};

// ============================================
// MAP / OFFICES SECTION
// ============================================
const OfficesSection = () => {
  const offices = [
    {
      city: 'San Francisco',
      country: 'United States',
      address: '123 AI Innovation Hub, CA 94105',
      type: 'HQ',
      timezone: 'PST (UTC-8)',
      color: 'cyan'
    },
    {
      city: 'London',
      country: 'United Kingdom',
      address: '45 Neural Lane, EC2A 4BX',
      type: 'Europe HQ',
      timezone: 'GMT (UTC+0)',
      color: 'purple'
    },
    {
      city: 'Singapore',
      country: 'Singapore',
      address: '78 AI Towers, 018956',
      type: 'APAC HQ',
      timezone: 'SGT (UTC+8)',
      color: 'pink'
    }
  ];

  return (
    <section className="nethra-contact-section-offices">
      <div className="nethra-contact-section-offices__container">
        <div className="nethra-contact-section-offices__header">
          <SectionTag icon={Icons.MapPin} text="Our Offices" />
          <h2 className="nethra-contact-page-comp-section-title">
            Global
            <span className="nethra-contact-page-comp-gradient-text"> Presence</span>
          </h2>
          <p className="nethra-contact-page-comp-section-subtitle">
            With offices across three continents, we're always close to our customers.
          </p>
        </div>

        <div className="nethra-contact-section-offices__grid">
          {offices.map((office, index) => (
            <GlassCard
              key={index}
              className={`nethra-contact-page-comp-office-card nethra-contact-page-comp-office-card--${office.color}`}
              glow
            >
              <div className="nethra-contact-page-comp-office-card__header">
                <span className={`nethra-contact-page-comp-office-card__type nethra-contact-page-comp-office-card__type--${office.color}`}>
                  {office.type}
                </span>
                <div className={`nethra-contact-page-comp-office-card__map-icon nethra-contact-page-comp-office-card__map-icon--${office.color}`}>
                  <Icons.MapPin />
                </div>
              </div>
              <h3 className="nethra-contact-page-comp-office-card__city">{office.city}</h3>
              <span className="nethra-contact-page-comp-office-card__country">{office.country}</span>
              <p className="nethra-contact-page-comp-office-card__address">{office.address}</p>
              <div className="nethra-contact-page-comp-office-card__timezone">
                <Icons.Clock />
                <span>{office.timezone}</span>
              </div>
              <a href="#" className={`nethra-contact-page-comp-office-card__directions nethra-contact-page-comp-office-card__directions--${office.color}`}>
                <span>Get Directions</span>
                <Icons.ArrowRight />
              </a>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================
// FINAL CTA SECTION
// ============================================
const FinalCTA = () => (
  <section className="nethra-contact-section-cta">
    <div className="nethra-contact-section-cta__container">
      <div className="nethra-contact-section-cta__bg-orbs">
        <div className="nethra-contact-section-cta__orb nethra-contact-section-cta__orb--1"></div>
        <div className="nethra-contact-section-cta__orb nethra-contact-section-cta__orb--2"></div>
        <div className="nethra-contact-section-cta__orb nethra-contact-section-cta__orb--3"></div>
      </div>

      <GlassCard className="nethra-contact-section-cta__card" glow>
        <div className="nethra-contact-section-cta__icon">
          <Icons.Sparkles />
        </div>
        <h2 className="nethra-contact-section-cta__title">
          Ready to Transform Your
          <span className="nethra-contact-page-comp-gradient-text"> Experience?</span>
        </h2>
        <p className="nethra-contact-section-cta__desc">
          Join thousands of teams already using Nethra to deliver exceptional AI-powered solutions.
          Start free today no payement required .
        </p>
        <div className="nethra-contact-section-cta__buttons">
          <button className="nethra-contact-page-comp-btn nethra-contact-page-comp-btn--primary nethra-contact-page-comp-btn--lg">
            <span>Get Started Free</span>
            <Icons.Zap />
          </button>
          <button className="nethra-contact-page-comp-btn nethra-contact-page-comp-btn--glass nethra-contact-page-comp-btn--lg">
            <span>Schedule a Demo</span>
          </button>
        </div>
        <div className="nethra-contact-section-cta__features">
          {['Free forever', 'No payment required', 'full features'].map((feature, i) => (
            <div key={i} className="nethra-contact-section-cta__feature">
              <Icons.Check />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  </section>
);

// ============================================
// MAIN CONTACT PAGE
// ============================================
const ContactUs = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    document.documentElement.style.scrollBehavior = 'smooth';
  }, []);

  return (
    <div className={`nethra-contact-page ${isLoaded ? 'nethra-contact-page--loaded' : ''}`}>
      <AnimatedBackground />
      <main className="nethra-contact-page__main">
        <ContactHero />
        <ContactChannels />
        <ContactFormSection />
        <LiveChatCTA />
        <FAQSection />
        <OfficesSection />
        <FinalCTA />
      </main>
    </div>
  );
};

export default ContactUs;