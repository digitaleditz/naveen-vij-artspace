import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const authSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(72),
  fullName: z.string().trim().min(2, "Name must be at least 2 characters").max(100).optional(),
});

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; fullName?: string }>({});
  
  const { signIn, signUp, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const validateForm = () => {
    try {
      if (isLogin) {
        authSchema.pick({ email: true, password: true }).parse({ email, password });
      } else {
        authSchema.parse({ email, password, fullName });
      }
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: typeof errors = {};
        err.errors.forEach((e) => {
          const field = e.path[0] as keyof typeof errors;
          fieldErrors[field] = e.message;
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);

    if (isLogin) {
      const { error } = await signIn(email, password);
      if (error) {
        toast({
          title: "Sign in failed",
          description: error.message === "Invalid login credentials" 
            ? "Invalid email or password. Please try again." 
            : error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome back",
          description: "You have successfully signed in.",
        });
        navigate("/");
      }
    } else {
      const { error } = await signUp(email, password, fullName);
      if (error) {
        toast({
          title: "Sign up failed",
          description: error.message.includes("already registered") 
            ? "This email is already registered. Please sign in instead." 
            : error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome",
          description: "Your account has been created successfully.",
        });
        navigate("/");
      }
    }
    
    setLoading(false);
  };

  return (
    <Layout>
      <section className="pt-32 pb-20 container-wide min-h-screen">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.3em] text-accent font-sans mb-4">
              {isLogin ? "Welcome Back" : "Join the Vision"}
            </p>
            <h1 className="font-serif text-3xl md:text-4xl mb-4">
              {isLogin ? "Sign In" : "Create Account"}
            </h1>
            <p className="text-muted-foreground font-sans text-sm">
              {isLogin 
                ? "Enter your credentials to access your collection." 
                : "Join to save artworks and track your acquisitions."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="text-xs uppercase tracking-widest font-sans text-muted-foreground mb-2 block">
                  Full Name
                </label>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="bg-transparent border-border focus:border-accent rounded-none h-12"
                  placeholder="Your full name"
                />
                {errors.fullName && (
                  <p className="text-sm text-destructive mt-1">{errors.fullName}</p>
                )}
              </div>
            )}
            
            <div>
              <label className="text-xs uppercase tracking-widest font-sans text-muted-foreground mb-2 block">
                Email Address
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent border-border focus:border-accent rounded-none h-12"
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="text-sm text-destructive mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest font-sans text-muted-foreground mb-2 block">
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent border-border focus:border-accent rounded-none h-12"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-sm text-destructive mt-1">{errors.password}</p>
              )}
            </div>

            <Button 
              variant="hero" 
              size="lg" 
              type="submit" 
              className="w-full"
              disabled={loading}
            >
              {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-muted-foreground font-sans text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrors({});
                }}
                className="text-accent hover:underline ml-2 font-medium"
              >
                {isLogin ? "Create one" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Auth;
