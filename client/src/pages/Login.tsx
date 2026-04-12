import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { trpc } from "@/lib/trpc";

export default function Login() {
  const [, navigate] = useLocation();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");

  const utils = trpc.useUtils();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }
      await utils.auth.me.invalidate();
      navigate("/dashboard");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (regPassword !== regConfirm) {
      setError("Passwords do not match");
      return;
    }
    if (regPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: regName, email: regEmail, password: regPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }
      await utils.auth.me.invalidate();
      navigate("/dashboard");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex flex-col items-center justify-center px-4">
      {/* Logo / brand */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center mb-2">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663429873569/7vQ3kTH4U9Q6fPjutgr3Jc/awarecam_logo_full_8e2d3e8d.png"
            alt="AwareCam"
            className="h-12 object-contain"
          />
        </div>
        <p className="text-blue-400 text-sm">Partner Portal</p>
      </div>

      <Card className="w-full max-w-md bg-[#111827] border-white/10 text-white shadow-2xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl text-white text-center">Welcome back</CardTitle>
          <CardDescription className="text-gray-400 text-center">Sign in to access your partner resources</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="mb-4 bg-red-900/30 border-red-500/50 text-red-300">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Tabs value={tab} onValueChange={(v) => { setTab(v as any); setError(""); }}>
            <TabsList className="w-full bg-white/5 mb-5">
              <TabsTrigger value="login" className="flex-1 data-[state=active]:bg-blue-600 data-[state=active]:text-white">Sign In</TabsTrigger>
              <TabsTrigger value="register" className="flex-1 data-[state=active]:bg-blue-600 data-[state=active]:text-white">Register</TabsTrigger>
            </TabsList>

            {/* Login tab */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="login-email" className="text-gray-300">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@company.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="login-password" className="text-gray-300">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-blue-500"
                  />
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>
                  {loading ? "Signing in…" : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            {/* Register tab */}
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="reg-name" className="text-gray-300">Full Name</Label>
                  <Input
                    id="reg-name"
                    type="text"
                    autoComplete="name"
                    placeholder="Your name"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    required
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="reg-email" className="text-gray-300">Email</Label>
                  <Input
                    id="reg-email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@company.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="reg-password" className="text-gray-300">Password</Label>
                  <Input
                    id="reg-password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Min. 8 characters"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="reg-confirm" className="text-gray-300">Confirm Password</Label>
                  <Input
                    id="reg-confirm"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Repeat password"
                    value={regConfirm}
                    onChange={(e) => setRegConfirm(e.target.value)}
                    required
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-blue-500"
                  />
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>
                  {loading ? "Creating account…" : "Create Account"}
                </Button>
                <p className="text-xs text-gray-500 text-center">
                  New accounts are reviewed by an admin before portal access is granted.
                </p>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <p className="mt-6 text-xs text-gray-600">
        © {new Date().getFullYear()} AwareCam · Partner Portal
      </p>
    </div>
  );
}
