import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Services from "../components/Services";
import About from "../components/About";
import Testimonials from "../components/Testimonials";
import BookingForm from "../components/BookingForm";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div data-testid="home-page">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <About />
        <Testimonials />
        <BookingForm />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
