import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    quote: "Naveen transformed our apartment into something we never imagined possible. Every corner now feels intentional, artistic, and deeply personal.",
    author: "Priya & Arjun Mehta",
    role: "Residential Client, Mumbai",
    type: "Interior Design",
  },
  {
    id: 2,
    quote: "His painting 'Urban Geometry' has become the centerpiece of our living room. It's not just art—it's a conversation starter and a source of daily inspiration.",
    author: "Vikram Sharma",
    role: "Art Collector, Delhi",
    type: "Art Purchase",
  },
  {
    id: 3,
    quote: "Working with Naveen on our café design was an incredible experience. He understood our brand's soul and created a space that our customers fall in love with.",
    author: "Anjali Kapoor",
    role: "Founder, The Artisan Café",
    type: "Commercial Design",
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
    <section className="section-padding bg-primary text-primary-foreground">
      <div className="container-wide">
        <div className="max-w-4xl mx-auto text-center">
          <Quote className="w-12 h-12 mx-auto mb-10 text-accent opacity-50" />
          
          <div className="relative min-h-[300px] flex items-center justify-center">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`absolute inset-0 transition-all duration-700 flex flex-col items-center justify-center ${
                  index === currentIndex
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8 pointer-events-none"
                }`}
              >
                <p className="font-serif text-xl md:text-2xl lg:text-3xl leading-relaxed mb-10 italic">
                  "{testimonial.quote}"
                </p>
                
                <div>
                  <p className="font-sans text-base mb-1">{testimonial.author}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-primary-foreground/60">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-10">
            <button
              onClick={prev}
              className="w-12 h-12 rounded-full border border-primary-foreground/20 flex items-center justify-center hover:border-accent hover:text-accent transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={20} />
            </button>
            
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "w-8 bg-accent"
                      : "bg-primary-foreground/30 hover:bg-primary-foreground/50"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            
            <button
              onClick={next}
              className="w-12 h-12 rounded-full border border-primary-foreground/20 flex items-center justify-center hover:border-accent hover:text-accent transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
