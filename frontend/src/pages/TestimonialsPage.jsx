import PageHero from "../components/PageHero";
import TestimonialsCarousel from "../components/TestimonialsCarousel";
import CTASection from "../components/CTASection";

export default function TestimonialsPage() {
  return (
    <div data-testid="testimonials-page">
      <PageHero
        eyebrow="Patient stories"
        title="Smiles that speak"
        italicWord="for themselves."
        subtitle="Each smile crafted at Be Dental Paradise carries a story of trust, transformation and care. Here are just a few of the kind words our patients have shared."
      />
      <TestimonialsCarousel heading={false} />
      <CTASection />
    </div>
  );
}
