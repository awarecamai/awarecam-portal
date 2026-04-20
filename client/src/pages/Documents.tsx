import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/_core/hooks/useAuth";
import PortalLayout from "@/components/PortalLayout";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FileText, Scale, Wrench, TrendingUp, BookOpen,
  Search, Eye, Download, Globe, X, Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Streamdown } from "streamdown";

type Category = "all" | "legal" | "setup_guides" | "sales_training" | "technical_reference";

interface Doc {
  id: number;
  title: string;
  titleHe: string | null;
  category: string;
  fileType: string;
  language: string;
  fileUrlEn: string | null;
  fileUrlHe: string | null;
  accessRoles: string;
  sortOrder: number;
  isPublished: boolean;
}

const categoryConfig: Record<Category, { label: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
  all:                 { label: "docs.all",       icon: FileText,   color: "text-muted-foreground" },
  legal:               { label: "docs.legal",     icon: Scale,      color: "text-blue-400" },
  setup_guides:        { label: "docs.setup",     icon: Wrench,     color: "text-teal-400" },
  sales_training:      { label: "docs.sales",     icon: TrendingUp, color: "text-pink-400" },
  technical_reference: { label: "docs.technical", icon: BookOpen,   color: "text-orange-400" },
};

/** Trigger a real PDF download from the server endpoint */
function downloadDocPdf(docId: number, title: string, lang: "en" | "he") {
  const url = `/api/documents/${docId}/pdf?lang=${lang}`;
  const a = document.createElement("a");
  a.href = url;
  const safeName = title.replace(/[^a-z0-9א-ת\s]/gi, "_").replace(/\s+/g, "_");
  a.download = `${safeName}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export default function Documents() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [search, setSearch] = useState("");
  const [previewDoc, setPreviewDoc] = useState<Doc | null>(null);
  const [previewLang, setPreviewLang] = useState<"en" | "he">("en");

  const logViewMutation = trpc.documents.logView.useMutation();

  // Always fetch ALL docs so tab counts are correct
  const { data: allDocs = [], isLoading } = trpc.documents.list.useQuery(
    undefined, // no category filter — fetch all, filter client-side
    { staleTime: 60_000 }
  );

  // Fetch full content only when a doc is being previewed
  const { data: fullDoc, isLoading: loadingContent } = trpc.documents.get.useQuery(
    { id: previewDoc?.id ?? 0 },
    { enabled: !!previewDoc, staleTime: 300_000 }
  );

  // Client-side category + search filter
  const filteredDocs = (allDocs as Doc[]).filter((doc) => {
    if (activeCategory !== "all" && doc.category !== activeCategory) return false;
    const title = language === "he" && doc.titleHe ? doc.titleHe : doc.title;
    if (search && !title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  // Count per category (from the full unfiltered list)
  const countFor = (cat: Category) =>
    cat === "all"
      ? (allDocs as Doc[]).length
      : (allDocs as Doc[]).filter((d) => d.category === cat).length;

  const handlePreview = (doc: Doc) => {
    setPreviewDoc(doc);
    setPreviewLang(language === "he" && (doc.language === "both" || doc.language === "he") ? "he" : "en");
    logViewMutation.mutate({ documentId: doc.id, title: doc.title });
  };

  const getContent = (doc: typeof fullDoc) => {
    if (!doc) return "";
    if (previewLang === "he" && doc.contentHe) return doc.contentHe;
    return doc.contentEn || doc.contentHe || "";
  };

  return (
    <PortalLayout>
      <div className="p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-3xl font-bold text-foreground mb-2"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
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
            const count = countFor(key);
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
                <span
                  className={cn(
                    "text-xs px-1.5 py-0.5 rounded-full",
                    activeCategory === key
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Document List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>{t("common.loading")}</span>
          </div>
        ) : filteredDocs.length === 0 ? (
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
              const dlLang: "en" | "he" = language === "he" && hasHebrew ? "he" : "en";

              return (
                <div
                  key={doc.id}
                  className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/30 transition-all group"
                >
                  {/* Category icon */}
                  <div
                    className={cn(
                      "w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0",
                      catConfig?.color
                    )}
                  >
                    <CatIcon className="w-5 h-5" />
                  </div>

                  {/* Title + category */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-medium text-foreground truncate">{title}</span>
                      {hasHebrew && (
                        <Badge
                          variant="outline"
                          className="text-[10px] px-1.5 py-0 border-primary/30 text-primary flex-shrink-0"
                        >
                          EN + עב
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground capitalize">
                      {catConfig?.label ? t(catConfig.label) : doc.category.replace(/_/g, " ")}
                    </div>
                  </div>

                  {/* Actions — always visible */}
                  <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                    {/* View */}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs gap-1.5 text-muted-foreground hover:text-foreground"
                      onClick={() => handlePreview(doc)}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{t("docs.preview")}</span>
                    </Button>

                    {/* Download PDF — directly from list */}
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs gap-1.5 border-primary/30 text-primary hover:bg-primary/10"
                      onClick={() => downloadDocPdf(doc.id, title, dlLang)}
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">PDF</span>
                    </Button>

                    {/* Hebrew PDF button when viewing in English but doc has Hebrew */}
                    {hasHebrew && language === "en" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-xs gap-1 text-muted-foreground hover:text-foreground"
                        title="Download Hebrew PDF"
                        onClick={() => downloadDocPdf(doc.id, doc.titleHe || doc.title, "he")}
                      >
                        <span className="text-[11px]">עב</span>
                        <Download className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-4xl max-h-[92vh] flex flex-col bg-card border border-border rounded-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-border flex-shrink-0 gap-3">
              <div className="min-w-0 flex-1">
                <h2 className="text-sm sm:text-base font-semibold text-foreground truncate">
                  {previewLang === "he" && previewDoc.titleHe
                    ? previewDoc.titleHe
                    : previewDoc.title}
                </h2>
                <p className="text-xs text-muted-foreground capitalize mt-0.5">
                  {previewDoc.category.replace(/_/g, " ")}
                </p>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                {/* Language toggle */}
                {previewDoc.language === "both" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs gap-1.5 border-primary/30 text-primary"
                    onClick={() => setPreviewLang((l) => (l === "en" ? "he" : "en"))}
                  >
                    <Globe className="w-3.5 h-3.5" />
                    {previewLang === "en" ? "עברית" : "English"}
                  </Button>
                )}
                {/* Download PDF from modal */}
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs gap-1.5"
                  disabled={loadingContent}
                  onClick={() => {
                    const title =
                      previewLang === "he" && previewDoc.titleHe
                        ? previewDoc.titleHe
                        : previewDoc.title;
                    downloadDocPdf(previewDoc.id, title, previewLang);
                  }}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t("docs.download")} PDF</span>
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setPreviewDoc(null)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Modal Content */}
            <div
              className="flex-1 overflow-y-auto p-4 sm:p-6"
              dir={previewLang === "he" ? "rtl" : "ltr"}
            >
              {loadingContent ? (
                <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Loading document…</span>
                </div>
              ) : (
                <div className="prose prose-invert prose-sm max-w-none">
                  {getContent(fullDoc) ? (
                    <Streamdown>{getContent(fullDoc)}</Streamdown>
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      No content available for this document.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
