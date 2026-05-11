import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  loginRequest,
  meRequest,
  refreshRequest,
  registerRequest,
  logoutRequest,
  updateProfileRequest
} from "./auth-service";
import { clearAccessToken, getAccessToken, saveAccessToken } from "../../shared/utils/token-storage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    const bootstrap = async () => {
      const existing = getAccessToken();
      if (!existing) {
        setIsReady(true);
        return;
      }

      try {
        const me = await meRequest();
        if (me.success && me.data) {
          setUser(me.data);
        }
      } catch {
        clearAccessToken();
      } finally {
        setIsReady(true);
      }
    };
    bootstrap();
  }, []);

  const login = async (credentials) => {
    setAuthError("");
    const response = await loginRequest(credentials);
    const token = response?.data?.token || response?.data?.data?.token || response?.data?.accessToken;
    if (!token) {
      throw new Error(response.message || "Login failed.");
    }
    saveAccessToken(token);
    const me = await meRequest();
    setUser(me?.data || { username: credentials.username });
    return response;
  };

  const register = async (credentials) => {
    setAuthError("");
    return registerRequest(credentials);
  };

  const refresh = async () => {
    const res = await refreshRequest();
    const token = res?.data?.token || res?.data?.data?.token || res?.data?.accessToken;
    if (!token) throw new Error("Session refresh failed.");
    saveAccessToken(token);
    return token;
  };

  const logout = async () => {
    try {
      await logoutRequest();
    } catch {
      // Intentionally ignored: local logout should still clear session.
    }
    clearAccessToken();
    setUser(null);
    setAuthError("");
  };

  const updateProfile = async (payload) => {
    const response = await updateProfileRequest(payload);
    if (!response.success) throw new Error(response.message || "Profile update failed.");
    setUser(response.data);
    return response;
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isReady,
      authError,
      setAuthError,
      login,
      register,
      refresh,
      updateProfile,
      logout
    }),
    [user, isReady, authError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
