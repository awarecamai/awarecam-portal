import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Loader2, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to send reset email. Please try again.");
        return;
      }

      setSent(true);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <img
            src="https://cdn.manus.im/webdev/awarecamhub-7vq3kth4/1744574481-awarecam-logo.png"
            alt="AwareCam"
            className="h-10 object-contain mx-auto"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
          <p className="text-slate-400 text-sm mt-1">Partner Portal</p>
        </div>

        <div className="bg-slate-900/80 backdrop-blur border border-slate-700/50 rounded-2xl p-5 sm:p-8 shadow-2xl">
          {sent ? (
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-500/10 border border-green-500/20 mb-4">
                <CheckCircle2 className="h-7 w-7 text-green-400" />
              </div>
              <h2 className="text-lg font-semibold text-white mb-2">Check your email</h2>
              <p className="text-slate-400 text-sm mb-6">
                If an account exists for <strong className="text-white">{email}</strong>, we've sent a password reset link. The link expires in 1 hour.
              </p>
              <p className="text-slate-500 text-xs mb-6">
                Don't see it? Check your spam folder or contact{" "}
                <a href="mailto:support@awarecam.com" className="text-cyan-400 hover:text-cyan-300">
                  support@awarecam.com
                </a>
              </p>
              <Link href="/login">
                <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to sign in
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h1 className="text-xl font-semibold text-white mb-1">Forgot your password?</h1>
                <p className="text-slate-400 text-sm">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              {error && (
                <Alert className="mb-5 border-red-500/30 bg-red-500/10 text-red-400">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-slate-300 text-sm">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="bg-slate-800/60 border-slate-600/50 text-white placeholder:text-slate-500 focus:border-cyan-500/60 h-10"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full h-10 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold transition-colors"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending…
                    </>
                  ) : (
                    "Send reset link"
                  )}
                </Button>
              </form>

              <div className="mt-5 text-center">
                <Link href="/login" className="text-sm text-slate-400 hover:text-slate-300 transition-colors inline-flex items-center gap-1">
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back to sign in
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
