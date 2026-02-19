import { createContext, useContext, useEffect, useMemo, useState } from "react";
import apiClient from "../utils/apiClient.js";

const AuthContext = createContext(null);

const STORAGE_KEY = "micro_marketplace_auth";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed.user || null);
        setToken(parsed.token || null);
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }

    setIsReady(true);
  }, []);

  useEffect(() => {
    if (token) {
      apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete apiClient.defaults.headers.common.Authorization;
    }
  }, [token]);

  const login = (nextUser, nextToken) => {
    setUser(nextUser);
    setToken(nextToken);
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ user: nextUser, token: nextToken }),
    );
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    window.localStorage.removeItem(STORAGE_KEY);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      isReady,
      login,
      logout,
    }),
    [user, token, isReady],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return ctx;
};
