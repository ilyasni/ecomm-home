import type { Metadata } from "next";
import { Onest } from "next/font/google";
import "./globals.css";
import { AuthProviderWrapper } from "@/components/auth/AuthProviderWrapper";

const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vita Brava Home",
  description: "Vita Brava Home — премиальный текстиль по доступной цене.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${onest.variable} antialiased`}>
        <AuthProviderWrapper>{children}</AuthProviderWrapper>
      </body>
    </html>
  );
}
