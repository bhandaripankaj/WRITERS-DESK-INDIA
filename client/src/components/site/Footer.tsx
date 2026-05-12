import { Link } from "@tanstack/react-router";
import { BookOpen, Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-16 sm:mt-24 bg-surface/60 border-t border-border">
      <div className="container-wide pt-12 sm:pt-16 pb-8">
        <div className="grid gap-10 sm:gap-12 md:grid-cols-2 lg:grid-cols-5 min-w-0">
          <div className="lg:col-span-2 min-w-0">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="grid place-items-center h-9 w-9 rounded-md" style={{ background: "var(--gradient-brand)" }}>
                <BookOpen className="h-4 w-4 text-white" />
              </span>
              <span className="leading-tight">
                <span className="block font-display text-[18px] font-semibold">WhiteFalcon</span>
                <span className="block text-[9px] tracking-[0.32em] text-muted-foreground -mt-0.5">PUBLISHING</span>
              </span>
            </Link>
            <p className="mt-5 text-sm text-muted-foreground max-w-xs leading-relaxed">
              We are a full-service publishing company dedicated to helping authors turn their manuscripts into best-selling books.
            </p>
            <div className="mt-5 flex gap-2">
              {[Facebook, Twitter, Instagram, Linkedin, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="h-9 w-9 grid place-items-center rounded-md border border-border hover:bg-secondary hover:text-brand transition-colors" aria-label="social">
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          <FooterCol title="Quick Links" links={[["Home", "/"], ["About Us", "/about"], ["How It Works", "/how-it-works"], ["Pricing", "/pricing"], ["Portfolio", "/portfolio"], ["Contact Us", "/contact"]]} />
          <FooterCol title="Services" links={[["Book Editing", "/services"], ["Cover Design", "/services"], ["Publishing", "/services"], ["Marketing", "/services"], ["Audiobook", "/services"], ["Author Website", "/services"]]} />
          <div>
            <h4 className="text-sm font-semibold mb-4 text-foreground">Contact Us</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2 break-words">
                <Mail className="h-4 w-4 mt-0.5 text-brand shrink-0" /> hello@whitefalconpublishing.com
              </li>
              <li className="flex items-start gap-2"><Phone className="h-4 w-4 mt-0.5 text-brand" /> +1 (888) 123-4567</li>
              <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 text-brand" /> 123 Publishing Lane,<br />New York, NY 10001, USA</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} WhiteFalcon Publishing. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h4 className="text-sm font-semibold mb-4 text-foreground">{title}</h4>
      <ul className="space-y-2.5">
        {links.map(([label, to]) => (
          <li key={label}>
            <Link to={to} className="text-sm text-muted-foreground hover:text-brand transition-colors">{label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
