import { motion } from "framer-motion";
import { Stethoscope, Sparkles, Shield, Crown, Smile, Activity, Scissors, Zap, Layers } from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  { key: "examination", icon: Stethoscope, title: "Examination", desc: "Thorough oral health exams, digital X-rays and personalized care plans for every visit.", img: "https://images.pexels.com/photos/3945608/pexels-photo-3945608.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", color: "from-paradise-blue to-paradise-cyan" },
  { key: "cleaning", icon: Sparkles, title: "Cleaning", desc: "Gentle scaling, polish and fluoride treatments that leave your smile island-fresh.", img: "https://images.pexels.com/photos/5622262/pexels-photo-5622262.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", color: "from-paradise-cyan to-paradise-green" },
  { key: "whitening", icon: Smile, title: "Teeth Whitening", desc: "In-office and take-home treatments for a radiant, sun-kissed glow.", img: "https://images.pexels.com/photos/3845625/pexels-photo-3845625.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", color: "from-paradise-yellow to-paradise-coral" },
  { key: "fillings", icon: Shield, title: "Fillings", desc: "Tooth-coloured composite fillings that protect decay and restore natural beauty.", img: "https://images.pexels.com/photos/5355705/pexels-photo-5355705.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", color: "from-paradise-blue to-paradise-navy" },
  { key: "crown-bridge", icon: Crown, title: "Crown & Bridge", desc: "Custom-crafted crowns and bridges to rebuild strength, shape and confidence.", img: "https://images.pexels.com/photos/5355709/pexels-photo-5355709.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", color: "from-paradise-cyan to-paradise-blue" },
  { key: "dentures", icon: Layers, title: "Dentures", desc: "Full and partial dentures designed for a secure fit and natural-looking smile.", img: "https://images.pexels.com/photos/3845657/pexels-photo-3845657.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", color: "from-paradise-green to-paradise-cyan" },
  { key: "extractions", icon: Scissors, title: "Extractions", desc: "Safe, comfortable tooth removal with attentive pre- and post-care support.", img: "https://images.pexels.com/photos/3881170/pexels-photo-3881170.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", color: "from-paradise-yellow to-paradise-coral" },
  { key: "root-canals", icon: Zap, title: "Root Canals", desc: "Save your natural tooth with modern, virtually pain-free endodontic treatment.", img: "https://images.pexels.com/photos/5355701/pexels-photo-5355701.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", color: "from-paradise-coral to-paradise-yellow" },
  { key: "minor-oral-surgery", icon: Activity, title: "Minor Oral Surgery", desc: "Wisdom teeth, surgical extractions & small procedures — performed with precision.", img: "https://images.pexels.com/photos/5355892/pexels-photo-5355892.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940", color: "from-paradise-blue to-paradise-coral" },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.2, 0.8, 0.2, 1] } },
};

export default function Services({ heading = true }) {
  return (
    <section id="services" className="relative py-24 lg:py-32 bg-paradise-mist" data-testid="services-section">
      <div className="absolute inset-0 grain-bg opacity-50" />
      <div className="container-x relative">
        {heading && (
          <div className="max-w-3xl mb-14">
            <div className="eyebrow mb-5">What we do</div>
            <h2 className="font-display font-semibold text-4xl sm:text-5xl lg:text-6xl text-paradise-navy">
              A full spectrum of <em className="text-paradise-blue not-italic font-medium">vibrant</em> dental care
            </h2>
            <p className="text-lg text-paradise-slate mt-6 max-w-2xl leading-relaxed">
              From routine cleanings to crown &amp; bridge restorations, prosthetic rehabilitation
              and minor oral surgery — every service is crafted to feel calm, modern and warm.
            </p>
          </div>
        )}

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <motion.article
                key={s.key}
                variants={item}
                whileHover={{ y: -8 }}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-soft hover:shadow-vibrant transition-shadow duration-300 border border-slate-100"
                data-testid={`service-card-${s.key}`}
              >
                <div className="relative h-52 overflow-hidden">
                  <img src={s.img} alt={s.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className={`absolute inset-0 bg-gradient-to-t ${s.color} opacity-50 mix-blend-multiply`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-paradise-navy/40 to-transparent" />
                  <div className="absolute top-4 left-4 w-12 h-12 rounded-2xl backdrop-blur-md bg-white/95 border border-white shadow-soft flex items-center justify-center text-paradise-blue">
                    <Icon className="w-5 h-5" strokeWidth={2} />
                  </div>
                </div>
                <div className="p-7">
                  <h3 className="font-display font-semibold text-2xl text-paradise-navy">{s.title}</h3>
                  <p className="text-sm text-paradise-slate mt-3 leading-relaxed">{s.desc}</p>
                  <Link
                    to="/book"
                    className="inline-flex items-center gap-1.5 mt-5 text-sm font-semibold text-paradise-blue hover:gap-2 transition-all"
                    data-testid={`service-learn-${s.key}`}
                  >
                    Book this →
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
        <p className="text-center text-sm text-paradise-slate mt-10 italic">… and much more. Ask us about any smile concern.</p>
      </div>
    </section>
  );
}
