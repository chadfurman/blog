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
        <Link href="/services">Services</Link>
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
