/**
 * Custom authentication routes:
 *  - POST /api/auth/register    — email + password registration
 *  - POST /api/auth/login       — email + password login
 *  - GET  /api/auth/google      — redirect to Google OAuth
 *  - GET  /api/auth/google/callback — Google OAuth callback
 *
 * Sessions are issued as JWT cookies identical to the existing Manus flow,
 * so all existing tRPC procedures and useAuth() hooks work without changes.
 */

import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import bcrypt from "bcryptjs";
import type { Express, Request, Response } from "express";
import { nanoid } from "nanoid";
import { ENV } from "./env";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";
import * as db from "../db";

// ─── Google OAuth via passport-google-oauth20 ────────────────────────────────

async function getGoogleOAuthUrl(redirectBase: string): Promise<string> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = `${redirectBase}/api/auth/google/callback`;
  const scope = encodeURIComponent("openid email profile");
  const state = Buffer.from(redirectBase).toString("base64");
  return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&state=${state}&access_type=offline&prompt=select_account`;
}

async function exchangeGoogleCode(code: string, redirectUri: string) {
  const clientId = process.env.GOOGLE_CLIENT_ID!;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenRes.ok) {
    const err = await tokenRes.text();
    throw new Error(`Google token exchange failed: ${err}`);
  }

  const tokens = await tokenRes.json() as { access_token: string; id_token: string };

  // Decode id_token to get user info (no signature verification needed — we just exchanged the code)
  const [, payloadB64] = tokens.id_token.split(".");
  const payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8")) as {
    sub: string;
    email: string;
    name: string;
    picture?: string;
  };

  return payload;
}

// ─── Session helpers ──────────────────────────────────────────────────────────

async function issueSession(req: Request, res: Response, openId: string, name: string) {
  const sessionToken = await sdk.createSessionToken(openId, { name, expiresInMs: ONE_YEAR_MS });
  const cookieOptions = getSessionCookieOptions(req);
  res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
}

// ─── Route registration ───────────────────────────────────────────────────────

export function registerCustomAuthRoutes(app: Express) {

  // ── Register (email + password) ──────────────────────────────────────────
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const { email, password, name } = req.body as { email?: string; password?: string; name?: string };

      if (!email || !password || !name) {
        res.status(400).json({ error: "name, email, and password are required" });
        return;
      }
      if (password.length < 8) {
        res.status(400).json({ error: "Password must be at least 8 characters" });
        return;
      }

      const existing = await db.getUserByEmail(email.toLowerCase().trim());
      if (existing) {
        res.status(409).json({ error: "An account with this email already exists" });
        return;
      }

      const passwordHash = await bcrypt.hash(password, 12);
      const openId = `email_${nanoid(24)}`;

      await db.upsertUser({
        openId,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        passwordHash,
        loginMethod: "email",
        lastSignedIn: new Date(),
      } as any);

      await issueSession(req, res, openId, name.trim());
      res.json({ success: true });
    } catch (err) {
      console.error("[Auth] Register failed:", err);
      res.status(500).json({ error: "Registration failed" });
    }
  });

  // ── Login (email + password) ─────────────────────────────────────────────
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body as { email?: string; password?: string };

      if (!email || !password) {
        res.status(400).json({ error: "email and password are required" });
        return;
      }

      const user = await db.getUserByEmail(email.toLowerCase().trim());
      if (!user) {
        res.status(401).json({ error: "Invalid email or password" });
        return;
      }

      if (!user.isActive) {
        res.status(403).json({ error: "Your account has been deactivated. Contact support." });
        return;
      }

      const passwordHash = (user as any).passwordHash;
      if (!passwordHash) {
        // Account exists but was created via Google — no password set
        res.status(401).json({ error: "This account uses Google Sign-In. Please use the 'Sign in with Google' button." });
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
      res.status(500).json({ error: "Login failed" });
    }
  });

  // ── Google OAuth — initiate ───────────────────────────────────────────────
  app.get("/api/auth/google", async (req: Request, res: Response) => {
    try {
      // Determine the base URL: prefer origin from query param (sent by frontend), else derive from request
      const origin = (req.query.origin as string) || `${req.protocol}://${req.get("host")}`;
      const url = await getGoogleOAuthUrl(origin);
      res.redirect(302, url);
    } catch (err) {
      console.error("[Auth] Google initiate failed:", err);
      res.status(500).json({ error: "Failed to initiate Google sign-in" });
    }
  });

  // ── Google OAuth — callback ───────────────────────────────────────────────
  app.get("/api/auth/google/callback", async (req: Request, res: Response) => {
    try {
      const code = req.query.code as string;
      const state = req.query.state as string;

      if (!code) {
        res.status(400).json({ error: "Missing code from Google" });
        return;
      }

      // Decode the base64 state to get the origin/redirectBase
      let redirectBase: string;
      try {
        redirectBase = Buffer.from(state, "base64").toString("utf8");
        // Validate it looks like a URL
        new URL(redirectBase);
      } catch {
        redirectBase = `${req.protocol}://${req.get("host")}`;
      }

      const redirectUri = `${redirectBase}/api/auth/google/callback`;
      const googleUser = await exchangeGoogleCode(code, redirectUri);

      // Find or create user
      let user = await db.getUserByGoogleId(googleUser.sub);
      if (!user) {
        // Try by email (account may have been created with email/password first)
        user = await db.getUserByEmail(googleUser.email.toLowerCase());
      }

      if (user) {
        // Update googleId if not set
        if (!(user as any).googleId) {
          await db.upsertUser({
            openId: user.openId,
            googleId: googleUser.sub,
            loginMethod: "google",
            lastSignedIn: new Date(),
          } as any);
        } else {
          await db.upsertUser({ openId: user.openId, lastSignedIn: new Date() } as any);
        }
      } else {
        // New user via Google
        const openId = `google_${nanoid(24)}`;
        await db.upsertUser({
          openId,
          name: googleUser.name,
          email: googleUser.email.toLowerCase(),
          googleId: googleUser.sub,
          loginMethod: "google",
          lastSignedIn: new Date(),
        } as any);
        user = await db.getUserByGoogleId(googleUser.sub);
      }

      if (!user) {
        res.status(500).json({ error: "Failed to create user account" });
        return;
      }

      if (!user.isActive) {
        res.redirect(302, `${redirectBase}/?error=deactivated`);
        return;
      }

      await issueSession(req, res, user.openId, user.name || googleUser.name);
      res.redirect(302, `${redirectBase}/dashboard`);
    } catch (err) {
      console.error("[Auth] Google callback failed:", err);
      res.status(500).json({ error: "Google sign-in failed" });
    }
  });
}
