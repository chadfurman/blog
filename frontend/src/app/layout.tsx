import type {Metadata} from "next";
import {Roboto, Work_Sans} from 'next/font/google'
import {GoogleAnalytics} from '@next/third-parties/google'
import "./globals.css";
import Link from "next/link";
import LightDarkToggle from "@/app/_components/LightDarkToggle/LightDarkToggle";

export const body_font = Work_Sans({
  subsets: ["latin"],
  weight: ["100", "300", "500", "700"],
  style: ["normal", "italic"],
  variable: "--font-body",
  display: "swap",
})

export const header_font = Roboto({
  subsets: ['latin'],
  variable: "--font-header",
  weight: ['100', '300', '500'],
  style: ['normal', 'italic'],
  display: 'swap',

})

export const metadata: Metadata = {
  title: "Chad Furman",
  description: "Mindful code and creativity.  Blog posts on various topics that interest me",
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
    <header
      className="lg:grid lg:grid-rows-1 lg:grid-cols-5 py-4 border-b border-dotted border-indigo-50/[.1] items-center">
      <div className="col-span-1">
        <h1 className="mx-auto m-0 w-fit">Chad&apos;s Website</h1>
        <h2 className="mx-auto m-0 w-fit text-xs">Mindful code and creativity</h2>
      </div>
      <nav className="col-span-3 flex flex-row justify-around items-center lg:mt-0 mt-4">
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/projects">Projects</Link>
        <Link href="/posts">Blog</Link>
        <Link href="/contact">Contact</Link>

      </nav>
      <LightDarkToggle/>
    </header>
    <main className="min-h-screen mx-auto px-4 sm:px-6 lg:px-8 max-w-screen-xl ">
      {children}
    </main>
    <GoogleAnalytics gaId="G-HBRN8ECZ6C"/>
    </body>
    </html>
  );
}
