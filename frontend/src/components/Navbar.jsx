import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, Phone, MessageCircle } from "lucide-react";
import { LOGO_URL, NAV_LINKS, PHONE_DISPLAY, PHONE_TEL, WHATSAPP_LINK } from "../lib/constants";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-nav py-2" : "bg-transparent py-3"
      }`}
      data-testid="site-navbar"
    >
      <div className="container-x flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3 shrink-0" data-testid="nav-logo-link">
          <img
            src={LOGO_URL}
            alt="Be Dental Paradise"
            className="h-12 w-12 rounded-2xl object-cover ring-2 ring-paradise-blue/10 shadow-soft"
          />
          <div className="leading-tight hidden sm:block">
            <div className="font-display font-bold text-xl text-paradise-navy">Be Dental Paradise</div>
            <div className="text-[10px] uppercase tracking-[0.28em] text-paradise-blue font-bold">Beautiful Smiles · Created Here</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                `relative px-4 py-2 text-sm font-medium transition-colors rounded-full ${
                  isActive
                    ? "text-paradise-blue bg-paradise-cyanSoft"
                    : "text-paradise-ink/80 hover:text-paradise-blue"
                }`
              }
              data-testid={`nav-link-${l.label.toLowerCase()}`}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden xl:flex items-center gap-2">
          <a
            href={`tel:${PHONE_TEL}`}
            className="flex items-center gap-2 text-sm text-paradise-navy hover:text-paradise-blue px-3 py-2"
            data-testid="nav-phone"
          >
            <Phone className="w-4 h-4" /> {PHONE_DISPLAY}
          </a>
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noreferrer"
            className="btn-whatsapp text-sm !py-2.5 !px-5"
            data-testid="nav-whatsapp-btn"
          >
            <MessageCircle className="w-4 h-4" /> Book on WhatsApp
          </a>
        </div>

        <Link
          to="/book"
          className="hidden lg:inline-flex xl:hidden btn-primary text-sm !py-2.5 !px-5"
          data-testid="nav-book-btn"
        >
          Book Visit
        </Link>

        <button
          className="lg:hidden p-2 rounded-full bg-white border border-slate-200 shadow-soft"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          data-testid="nav-mobile-toggle"
        >
          {open ? <X className="w-5 h-5 text-paradise-navy" /> : <Menu className="w-5 h-5 text-paradise-navy" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden container-x mt-3 bg-white rounded-3xl shadow-hover p-5 border border-slate-100" data-testid="nav-mobile-menu">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  `py-3 px-4 rounded-xl ${
                    isActive
                      ? "bg-paradise-cyanSoft text-paradise-blue font-semibold"
                      : "text-paradise-ink/90 hover:bg-slate-50"
                  }`
                }
                onClick={() => setOpen(false)}
                data-testid={`nav-mobile-${l.label.toLowerCase()}`}
              >
                {l.label}
              </NavLink>
            ))}
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noreferrer"
              className="btn-whatsapp justify-center mt-3"
              onClick={() => setOpen(false)}
            >
              <MessageCircle className="w-4 h-4" /> Book on WhatsApp
            </a>
            <Link to="/admin/login" className="text-center text-xs text-paradise-slate underline underline-offset-4 mt-3">
              Admin Portal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
