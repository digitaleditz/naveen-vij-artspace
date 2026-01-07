import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, ArrowRight, Check, ShoppingBag, Package, CreditCard } from "lucide-react";
import { z } from "zod";
import artwork1 from "@/assets/artwork-1.jpg";
import artwork2 from "@/assets/artwork-2.jpg";
import artwork3 from "@/assets/artwork-3.jpg";
import paintingFeatured from "@/assets/painting-featured.jpg";

const shippingSchema = z.object({
  fullName: z.string().trim().min(2, "Name is required").max(100),
  email: z.string().trim().email("Valid email required").max(255),
  phone: z.string().trim().min(10, "Valid phone required").max(20),
  address: z.string().trim().min(10, "Complete address required").max(500),
  city: z.string().trim().min(2, "City is required").max(100),
  state: z.string().trim().min(2, "State is required").max(100),
  pincode: z.string().trim().min(6, "Valid pincode required").max(10),
  notes: z.string().max(500).optional(),
});

type ShippingForm = z.infer<typeof shippingSchema>;

const getArtworkImage = (imageUrl: string | null, index: number) => {
  if (imageUrl) {
    const images: Record<string, string> = {
      "/artwork-1.jpg": artwork1,
      "/artwork-2.jpg": artwork2,
      "/artwork-3.jpg": artwork3,
      "/painting-featured.jpg": paintingFeatured,
    };
    return images[imageUrl] || artwork1;
  }
  const fallbacks = [artwork1, artwork2, artwork3, paintingFeatured];
  return fallbacks[index % fallbacks.length];
};

const Checkout = () => {
  const { items, total, clearCart, removeFromCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState<"cart" | "details" | "payment" | "success">("cart");
  const [form, setForm] = useState<ShippingForm>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Partial<ShippingForm>>({});
  const [processing, setProcessing] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth?redirect=/checkout");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("profiles")
      .select("full_name, phone, city")
      .eq("user_id", user.id)
      .maybeSingle();

    if (data) {
      setForm((prev) => ({
        ...prev,
        fullName: data.full_name || "",
        phone: data.phone || "",
        city: data.city || "",
        email: user.email || "",
      }));
    }
  };

  const validateForm = () => {
    try {
      shippingSchema.parse(form);
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Partial<ShippingForm> = {};
        err.errors.forEach((e) => {
          const field = e.path[0] as keyof ShippingForm;
          fieldErrors[field] = e.message;
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleProceedToDetails = () => {
    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add artworks to your cart before checkout.",
        variant: "destructive",
      });
      return;
    }
    setStep("details");
  };

  const handleProceedToPayment = () => {
    if (!validateForm()) return;
    setStep("payment");
  };

  const handleProcessPayment = async () => {
    if (!user) return;
    setProcessing(true);

    try {
      // Create orders for each item
      for (const item of items) {
        const shippingAddress = `${form.fullName}\n${form.address}\n${form.city}, ${form.state} - ${form.pincode}\nPhone: ${form.phone}`;

        const { data, error } = await supabase
          .from("orders")
          .insert({
            user_id: user.id,
            artwork_id: item.artwork.id,
            total_amount: item.artwork.price,
            shipping_address: shippingAddress,
            notes: form.notes || null,
            status: "confirmed",
          })
          .select("id")
          .single();

        if (error) throw error;
        if (data) setOrderId(data.id);
      }

      clearCart();
      setStep("success");
      toast({
        title: "Order placed successfully",
        description: "You will receive a confirmation email shortly.",
      });
    } catch (error: any) {
      toast({
        title: "Order failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }

    setProcessing(false);
  };

  if (items.length === 0 && step !== "success") {
    return (
      <Layout>
        <section className="pt-32 pb-20 container-wide min-h-screen">
          <div className="max-w-2xl mx-auto text-center">
            <ShoppingBag size={64} className="mx-auto text-muted-foreground/30 mb-6" />
            <h1 className="font-serif text-3xl md:text-4xl mb-4">Your Cart is Empty</h1>
            <p className="text-muted-foreground font-sans mb-8">
              Explore our collection and find pieces that speak to you.
            </p>
            <Button variant="hero" asChild>
              <Link to="/collection">
                Explore Collection
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </Button>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="pt-32 pb-20 container-wide min-h-screen">
        <div className="max-w-5xl mx-auto">
          {/* Progress Steps */}
          {step !== "success" && (
            <div className="flex items-center justify-center mb-16">
              {[
                { id: "cart", label: "Cart", icon: ShoppingBag },
                { id: "details", label: "Details", icon: Package },
                { id: "payment", label: "Payment", icon: CreditCard },
              ].map((s, i) => (
                <div key={s.id} className="flex items-center">
                  <div
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                      step === s.id
                        ? "bg-accent text-accent-foreground"
                        : ["cart", "details", "payment"].indexOf(step) > i
                        ? "bg-accent/20 text-accent"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    <s.icon size={16} />
                    <span className="text-xs uppercase tracking-wider font-sans hidden sm:inline">
                      {s.label}
                    </span>
                  </div>
                  {i < 2 && (
                    <div
                      className={`w-12 h-px mx-2 ${
                        ["cart", "details", "payment"].indexOf(step) > i
                          ? "bg-accent"
                          : "bg-border"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Cart Step */}
          {step === "cart" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <h1 className="font-serif text-3xl mb-8">Your Selection</h1>
                <div className="space-y-6">
                  {items.map((item, index) => (
                    <div
                      key={item.artwork.id}
                      className="flex gap-6 p-6 bg-secondary/50 border border-border"
                    >
                      <div className="w-32 h-32 flex-shrink-0 overflow-hidden">
                        <img
                          src={getArtworkImage(item.artwork.image_url, index)}
                          alt={item.artwork.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs uppercase tracking-widest text-muted-foreground font-sans mb-1">
                          {item.artwork.collection}
                        </p>
                        <h3 className="font-serif text-xl mb-2">{item.artwork.title}</h3>
                        <p className="text-sm text-muted-foreground font-sans mb-2">
                          {item.artwork.size} • {item.artwork.medium}
                        </p>
                        <p className="text-accent font-serif text-lg">
                          ₹{item.artwork.price.toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.artwork.id)}
                        className="text-muted-foreground hover:text-foreground transition-colors text-sm font-sans"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="sticky top-32 p-8 bg-secondary/50 border border-border">
                  <h2 className="font-serif text-xl mb-6">Order Summary</h2>
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-sm font-sans">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>₹{total.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm font-sans">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="text-accent">Complimentary</span>
                    </div>
                    <div className="border-t border-border pt-4">
                      <div className="flex justify-between font-serif text-xl">
                        <span>Total</span>
                        <span className="text-accent">₹{total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="hero"
                    size="lg"
                    className="w-full"
                    onClick={handleProceedToDetails}
                  >
                    Continue
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Details Step */}
          {step === "details" && (
            <div className="max-w-2xl mx-auto">
              <button
                onClick={() => setStep("cart")}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 text-sm font-sans"
              >
                <ArrowLeft size={16} />
                Back to cart
              </button>

              <h1 className="font-serif text-3xl mb-8">Shipping Details</h1>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs uppercase tracking-widest font-sans text-muted-foreground mb-2 block">
                      Full Name *
                    </label>
                    <Input
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      className="bg-transparent border-border focus:border-accent rounded-none h-12"
                    />
                    {errors.fullName && (
                      <p className="text-sm text-destructive mt-1">{errors.fullName}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-widest font-sans text-muted-foreground mb-2 block">
                      Email *
                    </label>
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="bg-transparent border-border focus:border-accent rounded-none h-12"
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-xs uppercase tracking-widest font-sans text-muted-foreground mb-2 block">
                    Phone *
                  </label>
                  <Input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="bg-transparent border-border focus:border-accent rounded-none h-12"
                    placeholder="+91 98765 43210"
                  />
                  {errors.phone && (
                    <p className="text-sm text-destructive mt-1">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs uppercase tracking-widest font-sans text-muted-foreground mb-2 block">
                    Shipping Address *
                  </label>
                  <Textarea
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="bg-transparent border-border focus:border-accent rounded-none min-h-24"
                    placeholder="House/Flat No., Building Name, Street, Landmark"
                  />
                  {errors.address && (
                    <p className="text-sm text-destructive mt-1">{errors.address}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="text-xs uppercase tracking-widest font-sans text-muted-foreground mb-2 block">
                      City *
                    </label>
                    <Input
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className="bg-transparent border-border focus:border-accent rounded-none h-12"
                    />
                    {errors.city && (
                      <p className="text-sm text-destructive mt-1">{errors.city}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-widest font-sans text-muted-foreground mb-2 block">
                      State *
                    </label>
                    <Input
                      value={form.state}
                      onChange={(e) => setForm({ ...form, state: e.target.value })}
                      className="bg-transparent border-border focus:border-accent rounded-none h-12"
                    />
                    {errors.state && (
                      <p className="text-sm text-destructive mt-1">{errors.state}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-widest font-sans text-muted-foreground mb-2 block">
                      Pincode *
                    </label>
                    <Input
                      value={form.pincode}
                      onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                      className="bg-transparent border-border focus:border-accent rounded-none h-12"
                    />
                    {errors.pincode && (
                      <p className="text-sm text-destructive mt-1">{errors.pincode}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-xs uppercase tracking-widest font-sans text-muted-foreground mb-2 block">
                    Special Instructions (Optional)
                  </label>
                  <Textarea
                    value={form.notes || ""}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className="bg-transparent border-border focus:border-accent rounded-none min-h-20"
                    placeholder="Any specific delivery instructions..."
                  />
                </div>

                <Button
                  variant="hero"
                  size="lg"
                  className="w-full"
                  onClick={handleProceedToPayment}
                >
                  Continue to Payment
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Payment Step */}
          {step === "payment" && (
            <div className="max-w-2xl mx-auto">
              <button
                onClick={() => setStep("details")}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 text-sm font-sans"
              >
                <ArrowLeft size={16} />
                Back to details
              </button>

              <h1 className="font-serif text-3xl mb-8">Complete Your Acquisition</h1>

              <div className="p-8 bg-secondary/50 border border-border mb-8">
                <h2 className="font-serif text-xl mb-6">Order Summary</h2>
                {items.map((item, index) => (
                  <div key={item.artwork.id} className="flex gap-4 mb-4 pb-4 border-b border-border last:border-0">
                    <div className="w-16 h-16 overflow-hidden">
                      <img
                        src={getArtworkImage(item.artwork.image_url, index)}
                        alt={item.artwork.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-serif">{item.artwork.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.artwork.size}</p>
                    </div>
                    <p className="font-serif text-accent">₹{item.artwork.price.toLocaleString()}</p>
                  </div>
                ))}
                <div className="flex justify-between font-serif text-xl mt-4 pt-4 border-t border-border">
                  <span>Total</span>
                  <span className="text-accent">₹{total.toLocaleString()}</span>
                </div>
              </div>

              <div className="p-8 bg-accent/5 border border-accent/20 mb-8">
                <h3 className="font-serif text-lg mb-4">Payment Method</h3>
                <p className="text-muted-foreground font-sans text-sm mb-4">
                  This is a demo checkout. In production, this would connect to a secure payment gateway.
                </p>
                <div className="flex items-center gap-3 p-4 bg-background border border-border">
                  <CreditCard size={24} className="text-accent" />
                  <div>
                    <p className="font-sans text-sm font-medium">Mock Payment</p>
                    <p className="text-xs text-muted-foreground">Click below to simulate payment</p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-secondary/30 border border-border mb-8">
                <h3 className="font-serif text-lg mb-2">Shipping To</h3>
                <p className="text-sm text-muted-foreground font-sans whitespace-pre-line">
                  {form.fullName}
                  {"\n"}{form.address}
                  {"\n"}{form.city}, {form.state} - {form.pincode}
                  {"\n"}Phone: {form.phone}
                </p>
              </div>

              <Button
                variant="hero"
                size="lg"
                className="w-full"
                onClick={handleProcessPayment}
                disabled={processing}
              >
                {processing ? "Processing..." : `Complete Purchase • ₹${total.toLocaleString()}`}
              </Button>
            </div>
          )}

          {/* Success Step */}
          {step === "success" && (
            <div className="max-w-2xl mx-auto text-center py-16">
              <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-8">
                <Check size={40} className="text-accent" />
              </div>
              <h1 className="font-serif text-4xl mb-4">Order Confirmed</h1>
              <p className="text-muted-foreground font-sans text-lg mb-8">
                Thank you for your acquisition. Your order has been placed successfully.
              </p>
              {orderId && (
                <p className="text-sm text-muted-foreground font-sans mb-8">
                  Order Reference: <span className="font-mono text-foreground">{orderId.slice(0, 8).toUpperCase()}</span>
                </p>
              )}
              <div className="p-8 bg-secondary/50 border border-border mb-8 text-left">
                <h3 className="font-serif text-lg mb-4">What's Next?</h3>
                <ul className="space-y-3 text-sm text-muted-foreground font-sans">
                  <li className="flex items-start gap-3">
                    <Check size={16} className="text-accent mt-0.5" />
                    <span>You will receive a confirmation email shortly</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check size={16} className="text-accent mt-0.5" />
                    <span>Our team will prepare your artwork with the utmost care</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check size={16} className="text-accent mt-0.5" />
                    <span>You can track your order status in your profile</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check size={16} className="text-accent mt-0.5" />
                    <span>Naveen Vij may reach out for a personal consultation</span>
                  </li>
                </ul>
              </div>
              <div className="flex gap-4 justify-center">
                <Button variant="hero" asChild>
                  <Link to="/profile">
                    View Orders
                    <ArrowRight size={16} className="ml-2" />
                  </Link>
                </Button>
                <Button variant="heroOutline" asChild>
                  <Link to="/collection">Continue Exploring</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Checkout;
