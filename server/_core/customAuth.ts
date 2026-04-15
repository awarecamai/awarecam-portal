/**
 * AwareCam Custom Authentication Routes
 *
 * POST /api/auth/login           — email + password login
 * POST /api/auth/logout          — clear session cookie
 * POST /api/auth/forgot-password — send password reset email via Resend
 * POST /api/auth/reset-password  — validate token + set new password
 * POST /api/auth/seed-admin      — one-time bootstrap: create first admin account
 *
 * Admin-only user management is handled via tRPC procedures in routers.ts.
 * No self-registration. No Google/Manus OAuth.
 */

import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import bcrypt from "bcryptjs";
import type { Express, Request, Response } from "express";
import { nanoid } from "nanoid";
import { Resend } from "resend";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";
import * as db from "../db";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = "AwareCam <noreply@awarecam.com>";
const RESET_TOKEN_EXPIRES_MS = 60 * 60 * 1000; // 1 hour

// ─── Session helper ───────────────────────────────────────────────────────────

async function issueSession(req: Request, res: Response, openId: string, name: string) {
  const sessionToken = await sdk.createSessionToken(openId, { name, expiresInMs: ONE_YEAR_MS });
  const cookieOptions = getSessionCookieOptions(req);
  res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
}

// ─── Route registration ───────────────────────────────────────────────────────

export function registerCustomAuthRoutes(app: Express) {

  // ── Login ────────────────────────────────────────────────────────────────
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body as { email?: string; password?: string };

      if (!email || !password) {
        res.status(400).json({ error: "Email and password are required" });
        return;
      }

      const user = await db.getUserByEmail(email.toLowerCase().trim());
      if (!user) {
        res.status(401).json({ error: "Invalid email or password" });
        return;
      }

      if (!user.isActive) {
        res.status(403).json({ error: "Your account has been deactivated. Contact support@awarecam.com." });
        return;
      }

      const passwordHash = (user as any).passwordHash;
      if (!passwordHash) {
        res.status(401).json({ error: "Invalid email or password" });
        return;
      }

      const valid = await bcrypt.compare(password, passwordHash);
      if (!valid) {
        res.status(401).json({ error: "Invalid email or password" });
        return;
      }

      await db.upsertUser({ openId: user.openId, lastSignedIn: new Date() } as any);
      await issueSession(req, res, user.openId, user.name || "");
      res.json({ success: true });
    } catch (err) {
      console.error("[Auth] Login failed:", err);
      res.status(500).json({ error: "Login failed. Please try again." });
    }
  });

  // ── Logout ───────────────────────────────────────────────────────────────
  app.post("/api/auth/logout", (req: Request, res: Response) => {
    const cookieOptions = getSessionCookieOptions(req);
    res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
    res.json({ success: true });
  });

  // ── Forgot Password ──────────────────────────────────────────────────────
  app.post("/api/auth/forgot-password", async (req: Request, res: Response) => {
    try {
      const { email } = req.body as { email?: string };

      if (!email) {
        res.status(400).json({ error: "Email is required" });
        return;
      }

      // Always return success to prevent email enumeration
      const user = await db.getUserByEmail(email.toLowerCase().trim());
      if (!user || !user.isActive) {
        res.json({ success: true, message: "If that email exists, a reset link has been sent." });
        return;
      }

      const token = nanoid(48);
      const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRES_MS);
      await db.createPasswordResetToken(user.id, token, expiresAt);

      // Determine the base URL from the request origin header or host
      const origin = req.headers.origin || `${req.protocol}://${req.get("host")}`;
      const resetUrl = `${origin}/reset-password?token=${token}`;

      await resend.emails.send({
        from: FROM_EMAIL,
        to: user.email!,
        subject: "Reset your AwareCam password",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #0f172a; color: #f1f5f9; border-radius: 12px;">
            <div style="margin-bottom: 24px;">
              <span style="font-size: 20px; font-weight: bold; color: #22d3ee;">AwareCam</span>
              <span style="font-size: 14px; color: #94a3b8; margin-left: 8px;">Partner Portal</span>
            </div>
            <h2 style="color: #f1f5f9; margin-bottom: 8px;">Reset your password</h2>
            <p style="color: #94a3b8; margin-bottom: 24px;">
              We received a request to reset the password for your AwareCam account (<strong style="color: #f1f5f9;">${user.email}</strong>).
              Click the button below to set a new password. This link expires in 1 hour.
            </p>
            <a href="${resetUrl}" style="display: inline-block; background: #22d3ee; color: #0f172a; font-weight: bold; padding: 12px 28px; border-radius: 8px; text-decoration: none; margin-bottom: 24px;">
              Reset Password
            </a>
            <p style="color: #64748b; font-size: 13px;">
              If you didn't request this, you can safely ignore this email. Your password won't change.
            </p>
            <hr style="border: none; border-top: 1px solid #1e293b; margin: 24px 0;" />
            <p style="color: #64748b; font-size: 12px;">AwareCam Partner Portal &bull; support@awarecam.com</p>
          </div>
        `,
      });

      res.json({ success: true, message: "If that email exists, a reset link has been sent." });
    } catch (err) {
      console.error("[Auth] Forgot password failed:", err);
      res.status(500).json({ error: "Failed to send reset email. Please try again." });
    }
  });

  // ── Reset Password ───────────────────────────────────────────────────────
  app.post("/api/auth/reset-password", async (req: Request, res: Response) => {
    try {
      const { token, password } = req.body as { token?: string; password?: string };

      if (!token || !password) {
        res.status(400).json({ error: "Token and new password are required" });
        return;
      }

      if (password.length < 8) {
        res.status(400).json({ error: "Password must be at least 8 characters" });
        return;
      }

      const resetToken = await db.getPasswordResetToken(token);
      if (!resetToken) {
        res.status(400).json({ error: "Invalid or expired reset link. Please request a new one." });
        return;
      }

      if (resetToken.usedAt) {
        res.status(400).json({ error: "This reset link has already been used. Please request a new one." });
        return;
      }

      if (new Date() > resetToken.expiresAt) {
        res.status(400).json({ error: "This reset link has expired. Please request a new one." });
        return;
      }

      const passwordHash = await bcrypt.hash(password, 12);
      await db.updateUserPassword(resetToken.userId, passwordHash);
      await db.markPasswordResetTokenUsed(token);

      res.json({ success: true, message: "Password updated successfully. You can now log in." });
    } catch (err) {
      console.error("[Auth] Reset password failed:", err);
      res.status(500).json({ error: "Failed to reset password. Please try again." });
    }
  });

  // ── Seed Admin (one-time bootstrap) ─────────────────────────────────────
  // Creates the first admin account. Protected by ADMIN_SEED_TOKEN env var.
  // After the first admin is created, use the admin panel to create additional users.
  app.post("/api/auth/seed-admin", async (req: Request, res: Response) => {
    try {
      const { email, password, name, token } = req.body as {
        email?: string; password?: string; name?: string; token?: string;
      };

      const seedToken = process.env.ADMIN_SEED_TOKEN;
      if (!seedToken || !token || token !== seedToken) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }

      if (!email || !password) {
        res.status(400).json({ error: "email and password are required" });
        return;
      }

      if (password.length < 8) {
        res.status(400).json({ error: "Password must be at least 8 characters" });
        return;
      }

      const normalizedEmail = email.toLowerCase().trim();
      let user = await db.getUserByEmail(normalizedEmail);

      if (!user) {
        const passwordHash = await bcrypt.hash(password, 12);
        const openId = `admin_${nanoid(24)}`;
        await db.upsertUser({
          openId,
          name: (name || normalizedEmail.split("@")[0]).trim(),
          email: normalizedEmail,
          loginMethod: "email",
          passwordHash,
          role: "admin",
          portalRole: "admin",
          isActive: true,
          lastSignedIn: new Date(),
        });
        user = await db.getUserByEmail(normalizedEmail);
      } else {
        // Update password and promote to admin
        const passwordHash = await bcrypt.hash(password, 12);
        await db.updateUserPassword(user.id, passwordHash);
        await db.updateUserRole(user.id, "admin");
      }

      if (!user) {
        res.status(500).json({ error: "Failed to create admin account" });
        return;
      }

      res.json({ success: true, message: `Admin account created for ${normalizedEmail}. You can now log in.` });
    } catch (err) {
      console.error("[Auth] Seed admin failed:", err);
      res.status(500).json({ error: "Failed to create admin account" });
    }
  });
}
