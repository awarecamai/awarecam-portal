import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import PortalLayout from "@/components/PortalLayout";
import { BookOpen, Bot, Wrench, Monitor, ArrowRight, Shield, Users, FileText, Zap } from "lucide-react";
import { Link } from "wouter";

const roleColors: Record<string, string> = {
  reseller: "text-blue-400",
  integrator: "text-teal-400",
  end_user: "text-purple-400",
  admin: "text-orange-400",
};

const quickLinks = [
  {
    href: "/documents",
    icon: BookOpen,
    title: "Document Library",
    titleHe: "ספריית מסמכים",
    desc: "Access all legal, setup, and technical documents",
    descHe: "גישה לכל המסמכים המשפטיים, ההתקנה והטכניים",
    color: "from-blue-500/20 to-blue-600/5",
    border: "border-blue-500/20",
    iconColor: "text-blue-400",
  },
  {
    href: "/installation",
    icon: Wrench,
    title: "Installation Guides",
    titleHe: "מדריכי התקנה",
    desc: "Step-by-step visual guides for all deployment types",
    descHe: "מדריכים חזותיים שלב אחר שלב לכל סוגי הפריסה",
    color: "from-teal-500/20 to-teal-600/5",
    border: "border-teal-500/20",
    iconColor: "text-teal-400",
  },
  {
    href: "/assistant",
    icon: Bot,
    title: "AI Assistant",
    titleHe: "עוזר AI",
    desc: "Get instant answers, quotes, and camera compatibility checks",
    descHe: "קבל תשובות מיידיות, הצעות מחיר ובדיקות תאימות מצלמות",
    color: "from-primary/20 to-primary/5",
    border: "border-primary/20",
    iconColor: "text-primary",
  },
  {
    href: "/sales",
    icon: Monitor,
    title: "Sales Training",
    titleHe: "הדרכת מכירות",
    desc: "Objection handling, brochures, and platform presentations",
    descHe: "טיפול בהתנגדויות, חוברות ומצגות פלטפורמה",
    color: "from-orange-500/20 to-orange-600/5",
    border: "border-orange-500/20",
    iconColor: "text-orange-400",
    roles: ["reseller", "integrator", "admin"],
  },
];

const stats = [
  { label: "Documents Available", labelHe: "מסמכים זמינים", value: "22", icon: FileText },
  { label: "Installation Guides", labelHe: "מדריכי התקנה", value: "3", icon: Wrench },
  { label: "AI Conversations", labelHe: "שיחות AI", value: "∞", icon: Zap },
];

export default function Dashboard() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const portalRole = (user as any)?.portalRole || "end_user";

  const visibleLinks = quickLinks.filter(
    (link) => !link.roles || link.roles.includes(portalRole)
  );

  return (
    <PortalLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-primary" />
            <span className={`text-sm font-medium capitalize ${roleColors[portalRole] || "text-primary"}`}>
              {t(`role.${portalRole}`)}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {t("dashboard.welcome")}, {user?.name?.split(" ")[0] || "Partner"} 👋
          </h1>
          <p className="text-muted-foreground">{t("dashboard.subtitle")}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="p-5 rounded-xl border border-border bg-card flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {language === "he" ? stat.labelHe : stat.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Links */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-foreground mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {t("dashboard.quickLinks")}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {visibleLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link key={link.href} href={link.href}>
                  <a className={`group block p-5 rounded-xl border ${link.border} bg-gradient-to-br ${link.color} hover:border-primary/40 transition-all cursor-pointer`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-10 h-10 rounded-lg bg-card/60 flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${link.iconColor}`} />
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                    </div>
                    <div className="text-sm font-semibold text-foreground mb-1">
                      {language === "he" ? link.titleHe : link.title}
                    </div>
                    <div className="text-xs text-muted-foreground leading-relaxed">
                      {language === "he" ? link.descHe : link.desc}
                    </div>
                  </a>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Admin quick access */}
        {portalRole === "admin" && (
          <div className="mt-6 p-5 rounded-xl border border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-orange-600/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">Admin Dashboard</div>
                  <div className="text-xs text-muted-foreground">Manage users, roles, and access activity</div>
                </div>
              </div>
              <Link href="/admin">
                <a className="flex items-center gap-2 text-xs text-orange-400 hover:text-orange-300 font-medium transition-colors">
                  Open <ArrowRight className="w-3 h-3" />
                </a>
              </Link>
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
