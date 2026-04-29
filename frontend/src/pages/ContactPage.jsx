import PageHero from "../components/PageHero";
import Contact from "../components/Contact";

export default function ContactPage() {
  return (
    <div data-testid="contact-page">
      <PageHero
        eyebrow="Contact"
        title="We value your time"
        italicWord="and comfort."
        subtitle="Whether you're planning a transformative treatment or seeking expert guidance, we're here to assist you every step of the way."
      />
      <Contact />
    </div>
  );
}
