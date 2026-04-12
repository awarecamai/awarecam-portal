import { useAuth } from "@/_core/hooks/useAuth";
import { Shield, Eye, Zap, Lock, ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { Link, useLocation } from "wouter";

export default function Home() {
  const { isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center animate-pulse">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border px-4 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663429873569/7vQ3kTH4U9Q6fPjutgr3Jc/awarecam_logo_full_20d05116.png"
            alt="AwareCam"
            className="w-10 h-10 object-contain"
          />
          <div>
            <span className="text-lg font-bold text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              AwareCam
            </span>
            <span className="text-xs text-muted-foreground ml-2 uppercase tracking-widest">Partner Portal</span>
          </div>
        </div>
        <Button asChild size="sm">
          <Link href="/login">
            Sign In <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </Button>
      </header>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 md:px-8 py-12 md:py-20">
        {/* Glow orb */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-medium mb-8">
            <Eye className="w-3 h-3" />
            AI-Powered Video Intelligence Platform
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            The AwareCam{" "}
            <span
              style={{
                background: "linear-gradient(135deg, oklch(0.65 0.2 200), oklch(0.55 0.18 240))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Partner Portal
            </span>
          </h1>

          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed">
            Your centralized hub for onboarding resources, installation guides, sales training, 
            and AI-powered support — built for resellers, integrators, and partners.
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 md:mb-12 text-left">
            {[
              { icon: BookOpen, title: "Document Library", desc: "Legal, setup guides, and technical references" },
              { icon: Zap, title: "AI Assistant", desc: "Instant answers, camera lookup, and custom quotes" },
              { icon: Lock, title: "Role-Based Access", desc: "Tailored content for every partner type" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-4 rounded-xl border border-border bg-card/50 backdrop-blur-sm">
                <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center mb-3">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <div className="text-sm font-semibold text-foreground mb-1">{title}</div>
                <div className="text-xs text-muted-foreground">{desc}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <Button asChild size="lg" className="gap-2 px-8">
            <Link href="/login">
              Access Partner Portal
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>

          <p className="text-xs text-muted-foreground mt-4">
            Authorized partners only · Contact your AwareCam representative for access
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border px-4 md:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>© 2025 AwareCam. All rights reserved.</span>
        <div className="flex items-center gap-4">
          <span>AwareCam Inc. (US) · AwareCam Ltd. (IL)</span>
        </div>
      </footer>
    </div>
  );
}


