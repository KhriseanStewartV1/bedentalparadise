import Hero from "../components/Hero";
import MarqueeStrip from "../components/MarqueeStrip";
import PhilosophyBanner from "../components/PhilosophyBanner";
import Services from "../components/Services";
import About from "../components/About";
import TestimonialsCarousel from "../components/TestimonialsCarousel";
import CTASection from "../components/CTASection";

export default function HomePage() {
  return (
    <div data-testid="home-page">
      <Hero />
      <MarqueeStrip />
      <PhilosophyBanner />
      <Services />
      <About />
      <TestimonialsCarousel />
      <CTASection />
    </div>
  );
}
