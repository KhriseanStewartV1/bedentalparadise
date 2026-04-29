import { motion } from "framer-motion";

const items = [
  "Beautiful smiles are created here",
  "Results from the first visit",
  "20+ years of experience",
  "We don't treat teeth, we treat people",
  "Caribbean-inspired dental care",
];

export default function MarqueeStrip() {
  const repeated = [...items, ...items, ...items];
  return (
    <div className="bg-paradise-yellow text-paradise-navy py-4 overflow-hidden border-y-4 border-paradise-navy" data-testid="marquee-strip">
      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, ease: "linear", repeat: Infinity }}
      >
        {repeated.map((t, i) => (
          <span key={i} className="font-display font-semibold text-2xl tracking-tight inline-flex items-center gap-12">
            {t}
            <span className="text-paradise-coral text-3xl">✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
