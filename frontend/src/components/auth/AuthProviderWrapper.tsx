"use client";

import type { ReactNode } from "react";
import { AuthModalProvider } from "./AuthModalController";

export function AuthProviderWrapper({ children }: { children: ReactNode }) {
  return <AuthModalProvider>{children}</AuthModalProvider>;
}
