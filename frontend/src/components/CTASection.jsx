import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MessageCircle, ArrowRight } from "lucide-react";
import { WHATSAPP_LINK } from "../lib/constants";

export default function CTASection() {
  return (
    <section className="py-20 lg:py-28 relative overflow-hidden" data-testid="cta-section">
      <div className="container-x">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8 }}
          className="relative bg-gradient-to-br from-paradise-blue via-paradise-blue to-paradise-cyan rounded-[2.5rem] p-10 sm:p-16 overflow-hidden"
        >
          <div className="absolute -top-32 -right-20 w-[400px] h-[400px] rounded-full bg-paradise-yellow/30 blur-3xl" />
          <div className="absolute -bottom-32 -left-20 w-[400px] h-[400px] rounded-full bg-paradise-coral/20 blur-3xl" />

          <div className="relative grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 text-white">
              <div className="font-script text-paradise-yellow text-3xl mb-3">Results from the first visit</div>
              <h2 className="font-display font-semibold text-4xl sm:text-5xl lg:text-6xl leading-[1.05]">
                Beautiful smiles
                <br />
                <span className="italic text-paradise-yellow">are created here.</span>
              </h2>
              <p className="text-white/90 mt-6 max-w-xl">
                Book your appointment now over WhatsApp — we typically reply within minutes during
                business hours.
              </p>
            </div>
            <div className="lg:col-span-4 flex flex-col gap-3">
              <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" className="btn-whatsapp justify-center text-base" data-testid="cta-whatsapp">
                <MessageCircle className="w-5 h-5" /> Book on WhatsApp
              </a>
              <Link to="/book" className="inline-flex justify-center items-center gap-2 bg-white text-paradise-blue hover:bg-paradise-yellow hover:text-paradise-navy px-7 py-3.5 rounded-full font-semibold transition-colors" data-testid="cta-online">
                Book online <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
