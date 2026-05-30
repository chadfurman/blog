import Link from "next/link";

import MobileNav from "@/app/_components/MobileNav";
import Footer from "@/app/_components/Footer";
import ServicesDropdown from "@/app/_components/ServicesDropdown";

// Chrome for the dormant WordPress/e-commerce services + blog pages.
// The Applied AI & SRE portfolio (homepage) ships its own dark chrome instead.
export default function LegacyLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <header className="relative lg:grid lg:grid-rows-1 lg:grid-cols-[1fr_auto] py-4 border-b border-dotted border-foreground/10 items-center px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto">
        <div className="flex items-center justify-between lg:justify-start">
          <Link href="/">
            <h1 className="m-0 hover:text-primary lg:whitespace-nowrap">Chad&apos;s Website</h1>
            <h2 className="m-0 text-sm tracking-[0.35em] lg:whitespace-nowrap">WordPress &amp; E-Commerce Solutions</h2>
          </Link>
          <MobileNav />
        </div>
        <nav className="primary-nav hidden lg:flex flex-row justify-end gap-8 items-center">
          <Link href="/">Home</Link>
          <ServicesDropdown />
          <Link href="/contact">Contact</Link>
        </nav>
      </header>
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
