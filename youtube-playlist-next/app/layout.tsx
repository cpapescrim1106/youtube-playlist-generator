import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/session-provider";
import { Navigation } from "@/components/navigation";
import { KeyboardShortcutsProvider } from "@/components/keyboard-shortcuts-provider";
import { ErrorBoundary } from "@/components/error-boundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YouTube Playlist Generator",
  description: "Create YouTube playlists instantly with AI-generated titles",
  icons: {
    icon: '/icon.svg',
    apple: '/apple-icon.png',
    shortcut: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <KeyboardShortcutsProvider>
            <ErrorBoundary>
              <div className="min-h-screen flex flex-col">
                <Navigation />
                <main className="flex-1">
                  {children}
                </main>
              </div>
            </ErrorBoundary>
          </KeyboardShortcutsProvider>
        </Providers>
      </body>
    </html>
  );
}
