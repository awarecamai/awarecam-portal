/**
 * AwareCam Document Library Seeder
 * Run: node scripts/seed-documents.mjs
 */
import { readFileSync } from "fs";
import { createConnection } from "mysql2/promise";
import * as dotenv from "dotenv";
dotenv.config();

const DB_URL = process.env.DATABASE_URL;
if (!DB_URL) { console.error("DATABASE_URL not set"); process.exit(1); }

function read(path) {
  try { return readFileSync(path, "utf8"); } catch { return null; }
}

const docs = [
  // ── LEGAL ─────────────────────────────────────────────────────────────────
  {
    title: "Reseller Agreement (US LLC)",
    titleHe: null,
    category: "legal",
    fileType: "markdown",
    language: "en",
    contentEn: read("/home/ubuntu/AwareCam_Reseller_Agreement_US.md"),
    contentHe: null,
    accessRoles: "reseller,integrator,admin",
    sortOrder: 1,
  },
  {
    title: "Reseller Agreement (Israel Ltd)",
    titleHe: "הסכם מפיץ (חברה ישראלית)",
    category: "legal",
    fileType: "markdown",
    language: "both",
    contentEn: read("/home/ubuntu/AwareCam_Reseller_Agreement_IL.md"),
    contentHe: read("/home/ubuntu/AwareCam_Reseller_Agreement_IL_HE.md"),
    accessRoles: "reseller,integrator,admin",
    sortOrder: 2,
  },
  {
    title: "End-User Service Agreement (US LLC)",
    titleHe: null,
    category: "legal",
    fileType: "markdown",
    language: "en",
    contentEn: read("/home/ubuntu/AwareCam_End_User_Agreement_US.md"),
    contentHe: null,
    accessRoles: "reseller,integrator,end_user,admin",
    sortOrder: 3,
  },
  {
    title: "End-User Service Agreement (Israel Ltd)",
    titleHe: "הסכם שירות למשתמש קצה (חברה ישראלית)",
    category: "legal",
    fileType: "markdown",
    language: "both",
    contentEn: read("/home/ubuntu/AwareCam_End_User_Agreement_IL.md"),
    contentHe: read("/home/ubuntu/AwareCam_End_User_Agreement_IL_HE.md"),
    accessRoles: "reseller,integrator,end_user,admin",
    sortOrder: 4,
  },

  // ── SETUP GUIDES ──────────────────────────────────────────────────────────
  {
    title: "Partner Onboarding Checklist",
    titleHe: "רשימת בדיקה לקליטת שותפים",
    category: "setup_guides",
    fileType: "markdown",
    language: "both",
    contentEn: read("/home/ubuntu/AwareCam_Partner_Onboarding_Checklist_EN.md"),
    contentHe: read("/home/ubuntu/AwareCam_Partner_Onboarding_Checklist_HE.md"),
    accessRoles: "reseller,integrator,admin",
    sortOrder: 10,
  },
  {
    title: "Client Welcome & Quick Start Guide",
    titleHe: "מדריך קבלת פנים ותחילת עבודה",
    category: "setup_guides",
    fileType: "markdown",
    language: "both",
    contentEn: read("/home/ubuntu/AwareCam_Client_Welcome_Guide_EN.md"),
    contentHe: read("/home/ubuntu/AwareCam_Client_Welcome_Guide_HE.md"),
    accessRoles: "reseller,integrator,end_user,admin",
    sortOrder: 11,
  },
  {
    title: "Kiosk Device Setup Guide (Raspberry Pi)",
    titleHe: "מדריך הגדרת מכשיר קיוסק (Raspberry Pi)",
    category: "setup_guides",
    fileType: "markdown",
    language: "both",
    contentEn: read("/home/ubuntu/AwareCam_Kiosk_Setup_Guide_EN.md"),
    contentHe: read("/home/ubuntu/AwareCam_Kiosk_Setup_Guide_HE.md"),
    accessRoles: "reseller,integrator,admin",
    sortOrder: 12,
  },
  {
    title: "Windows Edge Device Setup Guide",
    titleHe: "מדריך הגדרת מכשיר Edge (Windows)",
    category: "setup_guides",
    fileType: "markdown",
    language: "both",
    contentEn: read("/home/ubuntu/AwareCam_Windows_Edge_Setup_Guide_EN.md"),
    contentHe: read("/home/ubuntu/AwareCam_Windows_Edge_Setup_Guide_HE.md"),
    accessRoles: "reseller,integrator,admin",
    sortOrder: 13,
  },
  {
    title: "Direct RTSP / Cloud-Only Setup Guide",
    titleHe: "מדריך חיבור ישיר RTSP / ענן בלבד",
    category: "setup_guides",
    fileType: "markdown",
    language: "both",
    contentEn: read("/home/ubuntu/AwareCam_Direct_RTSP_Setup_Guide_EN.md"),
    contentHe: read("/home/ubuntu/AwareCam_Direct_RTSP_Setup_Guide_HE.md"),
    accessRoles: "reseller,integrator,admin",
    sortOrder: 14,
  },
  {
    title: "Mobile App User Guide",
    titleHe: "מדריך אפליקציית המובייל",
    category: "setup_guides",
    fileType: "markdown",
    language: "both",
    contentEn: read("/home/ubuntu/AwareCam_Mobile_App_Guide_EN.md"),
    contentHe: read("/home/ubuntu/AwareCam_Mobile_App_Guide_HE.md"),
    accessRoles: "reseller,integrator,end_user,admin",
    sortOrder: 15,
  },

  // ── SALES TRAINING ────────────────────────────────────────────────────────
  {
    title: "Reseller & Integrator Guide",
    titleHe: "מדריך מפיצים ואינטגרטורים",
    category: "sales_training",
    fileType: "markdown",
    language: "both",
    contentEn: read("/home/ubuntu/AwareCam_Reseller_Documentation_EN.md"),
    contentHe: read("/home/ubuntu/AwareCam_Reseller_Documentation_HE.md"),
    accessRoles: "reseller,integrator,admin",
    sortOrder: 20,
  },

  // ── TECHNICAL REFERENCE ───────────────────────────────────────────────────
  {
    title: "Camera Compatibility & RTSP Reference",
    titleHe: "תאימות מצלמות ומדריך RTSP",
    category: "technical_reference",
    fileType: "markdown",
    language: "both",
    contentEn: read("/home/ubuntu/AwareCam_Camera_Compatibility_Reference_EN.md"),
    contentHe: read("/home/ubuntu/AwareCam_Camera_Compatibility_Reference_HE.md"),
    accessRoles: "reseller,integrator,admin",
    sortOrder: 30,
  },
  {
    title: "Network & Firewall Requirements",
    titleHe: "דרישות רשת וחומת אש",
    category: "technical_reference",
    fileType: "markdown",
    language: "both",
    contentEn: read("/home/ubuntu/AwareCam_Network_Firewall_Requirements_EN.md"),
    contentHe: read("/home/ubuntu/AwareCam_Network_Firewall_Requirements_HE.md"),
    accessRoles: "reseller,integrator,admin",
    sortOrder: 31,
  },
];

async function seed() {
  const conn = await createConnection(DB_URL);
  console.log("Connected to database.");

  // Clear existing documents
  await conn.execute("DELETE FROM documents");
  console.log("Cleared existing documents.");

  let inserted = 0;
  for (const doc of docs) {
    if (!doc.contentEn && !doc.fileUrlEn) {
      console.warn(`  ⚠ Skipping "${doc.title}" — no content found`);
      continue;
    }
    await conn.execute(
      `INSERT INTO documents
        (title, titleHe, category, fileType, language, contentEn, contentHe,
         fileUrlEn, fileUrlHe, accessRoles, sortOrder, isPublished, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW())`,
      [
        doc.title,
        doc.titleHe ?? null,
        doc.category,
        doc.fileType,
        doc.language,
        doc.contentEn ?? null,
        doc.contentHe ?? null,
        doc.fileUrlEn ?? null,
        doc.fileUrlHe ?? null,
        doc.accessRoles,
        doc.sortOrder,
      ]
    );
    console.log(`  ✓ Inserted: ${doc.title}`);
    inserted++;
  }

  await conn.end();
  console.log(`\nDone. ${inserted} documents seeded.`);
}

seed().catch((err) => { console.error(err); process.exit(1); });
