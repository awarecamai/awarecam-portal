import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import PortalLayout from "@/components/PortalLayout";
import { TrendingUp, Shield, Building2, GraduationCap, Flame, HardHat, ChevronDown, ChevronUp, CheckCircle, XCircle, Monitor, BookOpen, Warehouse, Factory, Heart, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

type SalesTab = "objections" | "brochures" | "platform";

const objections = [
  {
    objection: "We already have a security system / cameras installed.",
    response: "That's exactly why AwareCam is perfect for you. We don't replace your existing cameras — we make them intelligent. AwareCam connects to any IP camera you already have via RTSP, adding AI detection, cloud recording, and mobile alerts without any hardware swap.",
    category: "Competition",
  },
  {
    objection: "It's too expensive / we don't have the budget.",
    response: "Consider the cost of a security incident — theft, liability, or a missed safety event — versus $39/camera/month retail (or $29/camera/month at partner pricing). AwareCam replaces the need for 24/7 human monitoring, which typically costs $3,500–5,000/month for a single security guard when factoring in salary, benefits, and overhead. A 10-camera site pays for itself in the first month compared to staffed monitoring.",
    category: "Price",
  },
  {
    objection: "We're concerned about privacy and data security.",
    response: "AwareCam processes video on the edge device — inside your facility — and only sends metadata (alerts, thumbnails) to the cloud. Raw video is never uploaded unless you request cloud recording. All data is encrypted in transit (TLS 1.3) and at rest (AES-256). We are GDPR-compliant.",
    category: "Security",
  },
  {
    objection: "Our IT team will never approve this.",
    response: "We have a dedicated Network & Firewall Requirements document for your IT team. The system only requires outbound UDP 51820 (WireGuard VPN) — no inbound ports, no firewall changes on your end. It's designed to be IT-friendly and passes most enterprise security reviews.",
    category: "IT / Technical",
  },
  {
    objection: "We tried AI cameras before and they had too many false alarms.",
    response: "AwareCam uses YOLO11 — the latest generation of computer vision models — with configurable confidence thresholds and detection zones. You define exactly where and what to detect. Most clients reduce false alarms by 90%+ compared to motion-based systems within the first week of tuning.",
    category: "Technology",
  },
  {
    objection: "We need to think about it / we'll get back to you.",
    response: "Completely understood. While you're evaluating, I'd like to offer a 30-day pilot on 3–5 cameras at no cost. This lets your team experience the platform firsthand. There's no obligation, and setup takes less than 2 hours. Shall I arrange that for you?",
    category: "Stall",
  },
  {
    objection: "We don't have IT staff to manage this.",
    response: "AwareCam is designed for non-technical users. The mobile app is as simple as any consumer app. The edge device is plug-and-play. Your reseller (us) handles all setup, provisioning, and ongoing support. Your team just receives the alerts.",
    category: "Complexity",
  },
  {
    objection: "What happens if the internet goes down?",
    response: "The edge device continues recording locally and running AI detection even without internet. Once connectivity is restored, alerts and recordings sync to the cloud automatically. You never lose footage due to a network outage.",
    category: "Reliability",
  },
];

const verticals = [
  {
    key: "retail",
    label: "Retail",
    icon: ShoppingCart,
    color: "text-pink-400",
    bg: "bg-pink-500/10",
    border: "border-pink-500/20",
    painPoints: ["Shoplifting and organized retail crime ($100B+ annual US losses)", "Employee theft and internal shrinkage", "Slip-and-fall liability and false claims", "After-hours break-ins and smash-and-grab"],
    aiAgents: ["Person Detection (loitering, after-hours)", "Crowd Detection (queue management)", "LPR (parking lot monitoring)", "Fire/Smoke Detection"],
    pitch: "Retail environments face constant shrinkage from shoplifting, employee theft, and organized retail crime. AwareCam's AI-powered person detection and crowd analytics provide real-time alerts for loitering and after-hours intrusion, while cloud-stored footage with AI-tagged events dramatically reduces investigation time and supports loss prevention teams.",
    keyStats: ["US retail shrinkage: $112B annually", "Stores with AI monitoring reduce shrinkage by 30–50%", "Average shoplifting incident: $461 in merchandise loss"],
  },
  {
    key: "construction",
    label: "Construction",
    icon: HardHat,
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    painPoints: ["Equipment and material theft (avg. $1B/year industry-wide)", "Safety compliance (PPE monitoring)", "Unauthorized site access", "Progress documentation"],
    aiAgents: ["Person Detection (after-hours intrusion)", "Vehicle Detection (equipment tracking)", "LPR (authorized vehicle access)", "Fire/Smoke Detection"],
    pitch: "Construction sites are high-value, high-risk environments with minimal permanent infrastructure. AwareCam's solar-powered kiosk option and cellular connectivity make it ideal for remote sites. AI-powered after-hours intrusion detection and LPR for vehicle access control protect millions in equipment and materials.",
    keyStats: ["Construction theft: $1B+ annually in the US", "Average equipment theft loss per incident: $30K", "Sites with active monitoring see 70% reduction in theft"],
  },
  {
    key: "education",
    label: "Education",
    icon: GraduationCap,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    painPoints: ["Campus safety and active threat detection", "Unauthorized visitor access", "Vandalism and after-hours intrusion", "Parking lot monitoring"],
    aiAgents: ["Person Detection (campus perimeter)", "Crowd Detection (assembly areas)", "LPR (parking management)", "Fire/Smoke Detection"],
    pitch: "Schools and universities have a duty of care to protect students and staff. AwareCam's real-time crowd detection and perimeter monitoring provide early warning of potential threats. Integration with existing access control systems and instant mobile alerts to administrators and security staff enable rapid response.",
    keyStats: ["K-12 security spending: $3.1B annually", "Average cost of a school security incident: $500K+", "Campuses with AI monitoring respond 4x faster to incidents"],
  },
  {
    key: "warehouse",
    label: "Warehousing",
    icon: Warehouse,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
    painPoints: ["Cargo theft and inventory shrinkage", "Forklift and worker safety in high-traffic zones", "Unauthorized access to restricted areas", "After-hours break-ins and loading dock security"],
    aiAgents: ["Person Detection (restricted zone access)", "Vehicle Detection (forklift and truck tracking)", "LPR (delivery vehicle verification)", "Fire/Smoke Detection"],
    pitch: "Warehouses and distribution centers handle high-value inventory around the clock. AwareCam's AI monitors loading docks, restricted zones, and perimeters 24/7 — detecting unauthorized access, verifying delivery vehicles via LPR, and alerting safety teams when workers enter hazardous forklift zones. Cloud-stored footage with AI-tagged events accelerates incident investigations.",
    keyStats: ["Cargo theft costs US businesses $15–35B annually", "Warehouses with AI monitoring reduce theft incidents by 40–60%", "Average cargo theft per incident: $200K+"],
  },
  {
    key: "manufacturing",
    label: "Manufacturing",
    icon: Factory,
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    painPoints: ["Worker safety compliance (PPE, exclusion zones)", "Equipment theft and vandalism", "Fire and smoke risk in production areas", "Shift change and access control monitoring"],
    aiAgents: ["Person Detection (exclusion zone & PPE monitoring)", "Fire/Smoke Detection (production floor)", "Vehicle Detection (loading areas)", "LPR (authorized vendor access)"],
    pitch: "Manufacturing facilities face strict OSHA safety requirements and significant fire risk from machinery and chemicals. AwareCam's real-time PPE compliance monitoring, exclusion zone alerts, and fire/smoke detection protect workers and assets. Automated compliance recording simplifies OSHA documentation and incident reporting.",
    keyStats: ["OSHA violations cost manufacturers avg. $15K per citation", "Manufacturing fires cause $1B+ in property damage annually", "AI safety monitoring reduces workplace incidents by 35%"],
  },
  {
    key: "healthcare",
    label: "Healthcare",
    icon: Heart,
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    painPoints: ["Patient and staff safety in sensitive areas", "Unauthorized access to medication storage and labs", "Parking lot and entrance security", "Liability documentation for incidents and falls"],
    aiAgents: ["Person Detection (restricted area access)", "Crowd Detection (waiting room management)", "LPR (parking and ambulance bay)", "Fire/Smoke Detection"],
    pitch: "Hospitals, clinics, and care facilities must balance open access with strict security for patients, staff, and controlled substances. AwareCam's AI monitors restricted areas like pharmacies and server rooms, detects unauthorized access after hours, and provides cloud-stored footage for liability protection. HIPAA-compliant edge processing ensures patient privacy.",
    keyStats: ["Healthcare workplace violence costs $4.6B annually in the US", "Medication theft from facilities: $75M+ per year", "AI monitoring reduces security response time by 60%"],
  },
  {
    key: "oil_gas",
    label: "Oil & Gas",
    icon: Flame,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    painPoints: ["Fire and gas leak detection (critical safety)", "Pipeline and perimeter security", "Remote facility monitoring", "Regulatory compliance (EPA, OSHA)"],
    aiAgents: ["Fire/Smoke Detection (highest priority)", "Person Detection (exclusion zones)", "Vehicle Detection (tanker tracking)", "LPR (authorized access)"],
    pitch: "Oil and gas facilities represent some of the highest-risk environments in industry. AwareCam's fire and smoke detection AI provides early warning seconds before traditional sensors trigger, potentially preventing catastrophic events. Remote monitoring of pipelines and wellheads with cellular-connected edge devices eliminates the need for on-site security personnel.",
    keyStats: ["Average oil & gas fire incident cost: $50M+", "Early fire detection reduces damage by 80%", "Remote monitoring saves $200K+/year in security staffing per facility"],
  },
];

const platformSlides = [
  { title: "The Problem", content: "Traditional security cameras are passive — they record, but they don't think. Security teams are overwhelmed reviewing hours of footage after incidents occur. False alarms from motion sensors waste time and resources. Meanwhile, real threats go undetected until it's too late." },
  { title: "The AwareCam Solution", content: "AwareCam transforms any existing IP camera into an intelligent AI sensor. Using YOLO11 computer vision running on edge devices, AwareCam detects real threats in real-time — persons, vehicles, fire, smoke, and license plates — and delivers instant mobile alerts to the right people." },
  { title: "How It Works", content: "1. Connect: AwareCam connects to any IP camera via RTSP — no hardware replacement needed.\n2. Process: AI runs locally on the edge device (Raspberry Pi or Intel N100 Mini-PC).\n3. Alert: Real-time alerts with images are sent to the mobile app and cloud dashboard.\n4. Review: 30–360 days of cloud-stored footage with AI-tagged events for fast review." },
  { title: "Key Differentiators", content: "\u2022 Edge-first: AI runs locally, not in the cloud — faster, more private, works offline\n\u2022 Camera-agnostic: Works with any RTSP-compatible IP camera (Dahua, Hikvision, Reolink, etc.)\n\u2022 No rip-and-replace: Protect existing camera investments\n\u2022 Scalable: From 1 camera to 40+ cameras on a single device\n\u2022 Affordable: Essential plan from $39/camera/month retail ($29 partner price) — vs. $3,500–5,000/month for a single security guard" },
  { title: "AI Agents Available", content: "Essential Plan: Person Detection, Vehicle Detection, Fire/Smoke Detection\nPro Plan adds: LPR (License Plate Recognition), Crowd Detection, Extended Storage (up to 360 days), API Access\n\nAll agents are configurable with custom detection zones, confidence thresholds, and alert schedules." },
  { title: "Deployment Options", content: "1. Kiosk (Raspberry Pi 4): Plug-and-play, up to 8 cameras, ideal for small sites\n2. Windows Edge Device (Intel N100): 30–40 cameras, ideal for large commercial sites\n3. Direct RTSP: Cloud-only, no local device, requires static IP — ideal for sites with existing infrastructure" },
];

export default function Sales() {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<SalesTab>("objections");
  const [expandedObjection, setExpandedObjection] = useState<number | null>(null);
  const [activeVertical, setActiveVertical] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);

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
              Common sales objections and proven responses. Click any objection to expand the full response.
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
          <div className="flex gap-6">
            {/* Vertical selector */}
            <div className="w-48 flex-shrink-0 space-y-2">
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
                    <VIcon className={cn("w-4 h-4", activeVertical === i ? v.color : "text-muted-foreground")} />
                    {v.label}
                  </button>
                );
              })}
            </div>

            {/* Vertical content */}
            <div className="flex-1 min-w-0">
              {(() => {
                const v = verticals[activeVertical];
                const VIcon = v.icon;
                return (
                  <div className="space-y-4">
                    {/* Header */}
                    <div className={cn("p-5 rounded-xl border", v.border, v.bg)}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", v.bg)}>
                          <VIcon className={cn("w-5 h-5", v.color)} />
                        </div>
                        <div>
                          <h2 className="text-lg font-bold text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                            {v.label} Industry
                          </h2>
                          <p className="text-xs text-muted-foreground">AwareCam vertical solution brief</p>
                        </div>
                      </div>
                      <p className="text-sm text-foreground leading-relaxed">{v.pitch}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Pain Points */}
                      <div className="p-4 rounded-xl border border-border bg-card">
                        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-red-400" /> Key Pain Points
                        </h3>
                        <ul className="space-y-2">
                          {v.painPoints.map((p, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                              <span className="text-red-400 mt-0.5">•</span> {p}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* AI Agents */}
                      <div className="p-4 rounded-xl border border-border bg-card">
                        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-teal-400" /> Recommended AI Agents
                        </h3>
                        <ul className="space-y-2">
                          {v.aiAgents.map((a, i) => (
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
                        <TrendingUp className="w-4 h-4 text-primary" /> Key Statistics & ROI
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {v.keyStats.map((stat, i) => (
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
          <div className="flex gap-6">
            {/* Slide nav */}
            <div className="w-44 flex-shrink-0 space-y-1">
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
                  <span className="text-[10px] text-muted-foreground block mb-0.5">Slide {i + 1}</span>
                  {slide.title}
                </button>
              ))}
            </div>

            {/* Slide content */}
            <div className="flex-1 min-w-0">
              <div className="p-6 rounded-xl border border-border bg-card min-h-[400px]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-muted-foreground">Slide {activeSlide + 1} of {platformSlides.length}</span>
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {platformSlides[activeSlide].title}
                </h2>
                <div className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                  {platformSlides[activeSlide].content}
                </div>
              </div>

              {/* Slide navigation */}
              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={() => setActiveSlide(Math.max(0, activeSlide - 1))}
                  disabled={activeSlide === 0}
                  className="px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  ← Previous
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
                  Next →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
