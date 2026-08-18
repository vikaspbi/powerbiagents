import type { Metadata, Viewport } from "next";
import { Fraunces, Noto_Sans } from "next/font/google";
import "./globals.css";

const sans = Noto_Sans({
  subsets: ["latin", "latin-ext", "devanagari"],
  variable: "--font-sans",
});

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "LearnInPowerBI",
  description:
    "Learn Power BI, DAX, and data analytics with quizzes, games, and a practice lab. Independent app — not affiliated with Microsoft.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "LearnInPowerBI" },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0b5f6b" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1214" },
  ],
  width: "device-width",
  initialScale: 1,
};

const themeScript = `(() => {try {const t = localStorage.getItem('lpbi-theme') || 'system'; const d = t === 'dark' || (t === 'system' && matchMedia('(prefers-color-scheme: dark)').matches); if (d) document.documentElement.classList.add('dark');} catch (e) {}})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${sans.variable} ${display.variable} antialiased`}>{children}</body>
    </html>
  );
}
