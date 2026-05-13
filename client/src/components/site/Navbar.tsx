import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronDown, Menu, Moon, Sun, X, BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

type NavTo = "/" | "/about" | "/how-it-works" | "/contact" | "/books" | "/collections";
type NavLink = {
  label: string;
  to: NavTo;
  /** In-page anchor on home */
  hash?: string;
  /** Home is active only at `/` with no hash */
  homeExact?: boolean;
  caret?: boolean;
};

const links: NavLink[] = [
  { to: "/", label: "Home", homeExact: true },
  { to: "/books", label: "Books" },
  { to: "/collections", label: "Collection" },
  { to: "/about", label: "About Us" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/contact", label: "Contact Us" },
];

const navLinkClass =
  "px-3 py-2 text-[13.5px] font-medium text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1";
const navLinkActiveClass =
  "px-3 py-2 text-[13.5px] font-medium text-foreground inline-flex items-center gap-1 relative after:content-[''] after:absolute after:left-3 after:right-3 after:-bottom-0.5 after:h-[2px] after:rounded-full after:bg-[var(--brand)]";

function useNavLinkActive(l: NavLink) {
  return useRouterState({
    select: (s) => {
      const path = s.location.pathname;
      const h = s.location.hash?.replace(/^#/, "") ?? "";
      if (l.hash) return path === "/" && h === l.hash;
      if (l.homeExact && l.to === "/") return path === "/" && !h;
      if (l.to === "/books") return path === "/books";
      if (l.to === "/collections") return path === "/collections";
      return path === l.to;
    },
  });
}

export function Navbar() {
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "backdrop-blur-xl bg-background/50 border-b border-border py-0"
          : "bg-transparent py-2"
      )}
    >
      <div className="container-wide flex h-[72px] items-center justify-between gap-3 sm:gap-6 min-w-0">
        <Link to="/" className="flex min-w-0 max-w-[58%] shrink items-center gap-2 sm:max-w-[220px] sm:gap-2.5 lg:max-w-none">
          <span className="grid place-items-center h-9 w-9 rounded-md shrink-0" style={{ background: "var(--gradient-brand)" }}>
            <BookOpen className="h-4 w-4 text-white" />
          </span>
          <span className="leading-tight min-w-0">
            <span className="block font-display text-[16px] sm:text-[18px] font-semibold tracking-tight truncate">
              WritersDesk
            </span>
            <span className="block text-[8px] sm:text-[9px] tracking-[0.28em] sm:tracking-[0.32em] text-muted-foreground -mt-0.5 truncate">
              PUBLISHING
            </span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <NavBarLink key={`${l.to}-${l.label}`} l={l} />
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="h-10 w-10 grid place-items-center rounded-lg border border-border hover:bg-secondary transition-colors"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <Link to="/contact" className="hidden md:inline-flex btn-primary !h-10 !px-5">
            Send Interest
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            className="lg:hidden h-10 w-10 grid place-items-center rounded-lg border border-border"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden border-t border-border bg-background"
          >
            <div className="container-wide py-4 flex flex-col gap-1">
              {links.map((l) => (
                <MobileNavLink key={`${l.to}-${l.label}`} l={l} onNavigate={() => setOpen(false)} />
              ))}
              <Link to="/contact" onClick={() => setOpen(false)} className="mt-2 btn-primary">
                Send Interest
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function NavBarLink({ l }: { l: NavLink }) {
  const active = useNavLinkActive(l);
  return (
    <Link
      to={l.to}
      {...(l.hash ? { hash: l.hash } : {})}
      className={active ? navLinkActiveClass : navLinkClass}
    >
      {l.label}
      {l.caret && <ChevronDown className="h-3 w-3 opacity-70" />}
    </Link>
  );
}

function MobileNavLink({ l, onNavigate }: { l: NavLink; onNavigate: () => void }) {
  const active = useNavLinkActive(l);
  return (
    <Link
      to={l.to}
      {...(l.hash ? { hash: l.hash } : {})}
      onClick={onNavigate}
      className={cn("px-3 py-3 rounded-lg hover:bg-secondary", active ? "text-foreground bg-secondary/80 font-medium" : "text-foreground")}
    >
      {l.label}
    </Link>
  );
}
