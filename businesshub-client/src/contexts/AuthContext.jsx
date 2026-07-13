// Authentication context: holds the current session and exposes login /
// register / logout. On mount it restores a session from a stored token by
// calling /me, so a page refresh keeps the user signed in.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { getToken, setToken, clearToken } from "../services/api.js";
import * as authService from "../services/auth.service.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  // "loading" until the initial session restore resolves.
  const [status, setStatus] = useState("loading");

  const clearSession = useCallback(() => {
    clearToken();
    setUser(null);
    setRoles([]);
    setPermissions([]);
    setStatus("unauthenticated");
  }, []);

  const applySession = useCallback(({ user, roles, permissions, token }) => {
    if (token) setToken(token);
    setUser(user);
    setRoles(roles || []);
    setPermissions(permissions || []);
    setStatus("authenticated");
  }, []);

  // Restore an existing session on first load.
  useEffect(() => {
    let active = true;
    if (!getToken()) {
      setStatus("unauthenticated");
      return;
    }
    authService
      .getMe()
      .then((profile) => {
        if (active) applySession(profile);
      })
      .catch(() => {
        if (active) clearSession();
      });
    return () => {
      active = false;
    };
  }, [applySession, clearSession]);

  // The API layer emits this when a request is rejected with 401.
  useEffect(() => {
    const handler = () => clearSession();
    window.addEventListener("auth:unauthorized", handler);
    return () => window.removeEventListener("auth:unauthorized", handler);
  }, [clearSession]);

  const login = useCallback(
    async (email, password) => {
      const session = await authService.login(email, password);
      applySession(session);
      return session;
    },
    [applySession]
  );

  const register = useCallback(
    async (payload) => {
      const session = await authService.register(payload);
      applySession(session);
      return session;
    },
    [applySession]
  );

  const value = {
    user,
    roles,
    permissions,
    status,
    isAuthenticated: status === "authenticated",
    login,
    register,
    logout: clearSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
