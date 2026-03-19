import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';

const API_BASE = (() => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL)
      return import.meta.env.VITE_API_URL;
  } catch (e) {}
  return 'http://localhost:5000/api/auth';
})();

const AuthContext = createContext(null);

// ============================================
// FETCH WITH TIMEOUT — prevents infinite spinning
// ============================================
const fetchWithTimeout = async (url, options = {}, timeoutMs = 15000) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
};

// ============================================
// AUTH PROVIDER
// ============================================
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('nethra_token'));
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && !!token;

  // ---- Helpers ----
  const setAuthData = useCallback((userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
    localStorage.setItem('nethra_token', tokenData);
    localStorage.setItem('nethra_user', JSON.stringify(userData));
  }, []);

  const clearAuthData = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('nethra_token');
    localStorage.removeItem('nethra_user');
  }, []);

  // ---- Build auth headers ----
  const getHeaders = useCallback(
    () => ({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token || localStorage.getItem('nethra_token') || ''}`,
    }),
    [token]
  );

  // ============================================
  // VERIFY TOKEN ON MOUNT — FIXED
  // Only logs out on 401 (invalid/expired token)
  // Does NOT log out on 500 or network errors
  // ============================================
  useEffect(() => {
    const verify = async () => {
      const storedToken = localStorage.getItem('nethra_token');

      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetchWithTimeout(
          `${API_BASE}/me`,
          { headers: { Authorization: `Bearer ${storedToken}` } },
          10000
        );

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setToken(storedToken);
        } else if (res.status === 401) {
          // Token is invalid or expired — ONLY case where we log out
          console.warn('Token expired or invalid, logging out');
          clearAuthData();
        } else {
          // Server error (500, etc.) — DON'T log out, use cached data
          console.warn(`Server returned ${res.status}, using cached user data`);
          const cached = localStorage.getItem('nethra_user');
          if (cached) {
            try {
              setUser(JSON.parse(cached));
              setToken(storedToken);
            } catch {
              // Corrupted cache — log out
              clearAuthData();
            }
          }
        }
      } catch (error) {
        // Network error / timeout — server might be down
        // DON'T log out — use cached data instead
        console.warn('Cannot reach server, using cached data:', error.message);
        const cached = localStorage.getItem('nethra_user');
        if (cached) {
          try {
            setUser(JSON.parse(cached));
            setToken(storedToken);
          } catch {
            clearAuthData();
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    verify();
  }, [clearAuthData]);

  // ---- Login ----
  const login = useCallback(
    async (email, password) => {
      const res = await fetchWithTimeout(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      setAuthData(data.user, data.token);
      return data;
    },
    [setAuthData]
  );

  // ---- Signup ----
  const signup = useCallback(
    async (name, email, password) => {
      const res = await fetchWithTimeout(`${API_BASE}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Signup failed');
      setAuthData(data.user, data.token);
      return data;
    },
    [setAuthData]
  );

  // ---- Logout ----
  const logout = useCallback(() => {
    clearAuthData();
  }, [clearAuthData]);

  // ---- Update Profile ----
  const updateProfile = useCallback(
    async (updates) => {
      const currentToken = token || localStorage.getItem('nethra_token');
      if (!currentToken) throw new Error('Not authenticated');

      const res = await fetchWithTimeout(`${API_BASE}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentToken}`,
        },
        body: JSON.stringify(updates),
      });

      const data = await res.json();

      if (res.status === 401) {
        clearAuthData();
        throw new Error('Session expired. Please log in again.');
      }

      if (!res.ok) throw new Error(data.message || 'Update failed');

      setUser(data.user);
      localStorage.setItem('nethra_user', JSON.stringify(data.user));
      return data;
    },
    [token, clearAuthData]
  );

  // ---- Get Preferences ----
  const getPreferences = useCallback(async () => {
    const currentToken = token || localStorage.getItem('nethra_token');
    if (!currentToken) throw new Error('Not authenticated');

    const res = await fetchWithTimeout(`${API_BASE}/preferences`, {
      headers: { Authorization: `Bearer ${currentToken}` },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to load preferences');
    return data.preferences;
  }, [token]);

  // ---- Update Preferences ----
  const updatePreferences = useCallback(
    async (prefs) => {
      const currentToken = token || localStorage.getItem('nethra_token');
      if (!currentToken) throw new Error('Not authenticated');

      const res = await fetchWithTimeout(`${API_BASE}/preferences`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentToken}`,
        },
        body: JSON.stringify(prefs),
      });

      const data = await res.json();

      if (res.status === 401) {
        clearAuthData();
        throw new Error('Session expired. Please log in again.');
      }

      if (!res.ok) throw new Error(data.message || 'Failed to save preferences');

      // Update user.preferences in state
      setUser((prev) => {
        if (!prev) return prev;
        const updated = { ...prev, preferences: { ...prev.preferences, ...data.preferences } };
        localStorage.setItem('nethra_user', JSON.stringify(updated));
        return updated;
      });

      return data;
    },
    [token, clearAuthData]
  );

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated,
      isLoading,
      login,
      signup,
      logout,
      updateProfile,
      getPreferences,
      updatePreferences,
    }),
    [user, token, isAuthenticated, isLoading, login, signup, logout,
     updateProfile, getPreferences, updatePreferences]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;