import PageHero from "../components/PageHero";
import About from "../components/About";
import PhilosophyBanner from "../components/PhilosophyBanner";
import CTASection from "../components/CTASection";

export default function AboutPage() {
  return (
    <div data-testid="about-page">
      <PageHero
        eyebrow="About the clinic"
        title="A team that treats"
        italicWord="people."
        subtitle="Be Dental Paradise is a boutique Jamaican clinic where Caribbean warmth meets modern dentistry — led by Dr. Yanahitza Baró, with 20+ years of clinical experience."
      />
      <About />
      <PhilosophyBanner />
      <CTASection />
    </div>
  );
}
