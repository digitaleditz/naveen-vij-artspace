import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    quote: "His painting 'Urban Geometry' has become the centerpiece of our living room. It's not just art—it's a conversation starter and a source of daily inspiration.",
    author: "Vikram Sharma",
    role: "Art Collector, Delhi",
  },
  {
    id: 2,
    quote: "Acquiring a piece from Naveen felt like bringing home a piece of architecture that exists beyond walls. The painting transforms our space completely.",
    author: "Priya & Arjun Mehta",
    role: "Collectors, Mumbai",
  },
  {
    id: 3,
    quote: "There's something deeply meditative about his work. The architectural discipline behind each brushstroke creates a sense of calm that fills the entire room.",
    author: "Dr. Anjali Kapoor",
    role: "Art Patron, Bangalore",
  },
];

export const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="section-padding bg-primary text-primary-foreground relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      
      <div className="container-wide relative z-10">
        <div className="text-center mb-10">
          <p className="text-[10px] uppercase tracking-[0.4em] text-accent font-sans mb-4">
            Collectors Speak
          </p>
        </div>

        <div className="max-w-4xl mx-auto text-center">
          <Quote className="w-12 h-12 mx-auto mb-8 text-accent opacity-40" />
          
          <div className="relative min-h-[220px] flex items-center justify-center">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`absolute inset-0 transition-all duration-700 flex flex-col items-center justify-center px-4 ${
                  index === currentIndex
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8 pointer-events-none"
                }`}
              >
                <p className="font-serif text-xl md:text-2xl lg:text-3xl leading-relaxed mb-8 italic font-light">
                  "{testimonial.quote}"
                </p>
                
                <div>
                  <p className="font-sans text-base mb-1">{testimonial.author}</p>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-primary-foreground/50">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-5 mt-10">
            <button
              onClick={prev}
              className="w-11 h-11 rounded-full border border-primary-foreground/20 flex items-center justify-center hover:border-accent hover:text-accent transition-all duration-300"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={18} />
            </button>
            
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    index === currentIndex
                      ? "w-8 bg-accent"
                      : "w-1.5 bg-primary-foreground/30 hover:bg-primary-foreground/50"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            
            <button
              onClick={next}
              className="w-11 h-11 rounded-full border border-primary-foreground/20 flex items-center justify-center hover:border-accent hover:text-accent transition-all duration-300"
              aria-label="Next testimonial"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
