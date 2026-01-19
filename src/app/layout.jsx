import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/themeProvider";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}

export const metadata = {
  title: 'PassForge - Secure Password Generator',
  description:
    'Generate strong, secure, and customizable passwords instantly. PassForge is a fast, open-source password generator you can trust.',
  keywords: [
    'password generator',
    'secure password',
    'PassForge',
    'brute force resistant password',
    'random password',
    'online password tool',
    'Next.js password generator'
  ],
  openGraph: {
    title: 'PassForge - Strong Password Generator',
    description: 'Create complex passwords with brute-force time estimation and strength scoring.',
    url: 'https://passforge.callcon.me',
    siteName: 'PassForge',
    images: [
      {
        url: '/og-image.png', // You can upload this image to /public
        width: 1200,
        height: 630,
        alt: 'PassForge Password Generator',
      },
    ],
    type: 'website',
  },
};
