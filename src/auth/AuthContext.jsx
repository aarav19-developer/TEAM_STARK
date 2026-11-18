import { createContext, useContext, useState, useCallback } from "react";

const STORAGE_KEY = "sahayak_auth";
const SESSION_KEY = "sahayak_session";

const AuthContext = createContext(null);

/**
 * Reads saved credentials from localStorage.
 * Returns { username, password } or null if not set up yet.
 */
export function getSavedCredentials() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  });

  const [credentials, setCredentials] = useState(() => getSavedCredentials());

  /** First-time setup: saves credentials to localStorage */
  const setupCredentials = useCallback((username, password) => {
    const creds = { username, password };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(creds));
    setCredentials(creds);
  }, []);

  /** Login: validates against stored credentials and sets sessionStorage flag */
  const login = useCallback((username, password) => {
    const saved = getSavedCredentials();
    if (!saved) return { ok: false, error: "No credentials set up yet." };
    if (saved.username === username && saved.password === password) {
      sessionStorage.setItem(SESSION_KEY, "1");
      setIsAuthenticated(true);
      return { ok: true };
    }
    return { ok: false, error: "Incorrect username or password." };
  }, []);

  /** Logout: clears sessionStorage flag */
  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, credentials, setupCredentials, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
