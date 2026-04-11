import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import PortalLayout from "@/components/PortalLayout";
import {
  Monitor, Cpu, Wifi, CheckCircle, AlertTriangle, ChevronDown, ChevronUp,
  ExternalLink, Download, UserPlus, Building2, Camera, Zap, Shield,
  ArrowRight, Info, Globe, Settings, Play
} from "lucide-react";
import { cn } from "@/lib/utils";

type GuideType = "account" | "kiosk" | "windows" | "rtsp";

interface Step {
  number: number;
  title: string;
  description: string;
  details?: string[];
  warning?: string;
  tip?: string;
  code?: string;
  visual?: string; // emoji or icon description for visual placeholder
}

const accountSteps: Step[] = [
  {
    number: 1,
    title: "Navigate to the AwareCam App",
    description: "Open your web browser and go to the AwareCam platform.",
    details: [
      "Go to app.base44.com/apps/awarecam (or the URL provided by your AwareCam partner).",
      "You will see the AwareCam login screen.",
    ],
    visual: "🌐",
    tip: "Bookmark this URL for quick access. The portal works on all modern browsers (Chrome, Firefox, Edge, Safari).",
  },
  {
    number: 2,
    title: "Create Your Account",
    description: "Click 'Sign Up' or 'Create Account' to register a new account.",
    details: [
      "Enter your full name.",
      "Enter your business email address.",
      "Create a strong password (minimum 8 characters, include numbers and symbols).",
      "Click 'Create Account'.",
      "Check your email inbox for a verification email from AwareCam.",
    ],
    visual: "📧",
    tip: "Use your business email, not a personal one. This email will be used for all billing, alerts, and support communications.",
  },
  {
    number: 3,
    title: "Verify Your Email",
    description: "Open the verification email and confirm your address.",
    details: [
      "Open the email from noreply@awarecam.com (check your spam folder if you don't see it).",
      "Click the 'Verify Email' button in the email.",
      "You will be redirected back to the AwareCam app and automatically logged in.",
    ],
    visual: "✉️",
    warning: "The verification link expires after 24 hours. If it expires, log in and request a new verification email.",
  },
  {
    number: 4,
    title: "Complete Your Organization Profile",
    description: "Set up your organization so you can add sites and cameras.",
    details: [
      "After verifying your email, you will be prompted to set up your organization.",
      "Enter your Organization Name (this is your company or client's business name).",
      "Select your Industry (Cannabis, Construction, Education, Mining, Oil & Gas, Retail, Other).",
      "Enter your country and time zone.",
      "Click 'Save & Continue'.",
    ],
    visual: "🏢",
    tip: "If you are a reseller setting up an account for a client, use the client's business name as the Organization Name.",
  },
  {
    number: 5,
    title: "Add Your First Site",
    description: "A 'Site' represents a physical location where cameras are installed.",
    details: [
      "Click 'Add Site' or navigate to Sites → New Site.",
      "Enter the Site Name (e.g., 'Main Warehouse', 'Branch Office - Tel Aviv').",
      "Enter the site address.",
      "Click 'Create Site'.",
    ],
    visual: "📍",
    tip: "You can add multiple sites under one organization. Each site manages its own cameras, AI agents, and alerts independently.",
  },
  {
    number: 6,
    title: "Get Your Provisioning Code",
    description: "Each site generates a unique 10-character pairing code used to connect your gateway device.",
    details: [
      "Open the site you just created.",
      "Navigate to Settings → Gateway Devices.",
      "Click 'Add Gateway Device'.",
      "A 10-character provisioning code will be displayed (e.g., XKMT-72PQ3).",
      "Write this code down or keep this screen open — you will need it in the next phase.",
    ],
    visual: "🔑",
    warning: "The provisioning code is single-use. Once a device is paired, a new code must be generated for any additional devices.",
  },
  {
    number: 7,
    title: "Download the Mobile App",
    description: "Install the AwareCam mobile app to receive real-time alerts and view live cameras.",
    details: [
      "iOS: Search 'AwareCam' on the Apple App Store.",
      "Android: Search 'AwareCam' on the Google Play Store.",
      "Log in with the same email and password you created in Step 2.",
      "Allow push notifications when prompted — this is required to receive AI alerts.",
    ],
    visual: "📱",
    tip: "Share the app download link with your client's team so multiple users can receive alerts from the same site.",
  },
];

const kioskSteps: Step[] = [
  {
    number: 1,
    title: "What You Need",
    description: "Gather all required hardware before starting the installation.",
    details: [
      "Raspberry Pi 4 or Pi 5 (pre-loaded with AwareCam OS by your distributor)",
      "Power supply: USB-C 5V/3A (included with the AwareCam Kiosk kit)",
      "Ethernet cable (strongly recommended over WiFi)",
      "HDMI cable + TV or monitor (for initial setup only)",
      "USB keyboard (for initial setup only — can be removed after pairing)",
      "Your 10-character AwareCam provisioning code (from Base44 account setup)",
    ],
    visual: "📦",
    tip: "The Raspberry Pi should come pre-flashed with AwareCam OS. If you received a blank Pi, contact support@awarecam.com for the OS image.",
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
    visual: "🔌",
    warning: "Always connect Ethernet BEFORE power. The device performs network configuration on first boot and needs a live connection.",
    tip: "Use the HDMI port closest to the USB-C power port on the Pi (labeled HDMI0). The second HDMI port (HDMI1) may not output video on first boot.",
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
      "The setup wizard will appear automatically.",
    ],
    visual: "🖥️",
    warning: "Do not disconnect power during first boot. The device is writing configuration files. Interrupting this can corrupt the SD card.",
  },
  {
    number: 4,
    title: "Enter the Provisioning Code",
    description: "Pair this device with your AwareCam account using the code from Base44.",
    details: [
      "On the setup screen, you will see a field labeled 'Enter Provisioning Code'.",
      "Type your 10-character code using the on-screen keyboard or USB keyboard.",
      "The code format is XXXX-XXXXX (4 characters, dash, 5 characters).",
      "Click 'Pair Device'.",
      "The device will connect to the AwareCam cloud and confirm pairing.",
      "You will see a green 'Device Paired Successfully' message.",
    ],
    visual: "🔗",
    tip: "The code is case-insensitive. XKMT-72PQ3 and xkmt-72pq3 both work.",
    warning: "If pairing fails, check that your Ethernet cable is connected and the internet is working. The device needs internet access to pair.",
  },
  {
    number: 5,
    title: "Set Your Security PIN",
    description: "Create a 4-digit PIN to protect the device from unauthorized access.",
    details: [
      "Enter a 4-digit PIN using the on-screen number pad.",
      "Confirm the PIN by entering it again.",
      "Click 'Set PIN'.",
      "This PIN is required every time the device restarts or is locked.",
    ],
    visual: "🔒",
    tip: "Choose a PIN that your on-site staff can remember but is not obvious (avoid 1234 or 0000). Write it down and store it securely.",
    warning: "If you forget the PIN, contact your AwareCam administrator. They can send a remote PIN reset from the admin dashboard.",
  },
  {
    number: 6,
    title: "Discover & Add Cameras",
    description: "Scan your local network to find IP cameras and add them to the system.",
    details: [
      "After entering your PIN, the main dashboard appears.",
      "Tap 'Cameras' in the sidebar.",
      "Choose a scan type: Quick Discover (2–3 sec), Enhanced Discovery (15 sec), or Full Network Scan (45 sec).",
      "Found cameras appear in the 'Discovered Cameras' list.",
      "Tap 'Configure' next to each camera.",
      "Enter the camera name, select the brand (Dahua, Hikvision, Reolink, etc.), username, and password.",
      "Select an RTSP URL from the suggestions list.",
      "Tap 'Test' to verify — a green checkmark means success.",
      "Tap 'Save Camera'.",
    ],
    visual: "📷",
    tip: "Use 'Full Network Scan' if cameras are not appearing. The device also auto-scans every 5 minutes in the background.",
    warning: "You must know your camera's password. AwareCam cannot bypass or recover camera passwords.",
  },
  {
    number: 7,
    title: "Configure AI Agents in Base44",
    description: "Return to the Base44 dashboard to enable AI detection on your cameras.",
    details: [
      "Log in to your Base44 account at app.base44.com/apps/awarecam.",
      "Navigate to your Site → Cameras.",
      "Your newly added cameras will appear (synced from the gateway device).",
      "Click on a camera → AI Agents.",
      "Enable the agents you want: Person Detection, Vehicle Detection, Fire/Smoke, LPR, etc.",
      "Draw detection zones on the camera image (optional but recommended to reduce false alarms).",
      "Set alert schedules (e.g., only alert after hours).",
      "Click 'Save'.",
    ],
    visual: "🤖",
    tip: "Start with Person Detection and Fire/Smoke on all cameras. Add more specific agents after the client has used the system for a week.",
  },
  {
    number: 8,
    title: "Verify Everything is Working",
    description: "Confirm cameras are streaming and AI alerts are being generated.",
    details: [
      "On the Kiosk screen: all cameras should show a green dot.",
      "In the Base44 dashboard: cameras should show 'Online' status.",
      "In the mobile app: live camera feeds should be visible.",
      "Walk in front of a camera to trigger a Person Detection alert.",
      "Confirm the alert appears in the mobile app and Base44 Events feed.",
    ],
    visual: "✅",
    tip: "Test alerts before leaving the site. It takes 30–60 seconds for the first alert to process after enabling an AI agent.",
  },
];

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
      "Internet: Stable broadband connection",
    ],
    visual: "💻",
    tip: "The Intel N100 Mini-PC (available from AwareCam) is pre-configured and tested to handle 30–40 simultaneous camera streams.",
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
    visual: "⬇️",
    warning: "Only download the installer from official AwareCam sources. Do not install from third-party websites.",
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
    visual: "⚙️",
    tip: "The installer registers AwareCam as a Windows Service that starts automatically on boot. You do not need to manually launch it after setup.",
  },
  {
    number: 4,
    title: "Open the AwareCam Dashboard",
    description: "Access the local web interface to configure the device.",
    details: [
      "The AwareCam Edge Agent opens a local web interface automatically.",
      "If it doesn't open, open Chrome or Edge and go to: http://localhost:8080",
      "You will see the AwareCam Edge Dashboard.",
      "From any other device on the same network, access it at: http://[PC-IP-address]:8080",
    ],
    visual: "🌐",
    code: "http://localhost:8080",
    tip: "Bookmark http://localhost:8080 for quick access. You can also access it remotely from any device on the same network.",
  },
  {
    number: 5,
    title: "Enter the Provisioning Code",
    description: "Pair this Windows device with your Base44 account.",
    details: [
      "In the AwareCam Edge Dashboard, click 'Pair with AwareCam Cloud'.",
      "Enter your 10-character provisioning code from Base44.",
      "Click 'Pair Device'.",
      "The device will connect to the AwareCam cloud and confirm pairing.",
      "You will see a green 'Device Paired Successfully' confirmation.",
      "The VPN status indicator in the top-right should turn green.",
    ],
    visual: "🔗",
    warning: "If pairing fails, check Windows Firewall. The AwareCam installer should add the necessary firewall exceptions automatically, but some enterprise security software may block it.",
  },
  {
    number: 6,
    title: "Discover & Add Cameras",
    description: "Scan the network to find IP cameras and configure them.",
    details: [
      "In the AwareCam Edge Dashboard, click 'Cameras' in the left sidebar.",
      "Click 'Scan for Cameras'.",
      "Choose: Quick Discover, Enhanced Discovery, or Full Network Scan.",
      "Discovered cameras appear in the list.",
      "Click 'Configure' next to each camera.",
      "Enter camera name, brand, username, and password.",
      "Select the RTSP URL from the dropdown.",
      "Click 'Test Connection' — green checkmark = success.",
      "Click 'Save Camera'.",
    ],
    visual: "📷",
    tip: "For large deployments (20+ cameras), use the CSV import feature to add cameras in bulk. Download the template from Cameras → Import → Download Template.",
  },
  {
    number: 7,
    title: "Configure AI Agents in Base44",
    description: "Enable and configure AI detection agents for each camera.",
    details: [
      "Log in to Base44 at app.base44.com/apps/awarecam.",
      "Navigate to your Site → Cameras.",
      "Your cameras will appear synced from the Windows Edge device.",
      "Click a camera → AI Agents.",
      "Enable desired agents and configure detection zones.",
      "Set alert schedules and notification preferences.",
      "Click 'Save'.",
    ],
    visual: "🤖",
    tip: "For large sites, use the 'Apply to All Cameras' option to quickly enable the same agents across all cameras, then fine-tune individual cameras as needed.",
  },
  {
    number: 8,
    title: "Configure Auto-Start & Monitoring",
    description: "Ensure the service runs reliably and restarts automatically.",
    details: [
      "Open Windows Services (press Win+R → type 'services.msc' → Enter).",
      "Find 'AwareCam Edge Agent' in the list.",
      "Right-click → Properties → Startup type: Automatic.",
      "Under Recovery tab, set 'First failure' and 'Second failure' to 'Restart the Service'.",
      "Click OK.",
      "The service will now automatically restart if it ever stops unexpectedly.",
    ],
    visual: "🔄",
    tip: "The AwareCam installer configures this automatically. This step is only needed if you're doing a manual or enterprise deployment.",
  },
];

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
      "✓ AwareCam Base44 account (see Account Setup guide)",
    ],
    visual: "📋",
    warning: "If you do not have a static IP, use a Kiosk or Windows Edge device instead. Dynamic IPs will cause cameras to go offline whenever the IP changes.",
    tip: "Not sure if you have a static IP? Ask your ISP or check your router's WAN settings. A static IP typically costs $5–15/month extra from most ISPs.",
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
    visual: "🔢",
    tip: "Write down each camera's name and assigned IP address. You will need this in the next steps.",
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
    visual: "🔀",
    code: "Camera 1: 192.168.1.100:554 → External Port 5541\nCamera 2: 192.168.1.101:554 → External Port 5542\nCamera 3: 192.168.1.102:554 → External Port 5543",
    warning: "Each camera must have a unique external port. Using the same external port for multiple cameras will cause conflicts.",
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
    visual: "🔗",
    code: "rtsp://admin:PASSWORD@YOUR.PUBLIC.IP:5541/cam/realmonitor?channel=1&subtype=1",
    tip: "Use substreams (lower resolution) for AI analytics. Main streams use too much bandwidth and are not needed for AI detection.",
  },
  {
    number: 5,
    title: "Add Cameras in Base44",
    description: "Enter the RTSP URLs into your AwareCam account.",
    details: [
      "Log in to Base44 at app.base44.com/apps/awarecam.",
      "Navigate to your Site → Cameras → Add Camera.",
      "Select 'Direct RTSP Connection'.",
      "Enter the camera name and paste the full RTSP URL.",
      "Click 'Test Connection'.",
      "A successful test shows a snapshot from the camera.",
      "Click 'Save Camera'.",
      "Repeat for each camera.",
    ],
    visual: "📷",
    warning: "If the test fails: verify port forwarding rules, confirm your public IP is correct, and check camera credentials.",
  },
  {
    number: 6,
    title: "Enable AI Agents",
    description: "Configure AI detection for each camera.",
    details: [
      "In Base44, go to Site → Cameras.",
      "Click a camera → AI Agents.",
      "Enable desired agents (Person Detection, Vehicle, Fire/Smoke, LPR, etc.).",
      "Draw detection zones on the camera image.",
      "Set alert schedules.",
      "Click 'Save'.",
    ],
    visual: "🤖",
    tip: "For Direct RTSP cameras, AI processing happens in the AwareCam cloud. Ensure your upload bandwidth is sufficient (1.5–2 Mbps per camera) before enabling multiple agents.",
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
    visual: "🛡️",
    warning: "Cameras with default passwords exposed to the internet are a serious security risk. Always change passwords before going live.",
  },
];

const troubleshootingItems = [
  { q: "Device won't power on", a: "Check the power cable is fully seated. Use the included USB-C power supply — underpowered supplies cause boot failures. Try a different power outlet." },
  { q: "Screen stays black after boot", a: "Ensure the TV is on the correct HDMI input. Use the HDMI port closest to the USB-C power port (HDMI0). Try a different HDMI cable." },
  { q: "Provisioning code not accepted", a: "Check your internet connection. Verify the code hasn't expired (codes are valid for 24 hours). Generate a new code in Base44 if needed." },
  { q: "Camera shows red dot (offline)", a: "Verify the camera is powered on and on the same network. Go to Cameras → Configure → Test. Try Restart Services in Settings." },
  { q: "Camera RTSP test fails", a: "Double-check the camera password. Ensure you selected the correct camera brand. Try a different RTSP URL from the suggestions list." },
  { q: "VPN shows Disconnected", a: "Check internet connection. Try Restart Services. The VPN auto-reconnects — wait 1–2 minutes. If persistent, try Restart Device." },
  { q: "No alerts being received", a: "Verify AI agents are enabled in Base44. Check notification permissions in the mobile app. Walk in front of a camera to trigger a test alert." },
  { q: "Live video buffering in app", a: "Check your phone's internet connection. Switch between WiFi and cellular. The issue may be on the camera's network side — check upload bandwidth." },
];

const guides = [
  { key: "account" as GuideType, label: "1. Base44 Account Setup", icon: UserPlus, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20", steps: accountSteps, description: "Create your AwareCam account, set up your organization, and get your provisioning code." },
  { key: "kiosk" as GuideType, label: "2. Kiosk (Raspberry Pi)", icon: Monitor, color: "text-teal-400", bg: "bg-teal-500/10", border: "border-teal-500/20", steps: kioskSteps, description: "Set up the Raspberry Pi gateway for small to medium sites (up to 20 cameras)." },
  { key: "windows" as GuideType, label: "3. Windows Edge Device", icon: Cpu, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", steps: windowsSteps, description: "Install the Windows Edge Agent for large commercial sites (30–40 cameras)." },
  { key: "rtsp" as GuideType, label: "4. Direct RTSP (Cloud)", icon: Wifi, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20", steps: rtspSteps, description: "Connect cameras directly to the cloud with no local device (requires static IP)." },
];

function StepCard({ step, isLast }: { step: Step; isLast: boolean }) {
  const [expanded, setExpanded] = useState(true);
  return (
    <div className="flex gap-4">
      {/* Step number + connector line */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div className="w-9 h-9 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-sm font-bold text-primary" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
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
          <div className="flex items-center gap-3">
            <span className="text-2xl">{step.visual}</span>
            <div>
              <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {step.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
            </div>
          </div>
          {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
        </button>

        {expanded && (
          <div className="mt-3 space-y-3">
            {/* Details list */}
            {step.details && (
              <ul className="space-y-1.5 pl-2">
                {step.details.map((d, i) => (
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
            {step.warning && (
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                <AlertTriangle className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-orange-300">{step.warning}</p>
              </div>
            )}

            {/* Tip */}
            {step.tip && (
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-primary/5 border border-primary/15">
                <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">{step.tip}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Installation() {
  const { t } = useLanguage();
  const [activeGuide, setActiveGuide] = useState<GuideType>("account");
  const [showTroubleshooting, setShowTroubleshooting] = useState(false);
  const [expandedTrouble, setExpandedTrouble] = useState<number | null>(null);

  const guide = guides.find(g => g.key === activeGuide)!;

  return (
    <PortalLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {t("install.title")}
          </h1>
          <p className="text-muted-foreground">
            Complete step-by-step installation guides. Start with <strong className="text-foreground">Base44 Account Setup</strong>, then follow the guide for your deployment type.
          </p>
        </div>

        {/* Deployment type selector */}
        <div className="grid grid-cols-4 gap-3 mb-8">
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
                  {g.label}
                </div>
                <div className="text-[11px] text-muted-foreground leading-relaxed">
                  {g.description}
                </div>
              </button>
            );
          })}
        </div>

        {/* Flow indicator: show which step in the overall process */}
        <div className="flex items-center gap-2 mb-6 p-3 rounded-lg bg-secondary/50 border border-border">
          <div className="flex items-center gap-1.5 flex-wrap">
            {guides.map((g, i) => {
              const GIcon = g.icon;
              const isActive = g.key === activeGuide;
              const isAccount = g.key === "account";
              return (
                <div key={g.key} className="flex items-center gap-1.5">
                  <button
                    onClick={() => setActiveGuide(g.key)}
                    className={cn(
                      "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all",
                      isActive ? `${g.bg} ${g.color} border ${g.border}` : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <GIcon className="w-3 h-3" />
                    {isAccount ? "Account Setup" : g.label.replace(/^\d+\.\s/, "")}
                  </button>
                  {i < guides.length - 1 && <ArrowRight className="w-3 h-3 text-border" />}
                </div>
              );
            })}
          </div>
          <div className="ml-auto text-xs text-muted-foreground">
            {guide.steps.length} steps
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Steps column */}
          <div className="col-span-2">
            <div className="p-6 rounded-xl border border-border bg-card">
              <div className="flex items-center gap-3 mb-6">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", guide.bg)}>
                  <guide.icon className={cn("w-5 h-5", guide.color)} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {guide.label}
                  </h2>
                  <p className="text-xs text-muted-foreground">{guide.description}</p>
                </div>
              </div>

              <div>
                {guide.steps.map((step, i) => (
                  <StepCard key={step.number} step={step} isLast={i === guide.steps.length - 1} />
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
                  <span className="text-sm font-semibold text-foreground">Troubleshooting</span>
                  <span className="text-xs text-muted-foreground">Common issues and solutions</span>
                </div>
                {showTroubleshooting ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
              </button>
              {showTroubleshooting && (
                <div className="border-t border-border divide-y divide-border">
                  {troubleshootingItems.map((item, i) => (
                    <div key={i}>
                      <button
                        className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-secondary/50 transition-colors"
                        onClick={() => setExpandedTrouble(expandedTrouble === i ? null : i)}
                      >
                        <span className="text-sm text-foreground">{item.q}</span>
                        {expandedTrouble === i ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />}
                      </button>
                      {expandedTrouble === i && (
                        <div className="px-5 pb-3">
                          <p className="text-xs text-muted-foreground leading-relaxed">{item.a}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar: quick reference + links */}
          <div className="space-y-4">
            {/* Quick reference card */}
            <div className="p-4 rounded-xl border border-border bg-card">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" /> Quick Reference
              </h3>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex justify-between py-1.5 border-b border-border">
                  <span>Base44 App URL</span>
                  <a href="https://app.base44.com" target="_blank" rel="noreferrer" className="text-primary flex items-center gap-1 hover:underline">
                    app.base44.com <ExternalLink className="w-3 h-3" />
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
                  <span>Support email</span>
                  <a href="mailto:support@awarecam.com" className="text-primary hover:underline">support@awarecam.com</a>
                </div>
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
                Our AI Assistant can answer installation questions, check camera compatibility, and help troubleshoot issues in real time.
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
