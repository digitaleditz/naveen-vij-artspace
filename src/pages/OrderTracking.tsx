import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
} from "lucide-react";
import artwork1 from "@/assets/artwork-1.jpg";
import artwork2 from "@/assets/artwork-2.jpg";
import artwork3 from "@/assets/artwork-3.jpg";
import paintingFeatured from "@/assets/painting-featured.jpg";

interface OrderDetails {
  id: string;
  status: string;
  shipping_status: string | null;
  tracking_number: string | null;
  estimated_delivery: string | null;
  total_amount: number;
  shipping_address: string | null;
  created_at: string;
  artwork: {
    title: string;
    image_url: string | null;
    size: string;
    medium: string;
  } | null;
}

const getArtworkImage = (imageUrl: string | null) => {
  if (imageUrl) {
    const images: Record<string, string> = {
      "/artwork-1.jpg": artwork1,
      "/artwork-2.jpg": artwork2,
      "/artwork-3.jpg": artwork3,
      "/painting-featured.jpg": paintingFeatured,
    };
    return images[imageUrl] || artwork1;
  }
  return artwork1;
};

const OrderTracking = () => {
  const { orderId } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId && user) {
      fetchOrder();
    }
  }, [orderId, user]);

  const fetchOrder = async () => {
    if (!orderId || !user) return;

    const { data, error } = await supabase
      .from("orders")
      .select(`
        id,
        status,
        shipping_status,
        tracking_number,
        estimated_delivery,
        total_amount,
        shipping_address,
        created_at,
        artworks (
          title,
          image_url,
          size,
          medium
        )
      `)
      .eq("id", orderId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (!error && data) {
      setOrder({
        ...data,
        artwork: data.artworks as OrderDetails["artwork"],
      });
    }
    setLoading(false);
  };

  const getStatusStep = (status: string) => {
    const steps = ["pending", "confirmed", "processing", "shipped", "delivered"];
    return steps.indexOf(status);
  };

  const trackingSteps = [
    { id: "confirmed", label: "Order Confirmed", icon: CheckCircle },
    { id: "processing", label: "Preparing Artwork", icon: Package },
    { id: "shipped", label: "Shipped", icon: Truck },
    { id: "delivered", label: "Delivered", icon: MapPin },
  ];

  if (loading) {
    return (
      <Layout>
        <div className="pt-32 pb-20 container-wide min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground">Loading order details...</p>
        </div>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout>
        <div className="pt-32 pb-20 container-wide min-h-screen">
          <div className="max-w-2xl mx-auto text-center">
            <Package size={64} className="mx-auto text-muted-foreground/30 mb-6" />
            <h1 className="font-serif text-3xl mb-4">Order Not Found</h1>
            <p className="text-muted-foreground font-sans mb-8">
              We couldn't find this order. Please check your order ID and try again.
            </p>
            <Button variant="hero" asChild>
              <Link to="/profile">View Your Orders</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const currentStep = getStatusStep(order.status);

  return (
    <Layout>
      <section className="pt-32 pb-20 container-wide min-h-screen">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/profile"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 text-sm font-sans"
          >
            <ArrowLeft size={16} />
            Back to Profile
          </Link>

          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.3em] text-accent font-sans mb-2">
              Order Tracking
            </p>
            <h1 className="font-serif text-3xl md:text-4xl mb-2">
              Order #{order.id.slice(0, 8).toUpperCase()}
            </h1>
            <p className="text-muted-foreground font-sans text-sm">
              Placed on{" "}
              {new Date(order.created_at).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* Artwork Info */}
          {order.artwork && (
            <div className="flex gap-6 p-6 bg-secondary/50 border border-border mb-10">
              <div className="w-24 h-24 flex-shrink-0 overflow-hidden">
                <img
                  src={getArtworkImage(order.artwork.image_url)}
                  alt={order.artwork.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="font-serif text-xl mb-1">{order.artwork.title}</h2>
                <p className="text-sm text-muted-foreground font-sans mb-2">
                  {order.artwork.size} • {order.artwork.medium}
                </p>
                <p className="text-accent font-serif text-lg">
                  ₹{order.total_amount.toLocaleString()}
                </p>
              </div>
            </div>
          )}

          {/* Tracking Progress */}
          <div className="mb-10">
            <h3 className="font-serif text-xl mb-6">Tracking Status</h3>
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />
              <div
                className="absolute left-6 top-0 w-px bg-accent transition-all duration-500"
                style={{
                  height: `${Math.min((currentStep / (trackingSteps.length - 1)) * 100, 100)}%`,
                }}
              />

              {/* Steps */}
              <div className="space-y-8">
                {trackingSteps.map((step, index) => {
                  const isComplete = currentStep >= index;
                  const isCurrent = currentStep === index;

                  return (
                    <div key={step.id} className="flex items-start gap-6 relative">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center z-10 transition-colors ${
                          isComplete
                            ? "bg-accent text-accent-foreground"
                            : "bg-secondary border border-border text-muted-foreground"
                        }`}
                      >
                        <step.icon size={20} />
                      </div>
                      <div className="flex-1 pt-2">
                        <p
                          className={`font-sans font-medium ${
                            isComplete ? "text-foreground" : "text-muted-foreground"
                          }`}
                        >
                          {step.label}
                        </p>
                        {isCurrent && order.status !== "cancelled" && (
                          <p className="text-sm text-accent font-sans mt-1">
                            Current Status
                          </p>
                        )}
                        {step.id === "shipped" && order.tracking_number && isComplete && (
                          <p className="text-sm text-muted-foreground font-sans mt-1">
                            Tracking: {order.tracking_number}
                          </p>
                        )}
                        {step.id === "delivered" && order.estimated_delivery && !isComplete && (
                          <p className="text-sm text-muted-foreground font-sans mt-1">
                            Expected:{" "}
                            {new Date(order.estimated_delivery).toLocaleDateString("en-IN", {
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          {order.shipping_address && (
            <div className="p-6 bg-secondary/30 border border-border mb-10">
              <h3 className="font-serif text-lg mb-4 flex items-center gap-2">
                <MapPin size={18} className="text-accent" />
                Delivery Address
              </h3>
              <p className="text-sm text-muted-foreground font-sans whitespace-pre-line">
                {order.shipping_address}
              </p>
            </div>
          )}

          {/* Support */}
          <div className="p-6 bg-accent/5 border border-accent/20">
            <h3 className="font-serif text-lg mb-2">Need Help?</h3>
            <p className="text-sm text-muted-foreground font-sans mb-4">
              If you have any questions about your order, please don't hesitate to contact us.
            </p>
            <Button variant="heroOutline" asChild>
              <Link to="/contact">
                <Phone size={16} className="mr-2" />
                Contact Support
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default OrderTracking;
