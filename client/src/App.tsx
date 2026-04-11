import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Documents from "./pages/Documents";
import Installation from "./pages/Installation";
import Sales from "./pages/Sales";
import Assistant from "./pages/Assistant";
import Admin from "./pages/Admin";
import { useAuth } from "./_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Loader2, Shield } from "lucide-react";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const [location, navigate] = useLocation();

  useEffect(() => {
    if (!loading && !isAuthenticated && location !== "/") {
      navigate("/");
    }
  }, [isAuthenticated, loading, location, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center animate-pulse">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <p className="text-muted-foreground text-sm">Loading portal...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;
  return <>{children}</>;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard">
        <AuthGuard><Dashboard /></AuthGuard>
      </Route>
      <Route path="/documents">
        <AuthGuard><Documents /></AuthGuard>
      </Route>
      <Route path="/installation">
        <AuthGuard><Installation /></AuthGuard>
      </Route>
      <Route path="/sales">
        <AuthGuard><Sales /></AuthGuard>
      </Route>
      <Route path="/assistant">
        <AuthGuard><Assistant /></AuthGuard>
      </Route>
      <Route path="/admin">
        <AuthGuard><Admin /></AuthGuard>
      </Route>
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
