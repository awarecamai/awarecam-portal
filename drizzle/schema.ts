import { boolean, integer, pgEnum, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

// ─── Enums ────────────────────────────────────────────────────────────────────
export const roleEnum = pgEnum("role", ["user", "admin"]);
export const portalRoleEnum = pgEnum("portal_role", ["reseller", "integrator", "end_user", "admin"]);
export const preferredLanguageEnum = pgEnum("preferred_language", ["en", "he"]);
export const categoryEnum = pgEnum("category", ["legal", "setup_guides", "sales_training", "technical_reference"]);
export const fileTypeEnum = pgEnum("file_type", ["markdown", "pdf", "external"]);
export const languageEnum = pgEnum("language", ["en", "he", "both"]);
export const chatRoleEnum = pgEnum("chat_role", ["user", "assistant", "system"]);

// ─── Tables ───────────────────────────────────────────────────────────────────

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("open_id", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  // Auth fields
  passwordHash: varchar("password_hash", { length: 255 }), // null for Google-only accounts
  googleId: varchar("google_id", { length: 128 }),         // null for email/password accounts
  loginMethod: varchar("login_method", { length: 64 }),    // "email", "google", "manus"
  role: roleEnum("role").default("user").notNull(),
  // AwareCam-specific portal role
  portalRole: portalRoleEnum("portal_role").default("end_user").notNull(),
  preferredLanguage: preferredLanguageEnum("preferred_language").default("en").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  company: varchar("company", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  lastSignedIn: timestamp("last_signed_in").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  token: varchar("token", { length: 128 }).notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  usedAt: timestamp("used_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;

export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  titleHe: varchar("title_he", { length: 255 }),
  category: categoryEnum("category").notNull(),
  fileType: fileTypeEnum("file_type").notNull(),
  language: languageEnum("language").default("en").notNull(),
  // For markdown: store content directly. For PDF/external: store URL.
  contentEn: text("content_en"),
  contentHe: text("content_he"),
  fileUrlEn: varchar("file_url_en", { length: 1024 }),
  fileUrlHe: varchar("file_url_he", { length: 1024 }),
  // Which roles can access this document
  accessRoles: varchar("access_roles", { length: 255 }).default("reseller,integrator,end_user,admin").notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  isPublished: boolean("is_published").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Document = typeof documents.$inferSelect;
export type InsertDocument = typeof documents.$inferInsert;

export const accessLogs = pgTable("access_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  action: varchar("action", { length: 64 }).notNull(),
  resourceType: varchar("resource_type", { length: 64 }),
  resourceId: varchar("resource_id", { length: 255 }),
  resourceTitle: varchar("resource_title", { length: 255 }),
  metadata: text("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type AccessLog = typeof accessLogs.$inferSelect;
export type InsertAccessLog = typeof accessLogs.$inferInsert;

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  sessionId: varchar("session_id", { length: 64 }).notNull(),
  role: chatRoleEnum("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = typeof chatMessages.$inferInsert;
