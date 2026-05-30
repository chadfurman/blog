import {profile} from "@/data/portfolio";

const links = [
  {label: "LinkedIn", href: profile.linkedin},
  {label: "GitHub", href: profile.github},
  {label: "Email", href: `mailto:${profile.email}`},
];

export default function SiteFooter() {
  return (
    <footer className="w-full py-20 border-t border-border-subtle bg-surface-deep">
      <div className="flex flex-col md:flex-row justify-between items-center px-6 max-w-screen-xl mx-auto gap-4">
        <div className="flex flex-col items-center md:items-start">
          <div className="font-display text-2xl text-on-surface mb-2 tracking-tight">{profile.name}</div>
          <p className="text-base text-on-surface-variant text-center md:text-left">
            © 2026 {profile.name}. Engineering Manager | Applied AI &amp; SRE
          </p>
        </div>
        <div className="flex gap-8">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-on-surface-variant hover:text-secondary transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
