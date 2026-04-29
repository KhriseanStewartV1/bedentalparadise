import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Heart } from "lucide-react";

export default function PhilosophyBanner() {
  return (
    <section className="relative py-24 lg:py-32 bg-paradise-navy text-white overflow-hidden" data-testid="philosophy-banner">
      <div className="absolute inset-0 grain-bg opacity-30" />
      <div className="absolute -top-20 -left-20 w-[400px] h-[400px] rounded-full bg-paradise-blue/40 blur-3xl" />
      <div className="absolute -bottom-32 -right-20 w-[500px] h-[500px] rounded-full bg-paradise-cyan/20 blur-3xl" />

      <div className="container-x relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.28em] font-bold text-paradise-yellow mb-6">
            <Heart className="w-4 h-4 fill-paradise-yellow" /> Our philosophy
          </div>
          <h2 className="font-display font-medium text-5xl sm:text-6xl lg:text-7xl leading-[1.05]">
            <span className="font-script text-paradise-yellow text-6xl sm:text-7xl lg:text-8xl block mb-2">“</span>
            We don't treat <span className="italic text-paradise-yellow">teeth</span>,
            <br />
            we treat <span className="italic text-paradise-cyan">people</span>.
          </h2>
          <p className="mt-8 text-lg text-white/80 max-w-2xl leading-relaxed">
            Every smile that walks through our door has its own story. We listen first, plan
            carefully, and treat with the warmth and precision your family deserves — from your
            very first visit.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link to="/about" className="btn-secondary" data-testid="philosophy-meet-doctor">
              Meet Dr. Yanahitza Baró <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/services" className="inline-flex items-center gap-2 text-paradise-yellow font-semibold hover:gap-3 transition-all">
              Our services →
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
