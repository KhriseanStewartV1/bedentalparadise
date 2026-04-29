import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, MessageCircle, Facebook, Send } from "lucide-react";
import { toast } from "sonner";
import api, { formatApiErrorDetail } from "../lib/api";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  PHONE_DISPLAY, PHONE_TEL, WHATSAPP_DISPLAY, WHATSAPP_LINK,
  EMAIL, FACEBOOK, FACEBOOK_HANDLE, HOURS,
} from "../lib/constants";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill all fields.");
      return;
    }
    setSending(true);
    try {
      await api.post("/contact", form);
      setForm({ name: "", email: "", message: "" });
      toast.success("Message sent — we'll reply soon!");
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail) || "Failed to send.");
    } finally {
      setSending(false);
    }
  };

  const items = [
    { icon: Phone, label: "Phone", value: PHONE_DISPLAY, href: `tel:${PHONE_TEL}`, accent: "text-paradise-blue" },
    { icon: MessageCircle, label: "WhatsApp", value: WHATSAPP_DISPLAY, href: WHATSAPP_LINK, accent: "text-paradise-green" },
    { icon: Mail, label: "Email", value: EMAIL, href: `mailto:${EMAIL}`, accent: "text-paradise-yellow" },
    { icon: Facebook, label: "Facebook", value: FACEBOOK_HANDLE, href: FACEBOOK, accent: "text-paradise-blue" },
    { icon: MapPin, label: "Location", value: "Jamaica · By appointment", accent: "text-paradise-coral" },
  ];

  return (
    <section className="py-20 lg:py-28 bg-white relative overflow-hidden" data-testid="contact-section">
      <div className="container-x grid lg:grid-cols-12 gap-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="lg:col-span-5"
        >
          <div className="space-y-5">
            {items.map((c, i) => {
              const Icon = c.icon;
              const Wrapper = c.href ? "a" : "div";
              const wrapperProps = c.href ? { href: c.href, target: c.href.startsWith("http") ? "_blank" : undefined, rel: "noreferrer" } : {};
              return (
                <Wrapper
                  key={i}
                  {...wrapperProps}
                  className={`flex items-start gap-4 ${c.href ? "group hover:-translate-y-0.5 transition-transform duration-200" : ""}`}
                  data-testid={`contact-info-${c.label.toLowerCase()}`}
                >
                  <div className={`w-12 h-12 rounded-2xl bg-paradise-mist ${c.accent} flex items-center justify-center shrink-0 shadow-soft`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.28em] text-paradise-slate font-bold">{c.label}</div>
                    <div className={`text-paradise-ink mt-1 ${c.href ? "group-hover:text-paradise-blue" : ""}`}>{c.value}</div>
                  </div>
                </Wrapper>
              );
            })}
          </div>

          <div className="mt-10 bg-paradise-mist rounded-3xl p-6">
            <div className="flex items-center gap-2 text-paradise-blue mb-4">
              <Clock className="w-4 h-4" />
              <div className="text-xs uppercase tracking-[0.28em] font-bold">Opening hours</div>
            </div>
            <ul className="space-y-2">
              {HOURS.map((h) => (
                <li key={h.d} className="flex justify-between text-sm">
                  <span className="font-semibold text-paradise-navy">{h.d}</span>
                  <span className="text-paradise-slate">{h.t}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          onSubmit={submit}
          className="lg:col-span-7 card-elev p-8 sm:p-10 space-y-5"
          data-testid="contact-form"
        >
          <h3 className="font-display font-semibold text-3xl text-paradise-navy">Send us a note</h3>
          <p className="text-sm text-paradise-slate -mt-2">We reply within the same business day.</p>
          <div className="grid sm:grid-cols-2 gap-5">
            <Input placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="h-12 rounded-xl" data-testid="contact-name" />
            <Input type="email" placeholder="Email address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="h-12 rounded-xl" data-testid="contact-email" />
          </div>
          <Textarea rows={5} placeholder="How can we help?" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="rounded-xl" data-testid="contact-message" />
          <button type="submit" disabled={sending} className="btn-primary justify-center w-full disabled:opacity-60" data-testid="contact-submit-btn">
            <Send className="w-4 h-4" /> {sending ? "Sending…" : "Send message"}
          </button>
        </motion.form>
      </div>
    </section>
  );
}
