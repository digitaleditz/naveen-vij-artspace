import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Instagram } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    interest: "interior",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent",
      description: "Thank you for reaching out. I'll get back to you soon.",
    });
    setFormData({ name: "", email: "", phone: "", interest: "interior", message: "" });
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-16 container-wide">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.3em] text-accent font-sans mb-6">
            Get in Touch
          </p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight">
            Let's Start a
            <span className="block text-accent">Conversation</span>
          </h1>
          <p className="text-lg text-muted-foreground font-sans leading-relaxed">
            Whether you're dreaming of a new interior, searching for the perfect artwork, 
            or simply want to connect—I'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding pt-8">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Form */}
            <div>
              <h2 className="font-serif text-2xl mb-8">Send a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs uppercase tracking-widest font-sans text-muted-foreground mb-2 block">
                      Name *
                    </label>
                    <Input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-transparent border-border focus:border-accent rounded-none h-12"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-widest font-sans text-muted-foreground mb-2 block">
                      Email *
                    </label>
                    <Input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-transparent border-border focus:border-accent rounded-none h-12"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs uppercase tracking-widest font-sans text-muted-foreground mb-2 block">
                      Phone
                    </label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="bg-transparent border-border focus:border-accent rounded-none h-12"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-widest font-sans text-muted-foreground mb-2 block">
                      I'm Interested In
                    </label>
                    <select
                      value={formData.interest}
                      onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                      className="w-full h-12 px-3 bg-transparent border border-border focus:border-accent outline-none font-sans text-sm"
                    >
                      <option value="interior">Interior Design</option>
                      <option value="art">Purchasing Artwork</option>
                      <option value="commission">Custom Commission</option>
                      <option value="other">Something Else</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs uppercase tracking-widest font-sans text-muted-foreground mb-2 block">
                    Message *
                  </label>
                  <Textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="bg-transparent border-border focus:border-accent rounded-none min-h-[160px] resize-none"
                    placeholder="Tell me about your project or what you're looking for..."
                  />
                </div>

                <Button variant="hero" size="lg" type="submit" className="w-full md:w-auto">
                  Send Message
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="font-serif text-2xl mb-8">Contact Information</h2>
              
              <div className="space-y-8 mb-12">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-secondary flex items-center justify-center flex-shrink-0">
                    <Mail size={20} className="text-accent" />
                  </div>
                  <div>
                    <h3 className="font-sans text-xs uppercase tracking-widest text-muted-foreground mb-1">
                      Email
                    </h3>
                    <a
                      href="mailto:hello@naveenvij.com"
                      className="font-sans text-lg hover:text-accent transition-colors"
                    >
                      hello@naveenvij.com
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-secondary flex items-center justify-center flex-shrink-0">
                    <Phone size={20} className="text-accent" />
                  </div>
                  <div>
                    <h3 className="font-sans text-xs uppercase tracking-widest text-muted-foreground mb-1">
                      Phone
                    </h3>
                    <a
                      href="tel:+919876543210"
                      className="font-sans text-lg hover:text-accent transition-colors"
                    >
                      +91 98765 43210
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-secondary flex items-center justify-center flex-shrink-0">
                    <MapPin size={20} className="text-accent" />
                  </div>
                  <div>
                    <h3 className="font-sans text-xs uppercase tracking-widest text-muted-foreground mb-1">
                      Studio
                    </h3>
                    <p className="font-sans text-lg">
                      Bandra West, Mumbai<br />
                      Maharashtra, India
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-secondary flex items-center justify-center flex-shrink-0">
                    <Instagram size={20} className="text-accent" />
                  </div>
                  <div>
                    <h3 className="font-sans text-xs uppercase tracking-widest text-muted-foreground mb-1">
                      Instagram
                    </h3>
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-sans text-lg hover:text-accent transition-colors"
                    >
                      @naveenvij.studio
                    </a>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-secondary">
                <h3 className="font-serif text-xl mb-4">Studio Hours</h3>
                <p className="text-muted-foreground font-sans text-sm leading-relaxed">
                  Monday – Friday: 10:00 AM – 6:00 PM<br />
                  Saturday: By Appointment<br />
                  Sunday: Closed
                </p>
                <p className="text-muted-foreground font-sans text-sm mt-4">
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
