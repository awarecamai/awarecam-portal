import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import PortalLayout from "@/components/PortalLayout";
import { Wrench, Monitor, Wifi, CheckCircle, AlertTriangle, ChevronDown, ChevronUp, Terminal, Network, Camera } from "lucide-react";
import { cn } from "@/lib/utils";

type GuideType = "kiosk" | "windows" | "rtsp";

const guides = {
  kiosk: {
    title: "Kiosk Device Setup Guide",
    titleHe: "מדריך התקנת קיוסק",
    subtitle: "Raspberry Pi 4 (8GB) Edge AI Gateway",
    subtitleHe: "שער AI קצה — Raspberry Pi 4 (8GB)",
    icon: Wrench,
    color: "text-teal-400",
    border: "border-teal-500/30",
    bg: "bg-teal-500/10",
    steps: [
      {
        num: 1,
        title: "Unbox & Connect Hardware",
        titleHe: "פתיחת האריזה וחיבור החומרה",
        desc: "Remove the AwareCam Kiosk from its packaging. Connect the included USB-C power adapter (5V/3A) to the device. Connect an Ethernet cable from the device to your local network switch or router.",
        descHe: "הוצא את קיוסק AwareCam מהאריזה שלו. חבר את מתאם החשמל USB-C המצורף (5V/3A) להתקן. חבר כבל Ethernet מההתקן למתג הרשת המקומית שלך.",
        icon: "🔌",
        note: "Do NOT use Wi-Fi for the gateway device. A wired Ethernet connection is required for stable video streaming.",
        noteHe: "אל תשתמש ב-Wi-Fi עבור התקן השער. נדרש חיבור Ethernet קווי לשידור וידאו יציב.",
        noteType: "warning",
      },
      {
        num: 2,
        title: "Power On & Wait for Boot",
        titleHe: "הפעלה והמתנה לאתחול",
        desc: "Press the power button. The green LED will flash during boot. Wait approximately 60–90 seconds for the device to fully initialize. The LED will turn solid green when ready.",
        descHe: "לחץ על כפתור ההפעלה. נורית ה-LED הירוקה תהבהב במהלך האתחול. המתן כ-60–90 שניות עד לאתחול מלא. הנורית תהפוך לירוקה קבועה כשמוכן.",
        icon: "🟢",
        note: "First boot may take up to 3 minutes as the system configures itself.",
        noteHe: "האתחול הראשון עשוי לקחת עד 3 דקות בזמן שהמערכת מגדירה את עצמה.",
        noteType: "info",
      },
      {
        num: 3,
        title: "Find the Device on Your Network",
        titleHe: "מציאת ההתקן ברשת שלך",
        desc: "From any computer on the same network, open a browser and navigate to http://awarecam.local or use a network scanner to find the device IP. The default local dashboard port is 8080.",
        descHe: "מכל מחשב באותה רשת, פתח דפדפן ועבור לכתובת http://awarecam.local או השתמש בסורק רשת למציאת ה-IP של ההתקן. פורט לוח הבקרה המקומי ברירת המחדל הוא 8080.",
        icon: "🌐",
        note: "Default local URL: http://awarecam.local:8080 | Default credentials: admin / awarecam2024",
        noteHe: "כתובת URL מקומית ברירת מחדל: http://awarecam.local:8080 | אישורי ברירת מחדל: admin / awarecam2024",
        noteType: "info",
      },
      {
        num: 4,
        title: "Provision with Your Partner Account",
        titleHe: "הקצאה עם חשבון השותף שלך",
        desc: "In the local dashboard, click 'Provision Device'. Enter your AwareCam Partner Portal credentials. The device will register itself to your account and establish a secure WireGuard VPN tunnel to the AwareCam cloud.",
        descHe: "בלוח הבקרה המקומי, לחץ על 'הקצה התקן'. הזן את אישורי פורטל השותפים של AwareCam שלך. ההתקן ירשום את עצמו לחשבונך ויקים מנהרת VPN מאובטחת של WireGuard לענן AwareCam.",
        icon: "🔐",
        note: "VPN status indicator will turn green once the cloud connection is established.",
        noteHe: "מחוון סטטוס VPN יהפוך לירוק לאחר שנוצר חיבור הענן.",
        noteType: "success",
      },
      {
        num: 5,
        title: "Add Cameras",
        titleHe: "הוספת מצלמות",
        desc: "Click 'Add Camera' in the local dashboard. Either use Auto-Discover (ONVIF/SSDP scan) to find cameras automatically, or enter the RTSP URL manually. Assign each camera a name and location.",
        descHe: "לחץ על 'הוסף מצלמה' בלוח הבקרה המקומי. השתמש ב-Auto-Discover (סריקת ONVIF/SSDP) למציאת מצלמות אוטומטית, או הזן את כתובת ה-RTSP ידנית. הקצה לכל מצלמה שם ומיקום.",
        icon: "📷",
        note: "For best AI performance, configure cameras to use Sub Stream (640×480 or 720p, 10–15 FPS, H.264).",
        noteHe: "לביצועי AI מיטביים, הגדר מצלמות לשימוש ב-Sub Stream (640×480 או 720p, 10–15 FPS, H.264).",
        noteType: "info",
      },
      {
        num: 6,
        title: "Enable AI Agents",
        titleHe: "הפעלת סוכני AI",
        desc: "In the Partner Portal cloud dashboard, navigate to the site and enable the desired AI agents per camera: Person Detection, Vehicle Detection, Fire/Smoke Detection, LPR (Pro plan), or Crowd Detection (Pro plan).",
        descHe: "בלוח הבקרה בענן של פורטל השותפים, נווט לאתר והפעל את סוכני ה-AI הרצויים לכל מצלמה: זיהוי אנשים, זיהוי רכבים, זיהוי אש/עשן, LPR (תוכנית Pro), או זיהוי קהל (תוכנית Pro).",
        icon: "🤖",
        note: "AI agents are billed per camera per month. Only enable agents that are needed to optimize costs.",
        noteHe: "סוכני AI מחויבים לפי מצלמה לחודש. הפעל רק סוכנים הנחוצים לאופטימיזציית עלויות.",
        noteType: "info",
      },
    ],
    troubleshooting: [
      { issue: "Device not found at awarecam.local", fix: "Try connecting via IP address. Use a network scanner (e.g., Advanced IP Scanner) to find the device. Ensure you're on the same subnet." },
      { issue: "VPN status shows red / disconnected", fix: "Check that UDP port 51820 is not blocked by your firewall. Verify the device has internet access by pinging 8.8.8.8 from the local dashboard terminal." },
      { issue: "Camera stream not appearing", fix: "Verify the RTSP URL is correct using VLC Media Player first. Check that the camera username/password are correct. Ensure the camera is on the same network as the Kiosk." },
      { issue: "AI detections not triggering", fix: "Ensure the Sub Stream is selected (not Main Stream). Check that the camera image is clear and well-lit. Verify the AI agent is enabled for that specific camera in the cloud dashboard." },
    ],
  },
  windows: {
    title: "Windows Edge Device Setup Guide",
    titleHe: "מדריך התקנת התקן קצה Windows",
    subtitle: "Intel N100 Mini-PC (30–40 Camera Streams)",
    subtitleHe: "מיני-PC Intel N100 (30–40 זרמי מצלמות)",
    icon: Monitor,
    color: "text-blue-400",
    border: "border-blue-500/30",
    bg: "bg-blue-500/10",
    steps: [
      {
        num: 1,
        title: "Download the AwareCam Windows App",
        titleHe: "הורד את אפליקציית AwareCam ל-Windows",
        desc: "On the Windows PC that will serve as the edge device, download the AwareCam Windows Agent from the Partner Portal under Documents → Setup Guides. Run the installer as Administrator.",
        descHe: "במחשב Windows שישמש כהתקן הקצה, הורד את סוכן AwareCam ל-Windows מפורטל השותפים תחת מסמכים → מדריכי התקנה. הפעל את תוכנית ההתקנה כמנהל מערכת.",
        icon: "💻",
        note: "Minimum requirements: Windows 10/11 (64-bit), 8GB RAM, 50GB free disk, Intel/AMD CPU with AVX2 support.",
        noteHe: "דרישות מינימום: Windows 10/11 (64-bit), 8GB RAM, 50GB דיסק פנוי, מעבד Intel/AMD עם תמיכת AVX2.",
        noteType: "info",
      },
      {
        num: 2,
        title: "Run the Setup Wizard",
        titleHe: "הפעל את אשף ההגדרה",
        desc: "Launch AwareCam Agent from the Start Menu. The setup wizard will guide you through: accepting the license agreement, choosing the installation directory, and configuring the service to start automatically with Windows.",
        descHe: "הפעל את AwareCam Agent מתפריט התחל. אשף ההגדרה ינחה אותך דרך: קבלת הסכם הרישיון, בחירת ספריית ההתקנה, והגדרת השירות להפעלה אוטומטית עם Windows.",
        icon: "⚙️",
        note: "Install as a Windows Service so the agent runs even when no user is logged in.",
        noteHe: "התקן כשירות Windows כדי שהסוכן יפעל גם כאשר אף משתמש לא מחובר.",
        noteType: "info",
      },
      {
        num: 3,
        title: "Provision with Partner Credentials",
        titleHe: "הקצאה עם אישורי שותף",
        desc: "In the AwareCam Agent tray application, click 'Provision'. Enter your Partner Portal email and provisioning token (found in the Partner Portal under your account settings). The device will register and connect to the cloud.",
        descHe: "באפליקציית מגש AwareCam Agent, לחץ על 'הקצה'. הזן את כתובת הדוא\"ל של פורטל השותפים ואסימון ההקצאה שלך (נמצא בפורטל השותפים תחת הגדרות החשבון שלך). ההתקן יירשם ויתחבר לענן.",
        icon: "🔑",
        note: "The provisioning token is unique per device. Generate a new token for each Windows PC you deploy.",
        noteHe: "אסימון ההקצאה הוא ייחודי לכל התקן. צור אסימון חדש לכל מחשב Windows שאתה פורס.",
        noteType: "warning",
      },
      {
        num: 4,
        title: "Add Cameras via the Agent UI",
        titleHe: "הוסף מצלמות דרך ממשק הסוכן",
        desc: "Open the AwareCam Agent UI (http://localhost:8080). Click 'Add Camera'. Use Auto-Discover for ONVIF cameras on the local network, or enter RTSP URLs manually. The Intel N100 can handle 30–40 simultaneous camera streams.",
        descHe: "פתח את ממשק AwareCam Agent (http://localhost:8080). לחץ על 'הוסף מצלמה'. השתמש ב-Auto-Discover עבור מצלמות ONVIF ברשת המקומית, או הזן כתובות RTSP ידנית. ה-Intel N100 יכול לטפל ב-30–40 זרמי מצלמות בו-זמנית.",
        icon: "📷",
        note: "For 30+ cameras, ensure the PC has a wired Gigabit Ethernet connection and sufficient upload bandwidth (at least 30 Mbps).",
        noteHe: "עבור 30+ מצלמות, ודא שלמחשב יש חיבור Ethernet קווי Gigabit ורוחב פס העלאה מספיק (לפחות 30 Mbps).",
        noteType: "warning",
      },
      {
        num: 5,
        title: "Configure AI Agents in the Cloud",
        titleHe: "הגדר סוכני AI בענן",
        desc: "Log into the AwareCam Partner Portal cloud dashboard. Navigate to the newly provisioned site. Enable AI detection agents per camera as needed. Configure alert rules and notification recipients.",
        descHe: "היכנס ללוח הבקרה בענן של פורטל השותפים של AwareCam. נווט לאתר שהוקצה לאחרונה. הפעל סוכני זיהוי AI לכל מצלמה לפי הצורך. הגדר כללי התראה ונמעני הודעות.",
        icon: "🤖",
        note: "Windows Agent supports GPU acceleration (NVIDIA CUDA) for higher camera counts. Contact support for GPU-enabled builds.",
        noteHe: "סוכן Windows תומך בהאצת GPU (NVIDIA CUDA) לספירות מצלמות גבוהות יותר. צור קשר עם התמיכה לגרסאות עם GPU.",
        noteType: "info",
      },
    ],
    troubleshooting: [
      { issue: "Agent service not starting", fix: "Run Services.msc, find 'AwareCam Agent', ensure it's set to Automatic startup. Check Windows Event Viewer for errors under Application logs." },
      { issue: "High CPU usage", fix: "Reduce the number of active AI agents. Switch cameras to Sub Stream (lower resolution). Consider upgrading to a GPU-enabled build for large deployments." },
      { issue: "Cameras dropping from the feed", fix: "Check network stability. Ensure cameras are on a dedicated VLAN or switch. Verify RTSP keep-alive settings in the Agent configuration." },
      { issue: "Cloud connection lost", fix: "Check that UDP 51820 is open outbound. Restart the AwareCam Agent service. Check the Windows Firewall is not blocking the agent executable." },
    ],
  },
  rtsp: {
    title: "Direct RTSP Setup Guide",
    titleHe: "מדריך חיבור RTSP ישיר",
    subtitle: "Cloud-Only · No Local Device Required · Static IP Required",
    subtitleHe: "ענן בלבד · אין צורך בהתקן מקומי · נדרשת IP סטטית",
    icon: Wifi,
    color: "text-purple-400",
    border: "border-purple-500/30",
    bg: "bg-purple-500/10",
    steps: [
      {
        num: 1,
        title: "Verify Prerequisites",
        titleHe: "אמת דרישות מוקדמות",
        desc: "Direct RTSP requires: (1) A static public IP address from your ISP, (2) Admin access to your router/firewall for port forwarding, (3) Minimum 1.5–2 Mbps upload bandwidth per camera stream.",
        descHe: "RTSP ישיר דורש: (1) כתובת IP ציבורית סטטית מספק האינטרנט שלך, (2) גישת מנהל לנתב/חומת האש שלך להפניית פורטים, (3) רוחב פס העלאה מינימלי של 1.5–2 Mbps לכל זרם מצלמה.",
        icon: "✅",
        note: "If you don't have a static IP, use a local gateway device (Kiosk or Windows Edge) instead.",
        noteHe: "אם אין לך IP סטטית, השתמש בהתקן שער מקומי (קיוסק או Windows Edge) במקום.",
        noteType: "warning",
      },
      {
        num: 2,
        title: "Configure Port Forwarding",
        titleHe: "הגדר הפניית פורטים",
        desc: "In your router's admin panel, create a port forwarding rule for each camera: map a unique external port (e.g., 5541, 5542...) to the camera's internal IP on port 554 (RTSP default). Use TCP/UDP protocol.",
        descHe: "בלוח הניהול של הנתב שלך, צור כלל הפניית פורטים לכל מצלמה: מפה פורט חיצוני ייחודי (למשל, 5541, 5542...) לכתובת ה-IP הפנימית של המצלמה בפורט 554 (ברירת מחדל RTSP). השתמש בפרוטוקול TCP/UDP.",
        icon: "🔀",
        note: "Example: External port 5541 → 192.168.1.100:554 (Camera 1), External port 5542 → 192.168.1.101:554 (Camera 2)",
        noteHe: "דוגמה: פורט חיצוני 5541 → 192.168.1.100:554 (מצלמה 1), פורט חיצוני 5542 → 192.168.1.101:554 (מצלמה 2)",
        noteType: "info",
      },
      {
        num: 3,
        title: "Build Your RTSP URLs",
        titleHe: "בנה את כתובות ה-RTSP שלך",
        desc: "Construct the public RTSP URL for each camera: rtsp://[username]:[password]@[Your_Public_IP]:[External_Port]/[stream_path]. Test each URL in VLC Media Player before adding to AwareCam.",
        descHe: "בנה את כתובת ה-RTSP הציבורית לכל מצלמה: rtsp://[שם_משתמש]:[סיסמה]@[IP_ציבורית_שלך]:[פורט_חיצוני]/[נתיב_זרם]. בדוק כל כתובת URL ב-VLC Media Player לפני הוספה ל-AwareCam.",
        icon: "🔗",
        note: "Common stream paths: Dahua: /cam/realmonitor?channel=1&subtype=1 | Hikvision: /Streaming/Channels/102 | Reolink: /h264Preview_01_sub",
        noteHe: "נתיבי זרם נפוצים: Dahua: /cam/realmonitor?channel=1&subtype=1 | Hikvision: /Streaming/Channels/102 | Reolink: /h264Preview_01_sub",
        noteType: "info",
      },
      {
        num: 4,
        title: "Add Cameras in the Partner Portal",
        titleHe: "הוסף מצלמות בפורטל השותפים",
        desc: "Log into the AwareCam Partner Portal. Navigate to the client's site. Click 'Add Camera' → 'Direct RTSP Connection'. Paste the full RTSP URL. Click 'Test Connection' to verify, then save.",
        descHe: "היכנס לפורטל השותפים של AwareCam. נווט לאתר הלקוח. לחץ על 'הוסף מצלמה' → 'חיבור RTSP ישיר'. הדבק את כתובת ה-RTSP המלאה. לחץ על 'בדוק חיבור' לאימות, ולאחר מכן שמור.",
        icon: "➕",
        note: "A snapshot preview will appear if the connection is successful.",
        noteHe: "תצוגה מקדימה של תמונת מצב תופיע אם החיבור הצליח.",
        noteType: "success",
      },
      {
        num: 5,
        title: "Secure Your Cameras",
        titleHe: "אבטח את המצלמות שלך",
        desc: "Change all default camera passwords to strong, unique passwords. Enable IP whitelisting on your router to only allow AwareCam cloud IP addresses to access the forwarded ports. Keep camera firmware updated.",
        descHe: "שנה את כל סיסמאות ברירת המחדל של המצלמות לסיסמאות חזקות וייחודיות. הפעל רשימה לבנה של IP בנתב שלך כדי לאפשר רק לכתובות IP של ענן AwareCam לגשת לפורטים המופנים. שמור על קושחת המצלמה מעודכנת.",
        icon: "🛡️",
        note: "Contact support@awarecam.com for the current list of AwareCam cloud IP addresses to whitelist.",
        noteHe: "צור קשר עם support@awarecam.com לקבלת הרשימה הנוכחית של כתובות IP של ענן AwareCam לאישור.",
        noteType: "warning",
      },
    ],
    troubleshooting: [
      { issue: "Test Connection fails in the portal", fix: "Verify the RTSP URL works in VLC first. Check port forwarding rules are correct. Confirm your public IP hasn't changed (use whatismyip.com). Ensure camera credentials are correct." },
      { issue: "Stream connects but video is black", fix: "The camera may be in a low-light environment. Check the Sub Stream is selected (not Main Stream). Try accessing the camera's web interface directly to verify the stream." },
      { issue: "Frequent disconnections", fix: "Dynamic IP addresses will cause this — upgrade to a static IP or use DDNS. Check router NAT session timeout settings and increase them. Verify upload bandwidth is sufficient." },
      { issue: "High latency / delayed alerts", fix: "Reduce stream resolution and bitrate. Use Sub Stream instead of Main Stream. Check upload bandwidth is not saturated." },
    ],
  },
};

export default function Installation() {
  const { t, language } = useLanguage();
  const [activeGuide, setActiveGuide] = useState<GuideType>("kiosk");
  const [expandedTroubleshooting, setExpandedTroubleshooting] = useState(false);

  const guide = guides[activeGuide];
  const Icon = guide.icon;

  return (
    <PortalLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {t("install.title")}
          </h1>
          <p className="text-muted-foreground">{t("install.subtitle")}</p>
        </div>

        {/* Guide Selector */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {(Object.entries(guides) as [GuideType, typeof guides.kiosk][]).map(([key, g]) => {
            const GIcon = g.icon;
            return (
              <button
                key={key}
                onClick={() => { setActiveGuide(key); setExpandedTroubleshooting(false); }}
                className={cn(
                  "p-4 rounded-xl border text-left transition-all",
                  activeGuide === key
                    ? `${g.border} ${g.bg} ${g.color}`
                    : "border-border bg-card text-muted-foreground hover:border-border hover:text-foreground"
                )}
              >
                <GIcon className={cn("w-6 h-6 mb-2", activeGuide === key ? g.color : "text-muted-foreground")} />
                <div className="text-sm font-semibold text-foreground">
                  {language === "he" ? g.titleHe : g.title}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {language === "he" ? g.subtitleHe : g.subtitle}
                </div>
              </button>
            );
          })}
        </div>

        {/* Steps */}
        <div className="space-y-4 mb-8">
          {guide.steps.map((step) => (
            <div key={step.num} className="flex gap-4 p-5 rounded-xl border border-border bg-card">
              {/* Step number */}
              <div className="flex flex-col items-center gap-2 flex-shrink-0">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold", guide.bg, guide.color)}>
                  {step.icon}
                </div>
                {step.num < guide.steps.length && (
                  <div className="w-px flex-1 bg-border min-h-[20px]" />
                )}
              </div>

              <div className="flex-1 min-w-0 pb-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className={cn("text-xs font-bold uppercase tracking-wider", guide.color)}>
                    Step {step.num}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {language === "he" ? step.titleHe : step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  {language === "he" ? step.descHe : step.desc}
                </p>

                {/* Note */}
                {step.note && (
                  <div className={cn(
                    "flex items-start gap-2 px-3 py-2.5 rounded-lg text-xs",
                    step.noteType === "warning" && "bg-orange-500/10 border border-orange-500/20 text-orange-300",
                    step.noteType === "info" && "bg-blue-500/10 border border-blue-500/20 text-blue-300",
                    step.noteType === "success" && "bg-teal-500/10 border border-teal-500/20 text-teal-300",
                  )}>
                    {step.noteType === "warning" && <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />}
                    {step.noteType === "info" && <Terminal className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />}
                    {step.noteType === "success" && <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />}
                    <span>{language === "he" ? step.noteHe : step.note}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Troubleshooting */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <button
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-secondary transition-colors"
            onClick={() => setExpandedTroubleshooting(!expandedTroubleshooting)}
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-semibold text-foreground">{t("install.troubleshooting")}</span>
              <span className="text-xs text-muted-foreground">({guide.troubleshooting.length} common issues)</span>
            </div>
            {expandedTroubleshooting ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </button>

          {expandedTroubleshooting && (
            <div className="border-t border-border divide-y divide-border">
              {guide.troubleshooting.map((item, i) => (
                <div key={i} className="px-5 py-4">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[10px] font-bold text-orange-400">{i + 1}</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground mb-1">❌ {item.issue}</div>
                      <div className="text-sm text-muted-foreground">✅ {item.fix}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PortalLayout>
  );
}
