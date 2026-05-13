import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import PortalLayout from "@/components/PortalLayout";
import { trpc } from "@/lib/trpc";
import {
  Monitor, Cpu, Wifi, CheckCircle, AlertTriangle, ChevronDown, ChevronUp,
  ExternalLink, Download, UserPlus, Building2, Camera, Zap, Shield,
  ArrowRight, Info, Globe, Settings, Play, Bell, MapPin, Bot,
  Layers, Eye, Smartphone, Lock, BarChart3, Video, FileText
} from "lucide-react";
import { cn } from "@/lib/utils";

/** Download a document as PDF via the server endpoint */
function downloadDocPdf(docId: number, title: string, lang: "en" | "he") {
  const a = document.createElement("a");
  a.href = `/api/documents/${docId}/pdf?lang=${lang}`;
  a.download = `${title.replace(/[^a-z0-9\u05d0-\u05ea\s]/gi, "_").replace(/\s+/g, "_")}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/** Banner showing PDF download links for installation guides */
function InstallationPdfBanner({ language }: { language: string }) {
  const { data: docs = [] } = trpc.documents.list.useQuery(undefined, { staleTime: 300_000 });
  const installDocs = (docs as any[]).filter((d: any) => d.category === "setup_guides");
  if (installDocs.length === 0) return null;
  return (
    <div className="mt-4 p-4 rounded-xl border border-primary/20 bg-primary/5 flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground flex-shrink-0">
        <FileText className="w-4 h-4 text-primary" />
        <span>{language === "he" ? "הורד מדריכים כ-PDF:" : "Download guides as PDF:"}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {installDocs.map((doc: any) => {
          const hasHe = doc.language === "both" || doc.language === "he";
          const title = language === "he" && doc.titleHe ? doc.titleHe : doc.title;
          return (
            <div key={doc.id} className="flex items-center gap-1">
              <button
                onClick={() => downloadDocPdf(doc.id, doc.title, "en")}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs bg-card border border-border hover:border-primary/40 text-foreground transition-colors"
              >
                <Download className="w-3 h-3 text-primary" />
                {doc.title.replace(/Setup Guide|Guide|Installation/gi, "").trim() || doc.title}
                <span className="text-muted-foreground ml-0.5">EN</span>
              </button>
              {hasHe && (
                <button
                  onClick={() => downloadDocPdf(doc.id, doc.titleHe || doc.title, "he")}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs bg-card border border-border hover:border-primary/40 text-foreground transition-colors"
                >
                  <Download className="w-3 h-3 text-primary" />
                  <span dir="rtl">{(doc.titleHe || doc.title).replace(/מדריך|התקנה/g, "").trim()}</span>
                  <span className="text-muted-foreground ml-0.5">עב</span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

type GuideType = "account" | "kiosk" | "windows" | "rtsp";

const CDN = "https://d2xsxph8kpxj0f.cloudfront.net/310519663429873569/7vQ3kTH4U9Q6fPjutgr3Jc";

const SCREENS = {
  login:              `${CDN}/01_login_683c4c48.webp`,
  onboarding:         `${CDN}/02_onboarding_welcome_5a8d39cd.webp`,
  orgSetup:           `${CDN}/03_organization_setup_5e8ba708.webp`,
  dashboard:          `${CDN}/04_dashboard_760d23b7.png`,
  cameraConnect:      `${CDN}/05_camera_connect_0fd61f80.png`,
  drawZones:          `${CDN}/06_draw_zones_86d4768c.png`,
  aiAgents:           `${CDN}/07_ai_agents_75bbdd18.png`,
  configureAlerts:    `${CDN}/08_configure_alerts_628189b3.png`,
  setupComplete:      `${CDN}/09_setup_complete_bb4eb944.png`,
  eventsInbox:        `${CDN}/10_events_inbox_bca9318f.png`,
  liveView:           `${CDN}/11_live_view_419ac628.png`,
  // Kiosk device UI (real screenshots from desktop-app)
  kioskSetup:         `${CDN}/kiosk_setup_screen_9fd40b5c.png`,
  kioskPin:           `${CDN}/kiosk_pin_screen_38ae6b6b.png`,
  kioskLoading:       `${CDN}/kiosk_loading_screen_f407c95c.png`,
  // Kiosk app UI mockups (rendered from source code)
  kioskHome:          `${CDN}/kiosk_home_7574fbd1.png`,
  kioskCameras:       `${CDN}/kiosk_cameras_585ef13e.png`,
  kioskStreams:       `${CDN}/kiosk_streams_cab1de6d.png`,
  kioskSettings:      `${CDN}/kiosk_settings_072d2d57.png`,
};

interface Step {
  number: number;
  title: string;
  description: string;
  details?: string[];
  warning?: string;
  tip?: string;
  code?: string;
  screenshot?: string; // CDN URL of the screenshot image
  screenshotAlt?: string;
  // Hebrew translations (shown when language === "he")
  titleHe?: string;
  descriptionHe?: string;
  detailsHe?: string[];
  warningHe?: string;
  tipHe?: string;
}

// ─────────────────────────────────────────────
// ACCOUNT SETUP & FULL PRODUCT GUIDE (A to Z)
// ─────────────────────────────────────────────
const accountSteps: Step[] = [
  {
    number: 1,
    title: "Navigate to the AwareCam App",
    description: "Open your web browser and go to the AwareCam platform.",
    details: [
      "Open any modern browser (Chrome, Firefox, Edge, or Safari).",
      "Go to: app.awarecam.com",
      "You will see the AwareCam welcome screen with the logo and a 'Sign In to Get Started' button.",
    ],
    screenshot: SCREENS.login,
    screenshotAlt: "AwareCam login screen",
    tip: "Bookmark app.awarecam.com for quick access. The platform works on all modern browsers.",

    titleHe: "כניסה לאפליקציית AwareCam",
    descriptionHe: "פתח את דפדפן האינטרנט שלך ועבור לפלטפורמת AwareCam.",
    detailsHe: [
      "פתח כל דפדפן מודרני (Chrome, Firefox, Edge או Safari).",
      "עבור אל: app.awarecam.com",
      "תראה את מסך הברוכים הבאים של AwareCam עם הלוגו וכפתור 'כניסה להתחלה'.",
    ],
    tipHe: "הוסף סימנייה ל-app.awarecam.com לגישה מהירה. הפלטפורמה עובדת בכל הדפדפנים המודרניים.",
  },
  {
    number: 2,
    title: "Create Your Account",
    description: "Click 'Sign In to Get Started' to register or log in via the AwareCam OAuth portal.",
    details: [
      "Click the blue 'Sign In to Get Started' button.",
      "You will be redirected to the AwareCam authentication portal.",
      "If you are a new user, click 'Create Account'.",
      "Enter your full name and business email address.",
      "Create a strong password (minimum 8 characters, include numbers and symbols).",
      "Click 'Create Account'.",
      "Check your inbox for a verification email from noreply@awarecam.com.",
    ],
    screenshot: SCREENS.login,
    screenshotAlt: "AwareCam account creation screen",
    tip: "Use your business email. This address will receive all billing, alerts, and support communications.",
    warning: "The verification link expires after 24 hours. If it expires, request a new one from the login screen.",

    titleHe: "יצירת חשבון",
    descriptionHe: "לחץ על 'כניסה להתחלה' כדי להירשם או להתחבר דרך פורטל האימות של AwareCam.",
    detailsHe: [
      "לחץ על הכפתור הכחול 'כניסה להתחלה'.",
      "תועבר לפורטל האימות של AwareCam.",
      "אם אתה משתמש חדש, לחץ על 'צור חשבון'.",
      "הזן את שמך המלא וכתובת האימייל העסקית.",
      "צור סיסמה חזקה (מינימום 8 תווים, כולל מספרים וסמלים).",
      "לחץ על 'צור חשבון'.",
      "בדוק את תיבת הדואר שלך לאימייל אימות מ-noreply@awarecam.com.",
    ],
    warningHe: "קישור האימות פג תוקף לאחר 24 שעות. אם פג תוקפו, בקש חדש ממסך הכניסה.",
    tipHe: "השתמש באימייל העסקי שלך. כתובת זו תקבל את כל תקשורות החיוב, ההתראות והתמיכה.",
  },
  {
    number: 3,
    title: "Complete the Onboarding Wizard",
    description: "After your first login, AwareCam guides you through a short setup wizard to configure your organization.",
    details: [
      "Step 1 — Welcome & Plan: Review your selected plan and trial details.",
      "Step 2 — Business Profile: Enter your Organization Name, select your Industry (Construction, Warehousing, Manufacturing, Healthcare, Retail, Education, Oil & Gas, or Other), and choose your country.",
      "Step 3 — Business Type: Select whether you are an Owner/Operator, Reseller/Integrator, or Security Company.",
      "Step 4 — Goals: Choose your primary security goals (perimeter protection, people counting, vehicle monitoring, etc.).",
      "Step 5 — Organization Size: Select the number of locations and cameras you manage.",
      "Step 6 — Primary Location: Enter your first site name, address, city, country, and time zone.",
      "Click 'Complete Setup' on the final step.",
    ],
    screenshot: SCREENS.onboarding,
    screenshotAlt: "AwareCam onboarding wizard — welcome step",
    tip: "If you are a reseller setting up an account for a client, use the client's business name as the Organization Name. You can manage multiple organizations from one account.",

    titleHe: "השלמת אשף ה-Onboarding",
    descriptionHe: "לאחר הכניסה הראשונה, AwareCam מנחה אותך דרך אשף הגדרה קצר להגדרת הארגון שלך.",
    detailsHe: [
      "שלב 1 — ברוכים הבאים ותוכנית: סקור את התוכנית שנבחרה ופרטי הניסיון.",
      "שלב 2 — פרופיל עסקי: הזן את שם הארגון, בחר את התעשייה (בנייה, מחסנאות, ייצור, בריאות, קמעונאות, חינוך, נפט וגז, או אחר) ובחר את המדינה.",
      "שלב 3 — סוג עסק: בחר אם אתה בעלים/מפעיל, מוכר/אינטגרטור, או חברת אבטחה.",
      "שלב 4 — מטרות: בחר את מטרות האבטחה העיקריות שלך (הגנת היקף, ספירת אנשים, ניטור רכבים וכו').",
      "שלב 5 — גודל ארגון: בחר את מספר המיקומים והמצלמות שאתה מנהל.",
      "שלב 6 — מיקום ראשי: הזן את שם האתר הראשון, כתובת, עיר, מדינה ואזור זמן.",
      "לחץ על 'השלם הגדרה' בשלב האחרון.",
    ],
    tipHe: "אם אתה מוכר מגדיר חשבון עבור לקוח, השתמש בשם העסק של הלקוח כשם הארגון. ניתן לנהל ארגונים מרובים מחשבון אחד.",
  },
  {
    number: 4,
    title: "Explore the Dashboard",
    description: "After onboarding, you land on the main Dashboard — your command center for all cameras, alerts, and analytics.",
    details: [
      "The left sidebar contains: Dashboard, Cameras, Live View, Alerts, Analytics, Locations, and Settings.",
      "The Dashboard shows: total cameras, active cameras, active AI agents, total zones, events today, and system health.",
      "The 'Recent Events' panel shows the latest AI-detected alerts with camera name, event type, and timestamp.",
      "The camera status breakdown shows Online, Offline, and Degraded counts.",
    ],
    screenshot: SCREENS.dashboard,
    screenshotAlt: "AwareCam main dashboard",
    tip: "The dashboard auto-refreshes every 30 seconds. All statistics are live.",

    titleHe: "חקירת לוח הבקרה",
    descriptionHe: "לאחר ה-Onboarding, אתה נוחת בלוח הבקרה הראשי — מרכז הפיקוד שלך לכל המצלמות, ההתראות והאנליטיקה.",
    detailsHe: [
      "סרגל הצד השמאלי מכיל: לוח בקרה, מצלמות, צפייה חיה, התראות, אנליטיקה, מיקומים והגדרות.",
      "לוח הבקרה מציג: סך המצלמות, מצלמות פעילות, סוכני AI פעילים, סך האזורים, אירועים היום ובריאות המערכת.",
      "לוח 'אירועים אחרונים' מציג את ההתראות האחרונות שזוהו על ידי AI עם שם המצלמה, סוג האירוע וחותמת הזמן.",
      "פירוט מצב המצלמה מציג ספירות מקוון, לא מקוון ומדורדר.",
    ],
    tipHe: "לוח הבקרה מתרענן אוטומטית כל 30 שניות. כל הסטטיסטיקות הן בזמן אמת.",
  },
  {
    number: 5,
    title: "Add a Site (Location)",
    description: "A 'Site' or 'Location' is a physical place where cameras are installed. You can have multiple sites under one organization.",
    details: [
      "Click 'Locations' in the left sidebar.",
      "Click 'Add Location' (top-right button).",
      "Enter the Site Name (e.g., 'Main Warehouse', 'Branch Office — Tel Aviv').",
      "Enter the address, city, state/province, country, and postal code.",
      "Select the time zone for this site.",
      "Click 'Create Location'.",
      "The new site appears in your locations list with a camera count of 0.",
    ],
    screenshot: "Locations page — list of location cards, each showing site name, address, camera count, active cameras, and last activity. 'Add Location' button in top-right.",
    screenshotAlt: "AwareCam locations page",
    tip: "Each site manages its own cameras, AI agents, and alert rules independently. Alerts can be filtered by site.",

    titleHe: "הוספת אתר (מיקום)",
    descriptionHe: "'אתר' או 'מיקום' הוא מקום פיזי שבו מותקנות מצלמות. ניתן לקבל מספר אתרים תחת ארגון אחד.",
    detailsHe: [
      "לחץ על 'מיקומים' בסרגל הצד השמאלי.",
      "לחץ על 'הוסף מיקום' (כפתור בפינה הימנית העליונה).",
      "הזן את שם האתר (למשל, 'מחסן ראשי', 'סניף — תל אביב').",
      "הזן את הכתובת, עיר, מדינה/מחוז, מדינה וקוד דואר.",
      "בחר את אזור הזמן עבור אתר זה.",
      "לחץ על 'צור מיקום'.",
      "האתר החדש מופיע ברשימת המיקומים שלך עם ספירת מצלמות של 0.",
    ],
    tipHe: "כל אתר מנהל את המצלמות, סוכני ה-AI וכללי ההתראות שלו באופן עצמאי. ניתן לסנן התראות לפי אתר.",
  },
  {
    number: 6,
    title: "Add Your First Camera",
    description: "Navigate to Cameras and use the 5-step camera setup wizard to connect your first IP camera.",
    details: [
      "Click 'Cameras' in the left sidebar.",
      "Click 'Add Camera' (top-right button).",
      "The Camera Setup Wizard opens — it has 5 steps: Connect → Zones → AI Agents → Alerts → Complete.",
      "Step 1 — Connect: Enter the camera name, select the location/site, choose the camera vendor (Hikvision, Dahua, Axis, Uniview, Reolink, or Generic), enter the IP address, port (default 554), username, and password. The RTSP URL is built automatically.",
      "Alternatively, toggle 'Use Direct RTSP URL' and paste the full RTSP URL.",
      "Click 'Test Connection' — a green checkmark confirms the camera is reachable.",
      "Click 'Next' to proceed to zone drawing.",
    ],
    screenshot: SCREENS.cameraConnect,
    screenshotAlt: "AwareCam add camera wizard — connection step",
    tip: "Use the substream (lower resolution) for AI analytics. It uses less bandwidth and is sufficient for all AI detection tasks.",
    warning: "You must know your camera's admin username and password. AwareCam cannot bypass or recover camera credentials.",

    titleHe: "הוספת המצלמה הראשונה שלך",
    descriptionHe: "עבור למצלמות והשתמש באשף הגדרת המצלמה בן 5 השלבים לחיבור מצלמת IP הראשונה שלך.",
    detailsHe: [
      "לחץ על 'מצלמות' בסרגל הצד השמאלי.",
      "לחץ על 'הוסף מצלמה' (כפתור בפינה הימנית העליונה).",
      "אשף הגדרת המצלמה נפתח — יש לו 5 שלבים: חיבור ← אזורים ← סוכני AI ← התראות ← השלמה.",
      "שלב 1 — חיבור: הזן את שם המצלמה, בחר את המיקום/אתר, בחר את ספק המצלמה (Hikvision, Dahua, Axis, Uniview, Reolink, או Generic), הזן את כתובת ה-IP, יציאה (ברירת מחדל 554), שם משתמש וסיסמה. כתובת ה-RTSP נבנית אוטומטית.",
      "לחלופין, הפעל 'השתמש בכתובת RTSP ישירה' והדבק את כתובת ה-RTSP המלאה.",
      "לחץ על 'בדוק חיבור' — סימן ביקורת ירוק מאשר שהמצלמה נגישה.",
      "לחץ על 'הבא' כדי להמשיך לצייר אזורים.",
    ],
    warningHe: "עליך לדעת את שם המשתמש והסיסמה של מנהל המצלמה. AwareCam אינה יכולה לעקוף או לשחזר אישורי מצלמה.",
    tipHe: "השתמש ב-substream (רזולוציה נמוכה יותר) לאנליטיקת AI. זה משתמש בפחות רוחב פס ומספיק לכל משימות זיהוי ה-AI.",
  },
  {
    number: 7,
    title: "Draw Detection Zones & Fences",
    description: "After connecting the camera, draw zones directly on the live video feed to define exactly where AI detection should be active.",
    details: [
      "The wizard advances to Step 2 — Zones. A live video preview of your camera appears.",
      "Click 'Add Zone' to start drawing.",
      "Click on the video image to place polygon points — each click adds a corner of the zone.",
      "Draw at least 3 points to form a closed polygon (e.g., a doorway, parking area, or perimeter fence line).",
      "Double-click or click 'Close Zone' to finish the polygon.",
      "Name the zone (e.g., 'Front Entrance', 'Parking Lot', 'Server Room Door').",
      "You can draw multiple zones on the same camera.",
      "Zones are color-coded — each zone gets a distinct color automatically.",
      "Click 'Save Zones' when finished, or click 'Skip' to use full-frame detection.",
    ],
    screenshot: SCREENS.drawZones,
    screenshotAlt: "AwareCam zone drawing interface — polygon drawn on camera feed",
    tip: "Drawing specific zones dramatically reduces false alarms. For example, a zone covering only the entrance door will not trigger alerts for movement in the parking lot.",
    warning: "Zones require a live camera stream. If the stream is not ready, the wizard will show a loading indicator — wait 30–60 seconds for the stream to initialize.",

    titleHe: "ציור אזורי זיהוי וגדרות",
    descriptionHe: "לאחר חיבור המצלמה, צייר אזורים ישירות על הזנת הווידאו החיה כדי להגדיר בדיוק היכן זיהוי ה-AI צריך להיות פעיל.",
    detailsHe: [
      "האשף מתקדם לשלב 2 — אזורים. תצוגה מקדימה חיה של המצלמה שלך מופיעה.",
      "לחץ על 'הוסף אזור' כדי להתחיל לצייר.",
      "לחץ על תמונת הווידאו כדי למקם נקודות פוליגון — כל לחיצה מוסיפה פינה לאזור.",
      "צייר לפחות 3 נקודות ליצירת פוליגון סגור (למשל, כניסה, אזור חניה, או קו גדר היקף).",
      "לחץ פעמיים או לחץ על 'סגור אזור' לסיום הפוליגון.",
      "תן שם לאזור (למשל, 'כניסה קדמית', 'חניון', 'דלת חדר שרתים').",
      "ניתן לצייר אזורים מרובים על אותה מצלמה.",
      "אזורים מקודדים בצבע — כל אזור מקבל צבע ייחודי אוטומטית.",
      "לחץ על 'שמור אזורים' בסיום, או לחץ על 'דלג' לשימוש בזיהוי מסגרת מלאה.",
    ],
    warningHe: "אזורים דורשים זרם מצלמה חי. אם הזרם אינו מוכן, האשף יציג מחוון טעינה — המתן 30–60 שניות לאתחול הזרם.",
    tipHe: "ציור אזורים ספציפיים מפחית דרמטית התראות שגויות. לדוגמה, אזור המכסה רק את דלת הכניסה לא יפעיל התראות לתנועה בחניון.",
  },
  {
    number: 8,
    title: "Select AI Detection Agents",
    description: "Choose which AI agents to activate on this camera. Each agent monitors for a specific type of event.",
    details: [
      "The wizard advances to Step 3 — AI Agents.",
      "Available agents are listed with name, description, and plan availability.",
      "Toggle the switch next to each agent to enable it.",
      "Included agents (available on all plans): Person Detection, Vehicle Detection, Fire & Smoke Detection, Loitering Detection.",
      "Premium add-on agents: License Plate Recognition (LPR), Crowd Counting, Occupancy Monitoring, Slip & Fall Detection.",
      "When you enable an agent, a configuration panel expands below it.",
      "Select which zone the agent should monitor (or leave as 'Full Frame').",
      "Configure agent-specific settings: sensitivity, minimum loiter time, maximum occupancy count, etc.",
      "Click 'Next' when all desired agents are configured.",
    ],
    screenshot: SCREENS.aiAgents,
    screenshotAlt: "AwareCam AI agent selection step",
    tip: "Start with Person Detection and Fire/Smoke on all cameras. Add specialized agents (LPR, Loitering) after the client has used the system for a week and confirmed the basic setup is working.",

    titleHe: "בחירת סוכני זיהוי AI",
    descriptionHe: "בחר אילו סוכני AI להפעיל על מצלמה זו. כל סוכן מנטר סוג ספציפי של אירוע.",
    detailsHe: [
      "האשף מתקדם לשלב 3 — סוכני AI.",
      "הסוכנים הזמינים מפורטים עם שם, תיאור וזמינות תוכנית.",
      "הפעל את המתג ליד כל סוכן כדי להפעילו.",
      "סוכנים כלולים (זמינים בכל התוכניות): זיהוי אנשים, זיהוי רכבים, זיהוי אש ועשן, זיהוי שהייה.",
      "סוכני תוספת פרמיום: זיהוי לוחיות רישוי (LPR), ספירת קהל, ניטור תפוסה, זיהוי נפילה.",
      "כאשר אתה מפעיל סוכן, לוח תצורה מתרחב מתחתיו.",
      "בחר באיזה אזור הסוכן צריך לנטר (או השאר כ'מסגרת מלאה').",
      "הגדר הגדרות ספציפיות לסוכן: רגישות, זמן שהייה מינימלי, ספירת תפוסה מקסימלית וכו'.",
      "לחץ על 'הבא' כאשר כל הסוכנים הרצויים מוגדרים.",
    ],
    tipHe: "התחל עם זיהוי אנשים ואש/עשן על כל המצלמות. הוסף סוכנים מיוחדים (LPR, שהייה) לאחר שהלקוח השתמש במערכת שבוע ואישר שההגדרה הבסיסית עובדת.",
  },
  {
    number: 9,
    title: "Configure Email & SMS Alerts",
    description: "Set up how and when you receive notifications when AI agents detect events.",
    details: [
      "The wizard advances to Step 4 — Alerts.",
      "Set the Alert Severity Threshold: Low (all events), Medium (moderate and high), or High (critical events only).",
      "Toggle 'Email Notifications' to ON.",
      "If no email channel exists yet, a form appears — enter the recipient email address and click 'Save Channel'.",
      "Toggle 'SMS Notifications' to ON.",
      "If no SMS channel exists yet, enter the phone number (with country code, e.g., +1 555 123 4567) and click 'Save Channel'.",
      "You can add multiple email and SMS recipients per organization.",
      "Click 'Next' to complete the camera setup.",
    ],
    screenshot: SCREENS.configureAlerts,
    screenshotAlt: "AwareCam alert configuration step — email and SMS setup",
    tip: "Alert channels are shared across all cameras in your organization. You only need to add an email or phone number once — it will be available for all future cameras.",
    warning: "SMS alerts require a verified phone number. A test message is sent when you save the channel — confirm receipt before completing setup.",

    titleHe: "הגדרת התראות אימייל ו-SMS",
    descriptionHe: "הגדר כיצד ומתי אתה מקבל התראות כאשר סוכני AI מזהים אירועים.",
    detailsHe: [
      "האשף מתקדם לשלב 4 — התראות.",
      "הגדר את סף חומרת ההתראה: נמוך (כל האירועים), בינוני (בינוני וגבוה), או גבוה (אירועים קריטיים בלבד).",
      "הפעל 'התראות אימייל' ל-ON.",
      "אם עדיין לא קיים ערוץ אימייל, מופיע טופס — הזן את כתובת האימייל של הנמען ולחץ על 'שמור ערוץ'.",
      "הפעל 'התראות SMS' ל-ON.",
      "אם עדיין לא קיים ערוץ SMS, הזן את מספר הטלפון (עם קוד מדינה, למשל +972 50 123 4567) ולחץ על 'שמור ערוץ'.",
      "ניתן להוסיף מספר נמעני אימייל ו-SMS לכל ארגון.",
      "לחץ על 'הבא' להשלמת הגדרת המצלמה.",
    ],
    warningHe: "התראות SMS דורשות מספר טלפון מאומת. הודעת בדיקה נשלחת כאשר אתה שומר את הערוץ — אשר קבלה לפני השלמת ההגדרה.",
    tipHe: "ערוצי התראות משותפים לכל המצלמות בארגון שלך. עליך להוסיף אימייל או מספר טלפון פעם אחת בלבד — הוא יהיה זמין לכל המצלמות העתידיות.",
  },
  {
    number: 10,
    title: "Camera Setup Complete",
    description: "The wizard confirms your camera is live and AI detection is active.",
    details: [
      "The wizard advances to Step 5 — Complete.",
      "A success screen confirms: Camera connected, Zones saved, AI agents active, Alerts configured.",
      "The camera now appears in your Cameras list with a green 'Online' status indicator.",
      "Click 'View Camera' to open the camera detail page.",
      "Click 'Add Another Camera' to repeat the process for additional cameras.",
    ],
    screenshot: SCREENS.setupComplete,
    screenshotAlt: "AwareCam camera setup completion screen",
    tip: "It takes 30–60 seconds for the first AI alert to process after enabling agents. Walk in front of the camera to trigger a test Person Detection alert.",

    titleHe: "הגדרת המצלמה הושלמה",
    descriptionHe: "האשף מאשר שהמצלמה שלך פעילה וזיהוי ה-AI פעיל.",
    detailsHe: [
      "האשף מתקדם לשלב 5 — השלמה.",
      "מסך הצלחה מאשר: מצלמה מחוברת, אזורים נשמרו, סוכני AI פעילים, התראות מוגדרות.",
      "המצלמה מופיעה כעת ברשימת המצלמות שלך עם מחוון מצב ירוק 'מקוון'.",
      "לחץ על 'צפה במצלמה' לפתיחת דף פרטי המצלמה.",
      "לחץ על 'הוסף מצלמה נוספת' לחזרה על התהליך עבור מצלמות נוספות.",
    ],
    tipHe: "לוקח 30–60 שניות לעיבוד ההתראה הראשונה של AI לאחר הפעלת הסוכנים. הלך מול המצלמה כדי להפעיל התראת זיהוי אנשים לבדיקה.",
  },
  {
    number: 11,
    title: "View Live Camera Feeds",
    description: "Monitor all cameras in real time from the Live View page.",
    details: [
      "Click 'Live View' in the left sidebar.",
      "All connected cameras are displayed in a grid layout.",
      "Click any camera tile to expand it to full screen.",
      "Use the grid layout selector (top-right) to switch between 1×1, 2×2, 3×3, and 4×4 grids.",
      "Active AI detections are shown as colored overlays on the live feed.",
      "Camera health status (green/yellow/red dot) is shown in the corner of each tile.",
    ],
    screenshot: SCREENS.liveView,
    screenshotAlt: "AwareCam live camera view — multi-camera grid",
    tip: "The Live View page is optimized for large monitors and TV displays. Use it as a dedicated monitoring screen in a control room or reception area.",

    titleHe: "צפייה בהזנות מצלמה חיות",
    descriptionHe: "נטר את כל המצלמות בזמן אמת מדף הצפייה החיה.",
    detailsHe: [
      "לחץ על 'צפייה חיה' בסרגל הצד השמאלי.",
      "כל המצלמות המחוברות מוצגות בפריסת רשת.",
      "לחץ על כל אריח מצלמה כדי להרחיב אותו למסך מלא.",
      "השתמש בבורר פריסת הרשת (בפינה הימנית העליונה) כדי לעבור בין רשתות 1×1, 2×2, 3×3 ו-4×4.",
      "זיהויי AI פעילים מוצגים כשכבות צבעוניות על ההזנה החיה.",
      "מצב בריאות המצלמה (נקודה ירוקה/צהובה/אדומה) מוצג בפינת כל אריח.",
    ],
    tipHe: "דף הצפייה החיה מותאם לצגים גדולים ולמסכי טלוויזיה. השתמש בו כמסך ניטור ייעודי בחדר בקרה או באזור קבלה.",
  },
  {
    number: 12,
    title: "View & Manage Alerts",
    description: "The Alerts page is your inbox for all AI-generated events. Review, filter, and act on detections.",
    details: [
      "Click 'Alerts' in the left sidebar.",
      "All AI-generated events appear in reverse chronological order.",
      "Each alert shows: camera name, event type (Person Detected, Vehicle, Fire/Smoke, etc.), severity badge, timestamp, and a thumbnail image.",
      "Use the search bar to find alerts by camera name or event type.",
      "Filter by Status: All, Unread, Read.",
      "Filter by Type: All, Person, Vehicle, Fire/Smoke, LPR, etc.",
      "Click an alert to open the full event detail with a video clip.",
      "Mark alerts as read individually or use 'Mark All as Read'.",
      "Select multiple alerts and use 'Delete Selected' to clear old events.",
    ],
    screenshot: SCREENS.eventsInbox,
    screenshotAlt: "AwareCam alerts inbox — list of AI-generated events",
    tip: "Unread alerts are highlighted. Encourage clients to review and clear alerts daily to maintain a clean audit trail.",

    titleHe: "צפייה וניהול התראות",
    descriptionHe: "דף ההתראות הוא תיבת הדואר הנכנס שלך לכל האירועים שנוצרו על ידי AI. סקור, סנן ופעל על זיהויים.",
    detailsHe: [
      "לחץ על 'התראות' בסרגל הצד השמאלי.",
      "כל האירועים שנוצרו על ידי AI מופיעים בסדר כרונולוגי הפוך.",
      "כל התראה מציגה: שם מצלמה, סוג אירוע (אדם זוהה, רכב, אש/עשן וכו'), תג חומרה, חותמת זמן ותמונה ממוזערת.",
      "השתמש בשורת החיפוש למציאת התראות לפי שם מצלמה או סוג אירוע.",
      "סנן לפי סטטוס: הכל, לא נקרא, נקרא.",
      "סנן לפי סוג: הכל, אדם, רכב, אש/עשן, LPR וכו'.",
      "לחץ על התראה לפתיחת פרטי האירוע המלאים עם קליפ וידאו.",
      "סמן התראות כנקראו בנפרד או השתמש ב'סמן הכל כנקרא'.",
      "בחר מספר התראות והשתמש ב'מחק נבחרים' לניקוי אירועים ישנים.",
    ],
    tipHe: "התראות שלא נקראו מסומנות. עודד לקוחות לסקור ולנקות התראות מדי יום לשמירה על מסלול ביקורת נקי.",
  },
  {
    number: 13,
    title: "Review Analytics",
    description: "The Analytics section provides historical data, trends, and insights across all cameras and sites.",
    details: [
      "Click 'Analytics' in the left sidebar.",
      "Sub-sections: Overview, People, Vehicles, Cameras & Zones, Security Risk, Diagnostics.",
      "Overview: Total events by day/week/month, top active cameras, event type breakdown.",
      "People: Foot traffic trends, peak hours, zone-specific counts.",
      "Vehicles: Vehicle detection counts, LPR hits, entry/exit patterns.",
      "Security Risk: AI-generated risk score per site based on event frequency and severity.",
      "Diagnostics: Camera uptime, stream health, agent performance metrics.",
      "All charts support date range filtering.",
    ],
    screenshot: "AwareCam Analytics Overview page — line chart showing events over the past 30 days, donut chart showing event type breakdown (Person 62%, Vehicle 28%, Other 10%), top cameras list on the right.",
    screenshotAlt: "AwareCam analytics overview — event trends and breakdown",
    tip: "Share the Analytics → Security Risk report with clients during monthly reviews. It demonstrates the value of the AI monitoring and justifies the subscription cost.",

    titleHe: "סקירת אנליטיקה",
    descriptionHe: "קטע האנליטיקה מספק נתונים היסטוריים, מגמות ותובנות בכל המצלמות והאתרים.",
    detailsHe: [
      "לחץ על 'אנליטיקה' בסרגל הצד השמאלי.",
      "תת-קטעים: סקירה כללית, אנשים, רכבים, מצלמות ואזורים, סיכון אבטחה, אבחון.",
      "סקירה כללית: סך האירועים לפי יום/שבוע/חודש, מצלמות פעילות מובילות, פירוט סוג אירוע.",
      "אנשים: מגמות תנועת רגל, שעות שיא, ספירות ספציפיות לאזור.",
      "רכבים: ספירות זיהוי רכבים, פגיעות LPR, דפוסי כניסה/יציאה.",
      "סיכון אבטחה: ציון סיכון שנוצר על ידי AI לכל אתר בהתבסס על תדירות וחומרת האירועים.",
      "אבחון: זמן פעולה של מצלמה, בריאות זרם, מדדי ביצועי סוכן.",
      "כל התרשימים תומכים בסינון טווח תאריכים.",
    ],
    tipHe: "שתף את דוח האנליטיקה ← סיכון אבטחה עם לקוחות במהלך סקירות חודשיות. הוא מדגים את הערך של ניטור ה-AI ומצדיק את עלות המנוי.",
  },
];

// ─────────────────────────────────────────────
// KIOSK (RASPBERRY PI) HARDWARE SETUP
// ─────────────────────────────────────────────
const kioskSteps: Step[] = [
  {
    number: 1,
    title: "What You Need",
    description: "Gather all required hardware before starting the installation.",
    details: [
      "Raspberry Pi 4 or Pi 5 (pre-loaded with AwareCam OS by your distributor)",
      "Power supply: USB-C 5V/3A (included with the AwareCam Kiosk kit)",
      "Ethernet cable (strongly recommended over WiFi for stability)",
      "HDMI cable + TV or monitor (for initial setup only)",
      "USB keyboard (for initial setup only — can be removed after pairing)",
      "Your AwareCam account credentials (from the Account Setup guide)",
    ],
    screenshot: SCREENS.kioskHome,
    screenshotAlt: "AwareCam Kiosk dashboard — home screen showing live cameras",
    tip: "The Raspberry Pi should come pre-flashed with AwareCam OS. If you received a blank Pi, contact support@awarecam.com for the OS image.",

    titleHe: "מה שצריך",
    descriptionHe: "אסוף את כל החומרה הנדרשת לפני תחילת ההתקנה.",
    detailsHe: [
      "Raspberry Pi 4 או Pi 5 (טעון מראש עם AwareCam OS על ידי המפיץ שלך)",
      "ספק כוח: USB-C 5V/3A (כלול בערכת AwareCam Kiosk)",
      "כבל Ethernet (מומלץ מאוד על פני WiFi לצורך יציבות)",
      "כבל HDMI + טלוויזיה או צג (להגדרה ראשונית בלבד)",
      "מקלדת USB (להגדרה ראשונית בלבד — ניתן להסיר לאחר הצימוד)",
      "אישורי חשבון AwareCam שלך (ממדריך הגדרת החשבון)",
    ],
    tipHe: "ה-Raspberry Pi אמור להגיע מוטען מראש עם AwareCam OS. אם קיבלת Pi ריק, צור קשר עם support@awarecam.com לקבלת תמונת מערכת ההפעלה.",
  },
  {
    number: 2,
    title: "Physical Connections",
    description: "Connect all cables before powering on the device.",
    details: [
      "Connect the Ethernet cable from the Pi to your network router or switch.",
      "Connect the HDMI cable from the Pi to your TV or monitor.",
      "Do NOT connect the power cable yet.",
    ],
    screenshot: SCREENS.kioskStreams,
    screenshotAlt: "AwareCam Kiosk streams/live view screen",
    warning: "Always connect Ethernet BEFORE power. The device performs network configuration on first boot and needs a live connection.",
    tip: "Use the HDMI port closest to the USB-C power port on the Pi (labeled HDMI0). The second HDMI port (HDMI1) may not output video on first boot.",

    titleHe: "חיבורים פיזיים",
    descriptionHe: "חבר את כל הכבלים לפני הפעלת המכשיר.",
    detailsHe: [
      "חבר את כבל ה-Ethernet מה-Pi לנתב או מתג הרשת שלך.",
      "חבר את כבל ה-HDMI מה-Pi לטלוויזיה או לצג שלך.",
      "אל תחבר את כבל החשמל עדיין.",
    ],
    warningHe: "חבר תמיד Ethernet לפני חשמל. המכשיר מבצע תצורת רשת בהפעלה ראשונה וצריך חיבור פעיל.",
    tipHe: "השתמש ביציאת HDMI הקרובה ביותר ליציאת USB-C (מסומנת HDMI0). יציאת HDMI השנייה (HDMI1) עשויה שלא להוציא וידאו בהפעלה ראשונה.",
  },
  {
    number: 3,
    title: "Power On & First Boot",
    description: "Connect power and wait for the AwareCam setup screen to appear.",
    details: [
      "Connect the USB-C power cable to the Pi.",
      "Turn on your TV/monitor and switch to the correct HDMI input.",
      "The Pi will boot — you will see a rainbow splash screen, then the AwareCam logo.",
      "First boot takes 60–90 seconds. Subsequent boots take 30–45 seconds.",
      "The AwareCam Kiosk setup screen will appear automatically.",
    ],
    screenshot: SCREENS.kioskLoading,
    screenshotAlt: "AwareCam Kiosk first boot loading screen",
    warning: "Do not disconnect power during first boot. The device is writing configuration files. Interrupting this can corrupt the SD card.",

    titleHe: "הפעלה והפעלה ראשונה",
    descriptionHe: "חבר חשמל והמתן להופעת מסך ההגדרה של AwareCam.",
    detailsHe: [
      "חבר את כבל החשמל USB-C ל-Pi.",
      "הפעל את הטלוויזיה/צג ועבור לכניסת HDMI הנכונה.",
      "ה-Pi יאתחל — תראה מסך פתיחה בצבעי קשת, ואז את לוגו AwareCam.",
      "הפעלה ראשונה לוקחת 60–90 שניות. הפעלות עוקבות לוקחות 30–45 שניות.",
      "מסך ההגדרה של AwareCam Kiosk יופיע אוטומטית.",
    ],
    warningHe: "אל תנתק חשמל במהלך ההפעלה הראשונה. המכשיר כותב קבצי תצורה. הפרעה לכך עלולה לפגום בכרטיס ה-SD.",
  },
  {
    number: 4,
    title: "Get Your Provisioning Code",
    description: "Log in to app.awarecam.com to generate a pairing code for this device.",
    details: [
      "On a separate computer or phone, open app.awarecam.com.",
      "Navigate to your Site (Location) → Settings → Gateway Devices.",
      "Click 'Add Gateway Device'.",
      "A 10-character provisioning code is displayed (format: XXXX-XXXXX, e.g., XKMT-72PQ3).",
      "Keep this screen open — you will enter this code on the Kiosk in the next step.",
    ],
    screenshot: SCREENS.kioskSettings,
    screenshotAlt: "AwareCam Kiosk settings screen",
    warning: "The provisioning code is single-use and expires after 24 hours. Generate a new code for each additional device.",

    titleHe: "קבלת קוד ההקצאה",
    descriptionHe: "התחבר ל-app.awarecam.com כדי ליצור קוד צימוד עבור מכשיר זה.",
    detailsHe: [
      "במחשב או טלפון נפרד, פתח את app.awarecam.com.",
      "נווט לאתר שלך (מיקום) ← הגדרות ← מכשירי שער.",
      "לחץ על 'הוסף מכשיר שער'.",
      "מוצג קוד הקצאה בן 10 תווים (פורמט: XXXX-XXXXX, למשל XKMT-72PQ3).",
      "השאר את המסך הזה פתוח — תזין קוד זה ב-Kiosk בשלב הבא.",
    ],
    warningHe: "קוד ההקצאה הוא חד-פעמי ופג תוקף לאחר 24 שעות. צור קוד חדש לכל מכשיר נוסף.",
  },
  {
    number: 5,
    title: "Enter the Provisioning Code on the Kiosk",
    description: "Pair the Kiosk device with your AwareCam account.",
    details: [
      "On the Kiosk setup screen, type your 10-character provisioning code using the USB keyboard.",
      "The code format is XXXX-XXXXX (4 characters, dash, 5 characters).",
      "Click 'Pair Device'.",
      "The device connects to the AwareCam cloud and confirms pairing.",
      "You will see a green 'Device Paired Successfully' message.",
    ],
    screenshot: SCREENS.kioskSetup,
    screenshotAlt: "AwareCam Kiosk provisioning code entry screen",
    tip: "The code is case-insensitive. XKMT-72PQ3 and xkmt-72pq3 both work.",
    warning: "If pairing fails, check that the Ethernet cable is connected and the internet is working. The device needs internet access to pair.",

    titleHe: "הזנת קוד ההקצאה ב-Kiosk",
    descriptionHe: "צמד את מכשיר ה-Kiosk עם חשבון AwareCam שלך.",
    detailsHe: [
      "במסך ההגדרה של ה-Kiosk, הקלד את קוד ההקצאה בן 10 התווים באמצעות מקלדת ה-USB.",
      "פורמט הקוד הוא XXXX-XXXXX (4 תווים, מקף, 5 תווים).",
      "לחץ על 'צמד מכשיר'.",
      "המכשיר מתחבר לענן AwareCam ומאשר את הצימוד.",
      "תראה הודעה ירוקה 'המכשיר צומד בהצלחה'.",
    ],
    warningHe: "אם הצימוד נכשל, בדוק שכבל ה-Ethernet מחובר ושהאינטרנט עובד. המכשיר צריך גישה לאינטרנט לצימוד.",
    tipHe: "הקוד אינו תלוי רישיות. XKMT-72PQ3 ו-xkmt-72pq3 שניהם עובדים.",
  },
  {
    number: 6,
    title: "Set Your Security PIN",
    description: "Create a 4-digit PIN to protect the Kiosk from unauthorized access.",
    details: [
      "Enter a 4-digit PIN using the on-screen number pad.",
      "Confirm the PIN by entering it again.",
      "Click 'Set PIN'.",
      "This PIN is required every time the device restarts or the screen is locked.",
    ],
    screenshot: SCREENS.kioskPin,
    screenshotAlt: "AwareCam Kiosk PIN setup screen",
    tip: "Choose a PIN that on-site staff can remember but is not obvious (avoid 1234 or 0000). Record it in your client's handover document.",
    warning: "If the PIN is forgotten, contact support@awarecam.com. A remote PIN reset can be sent from the admin dashboard.",

    titleHe: "הגדרת קוד PIN לאבטחה",
    descriptionHe: "צור PIN בן 4 ספרות להגנה על ה-Kiosk מפני גישה לא מורשית.",
    detailsHe: [
      "הזן PIN בן 4 ספרות באמצעות לוח המספרים על המסך.",
      "אשר את ה-PIN על ידי הזנתו שוב.",
      "לחץ על 'הגדר PIN'.",
      "PIN זה נדרש בכל פעם שהמכשיר מופעל מחדש או שהמסך נעול.",
    ],
    warningHe: "אם ה-PIN נשכח, צור קשר עם support@awarecam.com. ניתן לשלוח איפוס PIN מרחוק מלוח הניהול.",
    tipHe: "בחר PIN שצוות האתר יכול לזכור אך אינו ברור (הימנע מ-1234 או 0000). תעד אותו במסמך מסירת הלקוח.",
  },
  {
    number: 7,
    title: "Discover & Add Cameras",
    description: "Scan your local network to find IP cameras and add them to the system.",
    details: [
      "After entering your PIN, the Kiosk main dashboard appears.",
      "Tap 'Cameras' in the sidebar.",
      "Choose a scan type: Quick Discover (2–3 sec), Enhanced Discovery (15 sec), or Full Network Scan (45 sec).",
      "Found cameras appear in the 'Discovered Cameras' list with IP address and detected brand.",
      "Tap 'Configure' next to each camera.",
      "Enter the camera name, confirm the brand (Dahua, Hikvision, Reolink, etc.), username, and password.",
      "Select an RTSP URL from the suggestions list.",
      "Tap 'Test' to verify — a green checkmark means success.",
      "Tap 'Save Camera'.",
    ],
    screenshot: SCREENS.kioskCameras,
    screenshotAlt: "AwareCam Kiosk camera discovery and configuration screen",
    tip: "Use 'Full Network Scan' if cameras are not appearing. The device also auto-scans every 5 minutes in the background.",
    warning: "You must know your camera's admin password. AwareCam cannot bypass or recover camera passwords.",

    titleHe: "גילוי והוספת מצלמות",
    descriptionHe: "סרוק את הרשת המקומית למציאת מצלמות IP והוסף אותן למערכת.",
    detailsHe: [
      "לאחר הזנת ה-PIN, לוח הבקרה הראשי של ה-Kiosk מופיע.",
      "הקש על 'מצלמות' בסרגל הצד.",
      "בחר סוג סריקה: גילוי מהיר (2–3 שניות), גילוי מורחב (15 שניות), או סריקת רשת מלאה (45 שניות).",
      "מצלמות שנמצאו מופיעות ברשימת 'מצלמות שהתגלו' עם כתובת IP ומותג שזוהה.",
      "הקש על 'הגדר' ליד כל מצלמה.",
      "הזן את שם המצלמה, אשר את המותג (Dahua, Hikvision, Reolink וכו'), שם משתמש וסיסמה.",
      "בחר כתובת RTSP מרשימת ההצעות.",
      "הקש על 'בדוק' לאימות — סימן ביקורת ירוק פירושו הצלחה.",
      "הקש על 'שמור מצלמה'.",
    ],
    warningHe: "עליך לדעת את סיסמת מנהל המצלמה. AwareCam אינה יכולה לעקוף או לשחזר סיסמאות מצלמה.",
    tipHe: "השתמש ב'סריקת רשת מלאה' אם מצלמות אינן מופיעות. המכשיר גם סורק אוטומטית כל 5 דקות ברקע.",
  },
  {
    number: 8,
    title: "Configure AI Agents & Verify",
    description: "Return to app.awarecam.com to enable AI detection, then verify everything is working.",
    details: [
      "On a computer or phone, open app.awarecam.com.",
      "Navigate to your Site → Cameras.",
      "Your newly added cameras will appear (synced from the Kiosk device).",
      "Click a camera → follow the Camera Setup Wizard (Steps 7–10 in the Account Setup guide above) to draw zones, select AI agents, and configure alerts.",
      "On the Kiosk screen: all cameras should show a green status dot.",
      "In the app: cameras should show 'Online' status.",
      "Walk in front of a camera to trigger a Person Detection alert.",
      "Confirm the alert appears in the Alerts page on app.awarecam.com.",
    ],
    screenshot: SCREENS.setupComplete,
    screenshotAlt: "AwareCam app — cameras synced from Kiosk, showing online status",
    tip: "It takes 30–60 seconds for the first AI alert to process after enabling agents. Test before leaving the site.",

    titleHe: "הגדרת סוכני AI ואימות",
    descriptionHe: "חזור ל-app.awarecam.com להפעלת זיהוי AI, ואז אמת שהכל עובד.",
    detailsHe: [
      "במחשב או טלפון, פתח את app.awarecam.com.",
      "נווט לאתר שלך ← מצלמות.",
      "המצלמות שהוספת לאחרונה יופיעו (מסונכרנות ממכשיר ה-Kiosk).",
      "לחץ על מצלמה ← עקוב אחר אשף הגדרת המצלמה (שלבים 7–10 במדריך הגדרת החשבון לעיל) לציור אזורים, בחירת סוכני AI והגדרת התראות.",
      "במסך ה-Kiosk: כל המצלמות אמורות להציג נקודת מצב ירוקה.",
      "באפליקציה: מצלמות אמורות להציג מצב 'מקוון'.",
      "הלך מול מצלמה כדי להפעיל התראת זיהוי אנשים.",
      "אשר שההתראה מופיעה בדף ההתראות ב-app.awarecam.com.",
    ],
    tipHe: "לוקח 30–60 שניות לעיבוד ההתראה הראשונה של AI לאחר הפעלת הסוכנים. בדוק לפני עזיבת האתר.",
  },
];

// ─────────────────────────────────────────────
// WINDOWS EDGE DEVICE SETUP
// ─────────────────────────────────────────────
const windowsSteps: Step[] = [
  {
    number: 1,
    title: "System Requirements",
    description: "Verify the Windows PC meets minimum requirements before installing.",
    details: [
      "OS: Windows 10 (64-bit) or Windows 11",
      "Processor: Intel N100 or better (Intel Core i3/i5/i7 also supported)",
      "RAM: Minimum 8 GB (16 GB recommended for 20+ cameras)",
      "Storage: Minimum 50 GB free disk space",
      "Network: Ethernet connection (Gigabit recommended)",
      "Internet: Stable broadband connection (10 Mbps+ upload for 10 cameras)",
    ],
    screenshot: "Intel N100 Mini-PC — small form-factor PC with AwareCam branding sticker, Ethernet port, USB ports, and HDMI port visible. Placed next to a standard coffee mug for size reference.",
    screenshotAlt: "AwareCam Windows Edge Device — Intel N100 Mini-PC",
    tip: "The Intel N100 Mini-PC (available from AwareCam) is pre-configured and tested to handle 30–40 simultaneous camera streams.",

    titleHe: "דרישות מערכת",
    descriptionHe: "אמת שמחשב Windows עומד בדרישות המינימום לפני ההתקנה.",
    detailsHe: [
      "מערכת הפעלה: Windows 10 (64-bit) או Windows 11",
      "מעבד: Intel N100 או טוב יותר (Intel Core i3/i5/i7 נתמך גם)",
      "RAM: מינימום 8 GB (16 GB מומלץ ל-20+ מצלמות)",
      "אחסון: מינימום 50 GB שטח דיסק פנוי",
      "רשת: חיבור Ethernet (Gigabit מומלץ)",
      "אינטרנט: חיבור פס רחב יציב (10 Mbps+ העלאה ל-10 מצלמות)",
    ],
    tipHe: "מיני-PC Intel N100 (זמין מ-AwareCam) מוגדר ונבדק מראש לטיפול ב-30–40 זרמי מצלמה בו-זמניים.",
  },
  {
    number: 2,
    title: "Download the AwareCam Windows App",
    description: "Download the AwareCam Edge Agent installer from the partner portal.",
    details: [
      "Log in to the AwareCam Partner Portal (this portal).",
      "Navigate to Document Library → Setup Guides.",
      "Download 'AwareCam Windows Edge Agent' installer.",
      "Alternatively, your AwareCam partner will provide a direct download link.",
      "Save the installer file (AwareCam-Edge-Setup.exe) to the Desktop.",
    ],
    screenshot: "Partner Portal Document Library — Setup Guides tab selected, 'AwareCam Windows Edge Agent' document row highlighted with a Download button on the right.",
    screenshotAlt: "Partner Portal — downloading Windows Edge Agent installer",
    warning: "Only download the installer from official AwareCam sources. Do not install from third-party websites.",

    titleHe: "הורדת אפליקציית AwareCam Windows",
    descriptionHe: "הורד את מתקין AwareCam Edge Agent מפורטל השותפים.",
    detailsHe: [
      "התחבר לפורטל השותפים של AwareCam (פורטל זה).",
      "נווט לספריית מסמכים ← מדריכי הגדרה.",
      "הורד את מתקין 'AwareCam Windows Edge Agent'.",
      "לחלופין, שותף AwareCam שלך יספק קישור הורדה ישיר.",
      "שמור את קובץ המתקין (AwareCam-Edge-Setup.exe) בשולחן העבודה.",
    ],
    warningHe: "הורד את המתקין רק ממקורות AwareCam רשמיים. אל תתקין מאתרי צד שלישי.",
  },
  {
    number: 3,
    title: "Install the AwareCam Edge Agent",
    description: "Run the installer with administrator privileges.",
    details: [
      "Right-click AwareCam-Edge-Setup.exe → 'Run as administrator'.",
      "If Windows Defender SmartScreen appears, click 'More info' → 'Run anyway'.",
      "Accept the license agreement.",
      "Choose the installation directory (default: C:\\Program Files\\AwareCam).",
      "Click 'Install'.",
      "When installation completes, check 'Launch AwareCam Edge Agent' and click 'Finish'.",
    ],
    screenshot: "AwareCam Edge Agent installer — Windows setup wizard showing license agreement page, progress bar at 60%, and 'Install' button. AwareCam logo in top-left of installer window.",
    screenshotAlt: "AwareCam Edge Agent Windows installer",
    tip: "The installer registers AwareCam as a Windows Service that starts automatically on boot. No manual launch required after setup.",

    titleHe: "התקנת AwareCam Edge Agent",
    descriptionHe: "הפעל את המתקין עם הרשאות מנהל.",
    detailsHe: [
      "לחץ לחיצה ימנית על AwareCam-Edge-Setup.exe ← 'הפעל כמנהל'.",
      "אם מופיע Windows Defender SmartScreen, לחץ על 'מידע נוסף' ← 'הפעל בכל זאת'.",
      "קבל את הסכם הרישיון.",
      "בחר את ספריית ההתקנה (ברירת מחדל: C:\\Program Files\\AwareCam).",
      "לחץ על 'התקן'.",
      "כאשר ההתקנה מסתיימת, סמן 'הפעל AwareCam Edge Agent' ולחץ על 'סיום'.",
    ],
    tipHe: "המתקין רושם את AwareCam כשירות Windows שמתחיל אוטומטית עם האתחול. אין צורך בהפעלה ידנית לאחר ההגדרה.",
  },
  {
    number: 4,
    title: "Open the AwareCam Edge Dashboard",
    description: "Access the local web interface to configure the device.",
    details: [
      "The AwareCam Edge Agent opens a local web interface automatically after installation.",
      "If it doesn't open, open Chrome or Edge and go to: http://localhost:8080",
      "You will see the AwareCam Edge Dashboard.",
      "From any other device on the same network, access it at: http://[PC-IP-address]:8080",
    ],
    screenshot: "AwareCam Edge Dashboard — local web interface at localhost:8080. Dark theme, AwareCam logo top-left, sidebar with Cameras, Settings, Status. Main area shows 'Device Not Paired' status with a 'Pair with AwareCam Cloud' button.",
    screenshotAlt: "AwareCam Edge Dashboard — local web interface before pairing",
    code: "http://localhost:8080",
    tip: "Bookmark http://localhost:8080 for quick access. You can also access it remotely from any device on the same network using the PC's IP address.",

    titleHe: "פתיחת לוח הבקרה של AwareCam Edge",
    descriptionHe: "גש לממשק האינטרנט המקומי להגדרת המכשיר.",
    detailsHe: [
      "AwareCam Edge Agent פותח ממשק אינטרנט מקומי אוטומטית לאחר ההתקנה.",
      "אם אינו נפתח, פתח Chrome או Edge ועבור אל: http://localhost:8080",
      "תראה את לוח הבקרה של AwareCam Edge.",
      "מכל מכשיר אחר באותה רשת, גש אליו בכתובת: http://[כתובת-IP-של-המחשב]:8080",
    ],
    tipHe: "הוסף סימנייה ל-http://localhost:8080 לגישה מהירה. ניתן גם לגשת אליו מרחוק מכל מכשיר באותה רשת באמצעות כתובת ה-IP של המחשב.",
  },
  {
    number: 5,
    title: "Get Your Provisioning Code & Pair the Device",
    description: "Generate a provisioning code in app.awarecam.com and enter it in the Edge Dashboard.",
    details: [
      "On a separate computer or phone, open app.awarecam.com.",
      "Navigate to your Site → Settings → Gateway Devices → Add Gateway Device.",
      "Copy the 10-character provisioning code.",
      "In the AwareCam Edge Dashboard, click 'Pair with AwareCam Cloud'.",
      "Enter the provisioning code and click 'Pair Device'.",
      "The device connects to the AwareCam cloud — you will see a green 'Device Paired Successfully' confirmation.",
      "The VPN status indicator in the top-right should turn green.",
    ],
    screenshot: "AwareCam Edge Dashboard — pairing modal with provisioning code field filled in, 'Pair Device' button. Below it, green success banner: 'Device Paired Successfully — Site: Main Warehouse'. VPN status indicator in top-right showing green.",
    screenshotAlt: "AwareCam Edge Dashboard — device pairing success",
    warning: "If pairing fails, check Windows Firewall. The installer adds the necessary exceptions automatically, but some enterprise security software may block it.",

    titleHe: "קבלת קוד ההקצאה וצימוד המכשיר",
    descriptionHe: "צור קוד הקצאה ב-app.awarecam.com והזן אותו בלוח הבקרה של Edge.",
    detailsHe: [
      "במחשב או טלפון נפרד, פתח את app.awarecam.com.",
      "נווט לאתר שלך ← הגדרות ← מכשירי שער ← הוסף מכשיר שער.",
      "העתק את קוד ההקצאה בן 10 התווים.",
      "בלוח הבקרה של AwareCam Edge, לחץ על 'צמד עם ענן AwareCam'.",
      "הזן את קוד ההקצאה ולחץ על 'צמד מכשיר'.",
      "המכשיר מתחבר לענן AwareCam — תראה אישור ירוק 'המכשיר צומד בהצלחה'.",
      "מחוון מצב ה-VPN בפינה הימנית העליונה אמור להפוך לירוק.",
    ],
    warningHe: "אם הצימוד נכשל, בדוק את חומת האש של Windows. המתקין מוסיף את החריגים הנדרשים אוטומטית, אך תוכנת אבטחה ארגונית מסוימת עשויה לחסום אותו.",
  },
  {
    number: 6,
    title: "Discover & Add Cameras",
    description: "Scan the network to find IP cameras and configure them.",
    details: [
      "In the AwareCam Edge Dashboard, click 'Cameras' in the left sidebar.",
      "Click 'Scan for Cameras'.",
      "Choose: Quick Discover, Enhanced Discovery, or Full Network Scan.",
      "Discovered cameras appear in the list with IP address and detected brand.",
      "Click 'Configure' next to each camera.",
      "Enter camera name, confirm brand, username, and password.",
      "Select the RTSP URL from the dropdown.",
      "Click 'Test Connection' — green checkmark = success.",
      "Click 'Save Camera'.",
    ],
    screenshot: "AwareCam Edge Dashboard Cameras page — scan results showing 4 discovered cameras with IP addresses, brand icons (Hikvision, Dahua), and 'Configure' buttons. One camera has an expanded configuration panel open.",
    screenshotAlt: "AwareCam Edge Dashboard — camera discovery and configuration",
    tip: "For large deployments (20+ cameras), use the CSV import feature to add cameras in bulk. Download the template from Cameras → Import → Download Template.",

    titleHe: "גילוי והוספת מצלמות",
    descriptionHe: "סרוק את הרשת למציאת מצלמות IP והגדר אותן.",
    detailsHe: [
      "בלוח הבקרה של AwareCam Edge, לחץ על 'מצלמות' בסרגל הצד השמאלי.",
      "לחץ על 'סרוק מצלמות'.",
      "בחר: גילוי מהיר, גילוי מורחב, או סריקת רשת מלאה.",
      "מצלמות שהתגלו מופיעות ברשימה עם כתובת IP ומותג שזוהה.",
      "לחץ על 'הגדר' ליד כל מצלמה.",
      "הזן שם מצלמה, אשר מותג, שם משתמש וסיסמה.",
      "בחר את כתובת ה-RTSP מהתפריט הנפתח.",
      "לחץ על 'בדוק חיבור' — סימן ביקורת ירוק = הצלחה.",
      "לחץ על 'שמור מצלמה'.",
    ],
    tipHe: "לפריסות גדולות (20+ מצלמות), השתמש בתכונת ייבוא CSV להוספת מצלמות בכמות גדולה. הורד את התבנית מ-מצלמות ← ייבוא ← הורד תבנית.",
  },
  {
    number: 7,
    title: "Configure AI Agents & Alerts in the App",
    description: "Return to app.awarecam.com to enable AI detection for each camera.",
    details: [
      "Open app.awarecam.com on any browser.",
      "Navigate to your Site → Cameras.",
      "Your cameras will appear synced from the Windows Edge device.",
      "Click each camera and follow the Camera Setup Wizard (Steps 7–10 in the Account Setup guide) to draw zones, select AI agents, and configure email/SMS alerts.",
    ],
    screenshot: "AwareCam app Cameras page — cameras synced from Windows Edge device, each showing 'Online' status badge and 'Configure Agents' button.",
    screenshotAlt: "AwareCam app — cameras synced from Windows Edge device",
    tip: "For large sites, use the 'Apply to All Cameras' option to quickly enable the same agents across all cameras, then fine-tune individual cameras as needed.",

    titleHe: "הגדרת סוכני AI והתראות באפליקציה",
    descriptionHe: "חזור ל-app.awarecam.com להפעלת זיהוי AI עבור כל מצלמה.",
    detailsHe: [
      "פתח את app.awarecam.com בכל דפדפן.",
      "נווט לאתר שלך ← מצלמות.",
      "המצלמות שלך יופיעו מסונכרנות ממכשיר Windows Edge.",
      "לחץ על כל מצלמה ועקוב אחר אשף הגדרת המצלמה (שלבים 7–10 במדריך הגדרת החשבון) לציור אזורים, בחירת סוכני AI והגדרת התראות אימייל/SMS.",
    ],
    tipHe: "לאתרים גדולים, השתמש באפשרות 'החל על כל המצלמות' להפעלה מהירה של אותם סוכנים על כל המצלמות, ואז כוונן מצלמות בודדות לפי הצורך.",
  },
  {
    number: 8,
    title: "Configure Auto-Start & Verify",
    description: "Ensure the service runs reliably and confirm everything is working.",
    details: [
      "Open Windows Services (press Win+R → type 'services.msc' → Enter).",
      "Find 'AwareCam Edge Agent' in the list.",
      "Confirm Startup type is 'Automatic' (the installer sets this by default).",
      "Under the Recovery tab, confirm 'First failure' and 'Second failure' are set to 'Restart the Service'.",
      "In the app: cameras should show 'Online' status.",
      "Walk in front of a camera to trigger a test Person Detection alert.",
      "Confirm the alert appears in the Alerts page on app.awarecam.com.",
    ],
    screenshot: SCREENS.setupComplete,
    screenshotAlt: "Windows Services — AwareCam Edge Agent service running",
    tip: "The AwareCam installer configures auto-start automatically. This step is only needed if you're doing a manual or enterprise deployment.",

    titleHe: "הגדרת הפעלה אוטומטית ואימות",
    descriptionHe: "ודא שהשירות פועל בצורה אמינה ואשר שהכל עובד.",
    detailsHe: [
      "פתח שירותי Windows (לחץ Win+R ← הקלד 'services.msc' ← Enter).",
      "מצא 'AwareCam Edge Agent' ברשימה.",
      "אשר שסוג ההפעלה הוא 'אוטומטי' (המתקין מגדיר זאת כברירת מחדל).",
      "תחת לשונית השחזור, אשר ש'כשל ראשון' ו'כשל שני' מוגדרים ל'הפעל מחדש את השירות'.",
      "באפליקציה: מצלמות אמורות להציג מצב 'מקוון'.",
      "הלך מול מצלמה כדי להפעיל התראת זיהוי אנשים לבדיקה.",
      "אשר שההתראה מופיעה בדף ההתראות ב-app.awarecam.com.",
    ],
    tipHe: "מתקין AwareCam מגדיר הפעלה אוטומטית אוטומטית. שלב זה נדרש רק אם אתה מבצע פריסה ידנית או ארגונית.",
  },
];

// ─────────────────────────────────────────────
// DIRECT RTSP (CLOUD-ONLY) SETUP
// ─────────────────────────────────────────────
const rtspSteps: Step[] = [
  {
    number: 1,
    title: "Verify Requirements",
    description: "Direct RTSP requires specific network conditions. Confirm all requirements before proceeding.",
    details: [
      "✓ Public static IP address (provided by your ISP — not a dynamic IP)",
      "✓ Upload bandwidth: 1.5–2 Mbps per camera stream",
      "✓ Router/firewall access to configure port forwarding",
      "✓ Camera admin credentials (username + password)",
      "✓ AwareCam account at app.awarecam.com (see Account Setup guide)",
    ],
    screenshot: "Network diagram — camera on local network (192.168.1.x) connected to a router with a static public IP, arrow pointing to AwareCam cloud servers. Labels show 'Port Forwarding' on the router and 'RTSP Stream' on the arrow.",
    screenshotAlt: "Direct RTSP network architecture diagram",
    warning: "If you do not have a static IP, use a Kiosk or Windows Edge device instead. Dynamic IPs will cause cameras to go offline whenever the IP changes.",
    tip: "Not sure if you have a static IP? Ask your ISP or check your router's WAN settings. A static IP typically costs $5–15/month extra from most ISPs.",

    titleHe: "אימות דרישות",
    descriptionHe: "RTSP ישיר דורש תנאי רשת ספציפיים. אשר את כל הדרישות לפני ההמשך.",
    detailsHe: [
      "✓ כתובת IP סטטית ציבורית (מסופקת על ידי ספק האינטרנט שלך — לא IP דינמי)",
      "✓ רוחב פס העלאה: 1.5–2 Mbps לכל זרם מצלמה",
      "✓ גישה לנתב/חומת אש להגדרת העברת יציאות",
      "✓ אישורי מנהל מצלמה (שם משתמש + סיסמה)",
      "✓ חשבון AwareCam ב-app.awarecam.com (ראה מדריך הגדרת החשבון)",
    ],
    warningHe: "אם אין לך IP סטטי, השתמש במכשיר Kiosk או Windows Edge במקום. IPs דינמיים יגרמו למצלמות לצאת ממצב מקוון בכל פעם שה-IP משתנה.",
    tipHe: "לא בטוח אם יש לך IP סטטי? שאל את ספק האינטרנט שלך או בדוק את הגדרות ה-WAN של הנתב שלך. IP סטטי בדרך כלל עולה 20–60 ₪ לחודש נוסף מרוב ספקי האינטרנט.",
  },
  {
    number: 2,
    title: "Assign Static Local IPs to Cameras",
    description: "Give each camera a fixed local IP address so port forwarding rules stay consistent.",
    details: [
      "Log in to your router's admin interface (usually http://192.168.1.1 or http://192.168.0.1).",
      "Find the DHCP reservation or static IP assignment section.",
      "For each camera, reserve a static IP based on its MAC address.",
      "Recommended IP range: 192.168.1.100, 192.168.1.101, 192.168.1.102, etc.",
      "Save and reboot cameras to apply the new IPs.",
    ],
    screenshot: "Router admin interface — DHCP reservation table showing three cameras with MAC addresses, assigned IPs (192.168.1.100, .101, .102), and device names (Camera 1, Camera 2, Camera 3). 'Add Reservation' button at bottom.",
    screenshotAlt: "Router DHCP reservation table — static IP assignment for cameras",
    tip: "Write down each camera's name and assigned IP address. You will need this in the next steps.",

    titleHe: "הקצאת כתובות IP מקומיות סטטיות למצלמות",
    descriptionHe: "תן לכל מצלמה כתובת IP מקומית קבועה כדי שכללי העברת היציאות יישארו עקביים.",
    detailsHe: [
      "התחבר לממשק הניהול של הנתב שלך (בדרך כלל http://192.168.1.1 או http://192.168.0.1).",
      "מצא את קטע הקצאת IP סטטי או שמירת DHCP.",
      "עבור כל מצלמה, שמור IP סטטי בהתבסס על כתובת ה-MAC שלה.",
      "טווח IP מומלץ: 192.168.1.100, 192.168.1.101, 192.168.1.102 וכו'.",
      "שמור ואתחל מצלמות להחלת ה-IPs החדשים.",
    ],
    tipHe: "רשום את שם כל מצלמה וכתובת ה-IP שהוקצתה לה. תזדקק לזה בשלבים הבאים.",
  },
  {
    number: 3,
    title: "Configure Port Forwarding",
    description: "Map external ports on your router to each camera's internal RTSP port.",
    details: [
      "In your router's admin interface, find Port Forwarding (also called Virtual Server or NAT).",
      "Create one rule per camera:",
      "  • Internal IP: camera's local IP (e.g., 192.168.1.100)",
      "  • Internal Port: 554 (standard RTSP port)",
      "  • External Port: assign a unique port per camera (e.g., 5541, 5542, 5543...)",
      "  • Protocol: TCP",
      "Save all rules.",
    ],
    screenshot: "Router port forwarding table — three rules listed: Camera 1 (192.168.1.100:554 → external 5541), Camera 2 (192.168.1.101:554 → external 5542), Camera 3 (192.168.1.102:554 → external 5543). All rules show TCP protocol and Enabled status.",
    screenshotAlt: "Router port forwarding rules for RTSP cameras",
    code: "Camera 1: 192.168.1.100:554 → External Port 5541\nCamera 2: 192.168.1.101:554 → External Port 5542\nCamera 3: 192.168.1.102:554 → External Port 5543",
    warning: "Each camera must have a unique external port. Using the same external port for multiple cameras will cause conflicts.",

    titleHe: "הגדרת העברת יציאות",
    descriptionHe: "מפה יציאות חיצוניות בנתב שלך ליציאת RTSP הפנימית של כל מצלמה.",
    detailsHe: [
      "בממשק הניהול של הנתב, מצא העברת יציאות (נקרא גם שרת וירטואלי או NAT).",
      "צור כלל אחד לכל מצלמה:",
      "  • IP פנימי: כתובת ה-IP המקומית של המצלמה (למשל, 192.168.1.100)",
      "  • יציאה פנימית: 554 (יציאת RTSP סטנדרטית)",
      "  • יציאה חיצונית: הקצה יציאה ייחודית לכל מצלמה (למשל, 5541, 5542, 5543...)",
      "  • פרוטוקול: TCP",
      "שמור את כל הכללים.",
    ],
    warningHe: "לכל מצלמה חייבת להיות יציאה חיצונית ייחודית. שימוש באותה יציאה חיצונית עבור מצלמות מרובות יגרום לקונפליקטים.",
  },
  {
    number: 4,
    title: "Build Your RTSP URLs",
    description: "Construct the public RTSP URL for each camera using your static IP and port.",
    details: [
      "General format: rtsp://[username]:[password]@[Public_IP]:[External_Port]/[stream_path]",
      "Dahua substream: /cam/realmonitor?channel=1&subtype=1",
      "Hikvision substream: /Streaming/Channels/102",
      "Reolink substream: /h264Preview_01_sub",
      "Example: rtsp://admin:MyPass123@203.0.113.50:5541/cam/realmonitor?channel=1&subtype=1",
    ],
    screenshot: "RTSP URL builder tool — input fields for public IP, port, username, password, and camera brand. Below it, the constructed RTSP URL is shown in a copyable text box: rtsp://admin:●●●●●@203.0.113.50:5541/cam/realmonitor?channel=1&subtype=1",
    screenshotAlt: "RTSP URL construction example",
    code: "rtsp://admin:PASSWORD@YOUR.PUBLIC.IP:5541/cam/realmonitor?channel=1&subtype=1",
    tip: "Use substreams (lower resolution) for AI analytics. Main streams use too much bandwidth and are not needed for AI detection.",

    titleHe: "בניית כתובות RTSP שלך",
    descriptionHe: "בנה את כתובת ה-RTSP הציבורית לכל מצלמה באמצעות ה-IP הסטטי והיציאה שלך.",
    detailsHe: [
      "פורמט כללי: rtsp://[שם_משתמש]:[סיסמה]@[IP_ציבורי]:[יציאה_חיצונית]/[נתיב_זרם]",
      "Dahua substream: /cam/realmonitor?channel=1&subtype=1",
      "Hikvision substream: /Streaming/Channels/102",
      "Reolink substream: /h264Preview_01_sub",
      "דוגמה: rtsp://admin:MyPass123@203.0.113.50:5541/cam/realmonitor?channel=1&subtype=1",
    ],
    tipHe: "השתמש ב-substreams (רזולוציה נמוכה יותר) לאנליטיקת AI. זרמים ראשיים משתמשים ביותר מדי רוחב פס ואינם נדרשים לזיהוי AI.",
  },
  {
    number: 5,
    title: "Add Cameras in app.awarecam.com",
    description: "Enter the RTSP URLs into your AwareCam account.",
    details: [
      "Log in to app.awarecam.com.",
      "Navigate to your Site → Cameras → Add Camera.",
      "In the Camera Setup Wizard, select 'Direct RTSP Connection'.",
      "Toggle 'Use Direct RTSP URL' to ON.",
      "Paste the full RTSP URL.",
      "Click 'Test Connection' — a successful test shows a snapshot from the camera.",
      "Click 'Next' to proceed through zones, AI agents, and alerts.",
      "Repeat for each camera.",
    ],
    screenshot: "AwareCam Camera Setup Wizard — Step 1 with 'Use Direct RTSP URL' toggle ON, RTSP URL field filled with the full URL, and a 'Test Connection' button. Below the button, a green success message: 'Connection successful — snapshot preview shown'.",
    screenshotAlt: "AwareCam add camera — direct RTSP URL entry and test",
    warning: "If the test fails: verify port forwarding rules, confirm your public IP is correct, and check camera credentials.",

    titleHe: "הוספת מצלמות ב-app.awarecam.com",
    descriptionHe: "הזן את כתובות ה-RTSP לחשבון AwareCam שלך.",
    detailsHe: [
      "התחבר ל-app.awarecam.com.",
      "נווט לאתר שלך ← מצלמות ← הוסף מצלמה.",
      "באשף הגדרת המצלמה, בחר 'חיבור RTSP ישיר'.",
      "הפעל 'השתמש בכתובת RTSP ישירה' ל-ON.",
      "הדבק את כתובת ה-RTSP המלאה.",
      "לחץ על 'בדוק חיבור' — בדיקה מוצלחת מציגה תמונת מצב מהמצלמה.",
      "לחץ על 'הבא' כדי להמשיך דרך אזורים, סוכני AI והתראות.",
      "חזור על כך עבור כל מצלמה.",
    ],
    warningHe: "אם הבדיקה נכשלת: אמת כללי העברת יציאות, אשר שכתובת ה-IP הציבורית שלך נכונה, ובדוק אישורי מצלמה.",
  },
  {
    number: 6,
    title: "Enable AI Agents & Configure Alerts",
    description: "Configure AI detection and notifications for each camera.",
    details: [
      "Continue through the Camera Setup Wizard: draw zones, select AI agents, configure email/SMS alerts.",
      "Refer to Steps 7–10 in the Account Setup guide above for detailed instructions.",
      "For Direct RTSP cameras, AI processing happens in the AwareCam cloud.",
      "Ensure your upload bandwidth is sufficient (1.5–2 Mbps per camera) before enabling multiple agents.",
    ],
    screenshot: "AwareCam Camera Setup Wizard Step 3 — AI agents selection for a Direct RTSP camera. Person Detection and Fire/Smoke Detection enabled. Note at bottom: 'AI processing runs in the AwareCam cloud for Direct RTSP cameras'.",
    screenshotAlt: "AwareCam AI agent selection for Direct RTSP camera",
    tip: "For Direct RTSP deployments, monitor your router's upload bandwidth usage after enabling AI agents. Each active camera stream uses 1.5–2 Mbps continuously.",

    titleHe: "הפעלת סוכני AI והגדרת התראות",
    descriptionHe: "הגדר זיהוי AI ועדכוני התראות עבור כל מצלמה.",
    detailsHe: [
      "המשך דרך אשף הגדרת המצלמה: צייר אזורים, בחר סוכני AI, הגדר התראות אימייל/SMS.",
      "עיין בשלבים 7–10 במדריך הגדרת החשבון לעיל לקבלת הוראות מפורטות.",
      "עבור מצלמות RTSP ישיר, עיבוד ה-AI מתרחש בענן AwareCam.",
      "ודא שרוחב הפס להעלאה שלך מספיק (1.5–2 Mbps לכל מצלמה) לפני הפעלת סוכנים מרובים.",
    ],
    tipHe: "לפריסות RTSP ישיר, נטר את השימוש ברוחב פס ההעלאה של הנתב שלך לאחר הפעלת סוכני AI. כל זרם מצלמה פעיל משתמש ב-1.5–2 Mbps ברציפות.",
  },
  {
    number: 7,
    title: "Security Hardening",
    description: "Protect your cameras from unauthorized internet access.",
    details: [
      "Change all camera passwords from defaults to strong, unique passwords.",
      "Update camera firmware to the latest version.",
      "If your router supports IP whitelisting, restrict port forwarding rules to only allow connections from AwareCam's cloud IP range.",
      "Contact support@awarecam.com for the current AwareCam cloud IP whitelist.",
      "Consider disabling UPnP on your router to prevent unauthorized port opening.",
    ],
    screenshot: "Camera admin interface — firmware update page showing current version and 'Check for Updates' button. Password change form below with 'New Password' and 'Confirm Password' fields.",
    screenshotAlt: "Camera admin interface — firmware update and password change",
    warning: "Cameras with default passwords exposed to the internet are a serious security risk. Always change passwords before going live.",

    titleHe: "הקשחת אבטחה",
    descriptionHe: "הגן על המצלמות שלך מפני גישה לא מורשית לאינטרנט.",
    detailsHe: [
      "שנה את כל סיסמאות המצלמה מברירות מחדל לסיסמאות חזקות וייחודיות.",
      "עדכן את קושחת המצלמה לגרסה האחרונה.",
      "אם הנתב שלך תומך ברשימת IP מותרים, הגבל כללי העברת יציאות לאפשר חיבורים רק מטווח ה-IP של ענן AwareCam.",
      "צור קשר עם support@awarecam.com לקבלת רשימת ה-IP הנוכחית של ענן AwareCam.",
      "שקול להשבית UPnP בנתב שלך כדי למנוע פתיחת יציאות לא מורשית.",
    ],
    warningHe: "מצלמות עם סיסמאות ברירת מחדל חשופות לאינטרנט הן סיכון אבטחה חמור. שנה תמיד סיסמאות לפני ההפעלה.",
  },
];

// ─────────────────────────────────────────────
// TROUBLESHOOTING
// ─────────────────────────────────────────────
const troubleshootingItems = [
  { q: "Device won't power on", a: "Check the power cable is fully seated. Use the included USB-C power supply — underpowered supplies cause boot failures. Try a different power outlet.", qHe: "המכשיר לא מופעל", aHe: "בדוק שכבל החשמל מחובר היטב. השתמש בספק כוח USB-C הכלול — ספקי כוח חלשים גורמים לכשלי אתחול. נסה שקע חשמל אחר." },
  { q: "Screen stays black after boot", a: "Ensure the TV is on the correct HDMI input. Use the HDMI port closest to the USB-C power port (HDMI0). Try a different HDMI cable.", qHe: "המסך נשאר שחור לאחר האתחול", aHe: "ודא שהטלוויזיה על כניסת HDMI הנכונה. השתמש ביציאת HDMI הקרובה ביותר ליציאת USB-C (HDMI0). נסה כבל HDMI אחר." },
  { q: "Provisioning code not accepted", a: "Check your internet connection. Verify the code hasn't expired (codes are valid for 24 hours). Generate a new code in app.awarecam.com → Site → Settings → Gateway Devices.", qHe: "קוד ההקצאה אינו מתקבל", aHe: "בדוק את חיבור האינטרנט שלך. אמת שהקוד לא פג תוקף (קודים תקפים ל-24 שעות). צור קוד חדש ב-app.awarecam.com ← אתר ← הגדרות ← מכשירי שער." },
  { q: "Camera shows red dot (offline)", a: "Verify the camera is powered on and on the same network. Go to Cameras → Configure → Test. Try Restart Services in Settings.", qHe: "המצלמה מציגה נקודה אדומה (לא מקוון)", aHe: "אמת שהמצלמה מופעלת ונמצאת באותה רשת. עבור למצלמות ← הגדר ← בדוק. נסה הפעל מחדש שירותים בהגדרות." },
  { q: "Camera RTSP test fails", a: "Double-check the camera password. Ensure you selected the correct camera brand. Try a different RTSP URL from the suggestions list.", qHe: "בדיקת RTSP של המצלמה נכשלת", aHe: "בדוק שוב את סיסמת המצלמה. ודא שבחרת את מותג המצלמה הנכון. נסה כתובת RTSP אחרת מרשימת ההצעות." },
  { q: "VPN shows Disconnected", a: "Check internet connection. Try Restart Services. The VPN auto-reconnects — wait 1–2 minutes. If persistent, try Restart Device.", qHe: "ה-VPN מציג מנותק", aHe: "בדוק חיבור אינטרנט. נסה הפעל מחדש שירותים. ה-VPN מתחבר מחדש אוטומטית — המתן 1–2 דקות. אם הבעיה נמשכת, נסה הפעל מחדש מכשיר." },
  { q: "No alerts being received", a: "Verify AI agents are enabled in app.awarecam.com. Walk in front of a camera to trigger a test alert and confirm it appears in the Alerts page.", qHe: "לא מתקבלות התראות", aHe: "אמת שסוכני AI מופעלים ב-app.awarecam.com. הלך מול מצלמה כדי להפעיל התראת בדיקה ואשר שהיא מופיעה בדף ההתראות." },
  { q: "Live video buffering in app", a: "Check your phone's internet connection. Switch between WiFi and cellular. The issue may be on the camera's network side — check upload bandwidth.", qHe: "וידאו חי מאגר באפליקציה", aHe: "בדוק את חיבור האינטרנט של הטלפון שלך. עבור בין WiFi לסלולרי. הבעיה עשויה להיות בצד הרשת של המצלמה — בדוק רוחב פס העלאה." },
  { q: "Can't log in to app.awarecam.com", a: "Check your email and password. Use the 'Forgot Password' link on the login page. If you used Google or Microsoft sign-in, click the corresponding button instead of entering a password.", qHe: "לא ניתן להתחבר ל-app.awarecam.com", aHe: "בדוק את האימייל והסיסמה שלך. השתמש בקישור 'שכחתי סיסמה' בדף הכניסה. אם השתמשת בכניסה עם Google או Microsoft, לחץ על הכפתור המתאים במקום להזין סיסמה." },
  { q: "Zones not triggering alerts", a: "Confirm the AI agent is enabled and the zone is selected in the agent configuration. Verify the zone polygon covers the area where motion is occurring. Check the alert severity threshold — if set to High, only critical events trigger alerts.", qHe: "אזורים אינם מפעילים התראות", aHe: "אשר שסוכן ה-AI מופעל והאזור נבחר בתצורת הסוכן. אמת שפוליגון האזור מכסה את האזור שבו מתרחשת תנועה. בדוק את סף חומרת ההתראה — אם מוגדר לגבוה, רק אירועים קריטיים מפעילים התראות." },
];

// ─────────────────────────────────────────────
// GUIDE CONFIG
// ─────────────────────────────────────────────
const guides = [
  {
    key: "account" as GuideType,
    label: "1. AwareCam App — Full Product Guide",
    labelHe: "1. אפליקציית AwareCam — מדריך מוצר מלא",
    shortLabel: "App Guide (A to Z)",
    shortLabelHe: "מדריך אפליקציה (מ-א עד ת)",
    icon: UserPlus,
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
    steps: accountSteps,
    description: "Complete walkthrough: account creation, onboarding, adding cameras, drawing zones, AI agents, alerts, analytics, and live view.",
    descriptionHe: "מדריך מלא: יצירת חשבון, Onboarding, הוספת מצלמות, ציור אזורים, סוכני AI, התראות, אנליטיקה וצפייה חיה.",
  },
  {
    key: "kiosk" as GuideType,
    label: "2. Kiosk (Raspberry Pi) Setup",
    labelHe: "2. הגדרת Kiosk (Raspberry Pi)",
    shortLabel: "Kiosk Setup",
    shortLabelHe: "הגדרת Kiosk",
    icon: Monitor,
    color: "text-teal-400",
    bg: "bg-teal-500/10",
    border: "border-teal-500/20",
    steps: kioskSteps,
    description: "Hardware setup for the Raspberry Pi gateway device. Supports up to 20 cameras.",
    descriptionHe: "הגדרת חומרה למכשיר שער Raspberry Pi. תומך עד 20 מצלמות.",
  },
  {
    key: "windows" as GuideType,
    label: "3. Windows Edge Device Setup",
    labelHe: "3. הגדרת מכשיר Windows Edge",
    shortLabel: "Windows Setup",
    shortLabelHe: "הגדרת Windows",
    icon: Cpu,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    steps: windowsSteps,
    description: "Install the Windows Edge Agent for large commercial sites (30–40 cameras).",
    descriptionHe: "התקנת Windows Edge Agent לאתרים מסחריים גדולים (30–40 מצלמות).",
  },
  {
    key: "rtsp" as GuideType,
    label: "4. Direct RTSP (Cloud-Only)",
    labelHe: "4. RTSP ישיר (ענן בלבד)",
    shortLabel: "Direct RTSP",
    shortLabelHe: "RTSP ישיר",
    icon: Wifi,
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    steps: rtspSteps,
    description: "Connect cameras directly to the cloud with no local device. Requires a static public IP.",
    descriptionHe: "חיבור מצלמות ישירות לענן ללא מכשיר מקומי. דורש IP סטטי ציבורי.",
  },
];

// ─────────────────────────────────────────────
// STEP CARD COMPONENT
// ─────────────────────────────────────────────
function StepCard({ step, isLast, language }: { step: Step; isLast: boolean; language: string }) {
  const [expanded, setExpanded] = useState(true);
  const isHe = language === "he";

  return (
    <div className="flex gap-4">
      {/* Step number + connector line */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div
          className="w-9 h-9 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-sm font-bold text-primary"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          {step.number}
        </div>
        {!isLast && <div className="w-px flex-1 bg-border mt-2 min-h-[24px]" />}
      </div>

      {/* Content */}
      <div className={cn("flex-1 min-w-0 pb-6", isLast && "pb-0")}>
        <button
          className="w-full text-left flex items-center justify-between gap-3 group"
          onClick={() => setExpanded(!expanded)}
        >
          <div>
            <h3
              className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {isHe && step.titleHe ? step.titleHe : step.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">{isHe && step.descriptionHe ? step.descriptionHe : step.description}</p>
          </div>
          {expanded
            ? <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            : <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
        </button>

        {expanded && (
          <div className="mt-3 space-y-3">
            {/* Screenshot */}
            {step.screenshot && (() => {
              const isUrl = step.screenshot.startsWith("http") || step.screenshot.startsWith("/");
              if (!isUrl) return null;
              return (
                <div className="rounded-lg overflow-hidden border border-border">
                  <div className="flex items-center gap-2 px-3 py-1.5 border-b border-border bg-secondary/50">
                    <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">App Screenshot</p>
                  </div>
                  <img
                    src={step.screenshot}
                    alt={step.screenshotAlt || "AwareCam app screenshot"}
                    className="w-full block"
                    style={{ display: 'block' }}
                    loading="lazy"
                  />
                </div>
              );
            })()}

            {/* Details list */}
            {(isHe ? (step.detailsHe || step.details) : step.details) && (
              <ul className="space-y-1.5 pl-2">
                {(isHe ? (step.detailsHe || step.details) : step.details)!.map((d, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-primary mt-0.5 flex-shrink-0">→</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Code block */}
            {step.code && (
              <pre className="bg-secondary/80 border border-border rounded-lg p-3 text-xs text-foreground font-mono overflow-x-auto whitespace-pre-wrap">
                {step.code}
              </pre>
            )}

            {/* Warning */}
            {(isHe ? (step.warningHe || step.warning) : step.warning) && (
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                <AlertTriangle className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-orange-300">{isHe ? (step.warningHe || step.warning) : step.warning}</p>
              </div>
            )}

            {/* Tip */}
            {(isHe ? (step.tipHe || step.tip) : step.tip) && (
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-primary/5 border border-primary/15">
                <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">{isHe ? (step.tipHe || step.tip) : step.tip}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────
export default function Installation() {
  const { t, language } = useLanguage();
  const [activeGuide, setActiveGuide] = useState<GuideType>("account");
  const [showTroubleshooting, setShowTroubleshooting] = useState(false);
  const [expandedTrouble, setExpandedTrouble] = useState<number | null>(null);

  const guide = guides.find(g => g.key === activeGuide)!;

  return (
    <PortalLayout>
      <div className="p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-3xl font-bold text-foreground mb-2"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {t("install.title")}
          </h1>
          <p className="text-muted-foreground">
            {language === "he" ? (
              <>מדריכים שלב אחר שלב לפלטפורמת AwareCam. התחל ב-<strong className="text-foreground">מדריך המוצר המלא</strong> ללמוד את האפליקציה מ-א עד ת, ולאחר מכן עקוב אחר מדריך החומרה המתאים לסוג הפריסה שלך.</>
            ) : (
              <>Complete step-by-step guides for the AwareCam platform. Start with the{" "}
              <strong className="text-foreground">Full Product Guide</strong> to learn the app from A to Z,
              then follow the hardware guide for your deployment type.</>
            )}
          </p>
          <InstallationPdfBanner language={language} />
        </div>

        {/* Deployment type selector */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {guides.map((g) => {
            const GIcon = g.icon;
            return (
              <button
                key={g.key}
                onClick={() => setActiveGuide(g.key)}
                className={cn(
                  "p-4 rounded-xl border text-left transition-all",
                  activeGuide === g.key
                    ? `${g.border} ${g.bg}`
                    : "border-border bg-card hover:bg-secondary"
                )}
              >
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center mb-2", g.bg)}>
                  <GIcon className={cn("w-4 h-4", activeGuide === g.key ? g.color : "text-muted-foreground")} />
                </div>
                <div className={cn("text-xs font-semibold mb-1", activeGuide === g.key ? g.color : "text-foreground")}>
                  {language === "he" && (g as any).shortLabelHe ? (g as any).shortLabelHe : g.shortLabel}
                </div>
                <div className="text-[11px] text-muted-foreground leading-relaxed">
                  {language === "he" && (g as any).descriptionHe ? (g as any).descriptionHe : g.description}
                </div>
              </button>
            );
          })}
        </div>

        {/* Flow indicator */}
        <div className="flex items-center gap-2 mb-6 p-3 rounded-lg bg-secondary/50 border border-border">
          <div className="flex items-center gap-1.5 flex-wrap">
            {guides.map((g, i) => {
              const GIcon = g.icon;
              const isActive = g.key === activeGuide;
              return (
                <div key={g.key} className="flex items-center gap-1.5">
                  <button
                    onClick={() => setActiveGuide(g.key)}
                    className={cn(
                      "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all",
                      isActive
                        ? `${g.bg} ${g.color} border ${g.border}`
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <GIcon className="w-3 h-3" />
                    {language === "he" && (g as any).shortLabelHe ? (g as any).shortLabelHe : g.shortLabel}
                  </button>
                  {i < guides.length - 1 && <ArrowRight className="w-3 h-3 text-border" />}
                </div>
              );
            })}
          </div>
          <div className="ml-auto text-xs text-muted-foreground">
            {guide.steps.length} {language === "he" ? "שלבים" : "steps"}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Steps column */}
          <div className="lg:col-span-2">
            <div className="p-6 rounded-xl border border-border bg-card">
              <div className="flex items-center gap-3 mb-6">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", guide.bg)}>
                  <guide.icon className={cn("w-5 h-5", guide.color)} />
                </div>
                <div>
                  <h2
                    className="text-lg font-bold text-foreground"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {language === "he" && (guide as any).labelHe ? (guide as any).labelHe : guide.label}
                  </h2>
                  <p className="text-xs text-muted-foreground">{language === "he" && (guide as any).descriptionHe ? (guide as any).descriptionHe : guide.description}</p>
                </div>
              </div>

              <div>
                {guide.steps.map((step, i) => (
                  <StepCard key={step.number} step={step} isLast={i === guide.steps.length - 1} language={language} />
                ))}
              </div>
            </div>

            {/* Troubleshooting */}
            <div className="mt-4 rounded-xl border border-border bg-card overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-secondary transition-colors"
                onClick={() => setShowTroubleshooting(!showTroubleshooting)}
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-4 h-4 text-orange-400" />
                  <span className="text-sm font-semibold text-foreground">{language === "he" ? "פתרון תקלות" : "Troubleshooting"}</span>
                  <span className="text-xs text-muted-foreground">{language === "he" ? "בעיות נפוצות ופתרונות" : "Common issues and solutions"}</span>
                </div>
                {showTroubleshooting
                  ? <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
              </button>
              {showTroubleshooting && (
                <div className="border-t border-border divide-y divide-border">
                  {troubleshootingItems.map((item, i) => (
                    <div key={i}>
                      <button
                        className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-secondary/50 transition-colors"
                        onClick={() => setExpandedTrouble(expandedTrouble === i ? null : i)}
                      >
                        <span className="text-sm text-foreground">{language === "he" && item.qHe ? item.qHe : item.q}</span>
                        {expandedTrouble === i
                          ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                          : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />}
                      </button>
                      {expandedTrouble === i && (
                        <div className="px-5 pb-3">
                          <p className="text-xs text-muted-foreground leading-relaxed">{language === "he" && item.aHe ? item.aHe : item.a}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Quick reference */}
            <div className="p-4 rounded-xl border border-border bg-card">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" /> Quick Reference
              </h3>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex justify-between py-1.5 border-b border-border">
                  <span>AwareCam App</span>
                  <a href="https://app.awarecam.com" target="_blank" rel="noreferrer" className="text-primary flex items-center gap-1 hover:underline">
                    app.awarecam.com <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border">
                  <span>Local dashboard (Pi)</span>
                  <code className="text-foreground bg-secondary px-1.5 py-0.5 rounded text-[10px]">:8080</code>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border">
                  <span>Local dashboard (Win)</span>
                  <code className="text-foreground bg-secondary px-1.5 py-0.5 rounded text-[10px]">localhost:8080</code>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border">
                  <span>Kiosk capacity</span>
                  <span className="text-foreground">Up to 20 cameras</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border">
                  <span>Windows capacity</span>
                  <span className="text-foreground">30–40 cameras</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-border">
                  <span>RTSP bandwidth</span>
                  <span className="text-foreground">1.5–2 Mbps/cam</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span>Support</span>
                  <a href="mailto:support@awarecam.com" className="text-primary hover:underline">support@awarecam.com</a>
                </div>
              </div>
            </div>

            {/* App feature overview */}
            <div className="p-4 rounded-xl border border-border bg-card">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" /> App Features
              </h3>
              <div className="space-y-2">
                {[
                  { icon: Camera, label: "Camera Management", desc: "Add, configure, test cameras" },
                  { icon: Bot, label: "AI Agents", desc: "Person, Vehicle, Fire, LPR, more" },
                  { icon: Layers, label: "Zone Drawing", desc: "Polygon zones on live feed" },
                  { icon: Bell, label: "Alerts", desc: "Email, SMS, push notifications" },
                  { icon: BarChart3, label: "Analytics", desc: "Trends, risk scores, diagnostics" },
                  { icon: Video, label: "Live View", desc: "Multi-camera grid monitoring" },

                ].map((f) => (
                  <div key={f.label} className="flex items-center gap-2.5 text-xs">
                    <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <f.icon className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div>
                      <span className="font-medium text-foreground">{f.label}</span>
                      <span className="text-muted-foreground"> — {f.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Deployment comparison */}
            <div className="p-4 rounded-xl border border-border bg-card">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Settings className="w-4 h-4 text-primary" /> Deployment Comparison
              </h3>
              <div className="space-y-3">
                {[
                  { name: "Kiosk (Pi)", cameras: "Up to 20", setup: "~1 hour", skill: "Basic", best: "Small sites" },
                  { name: "Windows Edge", cameras: "30–40", setup: "~2 hours", skill: "Intermediate", best: "Large sites" },
                  { name: "Direct RTSP", cameras: "Unlimited", setup: "~30 min", skill: "Advanced", best: "Static IP sites" },
                ].map((d) => (
                  <div key={d.name} className="p-2.5 rounded-lg bg-secondary/50 text-xs">
                    <div className="font-medium text-foreground mb-1.5">{d.name}</div>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-muted-foreground">
                      <span>Cameras:</span><span className="text-foreground">{d.cameras}</span>
                      <span>Setup time:</span><span className="text-foreground">{d.setup}</span>
                      <span>Skill level:</span><span className="text-foreground">{d.skill}</span>
                      <span>Best for:</span><span className="text-foreground">{d.best}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Need help */}
            <div className="p-4 rounded-xl border border-primary/20 bg-primary/5">
              <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" /> Need Help?
              </h3>
              <p className="text-xs text-muted-foreground mb-3">
                Our AI Assistant can answer installation questions, check camera compatibility, generate quotes, and help troubleshoot issues in real time.
              </p>
              <a
                href="/assistant"
                className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
              >
                <Play className="w-3.5 h-3.5" /> Open AI Assistant
              </a>
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
