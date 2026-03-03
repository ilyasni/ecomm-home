import type { Metadata } from "next";
import { Onest } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { AuthProviderWrapper } from "@/components/auth/AuthProviderWrapper";

const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vitabrava-home.ru";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Vita Brava Home — премиальный текстиль по доступной цене",
    template: "%s | Vita Brava Home",
  },
  description:
    "Vita Brava Home — интернет-магазин премиального домашнего текстиля: постельное бельё, полотенца, пледы, халаты и аксессуары.",
  keywords: [
    "текстиль",
    "постельное белье",
    "полотенца",
    "пледы",
    "халаты",
    "домашний текстиль",
    "Vita Brava",
  ],
  authors: [{ name: "Vita Brava Home" }],
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: SITE_URL,
    siteName: "Vita Brava Home",
    title: "Vita Brava Home — премиальный текстиль по доступной цене",
    description:
      "Интернет-магазин премиального домашнего текстиля: постельное бельё, полотенца, пледы и аксессуары.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vita Brava Home",
    description: "Премиальный домашний текстиль по доступной цене.",
  },
  robots: {
    index: true,
    follow: true,
  },
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
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              fontFamily: "var(--font-onest), Arial, sans-serif",
              fontSize: "14px",
              borderRadius: "5px",
            },
            success: { duration: 4000 },
            error: { duration: 5000 },
          }}
        />
      </body>
    </html>
  );
}
