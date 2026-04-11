import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "he";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Nav
    "nav.dashboard": "Dashboard",
    "nav.documents": "Document Library",
    "nav.installation": "Installation Guides",
    "nav.sales": "Sales Training",
    "nav.assistant": "AI Assistant",
    "nav.admin": "Admin",
    "nav.logout": "Sign Out",
    "nav.profile": "My Profile",
    // Dashboard
    "dashboard.welcome": "Welcome back",
    "dashboard.subtitle": "Your AwareCam Partner Portal",
    "dashboard.quickLinks": "Quick Links",
    "dashboard.recentDocs": "Recently Accessed",
    "dashboard.getStarted": "Get Started",
    // Documents
    "docs.title": "Document Library",
    "docs.subtitle": "Access all resources, guides, and agreements",
    "docs.search": "Search documents...",
    "docs.all": "All",
    "docs.legal": "Legal",
    "docs.setup": "Setup Guides",
    "docs.sales": "Sales Training",
    "docs.technical": "Technical Reference",
    "docs.preview": "Preview",
    "docs.download": "Download",
    "docs.language": "Language",
    "docs.noResults": "No documents found",
    // Installation
    "install.title": "Installation Guides",
    "install.subtitle": "Step-by-step deployment guides with images",
    "install.kiosk": "Kiosk (Raspberry Pi)",
    "install.windows": "Windows Edge Device",
    "install.rtsp": "Direct RTSP",
    "install.troubleshooting": "Troubleshooting",
    // Sales
    "sales.title": "Sales Training",
    "sales.subtitle": "Resources to help you close more deals",
    "sales.objections": "Handling Objections",
    "sales.brochures": "Industry Brochures",
    "sales.platform": "Platform Presentation",
    "sales.verticals": "Verticals",
    // AI Assistant
    "ai.title": "AI Assistant",
    "ai.subtitle": "Ask anything about AwareCam — onboarding, cameras, pricing, quotes",
    "ai.placeholder": "Ask about camera compatibility, pricing, or get a custom quote...",
    "ai.send": "Send",
    "ai.newChat": "New Chat",
    "ai.thinking": "Thinking...",
    "ai.quoteTitle": "Generate a Quote",
    "ai.cameras": "Number of Cameras",
    "ai.plan": "Plan Tier",
    "ai.addons": "Add-ons",
    "ai.generate": "Generate Quote",
    // Admin
    "admin.title": "Admin Dashboard",
    "admin.users": "User Management",
    "admin.activity": "Access Activity",
    "admin.role": "Role",
    "admin.status": "Status",
    "admin.lastActive": "Last Active",
    "admin.actions": "Actions",
    "admin.assignRole": "Assign Role",
    "admin.deactivate": "Deactivate",
    "admin.activate": "Activate",
    // Roles
    "role.reseller": "Reseller",
    "role.integrator": "Integrator",
    "role.end_user": "End User",
    "role.admin": "Admin",
    // Common
    "common.loading": "Loading...",
    "common.error": "Something went wrong",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.close": "Close",
    "common.back": "Back",
    "common.next": "Next",
    "common.search": "Search",
    "common.filter": "Filter",
    "common.english": "English",
    "common.hebrew": "Hebrew",
    "common.signIn": "Sign In",
    "common.signInDesc": "Access your AwareCam Partner Portal",
  },
  he: {
    // Nav
    "nav.dashboard": "לוח בקרה",
    "nav.documents": "ספריית מסמכים",
    "nav.installation": "מדריכי התקנה",
    "nav.sales": "הדרכת מכירות",
    "nav.assistant": "עוזר AI",
    "nav.admin": "ניהול",
    "nav.logout": "התנתקות",
    "nav.profile": "הפרופיל שלי",
    // Dashboard
    "dashboard.welcome": "ברוך שובך",
    "dashboard.subtitle": "פורטל השותפים של AwareCam",
    "dashboard.quickLinks": "קישורים מהירים",
    "dashboard.recentDocs": "נגישות לאחרונה",
    "dashboard.getStarted": "התחל",
    // Documents
    "docs.title": "ספריית מסמכים",
    "docs.subtitle": "גישה לכל המשאבים, המדריכים וההסכמים",
    "docs.search": "חיפוש מסמכים...",
    "docs.all": "הכל",
    "docs.legal": "משפטי",
    "docs.setup": "מדריכי התקנה",
    "docs.sales": "הדרכת מכירות",
    "docs.technical": "עיון טכני",
    "docs.preview": "תצוגה מקדימה",
    "docs.download": "הורדה",
    "docs.language": "שפה",
    "docs.noResults": "לא נמצאו מסמכים",
    // Installation
    "install.title": "מדריכי התקנה",
    "install.subtitle": "מדריכי פריסה שלב אחר שלב עם תמונות",
    "install.kiosk": "קיוסק (Raspberry Pi)",
    "install.windows": "התקן קצה Windows",
    "install.rtsp": "RTSP ישיר",
    "install.troubleshooting": "פתרון בעיות",
    // Sales
    "sales.title": "הדרכת מכירות",
    "sales.subtitle": "משאבים שיעזרו לך לסגור יותר עסקאות",
    "sales.objections": "טיפול בהתנגדויות",
    "sales.brochures": "חוברות ענף",
    "sales.platform": "מצגת פלטפורמה",
    "sales.verticals": "ענפים",
    // AI Assistant
    "ai.title": "עוזר AI",
    "ai.subtitle": "שאל כל שאלה על AwareCam — קליטה, מצלמות, תמחור, הצעות מחיר",
    "ai.placeholder": "שאל על תאימות מצלמות, תמחור, או קבל הצעת מחיר מותאמת...",
    "ai.send": "שלח",
    "ai.newChat": "שיחה חדשה",
    "ai.thinking": "חושב...",
    "ai.quoteTitle": "יצירת הצעת מחיר",
    "ai.cameras": "מספר מצלמות",
    "ai.plan": "רמת תוכנית",
    "ai.addons": "תוספות",
    "ai.generate": "צור הצעת מחיר",
    // Admin
    "admin.title": "לוח בקרה לניהול",
    "admin.users": "ניהול משתמשים",
    "admin.activity": "פעילות גישה",
    "admin.role": "תפקיד",
    "admin.status": "סטטוס",
    "admin.lastActive": "פעיל לאחרונה",
    "admin.actions": "פעולות",
    "admin.assignRole": "הקצה תפקיד",
    "admin.deactivate": "השבת",
    "admin.activate": "הפעל",
    // Roles
    "role.reseller": "מפיץ",
    "role.integrator": "אינטגרטור",
    "role.end_user": "משתמש קצה",
    "role.admin": "מנהל",
    // Common
    "common.loading": "טוען...",
    "common.error": "משהו השתבש",
    "common.save": "שמור",
    "common.cancel": "ביטול",
    "common.close": "סגור",
    "common.back": "חזרה",
    "common.next": "הבא",
    "common.search": "חיפוש",
    "common.filter": "סינון",
    "common.english": "אנגלית",
    "common.hebrew": "עברית",
    "common.signIn": "כניסה",
    "common.signInDesc": "גישה לפורטל השותפים של AwareCam",
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key) => key,
  isRTL: false,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem("awarecam_lang") as Language) || "en";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("awarecam_lang", lang);
  };

  const isRTL = language === "he";

  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language, isRTL]);

  const t = (key: string): string => {
    return translations[language][key] || translations["en"][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
