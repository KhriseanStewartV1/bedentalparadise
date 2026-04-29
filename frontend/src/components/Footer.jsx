import { Link } from "react-router-dom";
import { Facebook, MessageCircle, Mail, Phone, MapPin } from "lucide-react";
import {
  LOGO_URL, PHONE_DISPLAY, PHONE_TEL, WHATSAPP_DISPLAY, WHATSAPP_LINK,
  EMAIL, FACEBOOK, FACEBOOK_HANDLE, HOURS, NAV_LINKS,
} from "../lib/constants";

export default function Footer() {
  return (
    <footer className="bg-paradise-navy text-white/90 relative overflow-hidden mt-12" data-testid="site-footer">
      <svg className="absolute top-0 left-0 w-full -translate-y-px" viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0,32 C240,80 480,0 720,24 C960,48 1200,72 1440,16 L1440,0 L0,0 Z" fill="#FFFFFF" />
      </svg>

      {/* glow */}
      <div className="pointer-events-none absolute -top-32 left-1/3 w-[500px] h-[500px] rounded-full bg-paradise-blue/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-20 w-[500px] h-[500px] rounded-full bg-paradise-cyan/20 blur-3xl" />

      <div className="container-x pt-24 pb-12 grid lg:grid-cols-12 gap-10 relative">
        <div className="lg:col-span-5">
          <div className="flex items-center gap-3">
            <img src={LOGO_URL} alt="Be Dental Paradise" className="h-14 w-14 rounded-2xl object-cover ring-2 ring-white/20" />
            <div>
              <div className="font-display font-bold text-2xl">Be Dental Paradise</div>
              <div className="text-[11px] uppercase tracking-[0.28em] text-paradise-yellow font-bold mt-1">
                Beautiful smiles are created here
              </div>
            </div>
          </div>
          <p className="text-white/70 mt-6 max-w-md leading-relaxed">
            Led by Dr. Yanahitza Baró, a Cuban dentist specializing in general dentistry and prosthetic
            rehabilitation with more than 20 years of clinical experience.
          </p>
          <p className="font-script text-2xl text-paradise-yellow mt-5">
            “We don't treat teeth, we treat people.”
          </p>
          <div className="flex gap-3 mt-6">
            <a href={FACEBOOK} target="_blank" rel="noreferrer" className="w-11 h-11 rounded-full bg-white/10 hover:bg-paradise-yellow hover:text-paradise-navy flex items-center justify-center transition-colors" aria-label="Facebook" data-testid="footer-social-facebook">
              <Facebook className="w-4 h-4" />
            </a>
            <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" className="w-11 h-11 rounded-full bg-white/10 hover:bg-paradise-green hover:text-white flex items-center justify-center transition-colors" aria-label="WhatsApp" data-testid="footer-social-whatsapp">
              <MessageCircle className="w-4 h-4" />
            </a>
            <a href={`mailto:${EMAIL}`} className="w-11 h-11 rounded-full bg-white/10 hover:bg-paradise-yellow hover:text-paradise-navy flex items-center justify-center transition-colors" aria-label="Email" data-testid="footer-social-email">
              <Mail className="w-4 h-4" />
            </a>
            <a href={`tel:${PHONE_TEL}`} className="w-11 h-11 rounded-full bg-white/10 hover:bg-paradise-cyan hover:text-white flex items-center justify-center transition-colors" aria-label="Call" data-testid="footer-social-phone">
              <Phone className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="text-xs uppercase tracking-[0.28em] text-paradise-yellow font-bold mb-5">Navigate</div>
          <ul className="space-y-2.5 text-sm text-white/80">
            {NAV_LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="hover:text-paradise-yellow transition-colors">{l.label}</Link>
              </li>
            ))}
            <li><Link to="/book" className="hover:text-paradise-yellow transition-colors">Book Appointment</Link></li>
          </ul>
        </div>

        <div className="lg:col-span-2">
          <div className="text-xs uppercase tracking-[0.28em] text-paradise-yellow font-bold mb-5">Hours</div>
          <ul className="space-y-2 text-sm text-white/80">
            {HOURS.map((h) => (
              <li key={h.d}>
                <div className="font-semibold text-white">{h.d}</div>
                <div className="text-xs">{h.t}</div>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <div className="text-xs uppercase tracking-[0.28em] text-paradise-yellow font-bold mb-5">Get in touch</div>
          <ul className="space-y-3 text-sm text-white/80">
            <li className="flex items-start gap-2"><Phone className="w-4 h-4 mt-0.5 text-paradise-yellow" /> {PHONE_DISPLAY}</li>
            <li className="flex items-start gap-2"><MessageCircle className="w-4 h-4 mt-0.5 text-paradise-green" /> {WHATSAPP_DISPLAY}</li>
            <li className="flex items-start gap-2"><Mail className="w-4 h-4 mt-0.5 text-paradise-yellow" /> {EMAIL}</li>
            <li className="flex items-start gap-2"><Facebook className="w-4 h-4 mt-0.5 text-paradise-yellow" /> {FACEBOOK_HANDLE}</li>
            <li className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5 text-paradise-yellow" /> Jamaica · By appointment</li>
          </ul>
          <Link to="/admin/login" className="inline-block mt-6 text-xs uppercase tracking-[0.28em] text-paradise-yellow hover:text-white" data-testid="footer-admin-link">
            Admin portal →
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10 relative">
        <div className="container-x py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/60">
          <div>© {new Date().getFullYear()} Be Dental Paradise. All rights reserved.</div>
          <div>Designed with care · Coastal smiles, always.</div>
        </div>
      </div>
    </footer>
  );
}
