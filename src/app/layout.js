import { Geist, Geist_Mono } from "next/font/google";
import { AppShell } from "@/components/layout/app-shell";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "DevConnect",
  description: "A community for developers to share what they build and learn.",
};

export default function RootLayout({ children }) {
  // Dark theme by default; the palette lives in globals.css (.dark).
  return (
    <html
      lang="en"
      className={`dark scheme-dark ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background">
        {/* The shell stays mounted across navigations; only `children` changes. */}
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
