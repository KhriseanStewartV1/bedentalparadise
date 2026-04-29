import { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { CalendarIcon, Clock, User, Mail, Phone, CheckCircle2, MessageCircle } from "lucide-react";
import { toast } from "sonner";

import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import api, { formatApiErrorDetail } from "../lib/api";
import { SERVICES_LIST, WHATSAPP_LINK } from "../lib/constants";

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
];

export default function BookingForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", notes: "" });
  const [date, setDate] = useState(null);
  const [time, setTime] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.service || !date || !time) {
      toast.error("Please complete all required fields.");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/appointments", {
        name: form.name,
        email: form.email,
        phone: form.phone,
        service: form.service,
        preferred_date: format(date, "yyyy-MM-dd"),
        preferred_time: time,
        notes: form.notes || null,
      });
      setDone(true);
      toast.success("Appointment request sent! We'll confirm shortly.");
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail) || "Failed to submit. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="book" className="py-20 lg:py-28 bg-paradise-mist relative overflow-hidden" data-testid="booking-section">
      <div className="absolute top-10 -right-32 w-[420px] h-[420px] rounded-full bg-paradise-yellow/20 blur-3xl pointer-events-none" />
      <div className="container-x grid lg:grid-cols-12 gap-14 items-start relative">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="lg:col-span-5"
        >
          <div className="eyebrow mb-5">Online booking</div>
          <h2 className="font-display font-semibold text-4xl sm:text-5xl text-paradise-navy leading-[1.05]">
            Pick a moment.
            <br />
            <span className="italic text-paradise-blue font-medium">We'll handle the smile.</span>
          </h2>
          <p className="font-script text-2xl text-paradise-coral mt-5">Results from the first visit.</p>
          <p className="text-lg text-paradise-slate mt-5">
            Or skip the form — message us on WhatsApp and we'll book you in directly.
          </p>

          <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" className="btn-whatsapp mt-7" data-testid="booking-whatsapp-btn">
            <MessageCircle className="w-5 h-5" /> Book on WhatsApp instead
          </a>

          <div className="mt-10 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white shadow-soft flex items-center justify-center text-paradise-blue">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-paradise-navy">Mon – Fri · 9:00 – 17:00 · Sat · 9:00 – 12:00</div>
                <div className="text-sm text-paradise-slate">Closed Sundays</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white shadow-soft flex items-center justify-center text-paradise-yellow">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-paradise-navy">Quick response</div>
                <div className="text-sm text-paradise-slate">We confirm most appointments within the business day</div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="lg:col-span-7"
        >
          {done ? (
            <div className="card-elev p-10 text-center" data-testid="booking-success">
              <div className="w-16 h-16 rounded-full bg-paradise-green/15 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-paradise-green" />
              </div>
              <h3 className="font-display font-semibold text-3xl text-paradise-navy mt-6">You're on the list!</h3>
              <p className="text-paradise-slate mt-3 max-w-md mx-auto">
                Thanks for reaching out. A member of our team will confirm your appointment within
                a few business hours.
              </p>
              <button
                className="btn-ghost mt-7"
                onClick={() => {
                  setDone(false);
                  setForm({ name: "", email: "", phone: "", service: "", notes: "" });
                  setDate(null);
                  setTime("");
                }}
                data-testid="booking-reset-btn"
              >
                Book another
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="card-elev p-7 sm:p-10 space-y-5" data-testid="booking-form">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <Label className="text-xs uppercase tracking-widest text-paradise-slate mb-2 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" /> Full name
                  </Label>
                  <Input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Ava Johnson" className="h-12 rounded-xl" data-testid="booking-name" />
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-widest text-paradise-slate mb-2 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" /> Phone
                  </Label>
                  <Input value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+1 876 555 0199" className="h-12 rounded-xl" data-testid="booking-phone" />
                </div>
              </div>

              <div>
                <Label className="text-xs uppercase tracking-widest text-paradise-slate mb-2 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> Email
                </Label>
                <Input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@email.com" className="h-12 rounded-xl" data-testid="booking-email" />
              </div>

              <div className="grid sm:grid-cols-3 gap-5">
                <div className="sm:col-span-1">
                  <Label className="text-xs uppercase tracking-widest text-paradise-slate mb-2 block">Service</Label>
                  <Select value={form.service} onValueChange={(v) => update("service", v)}>
                    <SelectTrigger className="h-12 rounded-xl" data-testid="booking-service">
                      <SelectValue placeholder="Pick a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {SERVICES_LIST.map((s) => (
                        <SelectItem key={s} value={s} data-testid={`booking-service-option-${s}`}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="sm:col-span-1">
                  <Label className="text-xs uppercase tracking-widest text-paradise-slate mb-2 block">Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button type="button" className="w-full h-12 rounded-xl border border-input bg-white px-4 text-left flex items-center gap-2 text-sm hover:border-paradise-blue transition-colors" data-testid="booking-date-trigger">
                        <CalendarIcon className="w-4 h-4 text-paradise-blue" />
                        {date ? format(date, "PPP") : <span className="text-muted-foreground">Pick a date</span>}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={date} onSelect={setDate} disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="sm:col-span-1">
                  <Label className="text-xs uppercase tracking-widest text-paradise-slate mb-2 block">Time</Label>
                  <Select value={time} onValueChange={setTime}>
                    <SelectTrigger className="h-12 rounded-xl" data-testid="booking-time">
                      <SelectValue placeholder="Pick a time" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((t) => (
                        <SelectItem key={t} value={t} data-testid={`booking-time-option-${t}`}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-xs uppercase tracking-widest text-paradise-slate mb-2 block">Notes (optional)</Label>
                <Textarea rows={3} value={form.notes} onChange={(e) => update("notes", e.target.value)} placeholder="Anything we should know?" className="rounded-xl" data-testid="booking-notes" />
              </div>

              <button type="submit" disabled={submitting} className="btn-primary w-full justify-center text-base disabled:opacity-60" data-testid="booking-submit-btn">
                {submitting ? "Sending…" : "Request my appointment"}
              </button>
              <p className="text-[11px] text-paradise-slate text-center">
                By submitting, you agree to be contacted about your appointment. We never share your info.
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
