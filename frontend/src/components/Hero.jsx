import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CalendarCheck, MessageCircle, Sparkles, Star } from "lucide-react";
import { WHATSAPP_LINK, LOGO_URL } from "../lib/constants";

const HERO_IMG =
  "https://images.pexels.com/photos/3845682/pexels-photo-3845682.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=940";

const HERO_BG_SLIDES = [
  "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.istockphoto.com%2Fid%2F1352126344%2Fphoto%2Flatinx-caribbean-young-woman-with-curly-hair-smile-happy-people-beautiful-in-winter.jpg%3Fs%3D170667a%26w%3D0%26k%3D20%26c%3D2YtGiMLi2tEBhpKpuuw4LskieQBmHzz5HjQht4lmOBg%3D&f=1&nofb=1&ipt=6f3e7662503e5dc689463625b4ba088b751fda6854fa9bf3cc9acffd343ac6c5",
  "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwitness-experts.com%2Fhubfs%2Fa-female-dentist-is-caring-for-her-male-patient.png&f=1&nofb=1&ipt=0c431ba06968055e2f90edb414df2d7aa758e982ec65908e633bd663c9877d9e",
  HERO_IMG,
];

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.2, 0.8, 0.2, 1], delay } },
});

export default function Hero() {
  const [activeBgSlide, setActiveBgSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveBgSlide((prev) => (prev + 1) % HERO_BG_SLIDES.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden pt-32 sm:pt-36 lg:pt-44 pb-24 lg:pb-36" data-testid="hero-section">
      <div className="absolute inset-0">
        {HERO_BG_SLIDES.map((slide, index) => (
          <img
            key={`${slide}-${index}`}
            src={slide}
            alt={`Hero background ${index + 1}`}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
              activeBgSlide === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>
      <div className="absolute inset-0 bg-white/65 pointer-events-none" />

      {/* Vibrant background blobs */}
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-paradise-blue/15 blur-3xl pointer-events-none" />
      <div className="absolute top-32 -left-40 w-[520px] h-[520px] rounded-full bg-paradise-yellow/25 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[420px] h-[420px] rounded-full bg-paradise-cyan/15 blur-3xl pointer-events-none" />
      <div className="absolute inset-0 grain-bg pointer-events-none opacity-60" />
      <div className="absolute left-4 md:left-7 lg:left-10 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-4">
        {HERO_BG_SLIDES.map((_, index) => {
          const isActive = activeBgSlide === index;
          return (
            <button
              key={index}
              type="button"
              onClick={() => setActiveBgSlide(index)}
              aria-label={`Show background slide ${index + 1}`}
              className="group relative h-9 w-9 flex items-center justify-center"
            >
              <span className="absolute inset-0 rounded-full border border-paradise-navy/20 bg-white/15 backdrop-blur-sm transition-colors group-hover:bg-white/35" />
              <motion.span
                animate={
                  isActive
                    ? { scale: [1, 1.15, 1], opacity: [0.35, 0.7, 0.35] }
                    : { scale: 1, opacity: 0 }
                }
                transition={{ duration: 1.5, repeat: isActive ? Infinity : 0, ease: "easeInOut" }}
                className="absolute h-7 w-7 rounded-full bg-paradise-blue/35"
              />
              <span
                className={`relative h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                  isActive ? "bg-paradise-blue scale-125" : "bg-paradise-navy/55 group-hover:bg-paradise-blue/80"
                }`}
              />
            </button>
          );
        })}
      </div>

      <div className="container-x grid lg:grid-cols-12 gap-10 lg:gap-16 items-center relative">
        <div className="lg:col-span-7 relative z-10">
          <motion.div {...fade(0)} className="eyebrow mb-6" data-testid="hero-eyebrow">
            Beautiful Smiles · Created Here
          </motion.div>

          <motion.h1
            {...fade(0.05)}
            className="font-display font-semibold text-5xl sm:text-6xl lg:text-[88px] leading-[0.96] text-paradise-navy"
          >
            Beautiful smiles
            <br />
            are <span className="text-shine italic">created</span>
            <br />
            <span className="relative inline-block">
              here.
              <svg className="absolute -bottom-3 left-0 w-full" viewBox="0 0 200 14" fill="none" preserveAspectRatio="none" aria-hidden="true">
                <path d="M2,8 C50,2 120,12 198,5" stroke="#FFD60A" strokeWidth="5" strokeLinecap="round" />
              </svg>
            </span>
          </motion.h1>

          <motion.p {...fade(0.18)} className="mt-8 text-lg sm:text-xl text-paradise-slate max-w-xl leading-relaxed" data-testid="hero-subhead">
            <span className="font-display italic font-semibold text-paradise-blue text-2xl block mb-2">
              Results from the first visit.
            </span>
            Caribbean-inspired dental care led by Dr. Yanahitza Baró — over 20 years of clinical
            experience, all in one warm, welcoming clinic.
          </motion.p>

          <motion.div {...fade(0.28)} className="mt-10 flex flex-wrap gap-4 items-center">
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noreferrer"
              className="btn-whatsapp text-base"
              data-testid="hero-whatsapp-btn"
            >
              <MessageCircle className="w-5 h-5" />
              Book your appointment now
            </a>
            <Link to="/services" className="btn-ghost" data-testid="hero-services-btn">
              Explore services
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
          </motion.div>

          <motion.div {...fade(0.4)} className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
            <div className="flex items-center -space-x-3">
              {[
                "https://images.pexels.com/photos/3845549/pexels-photo-3845549.jpeg?auto=compress&cs=tinysrgb&w=120",
                "https://images.pexels.com/photos/8498412/pexels-photo-8498412.jpeg?auto=compress&cs=tinysrgb&w=120",
                "https://images.pexels.com/photos/3845625/pexels-photo-3845625.jpeg?auto=compress&cs=tinysrgb&w=120",
              ].map((src, i) => (
                <img key={i} src={src} alt="patient" className="w-11 h-11 rounded-full ring-4 ring-white object-cover" />
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1 text-paradise-yellow">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <div className="text-sm text-paradise-slate font-medium mt-1">
                Loved by 320+ patients across Jamaica
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0, transition: { duration: 0.9, ease: [0.2, 0.8, 0.2, 1] } }}
          className="lg:col-span-5 relative z-10"
        >
          <div className="relative">
            <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-paradise-blue/30 via-paradise-cyan/20 to-paradise-yellow/30 blur-xl" />
            <div className="relative rounded-[2.5rem] overflow-hidden border-4 border-white shadow-vibrant">
              <img
                src={HERO_IMG}
                alt="Happy dental patient"
                className="object-cover w-full h-[560px]"
                data-testid="hero-image"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-paradise-navy/30 via-transparent to-transparent" />
            </div>

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-8 bottom-12 bg-white rounded-2xl shadow-vibrant p-5 w-[270px] border border-slate-100"
              data-testid="hero-floating-card"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-paradise-cyanSoft flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-paradise-blue" />
                </div>
                <div>
                  <div className="text-xs text-paradise-slate font-medium">Today</div>
                  <div className="font-display font-semibold text-lg text-paradise-navy">Whitening Special</div>
                </div>
              </div>
              <p className="text-xs text-paradise-slate mt-3 leading-relaxed">
                Brighten up to 8 shades in a single session.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0, transition: { delay: 0.6, duration: 0.7 } }}
              className="absolute -right-6 -top-8 bg-paradise-blue text-white rounded-2xl shadow-vibrant p-5 w-[220px]"
              data-testid="hero-badge"
            >
              <div className="flex items-center gap-2 text-paradise-yellow text-xs font-bold uppercase tracking-widest">
                <CalendarCheck className="w-4 h-4" /> 20+ Years
              </div>
              <div className="mt-2 font-display font-semibold text-lg leading-tight">
                Clinical experience you can feel.
              </div>
            </motion.div>

            <motion.img
              src={LOGO_URL}
              alt="Be Dental Paradise"
              animate={{ rotate: [0, 6, 0, -6, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-12 bottom-4 w-24 h-24 rounded-full border-4 border-white shadow-vibrant object-cover"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
