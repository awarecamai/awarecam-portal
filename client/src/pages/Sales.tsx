import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import PortalLayout from "@/components/PortalLayout";
import {
  TrendingUp, Shield, Building2, GraduationCap, Flame, HardHat,
  ChevronDown, ChevronUp, CheckCircle, XCircle, Monitor, BookOpen,
  Warehouse, Factory, Heart, ShoppingCart, Landmark, Church, Download
} from "lucide-react";
import { cn } from "@/lib/utils";

type SalesTab = "objections" | "brochures" | "platform";

interface Vertical {
  key: string;
  labelEn: string;
  labelHe: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bg: string;
  border: string;
  painPointsEn: string[];
  painPointsHe: string[];
  aiAgentsEn: string[];
  aiAgentsHe: string[];
  pitchEn: string;
  pitchHe: string;
  keyStatsEn: string[];
  keyStatsHe: string[];
}

const verticals: Vertical[] = [
  {
    key: "retail",
    labelEn: "Retail",
    labelHe: "קמעונאות",
    icon: ShoppingCart,
    color: "text-pink-400",
    bg: "bg-pink-500/10",
    border: "border-pink-500/20",
    painPointsEn: ["Shoplifting and organized retail crime ($100B+ annual US losses)", "Employee theft and internal shrinkage", "Slip-and-fall liability and false claims", "After-hours break-ins and smash-and-grab"],
    painPointsHe: ["גניבה מחנויות ופשע קמעונאי מאורגן (הפסדים של $100B+ בשנה)", "גניבת עובדים ואובדן פנימי", "תביעות אחריות בגין נפילות ותביעות שווא", "פריצות לאחר שעות עבודה"],
    aiAgentsEn: ["Person Detection (loitering, after-hours)", "Crowd Detection (queue management)", "LPR (parking lot monitoring)", "Fire/Smoke Detection"],
    aiAgentsHe: ["זיהוי אנשים (שהייה חשודה, לאחר שעות)", "זיהוי עומסי קהל (ניהול תורים)", "זיהוי לוחיות רישוי (ניטור חניון)", "זיהוי אש/עשן"],
    pitchEn: "Retail environments face constant shrinkage from shoplifting, employee theft, and organized retail crime. AwareCam's AI-powered person detection and crowd analytics provide real-time alerts for loitering and after-hours intrusion, while cloud-stored footage with AI-tagged events dramatically reduces investigation time and supports loss prevention teams.",
    pitchHe: "סביבות קמעונאיות מתמודדות עם אובדן מתמיד מגניבות, גניבת עובדים ופשע מאורגן. זיהוי האנשים וניתוח הקהל של AwareCam מספקים התראות בזמן אמת לשהייה חשודה ופריצות לאחר שעות, בעוד שצילומים שמורים בענן עם אירועים מתויגי AI מפחיתים דרמטית את זמן החקירה.",
    keyStatsEn: ["US retail shrinkage: $112B annually", "Stores with AI monitoring reduce shrinkage by 30–50%", "Average shoplifting incident: $461 in merchandise loss"],
    keyStatsHe: ["אובדן קמעונאי בארה\"ב: $112B בשנה", "חנויות עם ניטור AI מפחיתות אובדן ב-30–50%", "אירוע גניבה ממוצע: $461 בסחורה"],
  },
  {
    key: "construction",
    labelEn: "Construction",
    labelHe: "בנייה",
    icon: HardHat,
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    painPointsEn: ["Equipment and material theft (avg. $1B/year industry-wide)", "Safety compliance (PPE monitoring)", "Unauthorized site access", "Progress documentation"],
    painPointsHe: ["גניבת ציוד וחומרים (ממוצע $1B/שנה בתעשייה)", "עמידה בתקני בטיחות (ניטור ציוד מגן)", "גישה לא מורשית לאתר", "תיעוד התקדמות הבנייה"],
    aiAgentsEn: ["Person Detection (after-hours intrusion)", "Vehicle Detection (equipment tracking)", "LPR (authorized vehicle access)", "Fire/Smoke Detection"],
    aiAgentsHe: ["זיהוי אנשים (פריצה לאחר שעות)", "זיהוי כלי רכב (מעקב ציוד)", "זיהוי לוחיות רישוי (גישת רכב מורשית)", "זיהוי אש/עשן"],
    pitchEn: "Construction sites are high-value, high-risk environments with minimal permanent infrastructure. AwareCam's solar-powered kiosk option and cellular connectivity make it ideal for remote sites. AI-powered after-hours intrusion detection and LPR for vehicle access control protect millions in equipment and materials.",
    pitchHe: "אתרי בנייה הם סביבות בעלות ערך גבוה וסיכון גבוה עם תשתית קבועה מינימלית. אפשרות הקיוסק הסולארי של AwareCam וקישוריות סלולרית הופכים אותו לאידיאלי לאתרים מרוחקים. זיהוי פריצה לאחר שעות ו-LPR לבקרת גישת רכב מגנים על מיליונים בציוד וחומרים.",
    keyStatsEn: ["Construction theft: $1B+ annually in the US", "Average equipment theft loss per incident: $30K", "Sites with active monitoring see 70% reduction in theft"],
    keyStatsHe: ["גניבות בנייה: $1B+ בשנה בארה\"ב", "הפסד ממוצע מגניבת ציוד לאירוע: $30K", "אתרים עם ניטור פעיל רואים ירידה של 70% בגניבות"],
  },
  {
    key: "education",
    labelEn: "Education",
    labelHe: "חינוך",
    icon: GraduationCap,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    painPointsEn: ["Campus safety and active threat detection", "Unauthorized visitor access", "Vandalism and after-hours intrusion", "Parking lot monitoring"],
    painPointsHe: ["בטיחות קמפוס וזיהוי איומים פעילים", "גישת מבקרים לא מורשית", "ונדליזם ופריצה לאחר שעות", "ניטור חניון"],
    aiAgentsEn: ["Person Detection (campus perimeter)", "Crowd Detection (assembly areas)", "LPR (parking management)", "Fire/Smoke Detection"],
    aiAgentsHe: ["זיהוי אנשים (היקף קמפוס)", "זיהוי קהל (אזורי התכנסות)", "זיהוי לוחיות רישוי (ניהול חניון)", "זיהוי אש/עשן"],
    pitchEn: "Schools and universities have a duty of care to protect students and staff. AwareCam's real-time crowd detection and perimeter monitoring provide early warning of potential threats. Integration with existing access control systems and instant mobile alerts to administrators and security staff enable rapid response.",
    pitchHe: "לבתי ספר ואוניברסיטאות יש חובת טיפול להגן על תלמידים וצוות. זיהוי הקהל בזמן אמת וניטור ההיקף של AwareCam מספקים אזהרה מוקדמת לאיומים פוטנציאליים. שילוב עם מערכות בקרת גישה קיימות והתראות מובייל מיידיות למנהלים ולאנשי ביטחון מאפשרים תגובה מהירה.",
    keyStatsEn: ["K-12 security spending: $3.1B annually", "Average cost of a school security incident: $500K+", "Campuses with AI monitoring respond 4x faster to incidents"],
    keyStatsHe: ["הוצאות אבטחה בחינוך K-12: $3.1B בשנה", "עלות ממוצעת של אירוע אבטחה בבית ספר: $500K+", "קמפוסים עם ניטור AI מגיבים 4x מהר יותר לאירועים"],
  },
  {
    key: "warehouse",
    labelEn: "Warehousing",
    labelHe: "מחסנאות",
    icon: Warehouse,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
    painPointsEn: ["Cargo theft and inventory shrinkage", "Forklift and worker safety in high-traffic zones", "Unauthorized access to restricted areas", "After-hours break-ins and loading dock security"],
    painPointsHe: ["גניבת מטען ואובדן מלאי", "בטיחות מלגזות ועובדים באזורי תנועה גבוהה", "גישה לא מורשית לאזורים מוגבלים", "פריצות לאחר שעות ואבטחת רציף פריקה"],
    aiAgentsEn: ["Person Detection (restricted zone access)", "Vehicle Detection (forklift and truck tracking)", "LPR (delivery vehicle verification)", "Fire/Smoke Detection"],
    aiAgentsHe: ["זיהוי אנשים (גישה לאזור מוגבל)", "זיהוי כלי רכב (מעקב מלגזות ומשאיות)", "זיהוי לוחיות רישוי (אימות רכב משלוח)", "זיהוי אש/עשן"],
    pitchEn: "Warehouses and distribution centers handle high-value inventory around the clock. AwareCam's AI monitors loading docks, restricted zones, and perimeters 24/7 — detecting unauthorized access, verifying delivery vehicles via LPR, and alerting safety teams when workers enter hazardous forklift zones.",
    pitchHe: "מחסנים ומרכזי הפצה מטפלים במלאי בעל ערך גבוה מסביב לשעון. ה-AI של AwareCam מנטר רציפי פריקה, אזורים מוגבלים והיקפים 24/7 — מזהה גישה לא מורשית, מאמת רכבי משלוח באמצעות LPR ומתריע לצוותי בטיחות כאשר עובדים נכנסים לאזורי מלגזות מסוכנים.",
    keyStatsEn: ["Cargo theft costs US businesses $15–35B annually", "Warehouses with AI monitoring reduce theft incidents by 40–60%", "Average cargo theft per incident: $200K+"],
    keyStatsHe: ["גניבת מטען עולה לעסקים בארה\"ב $15–35B בשנה", "מחסנים עם ניטור AI מפחיתים אירועי גניבה ב-40–60%", "גניבת מטען ממוצעת לאירוע: $200K+"],
  },
  {
    key: "manufacturing",
    labelEn: "Manufacturing",
    labelHe: "ייצור",
    icon: Factory,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    painPointsEn: ["Worker safety compliance (PPE, exclusion zones)", "Equipment theft and vandalism", "Fire and smoke risk in production areas", "Shift change and access control monitoring"],
    painPointsHe: ["עמידה בתקני בטיחות עובדים (ציוד מגן, אזורי הגבלה)", "גניבת ציוד וונדליזם", "סיכון אש ועשן באזורי ייצור", "ניטור חילופי משמרות ובקרת גישה"],
    aiAgentsEn: ["Person Detection (exclusion zone & PPE monitoring)", "Fire/Smoke Detection (production floor)", "Vehicle Detection (loading areas)", "LPR (authorized vendor access)"],
    aiAgentsHe: ["זיהוי אנשים (ניטור אזורי הגבלה וציוד מגן)", "זיהוי אש/עשן (רצפת ייצור)", "זיהוי כלי רכב (אזורי טעינה)", "זיהוי לוחיות רישוי (גישת ספק מורשה)"],
    pitchEn: "Manufacturing facilities face strict OSHA safety requirements and significant fire risk from machinery and chemicals. AwareCam's real-time PPE compliance monitoring, exclusion zone alerts, and fire/smoke detection protect workers and assets. Automated compliance recording simplifies OSHA documentation and incident reporting.",
    pitchHe: "מפעלי ייצור מתמודדים עם דרישות בטיחות OSHA קפדניות וסיכון אש משמעותי ממכונות וכימיקלים. ניטור עמידה בציוד מגן בזמן אמת, התראות אזורי הגבלה וזיהוי אש/עשן של AwareCam מגנים על עובדים ונכסים. תיעוד עמידה אוטומטי מפשט את תיעוד OSHA ודיווח אירועים.",
    keyStatsEn: ["OSHA violations cost manufacturers avg. $15K per citation", "Manufacturing fires cause $1B+ in property damage annually", "AI safety monitoring reduces workplace incidents by 35%"],
    keyStatsHe: ["הפרות OSHA עולות ליצרנים ממוצע $15K לציטוט", "שריפות בייצור גורמות לנזק רכוש של $1B+ בשנה", "ניטור בטיחות AI מפחית תאונות עבודה ב-35%"],
  },
  {
    key: "healthcare",
    labelEn: "Healthcare",
    labelHe: "בריאות",
    icon: Heart,
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    painPointsEn: ["Patient and staff safety in sensitive areas", "Unauthorized access to medication storage and labs", "Parking lot and entrance security", "Liability documentation for incidents and falls"],
    painPointsHe: ["בטיחות מטופלים וצוות באזורים רגישים", "גישה לא מורשית לאחסון תרופות ומעבדות", "אבטחת חניון וכניסה", "תיעוד אחריות לאירועים ונפילות"],
    aiAgentsEn: ["Person Detection (restricted area access)", "Crowd Detection (waiting room management)", "LPR (parking and ambulance bay)", "Fire/Smoke Detection"],
    aiAgentsHe: ["זיהוי אנשים (גישה לאזור מוגבל)", "זיהוי קהל (ניהול חדר המתנה)", "זיהוי לוחיות רישוי (חניון ומפרץ אמבולנס)", "זיהוי אש/עשן"],
    pitchEn: "Hospitals, clinics, and care facilities must balance open access with strict security for patients, staff, and controlled substances. AwareCam's AI monitors restricted areas like pharmacies and server rooms, detects unauthorized access after hours, and provides cloud-stored footage for liability protection. Edge processing ensures patient privacy.",
    pitchHe: "בתי חולים, קליניקות ומתקני טיפול חייבים לאזן בין גישה פתוחה לבין אבטחה קפדנית למטופלים, צוות וחומרים מבוקרים. ה-AI של AwareCam מנטר אזורים מוגבלים כמו בתי מרקחת וחדרי שרתים, מזהה גישה לא מורשית לאחר שעות ומספק צילומים שמורים בענן להגנה מאחריות.",
    keyStatsEn: ["Healthcare workplace violence costs $4.6B annually in the US", "Medication theft from facilities: $75M+ per year", "AI monitoring reduces security response time by 60%"],
    keyStatsHe: ["אלימות במקום עבודה בתחום הבריאות עולה $4.6B בשנה בארה\"ב", "גניבת תרופות ממתקנים: $75M+ בשנה", "ניטור AI מפחית זמן תגובת אבטחה ב-60%"],
  },
  {
    key: "government",
    labelEn: "Government & Municipal",
    labelHe: "ממשל ועירייה",
    icon: Landmark,
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
    painPointsEn: ["Public safety monitoring in parks, plazas, and transit hubs", "Vandalism and graffiti on public infrastructure", "Unauthorized access to utility and government facilities", "Compliance documentation for public safety audits"],
    painPointsHe: ["ניטור בטיחות ציבורית בפארקים, כיכרות ומרכזי תחבורה", "ונדליזם וגרפיטי על תשתיות ציבוריות", "גישה לא מורשית למתקני תשתיות וממשל", "תיעוד עמידה לביקורות בטיחות ציבורית"],
    aiAgentsEn: ["Person Detection (perimeter and public space monitoring)", "Crowd Detection (public gathering management)", "LPR (vehicle access and traffic enforcement)", "Fire/Smoke Detection (public infrastructure)"],
    aiAgentsHe: ["זיהוי אנשים (ניטור היקף ומרחב ציבורי)", "זיהוי קהל (ניהול התכנסויות ציבוריות)", "זיהוי לוחיות רישוי (גישת רכב ואכיפת תנועה)", "זיהוי אש/עשן (תשתיות ציבוריות)"],
    pitchEn: "Government and municipal facilities require reliable, scalable surveillance that meets public accountability standards. AwareCam's edge-first architecture keeps sensitive footage on-premises while enabling centralized monitoring across multiple sites. AI-powered crowd management and perimeter detection support public safety teams without requiring large security staffing budgets.",
    pitchHe: "מתקני ממשל ועירייה דורשים מעקב אמין וניתן להרחבה העומד בסטנדרטים של אחריות ציבורית. הארכיטקטורה edge-first של AwareCam שומרת צילומים רגישים במקום תוך אפשור ניטור מרכזי על פני אתרים מרובים. ניהול קהל ממונע AI וזיהוי היקף תומכים בצוותי בטיחות ציבורית ללא צורך בתקציבי כוח אדם אבטחה גדולים.",
    keyStatsEn: ["US state & local government security spending: $8B+ annually", "Smart city surveillance reduces crime rates by 20–30%", "AI monitoring enables 1 operator to oversee 50+ cameras vs. 5–10 without AI"],
    keyStatsHe: ["הוצאות אבטחה של ממשל מדינה ומקומי בארה\"ב: $8B+ בשנה", "מעקב עיר חכמה מפחית שיעורי פשיעה ב-20–30%", "ניטור AI מאפשר למפעיל אחד לפקח על 50+ מצלמות לעומת 5–10 ללא AI"],
  },
  {
    key: "worship",
    labelEn: "Houses of Worship",
    labelHe: "בתי כנסת ומוסדות דת",
    icon: Church,
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    painPointsEn: ["Hate crime and vandalism targeting religious sites", "Unauthorized access during non-service hours", "Protecting congregants during services and events", "Parking lot safety and after-hours perimeter security"],
    painPointsHe: ["פשעי שנאה וונדליזם המכוונים לאתרים דתיים", "גישה לא מורשית בשעות שאינן שעות תפילה", "הגנה על מתפללים במהלך תפילות ואירועים", "בטיחות חניון ואבטחת היקף לאחר שעות"],
    aiAgentsEn: ["Person Detection (perimeter and entry monitoring)", "Crowd Detection (service and event management)", "LPR (parking lot access control)", "Fire/Smoke Detection"],
    aiAgentsHe: ["זיהוי אנשים (ניטור היקף וכניסה)", "זיהוי קהל (ניהול תפילות ואירועים)", "זיהוי לוחיות רישוי (בקרת גישה לחניון)", "זיהוי אש/עשן"],
    pitchEn: "Synagogues, churches, mosques, schools, and religious community centers face an elevated and growing threat of hate crimes, vandalism, and targeted violence. AwareCam provides discreet, always-on perimeter monitoring with instant mobile alerts to security coordinators and clergy — protecting congregants without creating a fortress atmosphere. Affordable pricing makes professional-grade security accessible to faith communities of all sizes.",
    pitchHe: "בתי כנסת, כנסיות, מסגדים, בתי ספר ומרכזי קהילה דתיים מתמודדים עם איום גובר של פשעי שנאה, ונדליזם ואלימות ממוקדת. AwareCam מספקת ניטור היקף שקט ותמידי עם התראות מובייל מיידיות לרכזי אבטחה ורבנים — מגנה על מתפללים מבלי ליצור אווירת מבצר. תמחור נגיש הופך אבטחה ברמה מקצועית לנגישה לקהילות אמונה בכל הגדלים.",
    keyStatsEn: ["Antisemitic incidents in the US reached record highs in 2023–2024", "FBI: hate crimes targeting religious institutions up 40% since 2019", "Average cost of a security guard for a single service: $300–600"],
    keyStatsHe: ["אירועים אנטישמיים בארה\"ב הגיעו לשיאים חדשים ב-2023–2024", "FBI: פשעי שנאה המכוונים למוסדות דתיים עלו ב-40% מאז 2019", "עלות ממוצעת של שומר אבטחה לתפילה בודדת: $300–600"],
  },
  {
    key: "oil_gas",
    labelEn: "Oil & Gas",
    labelHe: "נפט וגז",
    icon: Flame,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    painPointsEn: ["Fire and gas leak detection (critical safety)", "Pipeline and perimeter security", "Remote facility monitoring", "Regulatory compliance (EPA, OSHA)"],
    painPointsHe: ["זיהוי אש ודליפת גז (בטיחות קריטית)", "אבטחת צינורות והיקף", "ניטור מתקנים מרוחקים", "עמידה ברגולציה (EPA, OSHA)"],
    aiAgentsEn: ["Fire/Smoke Detection (highest priority)", "Person Detection (exclusion zones)", "Vehicle Detection (tanker tracking)", "LPR (authorized access)"],
    aiAgentsHe: ["זיהוי אש/עשן (עדיפות עליונה)", "זיהוי אנשים (אזורי הגבלה)", "זיהוי כלי רכב (מעקב מכליות)", "זיהוי לוחיות רישוי (גישה מורשית)"],
    pitchEn: "Oil and gas facilities represent some of the highest-risk environments in industry. AwareCam's fire and smoke detection AI provides early warning seconds before traditional sensors trigger, potentially preventing catastrophic events. Remote monitoring of pipelines and wellheads with cellular-connected edge devices eliminates the need for on-site security personnel.",
    pitchHe: "מתקני נפט וגז מייצגים חלק מהסביבות בעלות הסיכון הגבוה ביותר בתעשייה. ה-AI לזיהוי אש ועשן של AwareCam מספק אזהרה מוקדמת שניות לפני שחיישנים מסורתיים מופעלים, ועשוי למנוע אירועים קטסטרופליים. ניטור מרחוק של צינורות ובארות עם מכשירי קצה מחוברים סלולרית מבטל את הצורך בכוח אדם אבטחה באתר.",
    keyStatsEn: ["Average oil & gas fire incident cost: $50M+", "Early fire detection reduces damage by 80%", "Remote monitoring saves $200K+/year in security staffing per facility"],
    keyStatsHe: ["עלות ממוצעת של אירוע אש בנפט וגז: $50M+", "זיהוי אש מוקדם מפחית נזק ב-80%", "ניטור מרחוק חוסך $200K+/שנה בכוח אדם אבטחה למתקן"],
  },
];

interface PlatformSlide {
  titleEn: string;
  titleHe: string;
  contentEn: string;
  contentHe: string;
}

const platformSlides: PlatformSlide[] = [
  {
    titleEn: "The Problem",
    titleHe: "הבעיה",
    contentEn: "Traditional security cameras are passive — they record, but they don't think. Security teams are overwhelmed reviewing hours of footage after incidents occur. False alarms from motion sensors waste time and resources. Meanwhile, real threats go undetected until it's too late.",
    contentHe: "מצלמות אבטחה מסורתיות הן פסיביות — הן מקליטות, אבל לא חושבות. צוותי אבטחה מוצפים בסקירת שעות של צילומים לאחר אירועים. אזעקות שווא מחיישני תנועה מבזבזות זמן ומשאבים. בינתיים, איומים אמיתיים נשארים בלתי מזוהים עד שמאוחר מדי.",
  },
  {
    titleEn: "The AwareCam Solution",
    titleHe: "הפתרון של AwareCam",
    contentEn: "AwareCam transforms any existing IP camera into an intelligent AI sensor. Using YOLO11 computer vision running on edge devices, AwareCam detects real threats in real-time — persons, vehicles, fire, smoke, and license plates — and delivers instant mobile alerts to the right people.",
    contentHe: "AwareCam הופכת כל מצלמת IP קיימת לחיישן AI חכם. באמצעות ראיית מחשב YOLO11 הפועלת על מכשירי קצה, AwareCam מזהה איומים אמיתיים בזמן אמת — אנשים, כלי רכב, אש, עשן ולוחיות רישוי — ומספקת התראות מובייל מיידיות לאנשים הנכונים.",
  },
  {
    titleEn: "How It Works",
    titleHe: "איך זה עובד",
    contentEn: "1. Connect: AwareCam connects to any IP camera via RTSP — no hardware replacement needed.\n2. Process: AI runs locally on the edge device (Raspberry Pi or Intel N100 Mini-PC).\n3. Alert: Real-time alerts with images are sent to the mobile app and cloud dashboard.\n4. Review: 30–360 days of cloud-stored footage with AI-tagged events for fast review.",
    contentHe: "1. חיבור: AwareCam מתחברת לכל מצלמת IP דרך RTSP — אין צורך בהחלפת חומרה.\n2. עיבוד: AI פועל מקומית על מכשיר הקצה (Raspberry Pi או Intel N100 Mini-PC).\n3. התראה: התראות בזמן אמת עם תמונות נשלחות לאפליקציית המובייל ולוח הבקרה בענן.\n4. סקירה: 30–360 ימים של צילומים שמורים בענן עם אירועים מתויגי AI לסקירה מהירה.",
  },
  {
    titleEn: "Pricing & Plans",
    titleHe: "תמחור ותוכניות",
    contentEn: "Essential Plan — $39/camera/month retail | $29/camera/month partner price\n• Person Detection, Vehicle Detection, Fire/Smoke Detection\n• 30-day cloud storage, mobile alerts, basic analytics\n\nPro Plan — $59/camera/month retail | $44/camera/month partner price\n• Everything in Essential, plus:\n• LPR (License Plate Recognition), Crowd Detection\n• 90-day cloud storage, API access, priority support\n\nAdvanced Plan — $89/camera/month retail | $67/camera/month partner price\n• Everything in Pro, plus:\n• 360-day cloud storage, ALPR, fire/smoke advanced models\n• Dedicated account manager, SLA guarantee\n\nPartner margins: 26–33% on all plans. Volume discounts available at 50+ cameras.",
    contentHe: "תוכנית Essential — $39/מצלמה/חודש קמעונאי | $29/מצלמה/חודש מחיר שותף\n• זיהוי אנשים, זיהוי כלי רכב, זיהוי אש/עשן\n• אחסון ענן 30 יום, התראות מובייל, אנליטיקה בסיסית\n\nתוכנית Pro — $59/מצלמה/חודש קמעונאי | $44/מצלמה/חודש מחיר שותף\n• כל מה שב-Essential, בנוסף:\n• LPR (זיהוי לוחיות רישוי), זיהוי קהל\n• אחסון ענן 90 יום, גישת API, תמיכה מועדפת\n\nתוכנית Advanced — $89/מצלמה/חודש קמעונאי | $67/מצלמה/חודש מחיר שותף\n• כל מה שב-Pro, בנוסף:\n• אחסון ענן 360 יום, ALPR, מודלים מתקדמים לאש/עשן\n• מנהל חשבון ייעודי, ערבות SLA\n\nמרווחי שותפים: 26–33% על כל התוכניות. הנחות נפח זמינות ב-50+ מצלמות.",
  },
  {
    titleEn: "AI Agents Available",
    titleHe: "סוכני AI זמינים",
    contentEn: "Essential Plan: Person Detection, Vehicle Detection, Fire/Smoke Detection, Loitering Detection\n\nPro Plan adds: LPR (License Plate Recognition), Crowd Detection, Occupancy Monitoring\n\nAdvanced Plan adds: Advanced ALPR, Slip & Fall Detection, Extended Fire/Smoke Models\n\nAll agents are configurable with custom detection zones, confidence thresholds, and alert schedules.",
    contentHe: "תוכנית Essential: זיהוי אנשים, זיהוי כלי רכב, זיהוי אש/עשן, זיהוי שהייה חשודה\n\nתוכנית Pro מוסיפה: LPR (זיהוי לוחיות רישוי), זיהוי קהל, ניטור תפוסה\n\nתוכנית Advanced מוסיפה: ALPR מתקדם, זיהוי נפילה, מודלי אש/עשן מורחבים\n\nכל הסוכנים ניתנים להגדרה עם אזורי זיהוי מותאמים, סף ביטחון והגדרות התראה.",
  },
  {
    titleEn: "Deployment Options",
    titleHe: "אפשרויות פריסה",
    contentEn: "1. Kiosk (Raspberry Pi 4/5): Plug-and-play, up to 8–12 cameras, ideal for small sites. Pre-configured, ships ready to deploy.\n2. Windows Edge Device (Intel N100 Mini-PC): 30–40 cameras, ideal for large commercial sites. Full local AI processing.\n3. Direct RTSP: Cloud-only, no local device, requires static IP — ideal for sites with existing infrastructure.\n\nAll options include: WireGuard VPN, automatic OTA updates, and the AwareCam Partner Portal for remote management.",
    contentHe: "1. קיוסק (Raspberry Pi 4/5): פלאג-אנד-פליי, עד 8–12 מצלמות, אידיאלי לאתרים קטנים. מוגדר מראש, נשלח מוכן לפריסה.\n2. מכשיר קצה Windows (Intel N100 Mini-PC): 30–40 מצלמות, אידיאלי לאתרים מסחריים גדולים. עיבוד AI מקומי מלא.\n3. RTSP ישיר: ענן בלבד, ללא מכשיר מקומי, דורש IP סטטי — אידיאלי לאתרים עם תשתית קיימת.\n\nכל האפשרויות כוללות: WireGuard VPN, עדכוני OTA אוטומטיים ופורטל השותפים של AwareCam לניהול מרחוק.",
  },
];

function generateBrochureHTML(vertical: Vertical, lang: "en" | "he"): string {
  const isHe = lang === "he";
  const dir = isHe ? "rtl" : "ltr";
  const label = isHe ? vertical.labelHe : vertical.labelEn;
  const pitch = isHe ? vertical.pitchHe : vertical.pitchEn;
  const painPoints = isHe ? vertical.painPointsHe : vertical.painPointsEn;
  const aiAgents = isHe ? vertical.aiAgentsHe : vertical.aiAgentsEn;
  const keyStats = isHe ? vertical.keyStatsHe : vertical.keyStatsEn;

  const painPointsHTML = painPoints.map(p => `<li>${p}</li>`).join("");
  const aiAgentsHTML = aiAgents.map(a => `<li>✓ ${a}</li>`).join("");
  const keyStatsHTML = keyStats.map(s => `<div class="stat-box">${s}</div>`).join("");

  const industryLabel = isHe ? "ענף" : "Industry";
  const solutionBrief = isHe ? "תקציר פתרון AwareCam" : "AwareCam Solution Brief";
  const painPointsTitle = isHe ? "נקודות כאב עיקריות" : "Key Pain Points";
  const aiAgentsTitle = isHe ? "סוכני AI מומלצים" : "Recommended AI Agents";
  const statsTitle = isHe ? "סטטיסטיקות ו-ROI עיקריים" : "Key Statistics & ROI";
  const contactText = isHe ? "ליצירת קשר: partners@awarecam.com" : "Contact us: partners@awarecam.com";
  const tagline = isHe ? "הפוך כל מצלמה לחיישן AI חכם" : "Turn any camera into an intelligent AI sensor";

  return `<!DOCTYPE html>
<html dir="${dir}" lang="${lang}">
<head>
<meta charset="UTF-8"/>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: ${isHe ? "'Arial', 'Helvetica', sans-serif" : "'Helvetica Neue', Arial, sans-serif"}; background:#0f1117; color:#e2e8f0; direction:${dir}; }
  .page { width:794px; min-height:1123px; margin:0 auto; padding:48px; background:#0f1117; }
  .header { display:flex; align-items:center; justify-content:space-between; margin-bottom:36px; padding-bottom:24px; border-bottom:2px solid #1e2535; }
  .brand { font-size:22px; font-weight:800; color:#00d4b4; letter-spacing:-0.5px; }
  .badge { background:#1e2535; color:#94a3b8; font-size:11px; padding:4px 12px; border-radius:20px; }
  .hero { background:linear-gradient(135deg,#1a2035 0%,#0f1117 100%); border:1px solid #1e2535; border-radius:16px; padding:32px; margin-bottom:28px; }
  .hero h1 { font-size:28px; font-weight:800; color:#ffffff; margin-bottom:4px; }
  .hero .sub { font-size:13px; color:#64748b; margin-bottom:16px; }
  .hero p { font-size:14px; color:#94a3b8; line-height:1.7; }
  .grid { display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:20px; }
  .card { background:#141824; border:1px solid #1e2535; border-radius:12px; padding:24px; }
  .card h3 { font-size:13px; font-weight:700; color:#e2e8f0; margin-bottom:14px; display:flex; align-items:center; gap:8px; }
  .card ul { list-style:none; }
  .card ul li { font-size:12px; color:#94a3b8; padding:5px 0; border-bottom:1px solid #1e2535; line-height:1.5; }
  .card ul li:last-child { border-bottom:none; }
  .stats-card { background:#141824; border:1px solid #1e2535; border-radius:12px; padding:24px; margin-bottom:20px; }
  .stats-card h3 { font-size:13px; font-weight:700; color:#e2e8f0; margin-bottom:14px; }
  .stats-grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px; }
  .stat-box { background:#0f1117; border:1px solid #1e2535; border-radius:8px; padding:14px; font-size:11px; color:#94a3b8; line-height:1.5; }
  .footer { margin-top:32px; padding-top:20px; border-top:1px solid #1e2535; display:flex; justify-content:space-between; align-items:center; }
  .footer .contact { font-size:11px; color:#64748b; }
  .footer .tagline { font-size:11px; color:#00d4b4; font-style:italic; }
  .dot-red { color:#f87171; }
  .dot-teal { color:#2dd4bf; }
  .dot-gold { color:#fbbf24; }
</style>
</head>
<body>
<div class="page">
  <div class="header">
    <div class="brand">AwareCam</div>
    <div class="badge">${label} ${industryLabel} — ${solutionBrief}</div>
  </div>
  <div class="hero">
    <h1>${label} ${industryLabel}</h1>
    <div class="sub">${solutionBrief}</div>
    <p>${pitch}</p>
  </div>
  <div class="grid">
    <div class="card">
      <h3><span class="dot-red">●</span> ${painPointsTitle}</h3>
      <ul>${painPointsHTML}</ul>
    </div>
    <div class="card">
      <h3><span class="dot-teal">●</span> ${aiAgentsTitle}</h3>
      <ul>${aiAgentsHTML}</ul>
    </div>
  </div>
  <div class="stats-card">
    <h3><span class="dot-gold">●</span> ${statsTitle}</h3>
    <div class="stats-grid">${keyStatsHTML}</div>
  </div>
  <div class="footer">
    <div class="contact">${contactText}</div>
    <div class="tagline">${tagline}</div>
  </div>
</div>
</body>
</html>`;
}

function downloadBrochure(vertical: Vertical, lang: "en" | "he") {
  const html = generateBrochureHTML(vertical, lang);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const label = lang === "he" ? vertical.labelHe : vertical.labelEn;
  a.href = url;
  a.download = `AwareCam-${label.replace(/[^a-zA-Z0-9\u0590-\u05FF]/g, "-")}-Brochure-${lang.toUpperCase()}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function Sales() {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<SalesTab>("objections");
  const [expandedObjection, setExpandedObjection] = useState<number | null>(null);
  const [activeVertical, setActiveVertical] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);

  const isHe = language === "he";

  const objections = [
    {
      objection: isHe ? "כבר יש לנו מערכת אבטחה / מצלמות מותקנות." : "We already have a security system / cameras installed.",
      response: isHe ? "זה בדיוק למה AwareCam מושלמת עבורכם. אנחנו לא מחליפים את המצלמות הקיימות שלכם — אנחנו הופכים אותן לחכמות. AwareCam מתחברת לכל מצלמת IP שיש לכם דרך RTSP, ומוסיפה זיהוי AI, הקלטה בענן והתראות מובייל ללא החלפת חומרה." : "That's exactly why AwareCam is perfect for you. We don't replace your existing cameras — we make them intelligent. AwareCam connects to any IP camera you already have via RTSP, adding AI detection, cloud recording, and mobile alerts without any hardware swap.",
      category: isHe ? "תחרות" : "Competition",
    },
    {
      objection: isHe ? "זה יקר מדי / אין לנו תקציב." : "It's too expensive / we don't have the budget.",
      response: isHe ? "שקלו את עלות אירוע אבטחה — גניבה, אחריות, או אירוע בטיחות שהוחמץ — לעומת $39/מצלמה/חודש קמעונאי (או $29/מצלמה/חודש במחיר שותף). AwareCam מחליפה את הצורך בניטור אנושי 24/7, שעולה בדרך כלל $3,500–5,000/חודש לשומר אבטחה בודד. אתר עם 10 מצלמות מחזיר את עצמו בחודש הראשון." : "Consider the cost of a security incident — theft, liability, or a missed safety event — versus $39/camera/month retail (or $29/camera/month at partner pricing). AwareCam replaces the need for 24/7 human monitoring, which typically costs $3,500–5,000/month for a single security guard. A 10-camera site pays for itself in the first month.",
      category: isHe ? "מחיר" : "Price",
    },
    {
      objection: isHe ? "אנחנו מודאגים מפרטיות ואבטחת מידע." : "We're concerned about privacy and data security.",
      response: isHe ? "AwareCam מעבדת וידאו על מכשיר הקצה — בתוך המתקן שלכם — ושולחת רק מטא-דאטה (התראות, תמונות ממוזערות) לענן. וידאו גולמי לעולם לא מועלה אלא אם תבקשו הקלטת ענן. כל הנתונים מוצפנים בתעבורה (TLS 1.3) ובמנוחה (AES-256). אנחנו עומדים ב-GDPR." : "AwareCam processes video on the edge device — inside your facility — and only sends metadata (alerts, thumbnails) to the cloud. Raw video is never uploaded unless you request cloud recording. All data is encrypted in transit (TLS 1.3) and at rest (AES-256). We are GDPR-compliant.",
      category: isHe ? "אבטחה" : "Security",
    },
    {
      objection: isHe ? "צוות ה-IT שלנו לעולם לא יאשר את זה." : "Our IT team will never approve this.",
      response: isHe ? "יש לנו מסמך דרישות רשת וחומת אש ייעודי לצוות ה-IT שלכם. המערכת דורשת רק UDP יוצא 51820 (WireGuard VPN) — ללא פורטים נכנסים, ללא שינויים בחומת האש מצדכם. היא מתוכננת להיות ידידותית ל-IT ועוברת את רוב סקירות האבטחה הארגוניות." : "We have a dedicated Network & Firewall Requirements document for your IT team. The system only requires outbound UDP 51820 (WireGuard VPN) — no inbound ports, no firewall changes on your end. It's designed to be IT-friendly and passes most enterprise security reviews.",
      category: isHe ? "IT / טכני" : "IT / Technical",
    },
    {
      objection: isHe ? "ניסינו מצלמות AI בעבר והיו יותר מדי אזעקות שווא." : "We tried AI cameras before and they had too many false alarms.",
      response: isHe ? "AwareCam משתמשת ב-YOLO11 — הדור האחרון של מודלי ראיית מחשב — עם סף ביטחון ניתן להגדרה ואזורי זיהוי. אתם מגדירים בדיוק היכן ומה לזהות. רוב הלקוחות מפחיתים אזעקות שווא ב-90%+ לעומת מערכות מבוססות תנועה תוך השבוע הראשון של כוונון." : "AwareCam uses YOLO11 — the latest generation of computer vision models — with configurable confidence thresholds and detection zones. You define exactly where and what to detect. Most clients reduce false alarms by 90%+ compared to motion-based systems within the first week of tuning.",
      category: isHe ? "טכנולוגיה" : "Technology",
    },
    {
      objection: isHe ? "אנחנו צריכים לחשוב על זה / נחזור אליכם." : "We need to think about it / we'll get back to you.",
      response: isHe ? "מובן לחלוטין. בזמן שאתם מעריכים, אני רוצה להציע פיילוט של 30 יום על 3–5 מצלמות ללא עלות. זה מאפשר לצוות שלכם לחוות את הפלטפורמה ישירות. אין התחייבות, וההתקנה לוקחת פחות משעתיים. האם לסדר זאת עבורכם?" : "Completely understood. While you're evaluating, I'd like to offer a 30-day pilot on 3–5 cameras at no cost. This lets your team experience the platform firsthand. There's no obligation, and setup takes less than 2 hours. Shall I arrange that for you?",
      category: isHe ? "דחיינות" : "Stall",
    },
    {
      objection: isHe ? "אין לנו צוות IT לנהל את זה." : "We don't have IT staff to manage this.",
      response: isHe ? "AwareCam מתוכננת למשתמשים לא טכניים. אפליקציית המובייל פשוטה כמו כל אפליקציית צרכן. מכשיר הקצה הוא פלאג-אנד-פליי. המפיץ שלכם (אנחנו) מטפל בכל ההתקנה, ההקצאה והתמיכה השוטפת. הצוות שלכם פשוט מקבל את ההתראות." : "AwareCam is designed for non-technical users. The mobile app is as simple as any consumer app. The edge device is plug-and-play. Your reseller (us) handles all setup, provisioning, and ongoing support. Your team just receives the alerts.",
      category: isHe ? "מורכבות" : "Complexity",
    },
    {
      objection: isHe ? "מה קורה אם האינטרנט נופל?" : "What happens if the internet goes down?",
      response: isHe ? "מכשיר הקצה ממשיך להקליט מקומית ולהפעיל זיהוי AI גם ללא אינטרנט. ברגע שהקישוריות משוחזרת, התראות וצילומים מסתנכרנים לענן באופן אוטומטי. לעולם לא תאבדו צילומים בגלל הפסקת רשת." : "The edge device continues recording locally and running AI detection even without internet. Once connectivity is restored, alerts and recordings sync to the cloud automatically. You never lose footage due to a network outage.",
      category: isHe ? "אמינות" : "Reliability",
    },
  ];

  return (
    <PortalLayout>
      <div className="p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {t("sales.title")}
          </h1>
          <p className="text-muted-foreground">{t("sales.subtitle")}</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-border pb-0">
          {([
            { key: "objections", label: t("sales.objections"), icon: Shield },
            { key: "brochures", label: t("sales.brochures"), icon: Building2 },
            { key: "platform", label: t("sales.platform"), icon: Monitor },
          ] as { key: SalesTab; label: string; icon: React.ComponentType<{ className?: string }> }[]).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={cn(
                "flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-all -mb-px",
                activeTab === key
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Objections Tab */}
        {activeTab === "objections" && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground mb-4">
              {isHe ? "התנגדויות מכירה נפוצות ותגובות מוכחות. לחץ על כל התנגדות להרחבת התגובה המלאה." : "Common sales objections and proven responses. Click any objection to expand the full response."}
            </p>
            {objections.map((item, i) => (
              <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
                <button
                  className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-secondary transition-colors"
                  onClick={() => setExpandedObjection(expandedObjection === i ? null : i)}
                >
                  <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
                    <XCircle className="w-4 h-4 text-red-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground">{item.objection}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{item.category}</div>
                  </div>
                  {expandedObjection === i ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  )}
                </button>
                {expandedObjection === i && (
                  <div className="px-5 pb-5 border-t border-border">
                    <div className="flex items-start gap-4 pt-4">
                      <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-teal-400" />
                      </div>
                      <p className="text-sm text-foreground leading-relaxed">{item.response}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Brochures Tab */}
        {activeTab === "brochures" && (
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            {/* Vertical selector */}
            <div className="flex md:flex-col flex-wrap gap-1.5 md:w-52 md:flex-shrink-0 md:space-y-0">
              {verticals.map((v, i) => {
                const VIcon = v.icon;
                return (
                  <button
                    key={v.key}
                    onClick={() => setActiveVertical(i)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left border",
                      activeVertical === i
                        ? `${v.border} ${v.bg} ${v.color}`
                        : "border-transparent text-muted-foreground hover:text-foreground hover:bg-secondary"
                    )}
                  >
                    <VIcon className={cn("w-4 h-4 flex-shrink-0", activeVertical === i ? v.color : "text-muted-foreground")} />
                    <span className="truncate">{isHe ? v.labelHe : v.labelEn}</span>
                  </button>
                );
              })}
            </div>

            {/* Vertical content */}
            <div className="flex-1 min-w-0">
              {(() => {
                const v = verticals[activeVertical];
                const VIcon = v.icon;
                const label = isHe ? v.labelHe : v.labelEn;
                const pitch = isHe ? v.pitchHe : v.pitchEn;
                const painPoints = isHe ? v.painPointsHe : v.painPointsEn;
                const aiAgents = isHe ? v.aiAgentsHe : v.aiAgentsEn;
                const keyStats = isHe ? v.keyStatsHe : v.keyStatsEn;
                return (
                  <div className="space-y-4">
                    {/* Header with download buttons */}
                    <div className={cn("p-5 rounded-xl border", v.border, v.bg)}>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", v.bg)}>
                            <VIcon className={cn("w-5 h-5", v.color)} />
                          </div>
                          <div>
                            <h2 className="text-lg font-bold text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                              {label} {isHe ? "ענף" : "Industry"}
                            </h2>
                            <p className="text-xs text-muted-foreground">{isHe ? "תקציר פתרון AwareCam" : "AwareCam vertical solution brief"}</p>
                          </div>
                        </div>
                        {/* Download buttons */}
                        <div className="flex gap-2 flex-shrink-0">
                          <button
                            onClick={() => downloadBrochure(v, "en")}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary border border-border text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all"
                            title="Download English brochure"
                          >
                            <Download className="w-3 h-3" />
                            EN
                          </button>
                          <button
                            onClick={() => downloadBrochure(v, "he")}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary border border-border text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all"
                            title="הורד חוברת בעברית"
                          >
                            <Download className="w-3 h-3" />
                            עב
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-foreground leading-relaxed">{pitch}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Pain Points */}
                      <div className="p-4 rounded-xl border border-border bg-card">
                        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-red-400" /> {isHe ? "נקודות כאב עיקריות" : "Key Pain Points"}
                        </h3>
                        <ul className="space-y-2">
                          {painPoints.map((p, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                              <span className="text-red-400 mt-0.5">•</span> {p}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* AI Agents */}
                      <div className="p-4 rounded-xl border border-border bg-card">
                        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-teal-400" /> {isHe ? "סוכני AI מומלצים" : "Recommended AI Agents"}
                        </h3>
                        <ul className="space-y-2">
                          {aiAgents.map((a, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                              <span className="text-teal-400 mt-0.5">✓</span> {a}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Key Stats */}
                    <div className="p-4 rounded-xl border border-border bg-card">
                      <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-primary" /> {isHe ? "סטטיסטיקות ו-ROI עיקריים" : "Key Statistics & ROI"}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {keyStats.map((stat, i) => (
                          <div key={i} className="p-3 rounded-lg bg-secondary text-xs text-muted-foreground leading-relaxed">
                            {stat}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* Platform Presentation Tab */}
        {activeTab === "platform" && (
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            {/* Slide nav */}
            <div className="flex md:flex-col flex-wrap gap-1 md:w-44 md:flex-shrink-0">
              {platformSlides.map((slide, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSlide(i)}
                  className={cn(
                    "w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium transition-all",
                    activeSlide === i
                      ? "bg-primary/15 text-primary border border-primary/30"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  <span className="text-[10px] text-muted-foreground block mb-0.5">{isHe ? `שקף ${i + 1}` : `Slide ${i + 1}`}</span>
                  {isHe ? slide.titleHe : slide.titleEn}
                </button>
              ))}
            </div>

            {/* Slide content */}
            <div className="flex-1 min-w-0">
              <div className="p-6 rounded-xl border border-border bg-card min-h-[400px]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-muted-foreground">
                    {isHe ? `שקף ${activeSlide + 1} מתוך ${platformSlides.length}` : `Slide ${activeSlide + 1} of ${platformSlides.length}`}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {isHe ? platformSlides[activeSlide].titleHe : platformSlides[activeSlide].titleEn}
                </h2>
                <div className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                  {isHe ? platformSlides[activeSlide].contentHe : platformSlides[activeSlide].contentEn}
                </div>
              </div>

              {/* Slide navigation */}
              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={() => setActiveSlide(Math.max(0, activeSlide - 1))}
                  disabled={activeSlide === 0}
                  className="px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isHe ? "→ הקודם" : "← Previous"}
                </button>
                <div className="flex gap-1.5">
                  {platformSlides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveSlide(i)}
                      className={cn(
                        "w-2 h-2 rounded-full transition-all",
                        i === activeSlide ? "bg-primary w-6" : "bg-border hover:bg-muted-foreground"
                      )}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setActiveSlide(Math.min(platformSlides.length - 1, activeSlide + 1))}
                  disabled={activeSlide === platformSlides.length - 1}
                  className="px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isHe ? "← הבא" : "Next →"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
