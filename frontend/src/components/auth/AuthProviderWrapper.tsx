"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { AuthModalProvider } from "./AuthModalController";
import {
  getCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
  register as registerRequest,
  type AuthUser,
} from "@/lib/auth/client";

interface AuthSessionContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  logout: () => Promise<void>;
}

const AuthSessionContext = createContext<AuthSessionContextValue | null>(null);

export function useAuthSession() {
  const context = useContext(AuthSessionContext);
  if (!context) {
    throw new Error("useAuthSession must be used within AuthProviderWrapper");
  }
  return context;
}

export function AuthProviderWrapper({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    void getCurrentUser()
      .then((result) => setUser(result?.user ?? null))
      .finally(() => setIsLoading(false));
  }, []);

  const value = useMemo<AuthSessionContextValue>(
    () => ({
      user,
      isLoading,
      logout: async () => {
        await logoutRequest();
        setUser(null);
      },
    }),
    [isLoading, user]
  );

  return (
    <AuthSessionContext.Provider value={value}>
      <AuthModalProvider
        onLoginSubmit={(data) => {
          void loginRequest({
            identifier: data.email,
            password: data.password,
          }).then((response) => setUser(response.user));
        }}
        onRegisterSubmit={(data) => {
          void registerRequest({
            first_name: String(data.firstName ?? ""),
            last_name: String(data.lastName ?? ""),
            email: String(data.email ?? ""),
            password: String(data.password ?? ""),
          }).then((response) => setUser(response.user));
        }}
      >
        {children}
      </AuthModalProvider>
    </AuthSessionContext.Provider>
  );
}
