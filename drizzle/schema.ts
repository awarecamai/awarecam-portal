import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  // AwareCam-specific portal role
  portalRole: mysqlEnum("portalRole", ["reseller", "integrator", "end_user", "admin"]).default("end_user").notNull(),
  preferredLanguage: mysqlEnum("preferredLanguage", ["en", "he"]).default("en").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  company: varchar("company", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const documents = mysqlTable("documents", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  titleHe: varchar("titleHe", { length: 255 }),
  category: mysqlEnum("category", ["legal", "setup_guides", "sales_training", "technical_reference"]).notNull(),
  fileType: mysqlEnum("fileType", ["markdown", "pdf", "external"]).notNull(),
  language: mysqlEnum("language", ["en", "he", "both"]).default("en").notNull(),
  // For markdown: store content directly. For PDF/external: store URL.
  contentEn: text("contentEn"),
  contentHe: text("contentHe"),
  fileUrlEn: varchar("fileUrlEn", { length: 1024 }),
  fileUrlHe: varchar("fileUrlHe", { length: 1024 }),
  // Which roles can access this document
  accessRoles: varchar("accessRoles", { length: 255 }).default("reseller,integrator,end_user,admin").notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  isPublished: boolean("isPublished").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Document = typeof documents.$inferSelect;
export type InsertDocument = typeof documents.$inferInsert;

export const accessLogs = mysqlTable("access_logs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  action: varchar("action", { length: 64 }).notNull(), // e.g. "view_doc", "download_doc", "chat_message"
  resourceType: varchar("resourceType", { length: 64 }), // e.g. "document", "guide", "chat"
  resourceId: varchar("resourceId", { length: 255 }),
  resourceTitle: varchar("resourceTitle", { length: 255 }),
  metadata: text("metadata"), // JSON string for extra context
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AccessLog = typeof accessLogs.$inferSelect;
export type InsertAccessLog = typeof accessLogs.$inferInsert;

export const chatMessages = mysqlTable("chat_messages", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  sessionId: varchar("sessionId", { length: 64 }).notNull(),
  role: mysqlEnum("role", ["user", "assistant", "system"]).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = typeof chatMessages.$inferInsert;
