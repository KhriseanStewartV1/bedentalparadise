import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Check, Award, Globe2, MessageCircle, ArrowRight } from "lucide-react";
import { WHATSAPP_LINK } from "../lib/constants";

const DENTIST_IMG =
  "https://images.pexels.com/photos/5355889/pexels-photo-5355889.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=940";
const CLINIC_IMG =
  "https://images.pexels.com/photos/5355727/pexels-photo-5355727.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";

const credentials = [
  "General dentistry & prosthetic rehabilitation",
  "20+ years of clinical practice",
  "Personalized care plans for every patient",
  "Bilingual consultations (English & Spanish)",
];

export default function About({ compact = false }) {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden" data-testid="about-section">
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-paradise-cyanSoft opacity-60 blur-3xl pointer-events-none" />
      <div className="container-x relative grid lg:grid-cols-12 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
          className="lg:col-span-6 relative"
        >
          <div className="grid grid-cols-5 grid-rows-5 gap-4 h-[600px]">
            <div className="col-span-3 row-span-5 relative rounded-[2.5rem] overflow-hidden shadow-vibrant">
              <img src={DENTIST_IMG} alt="Dr. Yanahitza Baró" className="absolute inset-0 w-full h-full object-cover" data-testid="about-dentist-image" />
              <div className="absolute inset-0 bg-gradient-to-t from-paradise-navy/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <div className="text-xs uppercase tracking-[0.28em] font-bold text-paradise-yellow">Lead Dentist</div>
                <div className="font-display font-semibold text-3xl mt-1">Dr. Yanahitza Baró</div>
                <div className="text-sm text-white/80 mt-1">Cuban Dentist · 20+ years experience</div>
              </div>
            </div>
            <img src={CLINIC_IMG} alt="Clinic interior" className="col-span-2 row-span-3 w-full h-full object-cover rounded-3xl shadow-soft translate-y-8" data-testid="about-clinic-image" />
            <motion.div
              animate={{ rotate: [0, 4, -4, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="col-span-2 row-span-2 rounded-3xl bg-paradise-yellow shadow-vibrant flex flex-col justify-center items-center p-6 text-center -translate-y-2"
            >
              <Award className="w-8 h-8 text-paradise-navy" />
              <div className="font-display font-bold text-4xl text-paradise-navy leading-none mt-2">20+</div>
              <div className="text-[10px] mt-1 uppercase tracking-[0.2em] text-paradise-navy font-bold">years experience</div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
          className="lg:col-span-6"
        >
          <div className="eyebrow mb-5">Meet your dentist</div>
          <h2 className="font-display font-semibold text-4xl sm:text-5xl lg:text-6xl text-paradise-navy leading-[1.05]">
            Dr. Yanahitza
            <span className="block text-paradise-blue italic font-medium">Baró</span>
          </h2>
          <p className="font-script text-2xl text-paradise-coral mt-6">
            “We don't treat teeth, we treat people.”
          </p>
          <p className="text-lg text-paradise-slate mt-6 leading-relaxed">
            Be Dental Paradise is led by <strong className="text-paradise-navy">Dr. Yanahitza Baró</strong>,
            a Cuban dentist specializing in <strong className="text-paradise-navy">general dentistry and
            prosthetic rehabilitation</strong> with more than <strong className="text-paradise-navy">20 years
            of clinical experience</strong>. From a first cleaning to a full smile rehabilitation, every
            patient leaves with results — and confidence — from the very first visit.
          </p>

          <div className="flex items-center gap-3 mt-7 text-sm text-paradise-slate">
            <Globe2 className="w-4 h-4 text-paradise-blue" />
            English &amp; Spanish · Caribbean-inspired care
          </div>

          <ul className="mt-7 space-y-3">
            {credentials.map((p) => (
              <li key={p} className="flex items-start gap-3 text-paradise-ink" data-testid="about-point">
                <span className="mt-1 w-5 h-5 rounded-full bg-paradise-green/15 text-paradise-green flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3" strokeWidth={3} />
                </span>
                <span>{p}</span>
              </li>
            ))}
          </ul>

          {!compact && (
            <div className="mt-10 flex flex-wrap gap-4">
              <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" className="btn-whatsapp" data-testid="about-whatsapp-btn">
                <MessageCircle className="w-5 h-5" /> Book your consultation
              </a>
              <Link to="/contact" className="btn-ghost" data-testid="about-contact-btn">
                Contact the clinic <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
