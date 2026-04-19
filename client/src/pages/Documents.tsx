import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import PortalLayout from "@/components/PortalLayout";
import { trpc } from "@/lib/trpc";
import {
  BookOpen, Download, Eye, FileText, Search, X,
  Scale, Wrench, TrendingUp, Cpu, Loader2, Globe
} from "lucide-react";
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

type Doc = {
  id: number;
  title: string;
  titleHe: string | null;
  category: string;
  fileType: string;
  language: string;
  contentEn: string | null;
  contentHe: string | null;
  fileUrlEn: string | null;
  fileUrlHe: string | null;
  accessRoles: string;
  sortOrder: number;
};

// Download content as a styled HTML file that prints/saves as PDF
function downloadAsPdf(title: string, content: string, isRtl: boolean) {
  const htmlContent = `<!DOCTYPE html>
<html lang="${isRtl ? "he" : "en"}" dir="${isRtl ? "rtl" : "ltr"}">
<head>
<meta charset="UTF-8">
<title>${title}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
  body { font-family: 'Inter', Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 0 40px; color: #1a1a2e; line-height: 1.7; font-size: 14px; }
  h1 { font-size: 24px; font-weight: 700; color: #0a0f1e; border-bottom: 2px solid #06b6d4; padding-bottom: 12px; margin-bottom: 24px; }
  h2 { font-size: 18px; font-weight: 600; color: #0a0f1e; margin-top: 28px; }
  h3 { font-size: 15px; font-weight: 600; color: #374151; margin-top: 20px; }
  table { width: 100%; border-collapse: collapse; margin: 16px 0; }
  th { background: #f0f9ff; padding: 8px 12px; text-align: left; font-weight: 600; border: 1px solid #e0f2fe; }
  td { padding: 8px 12px; border: 1px solid #e0f2fe; }
  code { background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 12px; }
  pre { background: #f1f5f9; padding: 16px; border-radius: 8px; overflow-x: auto; }
  blockquote { border-left: 4px solid #06b6d4; margin: 16px 0; padding: 8px 16px; background: #f0f9ff; }
  .header { display: flex; align-items: center; gap: 12px; margin-bottom: 32px; padding-bottom: 16px; border-bottom: 1px solid #e2e8f0; }
  .logo { font-size: 20px; font-weight: 700; color: #06b6d4; }
  .meta { font-size: 12px; color: #64748b; margin-top: 4px; }
  @media print { body { margin: 0; padding: 20px; } }
</style>
</head>
<body>
<div class="header">
  <div>
    <div class="logo">AwareCam Partner Portal</div>
    <div class="meta">${title} · ${new Date().toLocaleDateString()}</div>
  </div>
</div>
<div id="content"></div>
<script>
// Simple markdown to HTML converter
const md = ${JSON.stringify(content)};
function mdToHtml(text) {
  return text
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\\*\\*(.+?)\\*\\*/g, '<strong>$1</strong>')
    .replace(/\\*(.+?)\\*/g, '<em>$1</em>')
    .replace(/\`(.+?)\`/g, '<code>$1</code>')
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\\/li>\\n?)+/g, '<ul>$&</ul>')
    .replace(/^\\d+\\. (.+)$/gm, '<li>$1</li>')
    .replace(/\\|(.+)\\|/g, (m) => '<tr>' + m.split('|').filter(Boolean).map(c => '<td>' + c.trim() + '</td>').join('') + '</tr>')
    .replace(/(<tr>.*<\\/tr>\\n?)+/g, '<table>$&</table>')
    .replace(/\\n\\n/g, '</p><p>')
    .replace(/^(?!<[h|u|o|t|b|p|l])(.+)$/gm, '$1');
}
document.getElementById('content').innerHTML = '<p>' + mdToHtml(md) + '</p>';
window.onload = () => window.print();
</script>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${title.replace(/[^a-z0-9\u0590-\u05ff]/gi, "_")}.html`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Documents() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [search, setSearch] = useState("");
  const [previewDoc, setPreviewDoc] = useState<Doc | null>(null);
  const [previewLang, setPreviewLang] = useState<"en" | "he">("en");
  const portalRole = (user as any)?.portalRole || "end_user";

  const logViewMutation = trpc.documents.logView.useMutation();

  // Fetch from database
  const { data: allDocs = [], isLoading } = trpc.documents.list.useQuery(
    { category: activeCategory === "all" ? undefined : activeCategory },
    { staleTime: 60_000 }
  );

  // Fetch full content when previewing
  const { data: fullDoc, isLoading: loadingContent } = trpc.documents.get.useQuery(
    { id: previewDoc?.id ?? 0 },
    { enabled: !!previewDoc, staleTime: 300_000 }
  );

  const filteredDocs = (allDocs as Doc[]).filter((doc) => {
    const title = language === "he" && doc.titleHe ? doc.titleHe : doc.title;
    if (search && !title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

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

  const handleDownload = (doc: typeof fullDoc) => {
    if (!doc) return;
    const content = getContent(doc);
    const title = previewLang === "he" && doc.titleHe ? doc.titleHe : doc.title;
    const isRtl = previewLang === "he";
    downloadAsPdf(title, content, isRtl);
  };

  return (
    <PortalLayout>
      <div className="p-4 md:p-8">
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
            const count = (allDocs as Doc[]).filter(d => key === "all" || d.category === key).length;
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
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Document Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading documents…</span>
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
                      {hasHebrew && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-primary/30 text-primary flex-shrink-0">
                          EN + עב
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground capitalize">
                      {catConfig?.label ? t(catConfig.label) : doc.category.replace(/_/g, " ")}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 flex-wrap justify-end">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs gap-1.5 text-muted-foreground hover:text-foreground"
                      onClick={() => handlePreview(doc)}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{t("docs.preview")}</span>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-4xl max-h-[92vh] flex flex-col bg-card border border-border rounded-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-border flex-shrink-0 gap-3">
              <div className="min-w-0 flex-1">
                <h2 className="text-sm sm:text-base font-semibold text-foreground truncate">
                  {previewLang === "he" && previewDoc.titleHe ? previewDoc.titleHe : previewDoc.title}
                </h2>
                <p className="text-xs text-muted-foreground capitalize mt-0.5">
                  {previewDoc.category.replace(/_/g, " ")}
                </p>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                {/* Language toggle */}
                {(previewDoc.language === "both") && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs gap-1.5 border-primary/30 text-primary"
                    onClick={() => setPreviewLang(l => l === "en" ? "he" : "en")}
                  >
                    <Globe className="w-3.5 h-3.5" />
                    {previewLang === "en" ? "עברית" : "English"}
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs gap-1.5"
                  disabled={loadingContent || !fullDoc}
                  onClick={() => handleDownload(fullDoc)}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t("docs.download")}</span>
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
