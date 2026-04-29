import PageHero from "../components/PageHero";
import Services from "../components/Services";
import CTASection from "../components/CTASection";

export default function ServicesPage() {
  return (
    <div data-testid="services-page">
      <PageHero
        eyebrow="Our services"
        title="Care for every"
        italicWord="smile."
        subtitle="From routine examinations to crown & bridge, dentures, root canals and minor oral surgery — Be Dental Paradise covers the full spectrum of modern dental care."
      />
      <Services heading={false} />
      <CTASection />
    </div>
  );
}
