import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../Style/Settings.css';

// ============================================
// API BASE
// ============================================
const API_BASE = (() => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL)
      return import.meta.env.VITE_API_URL;
  } catch (e) {}
  return 'http://localhost:5000/api/auth';
})();

// ============================================
// ICONS (same as before)
// ============================================
const Icons = {
  User: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
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
  Shield: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
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
  AlertTriangle: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  Settings: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  ),
  Trash: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  ),
  Save: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" />
    </svg>
  ),
  ArrowLeft: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
    </svg>
  ),
  Bell: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  ),
  Moon: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  ),
  Globe: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </svg>
  ),
  Download: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  Loader: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="nethra-settings-spinner-svg">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  ),
  Calendar: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  Key: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
    </svg>
  ),
};

// ============================================
// SUB-COMPONENTS
// ============================================
const Toast = ({ message, type, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`nethra-settings-toast nethra-settings-toast--${type}`}>
      <div className="nethra-settings-toast-icon">{type === 'success' ? <Icons.Check /> : <Icons.AlertCircle />}</div>
      <span className="nethra-settings-toast-msg">{message}</span>
      <button className="nethra-settings-toast-close" onClick={onClose} aria-label="Close">×</button>
    </div>
  );
};

const ToggleSwitch = ({ checked, onChange, label, description, saving }) => (
  <div className="nethra-settings-toggle-row">
    <div className="nethra-settings-toggle-info">
      <span className="nethra-settings-toggle-label">{label}</span>
      {description && <span className="nethra-settings-toggle-desc">{description}</span>}
    </div>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className={`nethra-settings-toggle ${checked ? 'nethra-settings-toggle--on' : ''} ${saving ? 'nethra-settings-toggle--saving' : ''}`}
      onClick={() => onChange(!checked)}
      disabled={saving}
    >
      <span className="nethra-settings-toggle-thumb" />
    </button>
  </div>
);

const PasswordInput = ({ label, name, value, onChange, placeholder, error }) => {
  const [show, setShow] = useState(false);
  return (
    <div className={`nethra-settings-field ${error ? 'nethra-settings-field--error' : ''}`}>
      <label className="nethra-settings-label" htmlFor={name}>{label}</label>
      <div className="nethra-settings-input-wrap">
        <div className="nethra-settings-input-icon"><Icons.Lock /></div>
        <input id={name} name={name} type={show ? 'text' : 'password'} value={value} onChange={onChange}
          placeholder={placeholder} className="nethra-settings-input" autoComplete="off" />
        <button type="button" className="nethra-settings-input-toggle" onClick={() => setShow(!show)}
          aria-label={show ? 'Hide' : 'Show'} tabIndex={-1}>
          {show ? <Icons.EyeOff /> : <Icons.Eye />}
        </button>
      </div>
      {error && <span className="nethra-settings-error" role="alert"><Icons.AlertCircle />{error}</span>}
    </div>
  );
};

const sectionNav = [
  { id: 'profile', label: 'Profile', icon: Icons.User },
  { id: 'security', label: 'Security', icon: Icons.Shield },
  { id: 'preferences', label: 'Preferences', icon: Icons.Settings },
  { id: 'danger', label: 'Danger Zone', icon: Icons.AlertTriangle },
];

// ============================================
// DEFAULT PREFERENCES (fallback)
// ============================================
const DEFAULT_PREFS = {
  emailNotifications: true,
  chatSounds: true,
  darkMode: true,
  language: 'en',
  saveHistory: true,
  showOnlineStatus: true,
};

// ============================================
// MAIN COMPONENT
// ============================================
const Settings = () => {
  const { user, token, logout, updateProfile, updatePreferences, getPreferences } = useAuth();
  const navigate = useNavigate();

  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');
  const [toast, setToast] = useState(null);

  // Profile
  const [profileData, setProfileData] = useState({ name: '', email: '' });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileErrors, setProfileErrors] = useState({});
  const [profileDirty, setProfileDirty] = useState(false);

  // Password
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({});

  // Preferences — initialized from user or defaults
  const [prefs, setPrefs] = useState(() => ({
    ...DEFAULT_PREFS,
    ...(user?.preferences || {}),
  }));
  const [prefsSaving, setPrefsSaving] = useState(false);
  const [prefsLoaded, setPrefsLoaded] = useState(false);

  // Delete
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const sectionRefs = useRef({});
  const prefsSaveTimer = useRef(null);

  // ---- Mount ----
  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  // ---- Sync profile data from user ----
  useEffect(() => {
    if (user) {
      setProfileData({ name: user.name || '', email: user.email || '' });
    }
  }, [user]);

  // ---- Load preferences from backend on mount ----
  useEffect(() => {
    if (!token || prefsLoaded) return;

    const loadPrefs = async () => {
      try {
        const serverPrefs = await getPreferences();
        setPrefs((current) => ({
          ...DEFAULT_PREFS,
          ...current,
          ...serverPrefs,
        }));
      } catch (err) {
        console.error('Failed to load preferences:', err);
        // Use user object fallback
        if (user?.preferences) {
          setPrefs((current) => ({ ...current, ...user.preferences }));
        }
      } finally {
        setPrefsLoaded(true);
      }
    };

    loadPrefs();
  }, [token, getPreferences, prefsLoaded, user]);

  // ---- Track profile dirty state ----
  useEffect(() => {
    if (user) {
      setProfileDirty(profileData.name !== user.name || profileData.email !== user.email);
    }
  }, [profileData, user]);

  // ---- Auto-save preferences (debounced) ----
  const savePref = useCallback(
    async (key, value) => {
      setPrefsSaving(true);
      try {
        await updatePreferences({ [key]: value });
      } catch (err) {
        setToast({ type: 'error', message: `Failed to save: ${err.message}` });
        // Revert on failure
        setPrefs((prev) => {
          const reverted = { ...prev };
          if (user?.preferences?.[key] !== undefined) {
            reverted[key] = user.preferences[key];
          } else {
            reverted[key] = DEFAULT_PREFS[key];
          }
          return reverted;
        });
      } finally {
        setPrefsSaving(false);
      }
    },
    [updatePreferences, user]
  );

  const handlePrefChange = useCallback(
    (key, value) => {
      setPrefs((prev) => ({ ...prev, [key]: value }));

      // Debounce save
      if (prefsSaveTimer.current) clearTimeout(prefsSaveTimer.current);
      prefsSaveTimer.current = setTimeout(() => savePref(key, value), 500);
    },
    [savePref]
  );

  // ---- Cleanup debounce timer ----
  useEffect(() => {
    return () => {
      if (prefsSaveTimer.current) clearTimeout(prefsSaveTimer.current);
    };
  }, []);

  // Scroll to section
  const scrollToSection = useCallback((id) => {
    setActiveSection(id);
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  // ---- Profile handlers ----
  const handleProfileChange = useCallback((e) => {
    const { name, value } = e.target;
    setProfileData((p) => ({ ...p, [name]: value }));
    setProfileErrors((p) => { const n = { ...p }; delete n[name]; return n; });
  }, []);

  const handleProfileSave = useCallback(async (e) => {
    e.preventDefault();
    const errs = {};
    if (!profileData.name.trim()) errs.name = 'Name is required';
    else if (profileData.name.trim().length < 2) errs.name = 'Min 2 characters';
    if (!profileData.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) errs.email = 'Invalid email';
    if (Object.keys(errs).length) { setProfileErrors(errs); return; }

    setProfileLoading(true);
    try {
      await updateProfile({ name: profileData.name.trim(), email: profileData.email.trim() });
      setToast({ type: 'success', message: 'Profile updated successfully!' });
      setProfileDirty(false);
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to update profile' });
    } finally {
      setProfileLoading(false);
    }
  }, [profileData, updateProfile]);

  // ---- Password handlers ----
  const handlePasswordChange = useCallback((e) => {
    const { name, value } = e.target;
    setPasswordData((p) => ({ ...p, [name]: value }));
    setPasswordErrors((p) => { const n = { ...p }; delete n[name]; return n; });
  }, []);

  const handlePasswordSave = useCallback(async (e) => {
    e.preventDefault();
    const errs = {};
    if (!passwordData.currentPassword) errs.currentPassword = 'Required';
    if (!passwordData.newPassword) errs.newPassword = 'Required';
    else if (passwordData.newPassword.length < 6) errs.newPassword = 'Min 6 characters';
    if (!passwordData.confirmNewPassword) errs.confirmNewPassword = 'Required';
    else if (passwordData.newPassword !== passwordData.confirmNewPassword) errs.confirmNewPassword = "Passwords don't match";
    if (passwordData.currentPassword && passwordData.newPassword && passwordData.currentPassword === passwordData.newPassword) errs.newPassword = 'Must be different from current';
    if (Object.keys(errs).length) { setPasswordErrors(errs); return; }

    setPasswordLoading(true);
    try {
      const res = await fetch(`${API_BASE}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed');
      if (data.token) localStorage.setItem('nethra_token', data.token);
      setToast({ type: 'success', message: 'Password changed successfully!' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to change password' });
    } finally {
      setPasswordLoading(false);
    }
  }, [passwordData, token]);

  // ---- Delete ----
  const handleDeleteAccount = useCallback(async () => {
    if (deleteConfirmText !== 'DELETE') return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`${API_BASE}/account`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ confirmation: 'DELETE' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed');
      setToast({ type: 'success', message: 'Account deleted. Goodbye!' });
      setTimeout(() => { logout(); navigate('/'); }, 1500);
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to delete account' });
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
      setDeleteConfirmText('');
    }
  }, [deleteConfirmText, token, logout, navigate]);

  // ---- Export ----
  const handleExportData = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/export`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed');
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nethra-data-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setToast({ type: 'success', message: 'Data exported successfully!' });
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Export failed' });
    }
  }, [token]);

  const getInitials = (name) => name ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : '?';

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : '—';

  if (!user) return null;

  return (
    <div className={`nethra-settings ${isVisible ? 'nethra-settings--visible' : ''}`}>
      <div className="nethra-settings-bg" aria-hidden="true">
        <div className="nethra-settings-bg-blob nethra-settings-bg-blob--1" />
        <div className="nethra-settings-bg-blob nethra-settings-bg-blob--2" />
        <div className="nethra-settings-bg-noise" />
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="nethra-settings-modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="nethra-settings-modal" onClick={(e) => e.stopPropagation()}>
            <div className="nethra-settings-modal-icon"><Icons.AlertTriangle /></div>
            <h3 className="nethra-settings-modal-title">Delete Account</h3>
            <p className="nethra-settings-modal-desc">
              This action is <strong>permanent</strong> and cannot be undone. All your data, conversations, and settings will be permanently deleted.
            </p>
            <div className="nethra-settings-modal-field">
              <label htmlFor="delete-confirm">Type <strong>DELETE</strong> to confirm</label>
              <input id="delete-confirm" type="text" value={deleteConfirmText} onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="DELETE" className="nethra-settings-input nethra-settings-input--danger" autoComplete="off" />
            </div>
            <div className="nethra-settings-modal-actions">
              <button className="nethra-settings-btn nethra-settings-btn--ghost" onClick={() => { setShowDeleteModal(false); setDeleteConfirmText(''); }}>Cancel</button>
              <button className="nethra-settings-btn nethra-settings-btn--danger" onClick={handleDeleteAccount} disabled={deleteConfirmText !== 'DELETE' || deleteLoading}>
                {deleteLoading ? (<><div className="nethra-settings-spinner"><Icons.Loader /></div><span>Deleting...</span></>) : (<><Icons.Trash /><span>Delete Forever</span></>)}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="nethra-settings-container">
        {/* Header */}
        <div className="nethra-settings-header">
          <button className="nethra-settings-back" onClick={() => navigate(-1)} aria-label="Go back"><Icons.ArrowLeft /></button>
          <div className="nethra-settings-header-info">
            <h1 className="nethra-settings-page-title">Settings</h1>
            <p className="nethra-settings-page-subtitle">Manage your account and preferences</p>
          </div>
        </div>

        <div className="nethra-settings-layout">
          {/* Sidebar */}
          <aside className="nethra-settings-sidebar">
            <div className="nethra-settings-sidebar-profile">
              <div className="nethra-settings-sidebar-avatar">
                {getInitials(user.name)}
                <div className="nethra-settings-sidebar-status" />
              </div>
              <div className="nethra-settings-sidebar-info">
                <span className="nethra-settings-sidebar-name">{user.name}</span>
                <span className="nethra-settings-sidebar-email">{user.email}</span>
              </div>
            </div>
            <nav className="nethra-settings-sidebar-nav">
              {sectionNav.map((item) => (
                <button key={item.id}
                  className={`nethra-settings-sidebar-link ${activeSection === item.id ? 'nethra-settings-sidebar-link--active' : ''} ${item.id === 'danger' ? 'nethra-settings-sidebar-link--danger' : ''}`}
                  onClick={() => scrollToSection(item.id)}>
                  <item.icon /><span>{item.label}</span>
                </button>
              ))}
            </nav>
          </aside>

          {/* Main */}
          <main className="nethra-settings-main">
            {/* ===== PROFILE ===== */}
            <section ref={(el) => (sectionRefs.current.profile = el)} className="nethra-settings-section">
              <div className="nethra-settings-section-header">
                <div className="nethra-settings-section-icon nethra-settings-section-icon--cyan"><Icons.User /></div>
                <div>
                  <h2 className="nethra-settings-section-title">Profile Information</h2>
                  <p className="nethra-settings-section-desc">Update your personal details</p>
                </div>
              </div>
              <div className="nethra-settings-card">
                <div className="nethra-settings-profile-header">
                  <div className="nethra-settings-avatar-large">
                    {getInitials(profileData.name || user.name)}
                    <div className="nethra-settings-avatar-glow" />
                  </div>
                  <div className="nethra-settings-profile-meta">
                    <span className="nethra-settings-profile-display-name">{profileData.name || user.name}</span>
                    <div className="nethra-settings-profile-joined"><Icons.Calendar /><span>Member since {memberSince}</span></div>
                  </div>
                </div>
                <form onSubmit={handleProfileSave} className="nethra-settings-form">
                  <div className={`nethra-settings-field ${profileErrors.name ? 'nethra-settings-field--error' : ''}`}>
                    <label className="nethra-settings-label" htmlFor="profile-name">Full Name</label>
                    <div className="nethra-settings-input-wrap">
                      <div className="nethra-settings-input-icon"><Icons.User /></div>
                      <input id="profile-name" name="name" type="text" value={profileData.name} onChange={handleProfileChange} className="nethra-settings-input" placeholder="Your name" autoComplete="name" />
                    </div>
                    {profileErrors.name && <span className="nethra-settings-error" role="alert"><Icons.AlertCircle />{profileErrors.name}</span>}
                  </div>
                  <div className={`nethra-settings-field ${profileErrors.email ? 'nethra-settings-field--error' : ''}`}>
                    <label className="nethra-settings-label" htmlFor="profile-email">Email Address</label>
                    <div className="nethra-settings-input-wrap">
                      <div className="nethra-settings-input-icon"><Icons.Mail /></div>
                      <input id="profile-email" name="email" type="email" value={profileData.email} onChange={handleProfileChange} className="nethra-settings-input" placeholder="you@example.com" autoComplete="email" />
                    </div>
                    {profileErrors.email && <span className="nethra-settings-error" role="alert"><Icons.AlertCircle />{profileErrors.email}</span>}
                  </div>
                  <div className="nethra-settings-form-actions">
                    <button type="submit" className="nethra-settings-btn nethra-settings-btn--primary" disabled={!profileDirty || profileLoading}>
                      {profileLoading ? (<><div className="nethra-settings-spinner"><Icons.Loader /></div><span>Saving...</span></>) : (<><Icons.Save /><span>Save Changes</span></>)}
                    </button>
                  </div>
                </form>
              </div>
            </section>

            {/* ===== SECURITY ===== */}
            <section ref={(el) => (sectionRefs.current.security = el)} className="nethra-settings-section">
              <div className="nethra-settings-section-header">
                <div className="nethra-settings-section-icon nethra-settings-section-icon--purple"><Icons.Shield /></div>
                <div>
                  <h2 className="nethra-settings-section-title">Security</h2>
                  <p className="nethra-settings-section-desc">Manage your password and security settings</p>
                </div>
              </div>
              <div className="nethra-settings-card">
                <div className="nethra-settings-card-label"><Icons.Key /><span>Change Password</span></div>
                <form onSubmit={handlePasswordSave} className="nethra-settings-form">
                  <PasswordInput label="Current Password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} placeholder="Enter current password" error={passwordErrors.currentPassword} />
                  <PasswordInput label="New Password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} placeholder="Enter new password" error={passwordErrors.newPassword} />
                  <PasswordInput label="Confirm New Password" name="confirmNewPassword" value={passwordData.confirmNewPassword} onChange={handlePasswordChange} placeholder="Confirm new password" error={passwordErrors.confirmNewPassword} />
                  <div className="nethra-settings-form-actions">
                    <button type="submit" className="nethra-settings-btn nethra-settings-btn--primary" disabled={passwordLoading}>
                      {passwordLoading ? (<><div className="nethra-settings-spinner"><Icons.Loader /></div><span>Updating...</span></>) : (<><Icons.Shield /><span>Update Password</span></>)}
                    </button>
                  </div>
                </form>
              </div>
            </section>

            {/* ===== PREFERENCES (NOW SAVES TO BACKEND) ===== */}
            <section ref={(el) => (sectionRefs.current.preferences = el)} className="nethra-settings-section">
              <div className="nethra-settings-section-header">
                <div className="nethra-settings-section-icon nethra-settings-section-icon--cyan"><Icons.Settings /></div>
                <div>
                  <h2 className="nethra-settings-section-title">Preferences</h2>
                  <p className="nethra-settings-section-desc">Customize your Nethra experience {prefsSaving && <span className="nethra-settings-saving-indicator">• Saving...</span>}</p>
                </div>
              </div>

              <div className="nethra-settings-card">
                <div className="nethra-settings-card-label"><Icons.Bell /><span>Notifications</span></div>
                <ToggleSwitch checked={prefs.emailNotifications} onChange={(v) => handlePrefChange('emailNotifications', v)}
                  label="Email Notifications" description="Receive updates and alerts via email" saving={prefsSaving} />
                <ToggleSwitch checked={prefs.chatSounds} onChange={(v) => handlePrefChange('chatSounds', v)}
                  label="Chat Sounds" description="Play sounds for new messages" saving={prefsSaving} />
              </div>

              <div className="nethra-settings-card">
                <div className="nethra-settings-card-label"><Icons.Moon /><span>Appearance</span></div>
                <ToggleSwitch checked={prefs.darkMode} onChange={(v) => handlePrefChange('darkMode', v)}
                  label="Dark Mode" description="Use dark theme throughout the app" saving={prefsSaving} />
                <ToggleSwitch checked={prefs.showOnlineStatus} onChange={(v) => handlePrefChange('showOnlineStatus', v)}
                  label="Show Online Status" description="Let others see when you're online" saving={prefsSaving} />
              </div>

              <div className="nethra-settings-card">
                <div className="nethra-settings-card-label"><Icons.Globe /><span>Language & Data</span></div>
                <div className="nethra-settings-field">
                  <label className="nethra-settings-label" htmlFor="language-select">Language</label>
                  <div className="nethra-settings-select-wrap">
                    <select id="language-select" value={prefs.language} onChange={(e) => handlePrefChange('language', e.target.value)} className="nethra-settings-select">
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                      <option value="ja">日本語</option>
                      <option value="ko">한국어</option>
                      <option value="zh">中文</option>
                      <option value="hi">हिन्दी</option>
                      <option value="ar">العربية</option>
                    </select>
                  </div>
                </div>
                <ToggleSwitch checked={prefs.saveHistory} onChange={(v) => handlePrefChange('saveHistory', v)}
                  label="Save Chat History" description="Store conversation history for future reference" saving={prefsSaving} />
                <div className="nethra-settings-inline-action">
                  <div className="nethra-settings-toggle-info">
                    <span className="nethra-settings-toggle-label">Export Your Data</span>
                    <span className="nethra-settings-toggle-desc">Download all your data as JSON</span>
                  </div>
                  <button type="button" className="nethra-settings-btn nethra-settings-btn--outline" onClick={handleExportData}>
                    <Icons.Download /><span>Export</span>
                  </button>
                </div>
              </div>
            </section>

            {/* ===== DANGER ZONE ===== */}
            <section ref={(el) => (sectionRefs.current.danger = el)} className="nethra-settings-section">
              <div className="nethra-settings-section-header">
                <div className="nethra-settings-section-icon nethra-settings-section-icon--red"><Icons.AlertTriangle /></div>
                <div>
                  <h2 className="nethra-settings-section-title nethra-settings-section-title--danger">Danger Zone</h2>
                  <p className="nethra-settings-section-desc">Irreversible and destructive actions</p>
                </div>
              </div>
              <div className="nethra-settings-card nethra-settings-card--danger">
                <div className="nethra-settings-danger-item">
                  <div className="nethra-settings-danger-info">
                    <strong>Delete Account</strong>
                    <span>Permanently remove your account and all associated data. This action cannot be undone.</span>
                  </div>
                  <button type="button" className="nethra-settings-btn nethra-settings-btn--danger" onClick={() => setShowDeleteModal(true)}>
                    <Icons.Trash /><span>Delete Account</span>
                  </button>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Settings;