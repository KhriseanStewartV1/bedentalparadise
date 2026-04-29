import PageHero from "../components/PageHero";
import BookingForm from "../components/BookingForm";

export default function BookPage() {
  return (
    <div data-testid="book-page">
      <PageHero
        eyebrow="Book your visit"
        title="Reserve a moment of"
        italicWord="paradise."
        subtitle="Tell us a little about you and pick a time that works best. Our team will confirm within a few hours — or message us on WhatsApp for an instant response."
      />
      <BookingForm />
    </div>
  );
}
