import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  memo,
  useMemo,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../Style/Chat.css';

// ============================================
// API BASE
// ============================================
const API_BASE = (() => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL)
      return import.meta.env.VITE_API_URL.replace('/auth', '/chat');
  } catch (e) { }
  return 'http://localhost:5000/api/chat';
})();

// ============================================
// SPEECH RECOGNITION
// ============================================
const SpeechRecognition =
  typeof window !== 'undefined'
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null;

// ============================================
// ICONS — defined outside component to avoid recreation
// ============================================
const Icons = {
  Send: memo(() => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  )),
  Stop: memo(() => (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <rect x="4" y="4" width="16" height="16" rx="2" />
    </svg>
  )),
  Plus: memo(() => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )),
  Trash: memo(() => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
    </svg>
  )),
  Copy: memo(() => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  )),
  Check: memo(() => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )),
  Refresh: memo(() => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
    </svg>
  )),
  Image: memo(() => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  )),
  Download: memo(() => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  )),
  X: memo(() => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )),
  Sidebar: memo(() => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="9" y1="3" x2="9" y2="21" />
    </svg>
  )),
  Sparkles: memo(() => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z" />
    </svg>
  )),
  Zap: memo(() => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  )),
  Brain: memo(() => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A2.5 2.5 0 0112 4.5v15a2.5 2.5 0 01-4.96.44 2.5 2.5 0 01-2.96-3.08 3 3 0 01-.34-5.58 2.5 2.5 0 011.32-4.24 2.5 2.5 0 011.98-3A2.5 2.5 0 019.5 2z" />
      <path d="M14.5 2A2.5 2.5 0 0012 4.5v15a2.5 2.5 0 004.96.44 2.5 2.5 0 002.96-3.08 3 3 0 00.34-5.58 2.5 2.5 0 00-1.32-4.24 2.5 2.5 0 00-1.98-3A2.5 2.5 0 0014.5 2z" />
    </svg>
  )),
  ChevronDown: memo(() => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )),
  MessageCircle: memo(() => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
    </svg>
  )),
  Mic: memo(() => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
      <path d="M19 10v2a7 7 0 01-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  )),
  MicOff: memo(() => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <line x1="1" y1="1" x2="23" y2="23" />
      <path d="M9 9v3a3 3 0 005.12 2.12M15 9.34V4a3 3 0 00-5.94-.6" />
      <path d="M17 16.95A7 7 0 015 12v-2m14 0v2c0 .76-.13 1.49-.35 2.17" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  )),
  Home: memo(() => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" />
    </svg>
  )),
  ArrowDown: memo(() => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <polyline points="19 12 12 19 5 12" />
    </svg>
  )),
  Eraser: memo(() => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 20H7L3 16l9-9 8 8-4 4" />
      <path d="M6.5 13.5l5 5" />
    </svg>
  )),
  Wand: memo(() => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 4V2" /><path d="M15 16v-2" />
      <path d="M8 9h2" /><path d="M20 9h2" />
      <path d="M17.8 11.8L19 13" /><path d="M15 9h.01" />
      <path d="M17.8 6.2L19 5" /><path d="M3 21l9-9" />
      <path d="M12.2 6.2L11 5" />
    </svg>
  )),
};

// ============================================
// MODES — static, defined once
// ============================================
const MODES = [
  { id: 'normal', label: 'Normal', desc: 'Auto-routes to best model', icon: Icons.Sparkles, color: 'cyan' },
  { id: 'fast', label: 'Fast', desc: '30B speed model', icon: Icons.Zap, color: 'green' },
  { id: 'thinking', label: 'Thinking', desc: '120B deep reasoning', icon: Icons.Brain, color: 'purple' },
  { id: 'image', label: 'Image', desc: 'Vision & generation', icon: Icons.Image, color: 'pink' },
];

// ============================================
// HELPERS
// ============================================
const formatTime = (ts) =>
  new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const formatDate = (ts) => {
  const d = new Date(ts);
  const t = new Date();
  if (d.toDateString() === t.toDateString()) return 'Today';
  const y = new Date(t); y.setDate(y.getDate() - 1);
  if (d.toDateString() === y.toDateString()) return 'Yesterday';
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

const getGreeting = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
};

// ============================================
// RICH MARKDOWN PARSER — replaces parseInlineMarkdown
// ============================================
const escapeHtml = (text) =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** Inline formatting — protects backtick code from other rules */
const applyInline = (text) => {
  if (!text) return '';
  const parts = text.split(/(`[^`]+`)/g);
  return parts
    .map((part) => {
      if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
        return `<code class="nc-inline-code">${part.slice(1, -1)}</code>`;
      }
      return part
        .replace(/\*\*\*(.+?)\*\*\*/g, '<strong class="nc-md-bold"><em>$1</em></strong>')
        .replace(/\*\*(.+?)\*\*/g, '<strong class="nc-md-bold">$1</strong>')
        .replace(/\*(.+?)\*/g, '<em class="nc-md-italic">$1</em>')
        .replace(/~~(.+?)~~/g, '<del class="nc-md-strike">$1</del>')
        .replace(
          /\[([^\]]+)\]\(([^)]+)\)/g,
          '<a class="nc-md-link" href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
        );
    })
    .join('');
};

/** Block-level markdown → HTML with classes for styling */
const parseMarkdownToHTML = (text) => {
  if (!text) return '';
  const lines = text.split('\n');
  let html = '';
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // ── empty line → spacer ──
    if (!trimmed) { html += '<div class="nc-md-spacer"></div>'; i++; continue; }

    // ── headers ──
    const hMatch = trimmed.match(/^(#{1,6})\s+(.+)/);
    if (hMatch) {
      const lvl = Math.min(hMatch[1].length, 4);
      html += `<h${lvl} class="nc-md-h${lvl}">${applyInline(escapeHtml(hMatch[2]))}</h${lvl}>`;
      i++; continue;
    }

    // ── horizontal rule ──
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
      html += '<hr class="nc-md-hr"/>'; i++; continue;
    }

    // ── blockquote ──
    if (trimmed.startsWith('> ') || trimmed === '>') {
      const qLines = [];
      while (i < lines.length) {
        const q = lines[i].trim();
        if (q.startsWith('> ')) qLines.push(q.slice(2));
        else if (q === '>') qLines.push('');
        else break;
        i++;
      }
      html += `<blockquote class="nc-md-blockquote">${qLines.map((l) => applyInline(escapeHtml(l))).join('<br/>')}</blockquote>`;
      continue;
    }

    // ── unordered list ──
    if (/^\s*[-*+]\s/.test(line)) {
      html += '<ul class="nc-md-ul">';
      while (i < lines.length && /^\s*[-*+]\s/.test(lines[i])) {
        const content = lines[i].trim().replace(/^[-*+]\s+/, '');
        html += `<li class="nc-md-li">${applyInline(escapeHtml(content))}</li>`;
        i++;
      }
      html += '</ul>'; continue;
    }

    // ── ordered list ──
    if (/^\s*\d{1,3}[.)]\s/.test(line)) {
      html += '<ol class="nc-md-ol">';
      while (i < lines.length && /^\s*\d{1,3}[.)]\s/.test(lines[i])) {
        const content = lines[i].trim().replace(/^\d{1,3}[.)]\s+/, '');
        html += `<li class="nc-md-li">${applyInline(escapeHtml(content))}</li>`;
        i++;
      }
      html += '</ol>'; continue;
    }

    // ── table ──
    if (trimmed.includes('|') && i + 1 < lines.length) {
      const sep = (lines[i + 1] || '').trim();
      if (/^[\|\s:_-]+$/.test(sep) && sep.includes('-')) {
        const parseRow = (r) => r.replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
        const hCells = parseRow(trimmed);
        i += 2;
        html += '<div class="nc-md-table-wrap"><table class="nc-md-table"><thead><tr>';
        hCells.forEach((c) => { html += `<th class="nc-md-th">${applyInline(escapeHtml(c))}</th>`; });
        html += '</tr></thead><tbody>';
        while (i < lines.length && lines[i].trim().includes('|')) {
          const cells = parseRow(lines[i].trim());
          html += '<tr>';
          cells.forEach((c) => { html += `<td class="nc-md-td">${applyInline(escapeHtml(c))}</td>`; });
          html += '</tr>'; i++;
        }
        html += '</tbody></table></div>'; continue;
      }
    }

    // ── regular paragraph — group consecutive plain lines ──
    const pLines = [];
    while (i < lines.length) {
      const ct = lines[i].trim();
      if (
        !ct ||
        /^#{1,6}\s/.test(ct) ||
        /^\s*[-*+]\s/.test(lines[i]) ||
        /^\s*\d{1,3}[.)]\s/.test(lines[i]) ||
        ct.startsWith('> ') || ct === '>' ||
        /^(-{3,}|\*{3,}|_{3,})$/.test(ct)
      ) break;
      // break on table header too
      if (ct.includes('|') && i + 1 < lines.length) {
        const ns = (lines[i + 1] || '').trim();
        if (/^[\|\s:_-]+$/.test(ns) && ns.includes('-')) break;
      }
      pLines.push(ct);
      i++;
    }
    if (pLines.length) {
      html += `<p class="nc-md-p">${pLines.map((l) => applyInline(escapeHtml(l))).join('<br/>')}</p>`;
    }
  }
  return html;
};

// ============================================
// TYPING DOTS — memoized
// ============================================
const TypingDots = memo(() => (
  <div className="nc-typing"><span /><span /><span /></div>
));

// ============================================
// CODE BLOCK — memoized with sticky copy
// ============================================
const CodeBlock = memo(({ code, language }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  return (
    <div className="nc-codeblock">
      <div className="nc-codeblock-bar">
        <span className="nc-codeblock-lang">{language || 'code'}</span>
        <button
          className={`nc-codeblock-copy ${copied ? 'nc-codeblock-copy--done' : ''}`}
          onClick={handleCopy} type="button"
        >
          {copied ? <Icons.Check /> : <Icons.Copy />}
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      <pre className="nc-codeblock-pre"><code>{code}</code></pre>
    </div>
  );
});

// ============================================
// MESSAGE CONTENT — now uses rich markdown parser
// ============================================
const MessageContent = memo(({ content, isStreaming }) => {
  if (!content) return isStreaming ? <TypingDots /> : null;

  const hasCompleteCodeBlock =
    content.includes('```') && (content.match(/```/g) || []).length >= 2;

  if (!hasCompleteCodeBlock) {
    return (
      <div
        className="nc-md"
        dangerouslySetInnerHTML={{ __html: parseMarkdownToHTML(content) }}
      />
    );
  }

  const segments = [];
  const regex = /```(\w*)\n?([\s\S]*?)```/g;
  let lastIdx = 0;
  let match;

  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIdx)
      segments.push({ type: 'text', value: content.slice(lastIdx, match.index) });
    segments.push({ type: 'code', lang: match[1], value: match[2] });
    lastIdx = match.index + match[0].length;
  }
  if (lastIdx < content.length)
    segments.push({ type: 'text', value: content.slice(lastIdx) });

  return (
    <>
      {segments.map((seg, i) =>
        seg.type === 'code' ? (
          <CodeBlock key={i} code={seg.value} language={seg.lang} />
        ) : (
          <div
            key={i}
            className="nc-md"
            dangerouslySetInnerHTML={{ __html: parseMarkdownToHTML(seg.value) }}
          />
        )
      )}
    </>
  );
});

// ============================================
// MODE SELECTOR — memoized
// ============================================
const ModeSelector = memo(({ mode, setMode, disabled }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = useMemo(() => MODES.find((m) => m.id === mode), [mode]);

  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);

  return (
    <div className="nc-mode-selector" ref={ref}>
      <button
        className={`nc-mode-btn nc-mode-btn--${current?.color}`}
        onClick={() => !disabled && setOpen(!open)}
        disabled={disabled} type="button" title={`Mode: ${current?.label}`}
      >
        {current && <current.icon />}
        <span className="nc-mode-btn-label">{current?.label}</span>
        <Icons.ChevronDown />
      </button>
      {open && (
        <div className="nc-mode-dropdown">
          {MODES.map((m) => (
            <button key={m.id}
              className={`nc-mode-option ${mode === m.id ? 'nc-mode-option--active' : ''} nc-mode-option--${m.color}`}
              onClick={() => { setMode(m.id); setOpen(false); }} type="button"
            >
              <div className="nc-mode-option-icon"><m.icon /></div>
              <div className="nc-mode-option-info">
                <span className="nc-mode-option-label">{m.label}</span>
                <span className="nc-mode-option-desc">{m.desc}</span>
              </div>
              {mode === m.id && <div className="nc-mode-check"><Icons.Check /></div>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
});

// ============================================
// MESSAGE BUBBLE — memoized
// ============================================
const MessageBubble = memo(({ msg, isLast, onRegenerate }) => {
  const [copied, setCopied] = useState(false);
  const isUser = msg.role === 'user';

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(msg.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [msg.content]);

  const handleDownload = useCallback(() => {
    if (!msg.imageUrl) return;
    const a = document.createElement('a');
    a.href = msg.imageUrl;
    a.download = `nethra-image-${Date.now()}.png`;
    a.click();
  }, [msg.imageUrl]);

  return (
    <div className={`nc-msg ${isUser ? 'nc-msg--user' : 'nc-msg--ai'}`}>
      {!isUser && <div className="nc-msg-avatar"><Icons.Sparkles /></div>}
      <div className="nc-msg-body">
        <div className={`nc-msg-bubble ${isUser ? 'nc-msg-bubble--user' : 'nc-msg-bubble--ai'} ${msg.isError ? 'nc-msg-bubble--error' : ''}`}>
          {isUser && msg.imageUrl && (
            <div className="nc-msg-image-preview"><img src={msg.imageUrl} alt="Uploaded" loading="lazy" /></div>
          )}
          <div className="nc-msg-text">
            <MessageContent content={msg.content} isStreaming={msg.isStreaming} />
          </div>
          {!isUser && msg.imageUrl && (
            <div className="nc-msg-generated-image">
              <img src={msg.imageUrl} alt="Generated" loading="lazy" />
              <button className="nc-img-download" onClick={handleDownload} title="Download"><Icons.Download /></button>
            </div>
          )}
          {!isUser && msg.isStreaming && msg.content && <span className="nc-cursor" />}
        </div>
        <div className="nc-msg-meta">
          <span className="nc-msg-time">{formatTime(msg.timestamp)}</span>
          {msg.model && <span className="nc-msg-model">{msg.model.split('/').pop()}</span>}
          {!isUser && !msg.isStreaming && msg.content && (
            <div className="nc-msg-actions">
              <button onClick={handleCopy} className="nc-msg-action" title="Copy">
                {copied ? <Icons.Check /> : <Icons.Copy />}
              </button>
              {isLast && <button onClick={onRegenerate} className="nc-msg-action" title="Regenerate"><Icons.Refresh /></button>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
// ============================================
// VOICE INPUT HOOK — with auto-translate to English
// ============================================
const useVoiceInput = (setInput, token) => {
  const [isListening, setIsListening] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedFrom, setTranslatedFrom] = useState(null); // e.g. "Spanish"
  const [isSupported] = useState(!!SpeechRecognition);
  const recognitionRef = useRef(null);
  const manualStopRef = useRef(false);
  const baseTextRef = useRef('');
  const prevSessionsRef = useRef('');
  const voiceCapturedRef = useRef('');

  const userLang = useMemo(() => navigator.language || 'en-US', []);
  const isNonEnglish = useMemo(() => !userLang.startsWith('en'), [userLang]);

  // Language display name for UI feedback
  const langDisplayName = useMemo(() => {
    try {
      const dn = new Intl.DisplayNames(['en'], { type: 'language' });
      return dn.of(userLang.split('-')[0]) || userLang;
    } catch {
      return userLang;
    }
  }, [userLang]);

  // ── Translate captured voice text to English ──
  const translateToEnglish = useCallback(
    async (text) => {
      if (!text.trim() || !token) return { result: text, didTranslate: false };

      // Quick ASCII heuristic — if mostly ASCII, likely already English
      const asciiChars = text.replace(/[^\x00-\x7F]/g, '').length;
      if (asciiChars / text.length > 0.92) return { result: text, didTranslate: false };

      setIsTranslating(true);
      try {
        const res = await fetch(`${API_BASE}/translate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            text: text.trim(),
            sourceLang: langDisplayName,
          }),
        });
        if (!res.ok) return { result: text, didTranslate: false };
        const data = await res.json();
        return {
          result: data.translated || text,
          didTranslate: data.wasTranslated || false,
        };
      } catch {
        return { result: text, didTranslate: false };
      } finally {
        setIsTranslating(false);
      }
    },
    [token, langDisplayName]
  );

  // ── Launch recognition session ──
  const launchSession = useCallback(() => {
    if (!SpeechRecognition) return;
    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = userLang; // Recognize in user's native language
    rec.maxAlternatives = 1;

    rec.onresult = (e) => {
      let t = '';
      for (let i = 0; i < e.results.length; i++)
        t += e.results[i][0].transcript;
      voiceCapturedRef.current = t;
      const parts = [baseTextRef.current, prevSessionsRef.current, t].filter(
        Boolean
      );
      setInput(parts.join(' ').replace(/  +/g, ' '));
    };

    rec.onend = () => {
      if (manualStopRef.current) {
        setIsListening(false);
        recognitionRef.current = null;
        return;
      }
      // Accumulate across auto-restart sessions
      setInput((c) => {
        const b = baseTextRef.current;
        prevSessionsRef.current = b ? c.slice(b.length).trim() : c.trim();
        return c;
      });
      setTimeout(() => {
        if (!manualStopRef.current)
          try {
            launchSession();
          } catch {
            setIsListening(false);
          }
      }, 80);
    };

    rec.onerror = (e) => {
      if (['no-speech', 'aborted'].includes(e.error)) return;
      if (e.error === 'not-allowed') {
        manualStopRef.current = true;
        setIsListening(false);
      }
    };

    recognitionRef.current = rec;
    try {
      rec.start();
    } catch {
      setIsListening(false);
    }
  }, [setInput, userLang]);

  // ── Start listening ──
  const startListening = useCallback(() => {
    if (!SpeechRecognition || isListening) return;
    manualStopRef.current = false;
    prevSessionsRef.current = '';
    voiceCapturedRef.current = '';
    setTranslatedFrom(null);
    setInput((c) => {
      baseTextRef.current = c || '';
      return c;
    });
    setIsListening(true);
    launchSession();
  }, [isListening, setInput, launchSession]);

  // ── Stop listening + auto-translate ──
  const stopListening = useCallback(async () => {
    manualStopRef.current = true;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch { }
      recognitionRef.current = null;
    }
    setIsListening(false);

    // ── Auto-translate the voice-captured portion to English ──
    const captured = voiceCapturedRef.current;
    const accumulated = prevSessionsRef.current;
    const voiceText = [accumulated, captured].filter(Boolean).join(' ').trim();

    if (voiceText && isNonEnglish) {
      const { result, didTranslate } = await translateToEnglish(voiceText);
      if (didTranslate) {
        const base = baseTextRef.current;
        const newInput = base
          ? `${base} ${result}`.replace(/  +/g, ' ')
          : result;
        setInput(newInput);
        setTranslatedFrom(langDisplayName);
        // Auto-clear the "translated from" badge after 4 seconds
        setTimeout(() => setTranslatedFrom(null), 4000);
      }
    }
  }, [isNonEnglish, translateToEnglish, setInput, langDisplayName]);

  // ── Toggle ──
  const toggleListening = useCallback(() => {
    isListening ? stopListening() : startListening();
  }, [isListening, startListening, stopListening]);

  // ── Cleanup on unmount ──
  useEffect(
    () => () => {
      manualStopRef.current = true;
      if (recognitionRef.current)
        try {
          recognitionRef.current.stop();
        } catch { }
    },
    []
  );

  return {
    isListening,
    isTranslating,
    isSupported,
    translatedFrom,
    toggleListening,
    stopListening,
  };
};
// ============================================
// PROMPT ENHANCER HOOK — ultimate version
// ============================================
const usePromptEnhancer = (token) => {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhanceError, setEnhanceError] = useState(null);

  const enhancePrompt = useCallback(
    async (prompt, mode) => {
      if (!prompt.trim() || !token) return null;
      setIsEnhancing(true);
      setEnhanceError(null);
      try {
        const res = await fetch(`${API_BASE}/enhance`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ prompt: prompt.trim(), mode }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || 'Enhancement failed');
        }
        const data = await res.json();
        return data.enhanced || null;
      } catch (err) {
        console.error('Enhance error:', err);
        setEnhanceError(err.message);
        setTimeout(() => setEnhanceError(null), 3000);
        return null;
      } finally {
        setIsEnhancing(false);
      }
    },
    [token]
  );

  return { enhancePrompt, isEnhancing, enhanceError };
};

// ============================================
// RENAME COMPONENT — memoized
// ============================================
const ConvoTitle = memo(({ title, convoId, token, onRenamed }) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(title);
  const inputRef = useRef(null);

  useEffect(() => { setValue(title); }, [title]);
  useEffect(() => { if (editing && inputRef.current) inputRef.current.focus(); }, [editing]);

  const save = useCallback(async () => {
    const t = value.trim();
    if (!t || t === title) { setEditing(false); setValue(title); return; }
    try {
      const res = await fetch(`${API_BASE}/conversations/${convoId}/rename`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title: t }),
      });
      if (res.ok) onRenamed(convoId, t);
    } catch { }
    setEditing(false);
  }, [value, title, convoId, token, onRenamed]);

  if (editing) {
    return (
      <input ref={inputRef} className="nc-convo-rename-input" value={value}
        onChange={(e) => setValue(e.target.value)} onBlur={save}
        onKeyDown={(e) => { if (e.key === 'Enter') save(); if (e.key === 'Escape') { setValue(title); setEditing(false); } }}
        onClick={(e) => e.stopPropagation()} maxLength={60} />
    );
  }
  return (
    <span className="nc-convo-title" onDoubleClick={(e) => { e.stopPropagation(); setEditing(true); }}
      title="Double-click to rename">{title}</span>
  );
});

// ============================================
// MAIN CHAT COMPONENT
// ============================================
const Chat = () => {
  const { user, token, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('normal');
  const [isStreaming, setIsStreaming] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentModel, setCurrentModel] = useState('');
  const [loadingConvos, setLoadingConvos] = useState(true);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const chatEndRef = useRef(null);
  const messagesRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const abortRef = useRef(null);
  const lastPromptRef = useRef('');
  const lastImageRef = useRef(null);

  const streamContentRef = useRef('');
  const streamModelRef = useRef('');
  const rafRef = useRef(null);

  const {
    isListening,
    isTranslating,
    isSupported: voiceSupported,
    translatedFrom,
    toggleListening,
    stopListening,
  } = useVoiceInput(setInput, token);

  const { enhancePrompt, isEnhancing, enhanceError } = usePromptEnhancer(token);

  useEffect(() => { if (!isAuthenticated) navigate('/login'); }, [isAuthenticated, navigate]);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    setSidebarOpen(mq.matches);
    const h = (e) => setSidebarOpen(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);

  useEffect(() => {
    const el = messagesRef.current;
    if (!el) return;
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const dist = el.scrollHeight - el.scrollTop - el.clientHeight;
        setShowScrollBtn(dist > 200);
        ticking = false;
      });
    };
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  const loadConversations = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/conversations`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) { const data = await res.json(); setConversations(data.conversations || []); }
    } catch { } finally { setLoadingConvos(false); }
  }, [token]);

  useEffect(() => { if (token) loadConversations(); }, [token, loadConversations]);

  const loadConversation = useCallback(async (id) => {
    try {
      const res = await fetch(`${API_BASE}/conversations/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) { const d = await res.json(); setMessages(d.conversation.messages || []); setActiveId(id); setMode(d.conversation.lastMode || 'normal'); }
    } catch { }
    if (window.innerWidth < 1024) setSidebarOpen(false);
  }, [token]);

  const handleNewChat = useCallback(() => {
    setActiveId(null); setMessages([]); setInput(''); setUploadedImage(null); setCurrentModel('');
    if (window.innerWidth < 1024) setSidebarOpen(false);
  }, []);

  const handleDeleteConvo = useCallback(async (id, e) => {
    e.stopPropagation();
    try { await fetch(`${API_BASE}/conversations/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }); } catch { }
    setConversations((p) => p.filter((c) => c._id !== id));
    if (activeId === id) handleNewChat();
  }, [token, activeId, handleNewChat]);

  const handleRenamed = useCallback((id, t) => {
    setConversations((p) => p.map((c) => c._id === id ? { ...c, title: t } : c));
  }, []);

  const handleClearChat = useCallback(() => {
    if (isStreaming) return;
    setMessages([]); setInput(''); setUploadedImage(null); setCurrentModel('');
  }, [isStreaming]);

  const scrollToBottom = useCallback((force = false) => {
    if (force) { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); return; }
    const el = messagesRef.current;
    if (!el) return;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 300) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight, 180) + 'px';
    });
  }, [input]);

  const handleImageUpload = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { alert('Image must be under 10MB'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => setUploadedImage(ev.target.result);
    reader.readAsDataURL(file);
    e.target.value = '';
  }, []);

  const handleStop = useCallback(() => {
    if (abortRef.current) { abortRef.current.abort(); abortRef.current = null; }
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    setIsStreaming(false); stopListening();
    setInput(lastPromptRef.current); setUploadedImage(lastImageRef.current);
    setMessages((p) => {
      const c = [...p];
      if (c.length && c[c.length - 1].role === 'assistant') c.pop();
      if (c.length && c[c.length - 1].role === 'user') c.pop();
      return c;
    });
  }, [stopListening]);

  const flushStreamContent = useCallback(() => {
    const content = streamContentRef.current;
    const model = streamModelRef.current;
    setMessages((p) => {
      const u = [...p];
      if (u.length) {
        u[u.length - 1] = { ...u[u.length - 1], content, model };
      }
      return u;
    });
  }, []);

  const scheduleFlush = useCallback(() => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      flushStreamContent();
    });
  }, [flushStreamContent]);

  const handleSend = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed && !uploadedImage) return;
    if (isStreaming) return;

    stopListening();
    lastPromptRef.current = trimmed;
    lastImageRef.current = uploadedImage;
    streamContentRef.current = '';
    streamModelRef.current = '';

    setMessages((p) => [
      ...p,
      { role: 'user', content: trimmed, mode, imageUrl: uploadedImage || '', timestamp: new Date().toISOString() },
      { role: 'assistant', content: '', mode, model: '', timestamp: new Date().toISOString(), isStreaming: true },
    ]);
    setInput(''); setUploadedImage(null); setIsStreaming(true); setCurrentModel('');

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch(`${API_BASE}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ conversationId: activeId, prompt: trimmed, mode, image: uploadedImage || null }),
        signal: controller.signal,
      });

      if (!res.ok) throw new Error('Failed');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let newConvoId = activeId;
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const t = line.trim();
          if (!t.startsWith('data: ')) continue;

          try {
            const data = JSON.parse(t.slice(6));

            if (data.type === 'routing') {
              setMessages((p) => {
                const u = [...p];
                if (u.length && u[u.length - 1].role === 'assistant') {
                  u[u.length - 1] = { ...u[u.length - 1], content: '🧭 Analyzing your prompt...' };
                }
                return u;
              });

            } else if (data.type === 'searching') {
              setMessages((p) => {
                const u = [...p];
                if (u.length && u[u.length - 1].role === 'assistant') {
                  u[u.length - 1] = {
                    ...u[u.length - 1],
                    content: `🔍 Searching the web for: "${data.query?.slice(0, 60) || '...'}"`,
                  };
                }
                return u;
              });

            } else if (data.type === 'searchDone') {
              streamContentRef.current = '';
              setMessages((p) => {
                const u = [...p];
                if (u.length) {
                  u[u.length - 1] = {
                    ...u[u.length - 1],
                    content: data.hasResults ? '' : '',
                  };
                }
                return u;
              });

            } else if (data.type === 'model') {
              streamModelRef.current = data.modelId || data.model;
              setCurrentModel(streamModelRef.current);
              if (data.routedBy === 'ai') {
                streamContentRef.current = '';
                setMessages((p) => {
                  const u = [...p];
                  if (u.length) u[u.length - 1] = { ...u[u.length - 1], content: '' };
                  return u;
                });
              }

            } else if (data.type === 'clear') {
              streamContentRef.current = '';
              flushStreamContent();

            } else if (data.type === 'token') {
              streamContentRef.current += data.token;
              scheduleFlush();

            } else if (data.type === 'image') {
              setMessages((p) => {
                const u = [...p];
                u[u.length - 1] = { ...u[u.length - 1], content: 'Here is your generated image:', imageUrl: data.imageUrl, model: streamModelRef.current };
                return u;
              });

            } else if (data.type === 'done') {
              newConvoId = data.conversationId || newConvoId;

            } else if (data.type === 'error') {
              setMessages((p) => {
                const u = [...p];
                u[u.length - 1] = { ...u[u.length - 1], content: data.message || 'An error occurred.', isError: true };
                return u;
              });
            }
          } catch { }
        }
      }

      if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
      flushStreamContent();

      setMessages((p) => {
        const u = [...p];
        if (u.length) u[u.length - 1] = { ...u[u.length - 1], isStreaming: false };
        return u;
      });
      if (newConvoId) setActiveId(newConvoId);
      loadConversations();
    } catch (err) {
      if (err.name === 'AbortError') return;
      setMessages((p) => {
        const u = [...p];
        if (u.length) u[u.length - 1] = { ...u[u.length - 1], content: 'Sorry, something went wrong.', isError: true, isStreaming: false };
        return u;
      });
    } finally {
      setIsStreaming(false); abortRef.current = null;
      if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    }
  }, [input, uploadedImage, mode, isStreaming, activeId, token, loadConversations, stopListening, flushStreamContent, scheduleFlush]);

  const handleRegenerate = useCallback(() => {
    if (isStreaming) return;
    const idx = messages.map((m) => m.role).lastIndexOf('user');
    if (idx === -1) return;
    setInput(messages[idx].content);
    setUploadedImage(messages[idx].imageUrl || null);
    setMessages((p) => p.slice(0, idx));
    setTimeout(() => textareaRef.current?.focus(), 50);
  }, [messages, isStreaming]);

  const handleEnhance = useCallback(async () => {
    if (!input.trim() || isEnhancing || isStreaming) return;
    const enhanced = await enhancePrompt(input, mode);
    if (enhanced) {
      setInput(enhanced);
      setTimeout(() => { const el = textareaRef.current; if (el) { el.focus(); el.selectionStart = el.selectionEnd = enhanced.length; } }, 50);
    }
  }, [input, mode, isEnhancing, isStreaming, enhancePrompt]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  }, [handleSend]);

  useEffect(() => {
    const handler = (e) => {
      const mod = e.ctrlKey || e.metaKey;
      if (mod && e.key === 'n') { e.preventDefault(); handleNewChat(); }
      if (mod && e.shiftKey && (e.key === 'S' || e.key === 's')) { e.preventDefault(); setSidebarOpen((p) => !p); }
      if (mod && e.shiftKey && (e.key === 'E' || e.key === 'e')) { e.preventDefault(); handleEnhance(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleNewChat, handleEnhance]);

  const isEmpty = messages.length === 0;
  const charCount = input.length;
  const showEnhance = input.trim().length > 3;

  return (
    <div className="nc-page">
      <aside className={`nc-sidebar ${sidebarOpen ? 'nc-sidebar--open' : ''}`}>
        <div className="nc-sidebar-header">
          <button className="nc-new-chat-btn" onClick={handleNewChat}><Icons.Plus /><span>New Chat</span></button>
          {messages.length > 0 && <button className="nc-clear-btn" onClick={handleClearChat} title="Clear chat" disabled={isStreaming}><Icons.Eraser /></button>}
          <button className="nc-sidebar-close" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar"><Icons.X /></button>
        </div>
        <div className="nc-sidebar-list">
          {loadingConvos ? <div className="nc-sidebar-loading"><TypingDots /></div>
            : conversations.length === 0 ? <div className="nc-sidebar-empty"><Icons.MessageCircle /><span>No conversations yet</span></div>
              : conversations.map((c) => (
                <button key={c._id} className={`nc-convo-item ${activeId === c._id ? 'nc-convo-item--active' : ''}`} onClick={() => loadConversation(c._id)}>
                  <div className="nc-convo-info">
                    <ConvoTitle title={c.title} convoId={c._id} token={token} onRenamed={handleRenamed} />
                    <span className="nc-convo-date">{formatDate(c.updatedAt)}</span>
                  </div>
                  <div className="nc-convo-actions-right">
                    <button className="nc-convo-delete" onClick={(e) => handleDeleteConvo(c._id, e)} aria-label="Delete"><Icons.Trash /></button>
                  </div>
                </button>
              ))}
        </div>
        <div className="nc-sidebar-footer">
          <button className="nc-home-sidebar-btn" onClick={() => navigate('/')}><Icons.Home /><span>Back to Home</span></button>
        </div>
      </aside>

      {sidebarOpen && <div className="nc-sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      <main className="nc-main">
        <div className="nc-top-bar">
          {!sidebarOpen && <button className="nc-float-btn" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar" title="Sidebar (Ctrl+Shift+S)"><Icons.Sidebar /></button>}
          <button className="nc-float-btn nc-home-btn" onClick={() => navigate('/')} title="Home"><Icons.Home /></button>
          {currentModel && <div className="nc-model-indicator"><Icons.Sparkles /><span>{currentModel.split('/').pop()}</span></div>}
        </div>

        <div className="nc-messages" ref={messagesRef}>
          {isEmpty ? (
            <div className="nc-empty">
              <div className="nc-empty-orb"><div className="nc-empty-orb-core" /><div className="nc-empty-orb-ring nc-empty-orb-ring--1" /><div className="nc-empty-orb-ring nc-empty-orb-ring--2" /></div>
              <h2 className="nc-empty-title">{getGreeting()}{user?.name ? `, ${user.name.split(' ')[0]}` : ''}!</h2>
              <p className="nc-empty-desc">Choose a mode and start chatting with Nethra AI</p>
              <div className="nc-empty-suggestions">
                {['Explain quantum computing simply', 'Write a Python sorting algorithm', 'Analyze pros and cons of remote work', 'Generate an image of a futuristic city'].map((s, i) => (
                  <button key={i} className="nc-suggestion" onClick={() => { setInput(s); textareaRef.current?.focus(); }}>{s}</button>
                ))}
              </div>
            </div>
          ) : messages.map((msg, idx) => (
            <MessageBubble key={msg._id || idx} msg={msg} isLast={idx === messages.length - 1 && msg.role === 'assistant'} onRegenerate={handleRegenerate} />
          ))}
          <div ref={chatEndRef} />
        </div>

        {showScrollBtn && <button className="nc-scroll-bottom" onClick={() => scrollToBottom(true)} title="Scroll to bottom"><Icons.ArrowDown /></button>}

        <div className="nc-input-area">
          {uploadedImage && (
            <div className="nc-image-preview">
              <img src={uploadedImage} alt="Upload preview" />
              <button
                className="nc-image-preview-remove"
                onClick={() => setUploadedImage(null)}
              >
                <Icons.X />
              </button>
            </div>
          )}

          {/* Voice listening indicator */}
          {isListening && (
            <div className="nc-voice-indicator">
              <div className="nc-voice-bars">
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
              <span className="nc-voice-label">
                Listening — speak now...
              </span>
              <button
                className="nc-voice-stop"
                onClick={toggleListening}
                type="button"
              >
                Stop
              </button>
            </div>
          )}

          {/* Translating indicator */}
          {isTranslating && (
            <div className="nc-translate-indicator">
              <div className="nc-translate-spinner" />
              <span>Translating to English...</span>
            </div>
          )}

          {/* Translated-from badge */}
          {translatedFrom && !isTranslating && (
            <div className="nc-translated-badge">
              <span>✓ Translated from {translatedFrom}</span>
            </div>
          )}

          {/* Enhance error toast */}
          {enhanceError && (
            <div className="nc-enhance-error">
              <span>⚠ {enhanceError}</span>
            </div>
          )}

          <div className="nc-input-row">
            {mode === 'image' && (
              <>
                <button
                  className="nc-input-icon-btn nc-upload-btn"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isStreaming}
                  title="Upload image"
                  type="button"
                >
                  <Icons.Image />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="nc-file-input"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </>
            )}

            {voiceSupported && (
              <button
                className={`nc-input-icon-btn nc-mic-btn ${isListening ? 'nc-mic-btn--active' : ''
                  } ${isTranslating ? 'nc-mic-btn--translating' : ''}`}
                onClick={toggleListening}
                disabled={isStreaming || isTranslating}
                title={
                  isTranslating
                    ? 'Translating...'
                    : isListening
                      ? 'Stop listening'
                      : 'Voice input (auto-translates to English)'
                }
                type="button"
              >
                {isTranslating ? (
                  <div className="nc-mic-spinner" />
                ) : isListening ? (
                  <Icons.MicOff />
                ) : (
                  <Icons.Mic />
                )}
              </button>
            )}

            <textarea
              ref={textareaRef}
              className="nc-textarea"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isTranslating
                  ? 'Translating to English...'
                  : isListening
                    ? 'Listening...'
                    : mode === 'image'
                      ? 'Describe an image to generate, or upload to analyze...'
                      : 'Message Nethra...'
              }
              rows={1}
              disabled={isStreaming || isEnhancing || isTranslating}
            />

            {showEnhance && (
              <button
                className={`nc-enhance-btn ${isEnhancing ? 'nc-enhance-btn--loading' : ''
                  }`}
                onClick={handleEnhance}
                disabled={isEnhancing || isStreaming || isTranslating}
                title="Enhance prompt with AI (Ctrl+Shift+E)"
                type="button"
              >
                {isEnhancing ? (
                  <div className="nc-enhance-spinner" />
                ) : (
                  <Icons.Wand />
                )}
                <span className="nc-enhance-label">
                  {isEnhancing ? 'Enhancing...' : 'Enhance'}
                </span>
              </button>
            )}

            <ModeSelector mode={mode} setMode={setMode} disabled={isStreaming} />

            {isStreaming ? (
              <button
                className="nc-stop-btn"
                onClick={handleStop}
                title="Stop"
                type="button"
              >
                <Icons.Stop />
              </button>
            ) : (
              <button
                className="nc-send-btn"
                onClick={handleSend}
                disabled={
                  (!input.trim() && !uploadedImage) || isTranslating
                }
                title="Send (Enter)"
                type="button"
              >
                <Icons.Send />
              </button>
            )}
          </div>

          {charCount > 50 && (
            <div className="nc-char-count">
              <span
                className={
                  charCount > 4000 ? 'nc-char-count--warn' : ''
                }
              >
                {charCount.toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Chat;