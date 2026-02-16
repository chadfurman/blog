import Link from "next/link";
import { services } from "@/data/services";

export default function Footer() {
  return (
    <footer className="bg-footer-bg text-slate-300">
      <div className="px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {/* Brand */}
          <div>
            <h3 className="!mt-0 !mb-2 text-white !text-lg">Chad&apos;s Website</h3>
            <p className="text-sm text-slate-400 !my-0">WordPress &amp; E-Commerce Solutions</p>
          </div>

          {/* Services */}
          <div>
            <h4 className="!mt-0 !mb-3 text-white !text-sm font-semibold uppercase tracking-wider">Services</h4>
            <ul className="!p-0 !m-0 list-none space-y-2">
              {services.map((service) => (
                <li key={service.id} className="!m-0">
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-sm text-slate-400 hover:text-white transition-colors no-underline"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="!mt-0 !mb-3 text-white !text-sm font-semibold uppercase tracking-wider">Get in Touch</h4>
            <ul className="!p-0 !m-0 list-none space-y-2">
              <li className="!m-0">
                <Link
                  href="/contact"
                  className="text-sm text-slate-400 hover:text-white transition-colors no-underline"
                >
                  Contact Form
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-700">
        <div className="px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto py-4 text-center">
          <p className="text-xs text-slate-500 !my-0">&copy; 2026 Chad Furman. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
