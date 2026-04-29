import { Star, Quote } from "lucide-react";

const reviews = [
  {
    name: "Tamara B.",
    role: "Kingston · Cleaning & whitening",
    img: "https://images.pexels.com/photos/3845549/pexels-photo-3845549.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=400",
    text: "Felt more like a coastal spa than a dentist. My cleaning and whitening result was beyond what I imagined — and totally painless.",
  },
  {
    name: "Marcus R.",
    role: "Montego Bay · Crown & bridge",
    img: "https://images.pexels.com/photos/8498412/pexels-photo-8498412.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=400",
    text: "The team walked me through every step of my crown and bridge treatment. I smile bigger than I ever used to — honestly life changing.",
  },
  {
    name: "Keisha M.",
    role: "Negril · Family patient",
    img: "https://images.pexels.com/photos/3845625/pexels-photo-3845625.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=400",
    text: "My whole family trusts Be Dental Paradise — from my six-year-old to my grandparents. Calm, patient and beautifully run.",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 lg:py-32 bg-white" data-testid="testimonials-section">
      <div className="container-x">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <div className="eyebrow mb-4">~ Kind words</div>
            <h2 className="text-4xl sm:text-5xl text-paradise-navy">
              Smiles that speak <em className="text-paradise-sky font-medium not-italic">for themselves</em>.
            </h2>
          </div>
          <div className="flex items-center gap-2 text-paradise-navy">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-paradise-yellow text-paradise-yellow" />
            ))}
            <span className="ml-2 text-sm text-paradise-slate">Loved by families across Jamaica</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-7">
          {reviews.map((r, i) => (
            <article
              key={r.name}
              className="relative bg-paradise-skySoft rounded-2xl p-8 border border-sky-100 hover:-translate-y-1 transition-transform duration-300"
              data-testid={`testimonial-${i}`}
            >
              <Quote className="w-10 h-10 text-paradise-sky/30 absolute -top-4 -left-2" />
              <p className="font-display italic text-xl text-paradise-ink leading-snug">
                “{r.text}”
              </p>
              <div className="flex items-center gap-4 mt-8">
                <img
                  src={r.img}
                  alt={r.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-soft"
                />
                <div>
                  <div className="font-medium text-paradise-navy">{r.name}</div>
                  <div className="text-xs text-paradise-slate">{r.role}</div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
