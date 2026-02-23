"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { AuthPromptModal } from "./AuthPromptModal";
import { LoginModal } from "./LoginModal";
import { RegisterModal } from "./RegisterModal";

type AuthView = "prompt" | "login" | "register" | null;

interface AuthModalContextValue {
  openLogin: () => void;
  openRegister: () => void;
  openPrompt: () => void;
  close: () => void;
}

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

export function useAuthModal() {
  const ctx = useContext(AuthModalContext);
  if (!ctx) {
    throw new Error("useAuthModal must be used within AuthModalProvider");
  }
  return ctx;
}

interface AuthModalProviderProps {
  children: ReactNode;
  onGuest?: () => void;
  onLoginSubmit?: (data: { email: string; password: string }) => void;
  onRegisterSubmit?: (data: Record<string, string>) => void;
}

export function AuthModalProvider({
  children,
  onGuest,
  onLoginSubmit,
  onRegisterSubmit,
}: AuthModalProviderProps) {
  const [view, setView] = useState<AuthView>(null);

  const openLogin = useCallback(() => setView("login"), []);
  const openRegister = useCallback(() => setView("register"), []);
  const openPrompt = useCallback(() => setView("prompt"), []);
  const close = useCallback(() => setView(null), []);

  const handleGuest = useCallback(() => {
    onGuest?.();
    close();
  }, [onGuest, close]);

  return (
    <AuthModalContext.Provider
      value={{ openLogin, openRegister, openPrompt, close }}
    >
      {children}

      <AuthPromptModal
        open={view === "prompt"}
        onClose={close}
        onLogin={openLogin}
        onGuest={handleGuest}
      />

      <LoginModal
        open={view === "login"}
        onClose={close}
        onSwitchToRegister={openRegister}
        onSubmit={onLoginSubmit}
      />

      <RegisterModal
        open={view === "register"}
        onClose={close}
        onSwitchToLogin={openLogin}
        onSubmit={onRegisterSubmit}
      />
    </AuthModalContext.Provider>
  );
}
