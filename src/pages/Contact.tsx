import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Instagram } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { z } from "zod";

const inquirySchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Please enter a valid email address").max(255, "Email must be less than 255 characters"),
  phone: z.string().trim().max(20, "Phone must be less than 20 characters").optional().or(z.literal("")),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(1000, "Message must be less than 1000 characters"),
});

const Contact = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    interest: "interior",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const validated = inquirySchema.parse({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        message: formData.message,
      });

      const { error } = await supabase
        .from("inquiries")
        .insert({
          name: validated.name,
          email: validated.email,
          phone: validated.phone || null,
          message: validated.message,
          inquiry_type: formData.interest,
          user_id: user?.id || null,
        });

      if (error) throw error;

      toast({
        title: "Message Sent",
        description: "Thank you for reaching out. I'll get back to you soon.",
      });
      setFormData({ name: "", email: "", phone: "", interest: "interior", message: "" });
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast({
          title: "Invalid Input",
          description: err.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to send message. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-40 pb-16 container-wide">
        <div className="max-w-4xl">
          <div className="inline-block mb-8">
            <p className="text-[10px] uppercase tracking-[0.4em] text-accent font-sans">
              Get in Touch
            </p>
            <div className="section-divider mt-4 mx-0" />
          </div>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl mb-8 leading-[1.1]">
            Let's Start a
            <span className="block text-accent mt-2">Conversation</span>
          </h1>
          <p className="text-xl text-muted-foreground font-sans leading-relaxed font-light">
            Whether you're dreaming of a new interior, searching for the perfect artwork, 
            or simply want to connect—I'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding pt-8">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32">
            {/* Form */}
            <div>
              <h2 className="font-serif text-3xl mb-10">Send a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.3em] font-sans text-muted-foreground mb-3 block">
                      Name *
                    </label>
                    <Input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-transparent border-border focus:border-accent rounded-none h-14 text-base"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.3em] font-sans text-muted-foreground mb-3 block">
                      Email *
                    </label>
                    <Input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-transparent border-border focus:border-accent rounded-none h-14 text-base"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.3em] font-sans text-muted-foreground mb-3 block">
                      Phone
                    </label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="bg-transparent border-border focus:border-accent rounded-none h-14 text-base"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.3em] font-sans text-muted-foreground mb-3 block">
                      I'm Interested In
                    </label>
                    <select
                      value={formData.interest}
                      onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                      className="w-full h-14 px-4 bg-transparent border border-border focus:border-accent outline-none font-sans text-base transition-colors"
                    >
                      <option value="interior">Interior Design</option>
                      <option value="art">Acquiring Artwork</option>
                      <option value="collaboration">Collaboration</option>
                      <option value="other">Something Else</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase tracking-[0.3em] font-sans text-muted-foreground mb-3 block">
                    Message *
                  </label>
                  <Textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="bg-transparent border-border focus:border-accent rounded-none min-h-[180px] resize-none text-base"
                    placeholder="Tell me about your project or what you're looking for..."
                  />
                </div>

                <Button variant="hero" size="lg" type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="font-serif text-3xl mb-10">Contact Information</h2>
              
              <div className="space-y-10 mb-16">
                {[
                  { icon: Mail, label: "Email", value: "hello@naveenvij.com", href: "mailto:hello@naveenvij.com" },
                  { icon: Phone, label: "Phone", value: "+91 98765 43210", href: "tel:+919876543210" },
                  { icon: MapPin, label: "Studio", value: "Bandra West, Mumbai\nMaharashtra, India", href: null },
                  { icon: Instagram, label: "Instagram", value: "@naveenvij.studio", href: "https://instagram.com" },
                ].map((item) => (
                  <div key={item.label} className="flex gap-6 group">
                    <div className="w-14 h-14 bg-secondary border border-border flex items-center justify-center flex-shrink-0 group-hover:border-accent transition-colors">
                      <item.icon size={20} className="text-accent" />
                    </div>
                    <div>
                      <h3 className="font-sans text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">
                        {item.label}
                      </h3>
                      {item.href ? (
                        <a
                          href={item.href}
                          target={item.href.startsWith("http") ? "_blank" : undefined}
                          rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                          className="font-sans text-lg hover:text-accent transition-colors whitespace-pre-line"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="font-sans text-lg whitespace-pre-line">
                          {item.value}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="premium-card p-10">
                <h3 className="font-serif text-2xl mb-6">Studio Hours</h3>
                <div className="space-y-2 text-muted-foreground font-sans leading-relaxed">
                  <p className="flex justify-between">
                    <span>Monday – Friday</span>
                    <span>10:00 AM – 6:00 PM</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Saturday</span>
                    <span>By Appointment</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Sunday</span>
                    <span>Closed</span>
                  </p>
                </div>
                <div className="section-divider my-6" />
                <p className="text-muted-foreground font-sans text-sm italic">
                  Studio visits are welcome by prior appointment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
