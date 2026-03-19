import React, { useEffect, useRef, useState, useCallback } from 'react';
import '../Style/Home.css';
import { Link } from 'react-router-dom';
// Icons as SVG components
const Icons = {
  Brain: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z" />
      <path d="M10 21v-2m4 2v-2M9 9h.01M15 9h.01M9.5 14a3.5 3.5 0 0 0 5 0" />
    </svg>
  ),
  Eye: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  Sparkles: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
      <path d="M5 19l.5 1.5L7 21l-1.5.5L5 23l-.5-1.5L3 21l1.5-.5L5 19z" />
      <path d="M19 5l.5 1.5L21 7l-1.5.5L19 9l-.5-1.5L17 7l1.5-.5L19 5z" />
    </svg>
  ),
  Wand: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M15 4V2m0 2v2m0-2h2m-2 0h-2" />
      <path d="M3 21l9-9m2-2l7-7-2-2-7 7" />
    </svg>
  ),
  Zap: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  Grid: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  ArrowRight: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  ),
  Check: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Star: () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  Code: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  MessageCircle: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  ),
  Image: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  ),
  FileText: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  Shield: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  Globe: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  Layers: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  ),
  Rocket: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  ),
  Play: () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  ),
  Cpu: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="4" y="4" width="16" height="16" rx="2" />
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
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  ),
  Network: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="3" />
      <circle cx="19" cy="5" r="2" />
      <circle cx="5" cy="5" r="2" />
      <circle cx="19" cy="19" r="2" />
      <circle cx="5" cy="19" r="2" />
      <line x1="14.5" y1="9.5" x2="17.5" y2="6.5" />
      <line x1="9.5" y1="9.5" x2="6.5" y2="6.5" />
      <line x1="14.5" y1="14.5" x2="17.5" y2="17.5" />
      <line x1="9.5" y1="14.5" x2="6.5" y2="17.5" />
    </svg>
  ),
  Lock: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  Clock: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Target: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
  Infinity: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.133-8-12.739-8-4.585 0-4.585 8 0 8 5.606 0 7.644-8 12.74-8z" />
    </svg>
  ),
  Pulse: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
};
// Feature cards data - EXPANDED
const featureCards = [
  {
    id: 1,
    icon: Icons.Brain,
    heading: "Intent Decryption",
    tagline: "Understand meaning, not just words",
    hook: "Powered by DeepSeek-R1, our intent decryption engine uses an 8-billion parameter model to comprehend context, tone, and implicit meaning — routing your query to the perfect processing pipeline in under 50 milliseconds.",
    description: "Unlike traditional keyword matching, the neural router performs deep semantic analysis. It maintains multi-turn conversation context, resolves ambiguous queries automatically, and continuously learns from interaction patterns to refine its accuracy over time.",
    node: "ROUTER_8B",
    gradient: "cyan",
    capabilities: [
      "Deep semantic analysis across 95+ languages",
      "Multi-turn conversation context retention",
      "Automatic ambiguity detection & resolution",
      "Self-improving routing via feedback loops"
    ],
    stats: [
      { label: "Accuracy", value: "99.2%" },
      { label: "Latency", value: "<50ms" },
      { label: "Languages", value: "95+" },
      { label: "Parameters", value: "8B" }
    ],
    techBadge: "DeepSeek-R1 · Fine-tuned · v3.2"
  },
  {
    id: 2,
    icon: Icons.Eye,
    heading: "Omni-Eyes Vision",
    tagline: "See the world through neural eyes",
    hook: "Real-time image analysis powered by Nemotron-VL with 12 billion parameters. Upload any visual data — screenshots, photos, diagrams, documents — and receive instant context-aware descriptions, data extraction, or code generation.",
    description: "The vision module processes images at up to 4K resolution, performing simultaneous OCR, object detection, scene understanding, and spatial reasoning. It excels at extracting structured data from unstructured visuals, making it invaluable for design-to-code workflows.",
    node: "EYES_12B",
    gradient: "purple",
    capabilities: [
      "OCR with 99.7% character-level accuracy",
      "Multi-object detection & scene composition",
      "Design-to-code screenshot conversion",
      "Document parsing with table extraction"
    ],
    stats: [
      { label: "Processing", value: "<100ms" },
      { label: "Resolution", value: "4K" },
      { label: "Formats", value: "50+" },
      { label: "Parameters", value: "12B" }
    ],
    techBadge: "Nemotron-VL · Multi-modal · v2.1"
  },
  {
    id: 3,
    icon: Icons.Sparkles,
    heading: "Visual Synthesis",
    tagline: "From imagination to pixel-perfect reality",
    hook: "Instant high-fidelity image generation with FLUX 2 Klein. Describe any concept and receive photorealistic or stylized 1024×1024 assets in sub-second response times — no design skills required.",
    description: "Our generation pipeline supports over 100 artistic styles, from photorealism to anime, watercolor to 3D render. Built-in style transfer, iterative refinement, and batch generation let you explore creative directions at unprecedented speed.",
    node: "GENERATE_MODE",
    gradient: "pink",
    capabilities: [
      "1024×1024 native resolution output",
      "100+ artistic styles & customizable presets",
      "Iterative refinement with edit instructions",
      "Batch generation for rapid exploration"
    ],
    stats: [
      { label: "Resolution", value: "1024px" },
      { label: "Speed", value: "<2s" },
      { label: "Styles", value: "100+" },
      { label: "Quality", value: "HD" }
    ],
    techBadge: "FLUX 2 Klein · Diffusion · v1.4"
  },
  {
    id: 4,
    icon: Icons.Wand,
    heading: "Prompt Refinement",
    tagline: "Turn simple ideas into powerful instructions",
    hook: "An integrated Prompt Improver that automatically transforms basic commands into high-detail, structured instructions — yielding up to 4× better AI output quality without any extra effort from you.",
    description: "The refinement engine analyzes your intent, injects relevant context and specificity, optimizes formatting for the target model, and adapts terminology to the task domain. It bridges the gap between what you think and what the AI needs to hear.",
    node: "PROMPT_AUTO",
    gradient: "cyan",
    capabilities: [
      "Automatic context enrichment & detail injection",
      "Domain-specific terminology adaptation",
      "Output format optimization per model type",
      "Before/after comparison for transparency"
    ],
    stats: [
      { label: "Enhancement", value: "4×" },
      { label: "Quality Lift", value: "87%" },
      { label: "Detection", value: "Auto" },
      { label: "Speed", value: "Real-time" }
    ],
    techBadge: "Prompt Engine · NLP Pipeline · v2.8"
  },
  {
    id: 5,
    icon: Icons.Zap,
    heading: "Neural Scaling",
    tagline: "The right brain for every task",
    hook: "Dynamic load balancing between Speedster (Fast mode) for quick, low-latency tasks and Super-Brain (Thinking mode) for complex multi-step reasoning — the system auto-selects the optimal model tier for every request.",
    description: "Our scaling infrastructure auto-provisions compute across 12 global regions, implements priority queuing for time-sensitive requests, and maintains intelligent fallback routing to guarantee 99.9% uptime even under extreme load.",
    node: "FAST / THINKING",
    gradient: "purple",
    capabilities: [
      "Automatic model tier selection per query",
      "Priority queuing for latency-sensitive tasks",
      "12-region global load distribution",
      "Intelligent fallback with zero downtime"
    ],
    stats: [
      { label: "Throughput", value: "10K/s" },
      { label: "Uptime", value: "99.9%" },
      { label: "Avg Latency", value: "<200ms" },
      { label: "Regions", value: "12" }
    ],
    techBadge: "Neural Mesh · Auto-scale · v4.0"
  },
  {
    id: 6,
    icon: Icons.Grid,
    heading: "Quad-Mode Matrix",
    tagline: "Four specialized modes, one unified experience",
    hook: "Seamlessly toggle between Normal (Balanced), Thinking (Deep Reasoning), Fast (Low Latency), and Generate (Visual Creation) — each mode is a purpose-built neural configuration optimized for its task type.",
    description: "Mode switching preserves full conversation context, so you can start brainstorming in Normal, dive deep in Thinking, get quick answers in Fast, and visualize concepts in Generate — all within the same session without losing a single thread.",
    node: "MULTI_STATE",
    gradient: "pink",
    capabilities: [
      "Instant mode switching with zero context loss",
      "Per-mode model optimization & tuning",
      "Adaptive UI that reshapes per mode",
      "Cross-mode conversation continuity"
    ],
    stats: [
      { label: "Modes", value: "4" },
      { label: "Switching", value: "<10ms" },
      { label: "Context", value: "Preserved" },
      { label: "Configs", value: "Custom" }
    ],
    techBadge: "Mode Engine · State Machine · v3.5",
    modes: [
      { name: "Normal", desc: "Balanced everyday assistance", color: "cyan" },
      { name: "Thinking", desc: "Deep logic & multi-step reasoning", color: "purple" },
      { name: "Fast", desc: "Ultra low-latency responses", color: "pink" },
      { name: "Generate", desc: "Creative image synthesis", color: "gradient" }
    ]
  }
];

// Use cases data
const useCases = [
  {
    icon: Icons.Code,
    title: "Developers",
    description: "Generate code, debug issues, and get architectural advice with deep reasoning capabilities.",
    tag: "Thinking Mode",
    color: "purple"
  },
  {
    icon: Icons.Image,
    title: "Designers",
    description: "Create stunning visuals, mockups, and creative assets with AI-powered generation.",
    tag: "Generate Mode",
    color: "pink"
  },
  {
    icon: Icons.MessageCircle,
    title: "Support Teams",
    description: "Handle customer queries instantly with fast, accurate responses at scale.",
    tag: "Fast Mode",
    color: "cyan"
  },
  {
    icon: Icons.FileText,
    title: "Content Creators",
    description: "Write articles, scripts, and marketing copy with balanced creativity and precision.",
    tag: "Normal Mode",
    color: "gradient"
  }
];

// Why choose us data
const whyChooseUs = [
  {
    icon: Icons.Zap,
    title: "Lightning Fast",
    description: "Sub-second response times with optimized neural pathways.",
    metric: "<200ms"
  },
  {
    icon: Icons.Shield,
    title: "Enterprise Security",
    description: "End-to-end encryption with SOC 2 compliance.",
    metric: "256-bit"
  },
  {
    icon: Icons.Globe,
    title: "Global Scale",
    description: "Distributed infrastructure across 12 regions worldwide.",
    metric: "12 Regions"
  },
  {
    icon: Icons.Layers,
    title: "Multi-Modal",
    description: "Seamlessly switch between text, vision, and generation.",
    metric: "4 Modes"
  }
];

// Testimonials data
const testimonials = [
  {
    quote: "This AI has transformed our development workflow. The thinking mode solves complex problems that other tools simply can't handle.",
    author: "Sarah Chen",
    role: "CTO at TechFlow",
    avatar: "SC",
    rating: 5
  },
  {
    quote: "The image generation quality is incredible. We've cut our design iteration time by 60% since switching to NeuralCore.",
    author: "Marcus Rodriguez",
    role: "Lead Designer at Pixelcraft",
    avatar: "MR",
    rating: 5
  },
  {
    quote: "Finally, an AI that understands context. The intent decryption feature feels like magic every single time.",
    author: "Emily Watson",
    role: "Product Manager at Innovate Inc",
    avatar: "EW",
    rating: 5
  }
];

// How it works steps
const howItWorksSteps = [
  {
    number: "01",
    title: "Input Your Query",
    description: "Type your question, upload an image, or describe what you want to create.",
    icon: Icons.MessageCircle
  },
  {
    number: "02",
    title: "AI Routes Intelligently",
    description: "DeepSeek-R1 analyzes intent and selects the optimal processing mode automatically.",
    icon: Icons.Network
  },
  {
    number: "03",
    title: "Neural Processing",
    description: "Your request is handled by specialized models optimized for the task type.",
    icon: Icons.Cpu
  },
  {
    number: "04",
    title: "Instant Results",
    description: "Receive high-quality responses, generated images, or refined solutions in seconds.",
    icon: Icons.Zap
  }
];

// Technology stack
const techStack = [
  { name: "DeepSeek-R1", category: "Reasoning", icon: Icons.Brain },
  { name: "Nemotron-VL", category: "Vision", icon: Icons.Eye },
  { name: "FLUX 2 Klein", category: "Generation", icon: Icons.Sparkles },
  { name: "Neural Router", category: "Orchestration", icon: Icons.Network }
];

// Metrics data
const metrics = [
  { value: "500K+", label: "Active Users", icon: Icons.Target },
  { value: "99.9%", label: "Uptime SLA", icon: Icons.Pulse },
  { value: "<200ms", label: "Avg Response", icon: Icons.Clock },
  { value: "50M+", label: "Queries/Day", icon: Icons.Infinity }
];

// Animated Background Component
const AnimatedBackground = () => {
  return (
    <div className="Nethra-home-page-animated-bg">
      {/* Gradient Orbs */}
      <div className="Nethra-home-page-animated-bg__orb Nethra-home-page-animated-bg__orb--1"></div>
      <div className="Nethra-home-page-animated-bg__orb Nethra-home-page-animated-bg__orb--2"></div>
      <div className="Nethra-home-page-animated-bg__orb Nethra-home-page-animated-bg__orb--3"></div>
      <div className="Nethra-home-page-animated-bg__orb Nethra-home-page-animated-bg__orb--4"></div>

      {/* Grid Pattern */}
      <div className="Nethra-home-page-animated-bg__grid"></div>

      {/* Floating Particles */}
      <div className="Nethra-home-page-animated-bg__particles">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="Nethra-home-page-particle"
            style={{
              '--delay': `${Math.random() * 5}s`,
              '--duration': `${15 + Math.random() * 10}s`,
              '--x-start': `${Math.random() * 100}%`,
              '--y-start': `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Scan Lines */}
      <div className="Nethra-home-page-animated-bg__scanlines"></div>
    </div>
  );
};

// Orbital System Component
const OrbitalSystem = ({ size = 400, children }) => {
  return (
    <div className="Nethra-home-page-orbital-system" style={{ '--size': `${size}px` }}>
      <div className="Nethra-home-page-orbital-system__ring Nethra-home-page-orbital-system__ring--1">
        <div className="Nethra-home-page-orbital-system__satellite Nethra-home-page-orbital-system__satellite--1">
          <Icons.Zap />
        </div>
      </div>
      <div className="Nethra-home-page-orbital-system__ring Nethra-home-page-orbital-system__ring--2">
        <div className="Nethra-home-page-orbital-system__satellite Nethra-home-page-orbital-system__satellite--2">
          <Icons.Shield />
        </div>
        <div className="Nethra-home-page-orbital-system__satellite Nethra-home-page-orbital-system__satellite--3">
          <Icons.Globe />
        </div>
      </div>
      <div className="Nethra-home-page-orbital-system__ring Nethra-home-page-orbital-system__ring--3">
        <div className="Nethra-home-page-orbital-system__satellite Nethra-home-page-orbital-system__satellite--4">
          <Icons.Layers />
        </div>
        <div className="Nethra-home-page-orbital-system__satellite Nethra-home-page-orbital-system__satellite--5">
          <Icons.Cpu />
        </div>
        <div className="Nethra-home-page-orbital-system__satellite Nethra-home-page-orbital-system__satellite--6">
          <Icons.Database />
        </div>
      </div>
      <div className="Nethra-home-page-orbital-system__core">
        {children || <Icons.Brain />}
      </div>
    </div>
  );
};

// Glass Card Component
const GlassCard = ({ children, className = "", hover = true, glow = false }) => {
  return (
    <div className={`Nethra-home-page-glass-card ${hover ? 'Nethra-home-page-glass-card--hover' : ''} ${glow ? 'Nethra-home-page-glass-card--glow' : ''} ${className}`}>
      {children}
    </div>
  );
};

// Hero Section
const HeroSection = () => {
  return (
    <section className="Nethra-home-page-hero">
      <div className="Nethra-home-page-hero__container">
        <div className="Nethra-home-page-hero__content">
          <div className="Nethra-home-page-hero__badge Nethra-home-page-glass-card">
            <span className="Nethra-home-page-hero__badge-dot"></span>
            <span>Powered by Next-Gen Neural Networks</span>
            <span className="Nethra-home-page-hero__badge-version">v3.0</span>
          </div>

          <h1 className="Nethra-home-page-hero__title">
            <span className="Nethra-home-page-hero__title-line">The Future of</span>
            <span className="Nethra-home-page-hero__title-line Nethra-home-page-hero__title-gradient">Intelligent</span>
            <span className="Nethra-home-page-hero__title-line">Conversation</span>
          </h1>

          <p className="Nethra-home-page-hero__subtitle">
            Experience AI that understands context, generates visuals, and adapts to your needs
            in real-time. Four distinct modes. One seamless interface. Infinite possibilities.
          </p>

          <div className="Nethra-home-page-hero__cta">
            <button className="Nethra-home-page-btn Nethra-home-page-btn--primary Nethra-home-page-btn--lg">
              <span>Start Creating</span>
              <div className="Nethra-home-page-btn__icon">
                <Icons.ArrowRight />
              </div>
            </button>
            <button className="Nethra-home-page-btn Nethra-home-page-btn--glass Nethra-home-page-btn--lg">
              <div className="Nethra-home-page-btn__play-icon">
                <Icons.Play />
              </div>
              <span>Watch Demo</span>
            </button>
          </div>

          {/* Mini Stats */}
          <div className="Nethra-home-page-hero__mini-stats">
            {metrics.slice(0, 3).map((metric, index) => (
              <div key={index} className="Nethra-home-page-hero__mini-stat">
                <span className="Nethra-home-page-hero__mini-stat-value">{metric.value}</span>
                <span className="Nethra-home-page-hero__mini-stat-label">{metric.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="Nethra-home-page-hero__visual">
          <OrbitalSystem size={450}>
            <Icons.Brain />
          </OrbitalSystem>

          {/* Floating Cards */}
          <div className="Nethra-home-page-hero__floating-card Nethra-home-page-hero__floating-card--1 Nethra-home-page-glass-card">
            <div className="Nethra-home-page-hero__floating-card-icon">
              <Icons.Zap />
            </div>
            <span>Fast Mode Active</span>
          </div>
          <div className="Nethra-home-page-hero__floating-card Nethra-home-page-hero__floating-card--2 Nethra-home-page-glass-card">
            <div className="Nethra-home-page-hero__floating-card-icon Nethra-home-page-hero__floating-card-icon--purple">
              <Icons.Brain />
            </div>
            <span>Thinking...</span>
          </div>
          <div className="Nethra-home-page-hero__floating-card Nethra-home-page-hero__floating-card--3 Nethra-home-page-glass-card">
            <div className="Nethra-home-page-hero__floating-card-icon Nethra-home-page-hero__floating-card-icon--pink">
              <Icons.Sparkles />
            </div>
            <span>Generating</span>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="Nethra-home-page-hero__scroll-indicator">
        <div className="Nethra-home-page-hero__scroll-mouse">
          <div className="Nethra-home-page-hero__scroll-wheel"></div>
        </div>
        <span>Scroll to explore</span>
      </div>
    </section>
  );
};

// Metrics Section
const MetricsSection = () => {
  return (
    <section className="Nethra-home-page-metrics">
      <div className="Nethra-home-page-metrics__container">
        <div className="Nethra-home-page-metrics__grid">
          {metrics.map((metric, index) => (
            <GlassCard key={index} className="Nethra-home-page-metric-card" glow>
              <div className="Nethra-home-page-metric-card__icon">
                <metric.icon />
              </div>
              <div className="Nethra-home-page-metric-card__content">
                <span className="Nethra-home-page-metric-card__value">{metric.value}</span>
                <span className="Nethra-home-page-metric-card__label">{metric.label}</span>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
};

// Stack Card Feature Section - CLEAN LAST CARD EXIT
const FeatureSection = () => {
  const sectionRef = useRef(null);
  const [activeCard, setActiveCard] = useState(0);
  const [cardProgress, setCardProgress] = useState(0);
  const [sectionProgress, setSectionProgress] = useState(0);
  const [exitProgress, setExitProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (!sectionRef.current) {
            ticking = false;
            return;
          }

          const section = sectionRef.current;
          const rect = section.getBoundingClientRect();
          const sectionTop = rect.top;
          const sectionHeight = section.offsetHeight;
          const windowHeight = window.innerHeight;

          const totalCards = featureCards.length;
          const totalTransitions = totalCards - 1;
          const scrollableHeight = sectionHeight - windowHeight;
          const scrolled = Math.max(0, -sectionTop);

          // Reserve scroll space for exit hint
          const exitScrollSpace = windowHeight * 0.3; // 30vh for exit
          const transitionScrollSpace = scrollableHeight - exitScrollSpace;

          const scrollPerTransition = transitionScrollSpace / totalTransitions;
          const rawTransitionIndex = Math.min(scrolled / scrollPerTransition, totalTransitions);

          const currentCard = Math.min(totalCards - 1, Math.floor(rawTransitionIndex));

          let progressInTransition = 0;
          if (currentCard < totalCards - 1) {
            progressInTransition = rawTransitionIndex - currentCard;
            progressInTransition = Math.max(0, Math.min(1, progressInTransition));
          }

          setActiveCard(currentCard);
          setCardProgress(progressInTransition);

          // Calculate exit progress (for hint visibility only)
          const lastCardStartScroll = scrollPerTransition * totalTransitions;
          if (scrolled > lastCardStartScroll) {
            const scrollIntoExit = scrolled - lastCardStartScroll;
            const exitProg = Math.min(1, scrollIntoExit / exitScrollSpace);
            setExitProgress(exitProg);
          } else {
            setExitProgress(0);
          }

          // Overall section progress
          const overallProgress = scrollableHeight > 0
            ? Math.min(1, scrolled / scrollableHeight)
            : 0;
          setSectionProgress(overallProgress);

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDotClick = (index) => {
    if (!sectionRef.current) return;

    const section = sectionRef.current;
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const windowHeight = window.innerHeight;
    const scrollableHeight = sectionHeight - windowHeight;
    const exitScrollSpace = windowHeight * 0.3;
    const transitionScrollSpace = scrollableHeight - exitScrollSpace;
    const totalTransitions = featureCards.length - 1;
    const scrollPerTransition = transitionScrollSpace / totalTransitions;

    const scrollTarget = sectionTop + (scrollPerTransition * index);

    window.scrollTo({ top: scrollTarget, behavior: 'smooth' });
  };

  // Card positioning - NO exit animation on last card
  const getCardStyles = (index) => {
    const totalCards = featureCards.length;
    const peekStartOffset = 115;
    const baseZIndex = (index + 1) * 10;

    // === PAST CARDS ===
    if (index < activeCard) {
      return {
        transform: 'translateY(0)',
        zIndex: baseZIndex,
      };
    }

    // === ACTIVE CARD ===
    // Stays in place - including the last card (no exit animation)
    if (index === activeCard) {
      return {
        transform: 'translateY(0)',
        zIndex: baseZIndex,
      };
    }

    // === NEXT CARD ===
    if (index === activeCard + 1) {
      const translateY = peekStartOffset * (1 - cardProgress);
      return {
        transform: `translateY(${translateY}%)`,
        zIndex: baseZIndex,
      };
    }

    // === FUTURE CARDS ===
    const stackPosition = index - activeCard - 1;
    const stackGap = 8;
    return {
      transform: `translateY(${peekStartOffset + 10 + (stackPosition * stackGap)}%)`,
      zIndex: baseZIndex,
    };
  };

  const isLastCard = activeCard === featureCards.length - 1;

  return (
    <section className="Nethra-home-page-features-section" id="features" ref={sectionRef}>
      {/* Header */}
      <div className="Nethra-home-page-features-section__header">
        <span className="Nethra-home-page-section-tag">
          <Icons.Cpu />
          <span>Core Capabilities</span>
        </span>
        <h2 className="Nethra-home-page-section-title">
          Six Pillars of
          <span className="Nethra-home-page-gradient-text"> Intelligence</span>
        </h2>
        <p className="Nethra-home-page-section-subtitle">
          Each module represents a specialized neural pathway, working in harmony
          to deliver unparalleled AI performance.
        </p>
      </div>

      {/* Sticky Container */}
      <div className="Nethra-home-page-features-section__sticky">
        <div className="Nethra-home-page-features-section__wrapper">
          {/* Cards Stack */}
          {/* Cards Stack */}
          <div className="Nethra-home-page-cards-stack">
            {featureCards.map((card, index) => {
              const styles = getCardStyles(index);
              const isActive = index === activeCard;
              const isNext = index === activeCard + 1;
              const isPast = index < activeCard;

              return (
                <div
                  key={card.id}
                  className={`Nethra-home-page-stack-card Nethra-home-page-stack-card--${card.gradient}`}
                  data-state={isActive ? 'active' : isNext ? 'next' : isPast ? 'past' : 'future'}
                  style={{
                    transform: styles.transform,
                    zIndex: styles.zIndex,
                  }}
                >
                  <div className="Nethra-home-page-stack-card__content">
                    {/* Header */}
                    <div className="Nethra-home-page-stack-card__header">
                      <span className="Nethra-home-page-stack-card__number">0{card.id}</span>
                      <div className="Nethra-home-page-stack-card__badge">
                        <span className="Nethra-home-page-stack-card__badge-dot"></span>
                        <span>{card.node}</span>
                      </div>
                    </div>

                    {/* Body - Two column layout */}
                    <div className="Nethra-home-page-stack-card__body">
                      {/* Left / Main Column */}
                      <div className="Nethra-home-page-stack-card__main">
                        {/* Icon + Title Row */}
                        <div className="Nethra-home-page-stack-card__title-row">
                          <div className="Nethra-home-page-stack-card__icon">
                            <card.icon />
                          </div>
                          <div className="Nethra-home-page-stack-card__title-group">
                            <h3 className="Nethra-home-page-stack-card__title">{card.heading}</h3>
                            <span className="Nethra-home-page-stack-card__tagline">{card.tagline}</span>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="Nethra-home-page-stack-card__hook">{card.hook}</p>
                        <p className="Nethra-home-page-stack-card__desc">{card.description}</p>

                        {/* Capabilities */}
                        <div className="Nethra-home-page-stack-card__capabilities">
                          {card.capabilities.map((cap, i) => (
                            <div key={i} className="Nethra-home-page-stack-card__capability">
                              <div className="Nethra-home-page-stack-card__capability-check">
                                <Icons.Check />
                              </div>
                              <span>{cap}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right / Sidebar Column */}
                      <div className="Nethra-home-page-stack-card__sidebar">
                        {/* Stats Grid */}
                        <div className="Nethra-home-page-stack-card__stats-grid">
                          {card.stats.map((stat, i) => (
                            <div key={i} className="Nethra-home-page-stack-card__stat-box">
                              <span className="Nethra-home-page-stack-card__stat-value">{stat.value}</span>
                              <span className="Nethra-home-page-stack-card__stat-label">{stat.label}</span>
                            </div>
                          ))}
                        </div>

                        {/* Modes Grid (Card 6 only) */}
                        {card.modes && (
                          <div className="Nethra-home-page-stack-card__modes">
                            {card.modes.map((mode, i) => (
                              <div
                                key={i}
                                className={`Nethra-home-page-stack-card__mode Nethra-home-page-stack-card__mode--${mode.color}`}
                              >
                                <span className="Nethra-home-page-stack-card__mode-name">{mode.name}</span>
                                <span className="Nethra-home-page-stack-card__mode-desc">{mode.desc}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Tech Badge */}
                        <div className="Nethra-home-page-stack-card__tech-badge">
                          <div className="Nethra-home-page-stack-card__tech-badge-dot"></div>
                          <span>{card.techBadge}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Progress Navigation */}
          {/* <nav className="Nethra-home-page-stack-nav">
            <div className="Nethra-home-page-stack-nav__track">
              <div 
                className="Nethra-home-page-stack-nav__progress" 
                style={{ height: `${sectionProgress * 100}%` }} 
              />
            </div>
            <div className="Nethra-home-page-stack-nav__dots">
              {featureCards.map((_, index) => (
                <button
                  key={index}
                  className={`Nethra-home-page-stack-nav__dot ${
                    index === activeCard ? 'Nethra-home-page-is-active' : ''
                  } ${index < activeCard ? 'Nethra-home-page-is-done' : ''}`}
                  onClick={() => handleDotClick(index)}
                  aria-label={`Go to card ${index + 1}`}
                >
                  0{index + 1}
                </button>
              ))}
            </div>
          </nav> */}
        </div>

        {/* Card Counter - fades out on last card exit */}
        <div
          className="Nethra-home-page-stack-counter"
          style={{
            opacity: isLastCard && exitProgress > 0.3 ? 1 - ((exitProgress - 0.3) / 0.7) : 1,
          }}
        >
          <span className="Nethra-home-page-stack-counter__num">0{activeCard + 1}</span>
          <span className="Nethra-home-page-stack-counter__divider">/</span>
          <span className="Nethra-home-page-stack-counter__total">0{featureCards.length}</span>
        </div>

        {/* Scroll Hint - Only shows on last card */}
        {/* {isLastCard && (
          <div 
            className="Nethra-home-page-stack-scroll-hint"
            style={{ 
              opacity: Math.min(1, exitProgress * 3), // Fades in quickly
              transform: `translateX(-50%) translateY(${20 - exitProgress * 20}px)`,
              pointerEvents: exitProgress > 0.1 ? 'auto' : 'none',
            }}
          >
            <div className="Nethra-home-page-stack-scroll-hint__icon">
              <Icons.ArrowRight />
            </div>
            <span>Keep scrolling to continue</span>
          </div>
        )} */}
      </div>
    </section>
  );
};

// Technology Stack Section
const TechStackSection = () => {
  return (
    <section className="Nethra-home-page-tech-stack">
      <div className="Nethra-home-page-tech-stack__container">
        <div className="Nethra-home-page-tech-stack__header">
          <span className="Nethra-home-page-section-tag">
            <Icons.Layers />
            <span>Technology</span>
          </span>
          <h2 className="Nethra-home-page-section-title">
            Powered by
            <span className="Nethra-home-page-gradient-text"> Cutting-Edge </span>
            Models
          </h2>
          <p className="Nethra-home-page-section-subtitle">
            Our neural architecture combines the most advanced AI models,
            each optimized for specific cognitive tasks.
          </p>
        </div>

        <div className="Nethra-home-page-tech-stack__visual">
          <div className="Nethra-home-page-tech-stack__orbit">
            {/* Central Hub */}
            <div className="Nethra-home-page-tech-stack__hub Nethra-home-page-glass-card">
              <div className="Nethra-home-page-tech-stack__hub-core">
                <Icons.Brain />
              </div>
              <span className="Nethra-home-page-tech-stack__hub-label">Neural Core</span>
            </div>

            {/* Orbiting Tech Cards */}
            {techStack.map((tech, index) => (
              <div
                key={index}
                className={`Nethra-home-page-tech-stack__item Nethra-home-page-tech-stack__item--${index + 1}`}
              >
                <GlassCard className="Nethra-home-page-tech-stack__card" glow>
                  <div className="Nethra-home-page-tech-stack__card-icon">
                    <tech.icon />
                  </div>
                  <div className="Nethra-home-page-tech-stack__card-content">
                    <span className="Nethra-home-page-tech-stack__card-name">{tech.name}</span>
                    <span className="Nethra-home-page-tech-stack__card-category">{tech.category}</span>
                  </div>
                </GlassCard>
              </div>
            ))}

            {/* Connection Lines */}
            <svg className="Nethra-home-page-tech-stack__connections" viewBox="0 0 600 600">
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(6, 182, 212, 0.5)" />
                  <stop offset="100%" stopColor="rgba(124, 58, 237, 0.5)" />
                </linearGradient>
              </defs>
              <circle cx="300" cy="300" r="120" fill="none" stroke="url(#lineGradient)" strokeWidth="1" strokeDasharray="5,5" className="Nethra-home-page-tech-stack__orbit-line--1" />
              <circle cx="300" cy="300" r="200" fill="none" stroke="url(#lineGradient)" strokeWidth="1" strokeDasharray="5,5" className="Nethra-home-page-tech-stack__orbit-line--2" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

// How It Works Section
const HowItWorksSection = () => {
  return (
    <section className="Nethra-home-page-how-it-works" id="how-it-works">
      <div className="Nethra-home-page-how-it-works__container">
        <div className="Nethra-home-page-how-it-works__header">
          <span className="Nethra-home-page-section-tag">
            <Icons.Rocket />
            <span>The Process</span>
          </span>
          <h2 className="Nethra-home-page-section-title">
            How It
            <span className="Nethra-home-page-gradient-text"> Works</span>
          </h2>
          <p className="Nethra-home-page-section-subtitle">
            From input to output in milliseconds. Here's the magic behind the scenes.
          </p>
        </div>

        <div className="Nethra-home-page-how-it-works__timeline">
          <div className="Nethra-home-page-how-it-works__line">
            <div className="Nethra-home-page-how-it-works__line-fill"></div>
          </div>

          {howItWorksSteps.map((step, index) => (
            <div key={index} className="Nethra-home-page-step-card">
              <div className="Nethra-home-page-step-card__marker">
                <div className="Nethra-home-page-step-card__marker-dot">
                  <step.icon />
                </div>
                <span className="Nethra-home-page-step-card__number">{step.number}</span>
              </div>

              <GlassCard className="Nethra-home-page-step-card__content" hover>
                <h3 className="Nethra-home-page-step-card__title">{step.title}</h3>
                <p className="Nethra-home-page-step-card__description">{step.description}</p>
              </GlassCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Use Cases Section
const UseCasesSection = () => {
  return (
    <section className="Nethra-home-page-use-cases" id="use-cases">
      <div className="Nethra-home-page-use-cases__container">
        <div className="Nethra-home-page-use-cases__content">
          <div className="Nethra-home-page-use-cases__header">
            <span className="Nethra-home-page-section-tag">
              <Icons.Target />
              <span>Applications</span>
            </span>
            <h2 className="Nethra-home-page-section-title">
              Built for Every
              <span className="Nethra-home-page-gradient-text"> Workflow</span>
            </h2>
            <p className="Nethra-home-page-section-subtitle">
              Whether you're coding, designing, or creating content,
              there's a mode optimized for you.
            </p>
          </div>

          <div className="Nethra-home-page-use-cases__grid">
            {useCases.map((useCase, index) => (
              <GlassCard key={index} className={`Nethra-home-page-use-case-card Nethra-home-page-use-case-card--${useCase.color}`} hover glow>
                <div className="Nethra-home-page-use-case-card__header">
                  <div className="Nethra-home-page-use-case-card__icon">
                    <useCase.icon />
                  </div>
                  <span className="Nethra-home-page-use-case-card__tag">{useCase.tag}</span>
                </div>

                <h3 className="Nethra-home-page-use-case-card__title">{useCase.title}</h3>
                <p className="Nethra-home-page-use-case-card__description">{useCase.description}</p>

                <a href="#" className="Nethra-home-page-use-case-card__link">
                  <span>Learn more</span>
                  <Icons.ArrowRight />
                </a>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Why Choose Us Section
const WhyChooseUsSection = () => {
  return (
    <section className="Nethra-home-page-why-choose-us">
      <div className="Nethra-home-page-why-choose-us__container">
        <div className="Nethra-home-page-why-choose-us__header">
          <span className="Nethra-home-page-section-tag">
            <Icons.Shield />
            <span>Why NeuralCore</span>
          </span>
          <h2 className="Nethra-home-page-section-title">
            Enterprise-Grade AI,
            <span className="Nethra-home-page-gradient-text"> Human-Level </span>
            Understanding
          </h2>
          <p className="Nethra-home-page-section-subtitle">
            We've engineered every component for performance, security, and reliability at scale.
          </p>
        </div>

        <div className="Nethra-home-page-why-choose-us__content">
          <div className="Nethra-home-page-why-choose-us__grid">
            {whyChooseUs.map((item, index) => (
              <GlassCard key={index} className="Nethra-home-page-why-card" hover glow>
                <div className="Nethra-home-page-why-card__metric">{item.metric}</div>
                <div className="Nethra-home-page-why-card__icon">
                  <item.icon />
                </div>
                <h3 className="Nethra-home-page-why-card__title">{item.title}</h3>
                <p className="Nethra-home-page-why-card__description">{item.description}</p>
              </GlassCard>
            ))}
          </div>

          <div className="Nethra-home-page-why-choose-us__visual">
            <OrbitalSystem size={350}>
              <Icons.Brain />
            </OrbitalSystem>
          </div>
        </div>
      </div>
    </section>
  );
};

// Testimonials Section
const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handleDotClick = (index) => {
    setActiveIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <section className="Nethra-home-page-testimonials" id="testimonials">
      <div className="Nethra-home-page-testimonials__container">
        <div className="Nethra-home-page-testimonials__header">
          <span className="Nethra-home-page-section-tag">
            <Icons.Star />
            <span>Testimonials</span>
          </span>
          <h2 className="Nethra-home-page-section-title">
            Trusted by
            <span className="Nethra-home-page-gradient-text"> Innovators</span>
          </h2>
        </div>

        <div className="Nethra-home-page-testimonials__carousel">
          <div className="Nethra-home-page-testimonials__track" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
            {testimonials.map((testimonial, index) => (
              <div key={index} className="Nethra-home-page-testimonials__slide">
                <GlassCard className="Nethra-home-page-testimonial-card" glow>
                  <div className="Nethra-home-page-testimonial-card__quote-mark">"</div>

                  <div className="Nethra-home-page-testimonial-card__stars">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="Nethra-home-page-testimonial-card__star">
                        <Icons.Star />
                      </span>
                    ))}
                  </div>

                  <blockquote className="Nethra-home-page-testimonial-card__quote">
                    {testimonial.quote}
                  </blockquote>

                  <div className="Nethra-home-page-testimonial-card__author">
                    <div className="Nethra-home-page-testimonial-card__avatar">
                      {testimonial.avatar}
                    </div>
                    <div className="Nethra-home-page-testimonial-card__info">
                      <span className="Nethra-home-page-testimonial-card__name">{testimonial.author}</span>
                      <span className="Nethra-home-page-testimonial-card__role">{testimonial.role}</span>
                    </div>
                  </div>
                </GlassCard>
              </div>
            ))}
          </div>
        </div>

        <div className="Nethra-home-page-testimonials__controls">
          <div className="Nethra-home-page-testimonials__dots">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`Nethra-home-page-testimonials__dot ${index === activeIndex ? 'Nethra-home-page-testimonials__dot--active' : ''}`}
                onClick={() => handleDotClick(index)}
                aria-label={`View testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Interactive Demo Section
const DemoSection = () => {
  const [activeMode, setActiveMode] = useState('thinking');

  const modes = [
    { id: 'normal', name: 'Normal', icon: Icons.MessageCircle, color: 'cyan' },
    { id: 'thinking', name: 'Thinking', icon: Icons.Brain, color: 'purple' },
    { id: 'fast', name: 'Fast', icon: Icons.Zap, color: 'pink' },
    { id: 'generate', name: 'Generate', icon: Icons.Sparkles, color: 'gradient' },
  ];

  return (
    <section className="Nethra-home-page-demo">
      <div className="Nethra-home-page-demo__container">
        <div className="Nethra-home-page-demo__header">
          <span className="Nethra-home-page-section-tag">
            <Icons.Play />
            <span>Live Preview</span>
          </span>
          <h2 className="Nethra-home-page-section-title">
            Experience the
            <span className="Nethra-home-page-gradient-text"> Interface</span>
          </h2>
          <p className="Nethra-home-page-section-subtitle">
            See how different modes transform your AI interactions in real-time.
          </p>
        </div>

        <div className="Nethra-home-page-demo__content">
          {/* Mode Selector */}
          <div className="Nethra-home-page-demo__modes">
            {modes.map((mode) => (
              <button
                key={mode.id}
                className={`Nethra-home-page-demo__mode-btn Nethra-home-page-demo__mode-btn--${mode.color} ${activeMode === mode.id ? 'Nethra-home-page-demo__mode-btn--active' : ''}`}
                onClick={() => setActiveMode(mode.id)}
              >
                <mode.icon />
                <span>{mode.name}</span>
              </button>
            ))}
          </div>

          {/* Chat Preview */}
          <GlassCard className="Nethra-home-page-demo__preview" glow>
            <div className="Nethra-home-page-demo__preview-header">
              <div className="Nethra-home-page-demo__preview-dots">
                <span></span><span></span><span></span>
              </div>
              <div className={`Nethra-home-page-demo__preview-mode Nethra-home-page-demo__preview-mode--${activeMode}`}>
                <span className="Nethra-home-page-demo__preview-mode-dot"></span>
                <span>{modes.find(m => m.id === activeMode)?.name} Mode</span>
              </div>
            </div>

            <div className="Nethra-home-page-demo__preview-messages">
              <div className="Nethra-home-page-demo__message Nethra-home-page-demo__message--user">
                <p>Analyze this code and suggest performance improvements</p>
              </div>

              <div className={`Nethra-home-page-demo__message Nethra-home-page-demo__message--bot Nethra-home-page-demo__message--${activeMode}`}>
                {activeMode === 'thinking' && (
                  <>
                    <div className="Nethra-home-page-demo__thinking">
                      <div className="Nethra-home-page-demo__thinking-brain">
                        <Icons.Brain />
                      </div>
                      <div className="Nethra-home-page-demo__thinking-text">
                        <span>Analyzing code structure...</span>
                        <div className="Nethra-home-page-demo__thinking-dots">
                          <span></span><span></span><span></span>
                        </div>
                      </div>
                    </div>
                    <div className="Nethra-home-page-demo__response">
                      <p>I've identified <span className="Nethra-home-page-highlight">3 optimization opportunities</span>:</p>
                      <ul>
                        <li>Memoize expensive computations</li>
                        <li>Implement lazy loading for modules</li>
                        <li>Optimize database queries with indexing</li>
                      </ul>
                    </div>
                  </>
                )}

                {activeMode === 'fast' && (
                  <div className="Nethra-home-page-demo__response Nethra-home-page-demo__response--instant">
                    <p>Quick analysis: Use memoization, lazy loading, and query indexing.</p>
                    <span className="Nethra-home-page-demo__response-time">Response: 45ms</span>
                  </div>
                )}

                {activeMode === 'normal' && (
                  <div className="Nethra-home-page-demo__response">
                    <p>I can help optimize your code. Here are my suggestions for improving performance while maintaining readability...</p>
                  </div>
                )}

                {activeMode === 'generate' && (
                  <div className="Nethra-home-page-demo__response Nethra-home-page-demo__response--generate">
                    <div className="Nethra-home-page-demo__generate-preview">
                      <div className="Nethra-home-page-demo__generate-shimmer"></div>
                      <Icons.Image />
                      <span>Generating visual diagram...</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="Nethra-home-page-demo__preview-input">
              <input type="text" placeholder="Type your message..." disabled />
              <button className="Nethra-home-page-demo__send-btn">
                <Icons.ArrowRight />
              </button>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
};

// Final CTA Section
const FinalCTASection = () => {
  return (
    <section className="Nethra-home-page-final-cta">
      <div className="Nethra-home-page-final-cta__bg">
        <div className="Nethra-home-page-final-cta__orb Nethra-home-page-final-cta__orb--1"></div>
        <div className="Nethra-home-page-final-cta__orb Nethra-home-page-final-cta__orb--2"></div>
        <div className="Nethra-home-page-final-cta__orb Nethra-home-page-final-cta__orb--3"></div>
      </div>

      <div className="Nethra-home-page-final-cta__container">
        <GlassCard className="Nethra-home-page-final-cta__content" glow>
          <div className="Nethra-home-page-final-cta__icon">
            <Icons.Rocket />
          </div>

          <h2 className="Nethra-home-page-final-cta__title">
            Ready to Experience the
            <span className="Nethra-home-page-gradient-text"> Future?</span>
          </h2>

          <p className="Nethra-home-page-final-cta__subtitle">
            Join thousands of teams already using NeuralCore to transform their workflows.
            Start for free, no credit card required.
          </p>

          <div className="Nethra-home-page-final-cta__actions">
            <Link to="/login">
              <button className="Nethra-home-page-btn Nethra-home-page-btn--primary Nethra-home-page-btn--lg">
                <span>Get Started Free</span>
                <div className="Nethra-home-page-btn__icon">
                  <Icons.ArrowRight />
                </div>
              </button>
            </Link>
          </div>

          <div className="Nethra-home-page-final-cta__features">
            <div className="Nethra-home-page-final-cta__feature">
              <div className="Nethra-home-page-final-cta__feature-icon">
                <Icons.Check />
              </div>
              <span>Free Forever</span>
            </div>
            <div className="Nethra-home-page-final-cta__feature">
              <div className="Nethra-home-page-final-cta__feature-icon">
                <Icons.Check />
              </div>
              <span>No payment required</span>
            </div>
            <div className="Nethra-home-page-final-cta__feature">
              <div className="Nethra-home-page-final-cta__feature-icon">
                <Icons.Check />
              </div>
              <span>Full features</span>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
};

// Main HomePage Component
const HomePage = () => {
  useEffect(() => {
    // Smooth scroll polyfill for older browsers
    document.documentElement.style.scrollBehavior = 'smooth';
  }, []);

  return (
    <div className="Nethra-home-page">
      <AnimatedBackground />
      <main>
        <HeroSection />
        <MetricsSection />
        <FeatureSection />
        <TechStackSection />
        <HowItWorksSection />
        <UseCasesSection />
        <WhyChooseUsSection />
        <DemoSection />
        <TestimonialsSection />
        <FinalCTASection />
      </main>
    </div>
  );
};

export default HomePage;