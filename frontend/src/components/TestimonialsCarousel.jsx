import { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const reviews = [
  {
    name: "Tamara B.",
    role: "Kingston · Cleaning & whitening",
    img: "https://images.pexels.com/photos/3845549/pexels-photo-3845549.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=600",
    text: "Felt more like a coastal spa than a dentist. My cleaning and whitening result was beyond what I imagined — and totally painless.",
  },
  {
    name: "Marcus R.",
    role: "Montego Bay · Crown & bridge",
    img: "https://images.pexels.com/photos/8498412/pexels-photo-8498412.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=600",
    text: "Dr. Baró walked me through every step of my crown and bridge treatment. I smile bigger than I ever used to — honestly life changing.",
  },
  {
    name: "Keisha M.",
    role: "Negril · Family patient",
    img: "https://images.pexels.com/photos/3845625/pexels-photo-3845625.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=600",
    text: "My whole family trusts Be Dental Paradise — from my six-year-old to my grandparents. Calm, patient and beautifully run.",
  },
  {
    name: "Andre P.",
    role: "Spanish Town · Whitening",
    img: "https://images.pexels.com/photos/35037064/pexels-photo-35037064.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=600",
    text: "Saw real results from the first visit. The team is warm, professional and the clinic is spotless. I recommend them to everyone.",
  },
  {
    name: "Sasha N.",
    role: "Ocho Rios · Prosthetic rehab",
    img: "https://images.pexels.com/photos/3845657/pexels-photo-3845657.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=600",
    text: "After 20 years of dental anxiety, Dr. Baró completely changed my outlook. She really treats you like a person, not a chart.",
  },
];

export default function TestimonialsCarousel({ heading = true }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" }, []);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((i) => emblaApi && emblaApi.scrollTo(i), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    // Auto-rotate
    const id = setInterval(() => emblaApi.scrollNext(), 5500);
    return () => {
      clearInterval(id);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <section id="testimonials" className="py-24 lg:py-32 bg-white relative overflow-hidden" data-testid="testimonials-section">
      <div className="absolute -top-32 right-0 w-[400px] h-[400px] rounded-full bg-paradise-yellow/15 blur-3xl pointer-events-none" />
      <div className="container-x relative">
        {heading && (
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7 }}
              className="max-w-2xl"
            >
              <div className="eyebrow mb-5">Kind words</div>
              <h2 className="font-display font-semibold text-4xl sm:text-5xl text-paradise-navy">
                Smiles that speak <em className="text-paradise-blue font-medium not-italic">for themselves</em>.
              </h2>
            </motion.div>
            <div className="flex items-center gap-3">
              <button
                onClick={scrollPrev}
                aria-label="Previous"
                className="w-12 h-12 rounded-full bg-paradise-mist hover:bg-paradise-blue hover:text-white text-paradise-navy flex items-center justify-center transition-colors"
                data-testid="testimonials-prev"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={scrollNext}
                aria-label="Next"
                className="w-12 h-12 rounded-full bg-paradise-blue hover:bg-paradise-blueDark text-white flex items-center justify-center transition-colors shadow-vibrant"
                data-testid="testimonials-next"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        <div className="overflow-hidden -mx-4 px-4" ref={emblaRef} data-testid="testimonials-carousel">
          <div className="flex gap-6">
            {reviews.map((r, i) => (
              <article
                key={i}
                className="relative flex-[0_0_100%] sm:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.333%-16px)] bg-paradise-cyanSoft rounded-3xl p-8 border border-paradise-cyan/20 hover:border-paradise-blue/40 hover:-translate-y-1 transition-all duration-300"
                data-testid={`testimonial-${i}`}
              >
                <Quote className="w-12 h-12 text-paradise-blue/15 absolute -top-3 left-4" />
                <div className="flex items-center gap-1 text-paradise-yellow mb-4 relative">
                  {[...Array(5)].map((_, idx) => <Star key={idx} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="font-display italic text-xl text-paradise-ink leading-snug relative">
                  “{r.text}”
                </p>
                <div className="flex items-center gap-4 mt-8">
                  <img src={r.img} alt={r.name} className="w-14 h-14 rounded-full object-cover ring-4 ring-white shadow-soft" />
                  <div>
                    <div className="font-semibold text-paradise-navy">{r.name}</div>
                    <div className="text-xs text-paradise-slate">{r.role}</div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-2 mt-10">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                selectedIndex === i ? "w-10 bg-paradise-blue" : "w-2 bg-paradise-blue/25"
              }`}
              data-testid={`testimonial-dot-${i}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
