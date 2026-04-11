import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import PortalLayout from "@/components/PortalLayout";
import { trpc } from "@/lib/trpc";
import { BookOpen, Download, Eye, FileText, Search, X, ChevronRight, Scale, Wrench, TrendingUp, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Streamdown } from "streamdown";
import { cn } from "@/lib/utils";

type Category = "all" | "legal" | "setup_guides" | "sales_training" | "technical_reference";

const categoryConfig = {
  all: { label: "docs.all", icon: BookOpen, color: "text-foreground" },
  legal: { label: "docs.legal", icon: Scale, color: "text-blue-400" },
  setup_guides: { label: "docs.setup", icon: Wrench, color: "text-teal-400" },
  sales_training: { label: "docs.sales", icon: TrendingUp, color: "text-orange-400" },
  technical_reference: { label: "docs.technical", icon: Cpu, color: "text-purple-400" },
};

// Static document data (seeded content from markdown files)
const staticDocs = [
  // Legal
  { id: 1, title: "Reseller Agreement (US LLC)", titleHe: "הסכם מפיץ (ארה\"ב)", category: "legal", fileType: "markdown", language: "en", accessRoles: "reseller,integrator,admin", sortOrder: 1 },
  { id: 2, title: "Reseller Agreement (Israel Ltd)", titleHe: "הסכם מפיץ (ישראל)", category: "legal", fileType: "markdown", language: "both", accessRoles: "reseller,integrator,admin", sortOrder: 2 },
  { id: 3, title: "End-User Service Agreement (US LLC)", titleHe: "הסכם שירות למשתמש קצה (ארה\"ב)", category: "legal", fileType: "markdown", language: "en", accessRoles: "reseller,integrator,end_user,admin", sortOrder: 3 },
  { id: 4, title: "End-User Service Agreement (Israel Ltd)", titleHe: "הסכם שירות למשתמש קצה (ישראל)", category: "legal", fileType: "markdown", language: "both", accessRoles: "reseller,integrator,end_user,admin", sortOrder: 4 },
  // Setup Guides
  { id: 5, title: "Kiosk Device Setup Guide (Raspberry Pi)", titleHe: "מדריך התקנת קיוסק (Raspberry Pi)", category: "setup_guides", fileType: "markdown", language: "both", accessRoles: "reseller,integrator,end_user,admin", sortOrder: 1 },
  { id: 6, title: "Windows Edge Device Setup Guide", titleHe: "מדריך התקנת התקן קצה Windows", category: "setup_guides", fileType: "markdown", language: "both", accessRoles: "reseller,integrator,admin", sortOrder: 2 },
  { id: 7, title: "Direct RTSP Setup Guide", titleHe: "מדריך חיבור RTSP ישיר", category: "setup_guides", fileType: "markdown", language: "both", accessRoles: "reseller,integrator,admin", sortOrder: 3 },
  { id: 8, title: "Client Welcome & Quick Start Guide", titleHe: "מדריך ברוכים הבאים ללקוח", category: "setup_guides", fileType: "markdown", language: "both", accessRoles: "reseller,integrator,end_user,admin", sortOrder: 4 },
  // Sales Training
  { id: 9, title: "Reseller & Integrator Guide", titleHe: "מדריך מפיצים ואינטגרטורים", category: "sales_training", fileType: "markdown", language: "both", accessRoles: "reseller,integrator,admin", sortOrder: 1 },
  { id: 10, title: "Partner Onboarding Checklist", titleHe: "רשימת קליטת שותפים", category: "sales_training", fileType: "markdown", language: "both", accessRoles: "reseller,integrator,admin", sortOrder: 2 },
  { id: 11, title: "Mobile App User Guide", titleHe: "מדריך אפליקציית המובייל", category: "sales_training", fileType: "markdown", language: "both", accessRoles: "reseller,integrator,end_user,admin", sortOrder: 3 },
  // Technical Reference
  { id: 12, title: "Camera Compatibility & RTSP Reference", titleHe: "תאימות מצלמות וכתובות RTSP", category: "technical_reference", fileType: "markdown", language: "both", accessRoles: "reseller,integrator,admin", sortOrder: 1 },
  { id: 13, title: "Network & Firewall Requirements", titleHe: "דרישות רשת וחומת אש", category: "technical_reference", fileType: "markdown", language: "both", accessRoles: "reseller,integrator,admin", sortOrder: 2 },
];

export default function Documents() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [search, setSearch] = useState("");
  const [previewDoc, setPreviewDoc] = useState<typeof staticDocs[0] | null>(null);
  const portalRole = (user as any)?.portalRole || "end_user";

  const logViewMutation = trpc.documents.logView.useMutation();

  const filteredDocs = staticDocs.filter((doc) => {
    const roles = doc.accessRoles.split(",").map((r) => r.trim());
    if (!roles.includes(portalRole)) return false;
    if (activeCategory !== "all" && doc.category !== activeCategory) return false;
    const title = language === "he" && doc.titleHe ? doc.titleHe : doc.title;
    if (search && !title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handlePreview = (doc: typeof staticDocs[0]) => {
    setPreviewDoc(doc);
    logViewMutation.mutate({ documentId: doc.id, title: doc.title });
  };

  const getDocContent = (doc: typeof staticDocs[0]) => {
    const contentMap: Record<number, string> = {
      1: `# Reseller Agreement (US LLC)\n\n**AwareCam Inc.** | Governing Law: Delaware, USA\n\nThis agreement establishes the terms between AwareCam Inc. and the Reseller for distribution of AwareCam services.\n\n## Key Terms\n- Reseller receives wholesale pricing and may set their own retail rates\n- Minimum commitment: 10 cameras per month\n- Payment terms: Net 30\n- Territory: Non-exclusive unless otherwise agreed in writing\n\n*Full agreement available upon request from legal@awarecam.com*`,
      5: `# Kiosk Device Setup Guide\n\n## Overview\nThe AwareCam Kiosk is a Raspberry Pi 4 (8GB) pre-configured as an edge AI gateway.\n\n## Step 1: Unbox and Connect\n1. Remove the Raspberry Pi Kiosk from packaging\n2. Connect the power adapter (USB-C, 5V/3A)\n3. Connect an Ethernet cable to your local network\n4. Power on the device\n\n## Step 2: Provision\n1. Open the AwareCam Partner Portal\n2. Navigate to **Installation Guides → Kiosk**\n3. Follow the on-screen provisioning wizard\n\n## Step 3: Add Cameras\nSee the full visual guide in **Installation Guides** for step-by-step instructions with images.`,
      12: `# Camera Compatibility & RTSP Reference\n\n## Supported Brands\nAwareCam works with any IP camera supporting RTSP (H.264/H.265).\n\n| Brand | Default User | Default Pass | RTSP Sub Stream |\n|---|---|---|---|\n| Dahua | admin | admin | \`/cam/realmonitor?channel=1&subtype=1\` |\n| Hikvision | admin | 12345 | \`/Streaming/Channels/102\` |\n| Reolink | admin | (blank) | \`/h264Preview_01_sub\` |\n| Axis | root | pass | \`/axis-media/media.amp\` |\n\n## Recommended Stream Settings\n- Resolution: 640×480 or 720p\n- FPS: 10–15\n- Bitrate: 512–1024 Kbps\n- Codec: H.264`,
    };
    return contentMap[doc.id] || `# ${doc.title}\n\nFull document content is available for download. Click **Download** to get the complete document.\n\nFor questions, contact support@awarecam.com`;
  };

  return (
    <PortalLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {t("docs.title")}
          </h1>
          <p className="text-muted-foreground">{t("docs.subtitle")}</p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={t("docs.search")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-card border-border"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {(Object.entries(categoryConfig) as [Category, typeof categoryConfig.all][]).map(([key, cfg]) => {
            const Icon = cfg.icon;
            return (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border",
                  activeCategory === key
                    ? "bg-primary/15 text-primary border-primary/30"
                    : "text-muted-foreground border-border hover:text-foreground hover:bg-secondary"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {t(cfg.label)}
                <span className={cn(
                  "text-xs px-1.5 py-0.5 rounded-full",
                  activeCategory === key ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                )}>
                  {staticDocs.filter(d => {
                    const roles = d.accessRoles.split(",").map(r => r.trim());
                    return roles.includes(portalRole) && (key === "all" || d.category === key);
                  }).length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Document Grid */}
        {filteredDocs.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>{t("docs.noResults")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {filteredDocs.map((doc) => {
              const catConfig = categoryConfig[doc.category as Category];
              const CatIcon = catConfig?.icon || FileText;
              const title = language === "he" && doc.titleHe ? doc.titleHe : doc.title;
              const hasHebrew = doc.language === "both" || doc.language === "he";

              return (
                <div
                  key={doc.id}
                  className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/30 transition-all group"
                >
                  <div className={cn("w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0", catConfig?.color)}>
                    <CatIcon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-medium text-foreground truncate">{title}</span>
                      {hasHebrew && language === "en" && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-primary/30 text-primary flex-shrink-0">
                          EN + עב
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground capitalize">
                      {t(`docs.${doc.category.replace("_", "")}`) || doc.category.replace("_", " ")}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs gap-1.5 text-muted-foreground hover:text-foreground"
                      onClick={() => handlePreview(doc)}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      {t("docs.preview")}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs gap-1.5"
                      onClick={() => {
                        const content = getDocContent(doc);
                        const blob = new Blob([content], { type: "text/markdown" });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `${doc.title.replace(/[^a-z0-9]/gi, "_")}.md`;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                    >
                      <Download className="w-3.5 h-3.5" />
                      {t("docs.download")}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-3xl max-h-[85vh] flex flex-col bg-card border border-border rounded-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  {language === "he" && previewDoc.titleHe ? previewDoc.titleHe : previewDoc.title}
                </h2>
                <p className="text-xs text-muted-foreground capitalize mt-0.5">
                  {previewDoc.category.replace("_", " ")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs gap-1.5"
                  onClick={() => {
                    const content = getDocContent(previewDoc);
                    const blob = new Blob([content], { type: "text/markdown" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `${previewDoc.title.replace(/[^a-z0-9]/gi, "_")}.md`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                >
                  <Download className="w-3.5 h-3.5" />
                  {t("docs.download")}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setPreviewDoc(null)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="prose prose-invert prose-sm max-w-none">
                <Streamdown>{getDocContent(previewDoc)}</Streamdown>
              </div>
            </div>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
