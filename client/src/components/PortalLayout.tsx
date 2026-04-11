import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Bot,
  ChevronRight,
  Globe,
  LayoutDashboard,
  LogOut,
  Monitor,
  Settings,
  Shield,
  Users,
  Wrench,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { trpc } from "@/lib/trpc";

interface NavItem {
  key: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: string[];
}

const navItems: NavItem[] = [
  { key: "nav.dashboard", href: "/dashboard", icon: LayoutDashboard },
  { key: "nav.documents", href: "/documents", icon: BookOpen },
  { key: "nav.installation", href: "/installation", icon: Wrench },
  { key: "nav.sales", href: "/sales", icon: Monitor, roles: ["reseller", "integrator", "admin"] },
  { key: "nav.assistant", href: "/assistant", icon: Bot },
  { key: "nav.admin", href: "/admin", icon: Users, roles: ["admin"] },
];

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const { t, language, setLanguage, isRTL } = useLanguage();
  const [location] = useLocation();
  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => { logout(); window.location.href = "/"; },
  });

  const portalRole = (user as any)?.portalRole || "end_user";

  const visibleNav = navItems.filter((item) => {
    if (!item.roles) return true;
    return item.roles.includes(portalRole);
  });

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <div className={cn("flex min-h-screen bg-background", isRTL && "font-[Arial_Hebrew,sans-serif]")}>
      {/* Sidebar */}
      <aside className="w-60 min-w-[240px] flex flex-col border-r border-border bg-[oklch(0.14_0.01_240)]">
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-border">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Shield className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <div className="text-sm font-bold text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              AwareCam
            </div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Partner Portal</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {visibleNav.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href || location.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                  isActive
                    ? "bg-primary/15 text-primary border border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                <Icon className={cn("w-4 h-4 flex-shrink-0", isActive && "text-primary")} />
                {t(item.key)}
                {isActive && <ChevronRight className="w-3 h-3 ml-auto text-primary" />}
              </Link>
            );
          })}
        </nav>

        {/* Language toggle — only for integrators and admins */}
        {(portalRole === "integrator" || portalRole === "admin") && (
          <div className="px-4 py-3 border-t border-border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <Globe className="w-3 h-3" />
              <span>{t("docs.language")}</span>
            </div>
            <div className="flex rounded-lg overflow-hidden border border-border">
              <button
                onClick={() => setLanguage("en")}
                className={cn(
                  "flex-1 py-1.5 text-xs font-medium transition-colors",
                  language === "en"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage("he")}
                className={cn(
                  "flex-1 py-1.5 text-xs font-medium transition-colors",
                  language === "he"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                עב
              </button>
            </div>
          </div>
        )}

        {/* User */}
        <div className="px-3 py-3 border-t border-border">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 w-full px-2 py-2 rounded-lg hover:bg-secondary transition-colors text-left">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">{user?.name || "User"}</div>
                  <div className="text-xs text-muted-foreground capitalize">{t(`role.${portalRole}`)}</div>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>
                <Settings className="w-4 h-4 mr-2" />
                {t("nav.profile")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => logoutMutation.mutate()}
              >
                <LogOut className="w-4 h-4 mr-2" />
                {t("nav.logout")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
