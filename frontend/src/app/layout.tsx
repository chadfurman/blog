import type {Metadata} from "next";
import {Plus_Jakarta_Sans, Geist, JetBrains_Mono} from 'next/font/google'
import {GoogleAnalytics} from '@next/third-parties/google'
import "./globals.css";

import PrismLoader from "@/app/_components/PrismLoader/PrismLoader";

const header_font = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: "--font-header",
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

const body_font = Geist({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
  display: "swap",
})

const mono_font = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Chad Furman | Applied AI & SRE",
  description: "Engineering Manager building scalable infrastructure and agentic AI products. Applied AI, SRE, and full-stack engineering leadership.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
    <body
      className={`${body_font.variable} ${header_font.variable} ${mono_font.variable} font-body antialiased`}
    >
    {children}
    <PrismLoader />
    <GoogleAnalytics gaId="G-HBRN8ECZ6C"/>
    </body>
    </html>
  );
}
