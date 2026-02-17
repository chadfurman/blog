import type {Metadata} from "next";
import {Plus_Jakarta_Sans, Source_Sans_3} from 'next/font/google'
import {GoogleAnalytics} from '@next/third-parties/google'
import "./globals.css";
import Link from "next/link";

import PrismLoader from "@/app/_components/PrismLoader/PrismLoader";
import MobileNav from "@/app/_components/MobileNav";
import Footer from "@/app/_components/Footer";


const body_font = Source_Sans_3({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-body",
  display: "swap",
})

const header_font = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: "--font-header",
  weight: ['400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Chad Furman",
  description: "WordPress hosting, SEO, e-commerce, and Klaviyo marketing automation for small businesses and online stores.",
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
    <html lang="en">
    <body
      className={`${body_font.variable} ${header_font.variable} antialiased`}
    >
    <header className="relative lg:grid lg:grid-rows-1 lg:grid-cols-3 py-4 border-b border-dotted border-foreground/10 items-center px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto">
      <div className="col-span-1 flex items-center justify-between lg:justify-start">
        <Link href="/">
          <h1 className="m-0 hover:text-primary">Chad&apos;s Website</h1>
          <h2 className="m-0 text-sm tracking-[0.35em]">WordPress &amp; E-Commerce Solutions</h2>
        </Link>
        <MobileNav />
      </div>
      <nav className="primary-nav col-span-2 hidden lg:flex flex-row justify-end gap-8 items-center">
        <Link href="/">Home</Link>
        <div className="relative group">
          <Link href="/services" className="inline-flex items-center gap-1">
            Services
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:rotate-180">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </Link>
          <div className="hidden group-hover:block absolute top-full right-0 pt-2 z-50">
            <div className="bg-white rounded-lg shadow-lg border border-foreground/10 py-2 min-w-[200px]">
              <Link href="/services/wordpress-care" className="block px-4 py-2 text-sm hover:bg-primary/5 hover:text-primary transition-colors">
                WordPress Care
              </Link>
              <Link href="/services/ecommerce" className="block px-4 py-2 text-sm hover:bg-primary/5 hover:text-primary transition-colors">
                E-Commerce
              </Link>
              <Link href="/services/marketing" className="block px-4 py-2 text-sm hover:bg-primary/5 hover:text-primary transition-colors">
                Marketing
              </Link>
              <Link href="/services/starter-site" className="block px-4 py-2 text-sm hover:bg-primary/5 hover:text-primary transition-colors">
                Starter Site
              </Link>
            </div>
          </div>
        </div>
        <Link href="/contact">Contact</Link>
      </nav>
    </header>
    <main className="min-h-screen">
      {children}
    </main>
    <Footer />
    <PrismLoader />
    <GoogleAnalytics gaId="G-HBRN8ECZ6C"/>
    </body>
    </html>
  );
}
