import { and, desc, eq, like, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { accessLogs, chatMessages, documents, users, passwordResetTokens, InsertUser, InsertAccessLog, InsertChatMessage } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ─── Users ───────────────────────────────────────────────────────────────────

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }

  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};

  const textFields = ["name", "email", "loginMethod", "passwordHash", "googleId"] as const;
  for (const field of textFields) {
    const value = (user as any)[field];
    if (value === undefined) continue;
    const normalized = value ?? null;
    (values as any)[field] = normalized;
    updateSet[field] = normalized;
  }

  if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
  if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
  else if (user.openId === ENV.ownerOpenId) { values.role = "admin"; updateSet.role = "admin"; }

  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();

  // Auto-promote owner to admin portal role
  if (user.openId === ENV.ownerOpenId) {
    values.portalRole = "admin";
    updateSet.portalRole = "admin";
  }

  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserByGoogleId(googleId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.googleId, googleId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUsers() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(users).orderBy(desc(users.createdAt));
}

export async function updateUserRole(userId: number, portalRole: "reseller" | "integrator" | "end_user" | "admin") {
  const db = await getDb();
  if (!db) return;
  const roleMap = { admin: "admin" as const, reseller: "user" as const, integrator: "user" as const, end_user: "user" as const };
  await db.update(users).set({ portalRole, role: roleMap[portalRole] }).where(eq(users.id, userId));
}

export async function updateUserStatus(userId: number, isActive: boolean) {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set({ isActive }).where(eq(users.id, userId));
}

export async function updateUserLanguage(userId: number, preferredLanguage: "en" | "he") {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set({ preferredLanguage }).where(eq(users.id, userId));
}

// ─── Password Reset Tokens ────────────────────────────────────────────────────

export async function createPasswordResetToken(userId: number, token: string, expiresAt: Date) {
  const db = await getDb();
  if (!db) return;
  await db.insert(passwordResetTokens).values({ userId, token, expiresAt });
}

export async function getPasswordResetToken(token: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(passwordResetTokens).where(eq(passwordResetTokens.token, token)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function markPasswordResetTokenUsed(token: string) {
  const db = await getDb();
  if (!db) return;
  await db.update(passwordResetTokens).set({ usedAt: new Date() }).where(eq(passwordResetTokens.token, token));
}

// ─── Documents ───────────────────────────────────────────────────────────────

export async function getDocuments(opts: {
  category?: string;
  portalRole?: string;
}) {
  const db = await getDb();
  if (!db) return [];

  let query = db.select().from(documents).$dynamic();

  if (opts.category && opts.category !== "all") {
    query = query.where(
      and(
        eq(documents.category, opts.category as any),
        eq(documents.isPublished, true)
      )
    );
  } else {
    query = query.where(eq(documents.isPublished, true));
  }

  const results = await query.orderBy(documents.sortOrder, documents.title);

  // Filter by access role
  if (opts.portalRole) {
    return results.filter((doc) => {
      const roles = doc.accessRoles.split(",").map((r) => r.trim());
      return roles.includes(opts.portalRole!);
    });
  }

  return results;
}

export async function getDocumentById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(documents).where(eq(documents.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function upsertDocument(doc: typeof documents.$inferInsert) {
  const db = await getDb();
  if (!db) return;
  await db.insert(documents).values(doc).onDuplicateKeyUpdate({ set: doc });
}

// ─── Access Logs ─────────────────────────────────────────────────────────────

export async function logAccess(entry: Omit<InsertAccessLog, "id" | "createdAt">) {
  const db = await getDb();
  if (!db) return;
  await db.insert(accessLogs).values(entry);
}

export async function getAccessLogs(userId?: number, limit = 50) {
  const db = await getDb();
  if (!db) return [];
  let query = db.select().from(accessLogs).$dynamic();
  if (userId) query = query.where(eq(accessLogs.userId, userId));
  return await query.orderBy(desc(accessLogs.createdAt)).limit(limit);
}

// ─── Chat Messages ────────────────────────────────────────────────────────────

export async function getChatMessages(userId: number, sessionId: string) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(chatMessages)
    .where(and(eq(chatMessages.userId, userId), eq(chatMessages.sessionId, sessionId)))
    .orderBy(chatMessages.createdAt);
}

export async function saveChatMessage(msg: Omit<InsertChatMessage, "id" | "createdAt">) {
  const db = await getDb();
  if (!db) return;
  await db.insert(chatMessages).values(msg);
}

export async function clearChatSession(userId: number, sessionId: string) {
  const db = await getDb();
  if (!db) return;
  const { sql } = await import("drizzle-orm");
  await db.delete(chatMessages).where(
    and(eq(chatMessages.userId, userId), eq(chatMessages.sessionId, sessionId))
  );
}
