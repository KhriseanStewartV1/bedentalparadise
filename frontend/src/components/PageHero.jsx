import { motion } from "framer-motion";

export default function PageHero({ eyebrow, title, italicWord, subtitle, image, height = "h-[400px]" }) {
  return (
    <section className={`relative pt-32 sm:pt-36 lg:pt-40 pb-20 overflow-hidden bg-paradise-mist`} data-testid="page-hero">
      <div className="absolute inset-0 grain-bg opacity-50" />
      <div className="absolute -top-40 -right-32 w-[500px] h-[500px] rounded-full bg-paradise-blue/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-[420px] h-[420px] rounded-full bg-paradise-yellow/15 blur-3xl pointer-events-none" />

      <div className="container-x relative grid lg:grid-cols-12 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
          className={image ? "lg:col-span-7" : "lg:col-span-12 text-center max-w-3xl mx-auto"}
        >
          {eyebrow && <div className="eyebrow mb-5 justify-center" style={{ display: image ? "inline-flex" : "inline-flex" }}>{eyebrow}</div>}
          <h1 className="font-display font-semibold text-5xl sm:text-6xl lg:text-7xl text-paradise-navy leading-[0.98]">
            {title}{" "}
            {italicWord && (
              <span className="italic text-paradise-blue font-medium">{italicWord}</span>
            )}
          </h1>
          {subtitle && (
            <p className="mt-6 text-lg sm:text-xl text-paradise-slate max-w-2xl leading-relaxed mx-auto">
              {subtitle}
            </p>
          )}
        </motion.div>

        {image && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
            className="lg:col-span-5"
          >
            <div className={`relative rounded-[2rem] overflow-hidden shadow-vibrant border-4 border-white ${height}`}>
              <img src={image} alt={title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-paradise-navy/30 to-transparent" />
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
