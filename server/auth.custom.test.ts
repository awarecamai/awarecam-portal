import { describe, it, expect } from "vitest";

/**
 * Validates that the custom auth endpoints are correctly configured.
 * Tests: seed-admin endpoint rejects missing/wrong token (403),
 *        login endpoint rejects missing credentials (400),
 *        forgot-password endpoint rejects missing email (400).
 */
describe("Custom Auth Endpoints", () => {
  const BASE = "http://localhost:3000";

  it("seed-admin: rejects request with no token (403)", async () => {
    const res = await fetch(`${BASE}/api/auth/seed-admin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@test.com", password: "password123" }),
    });
    expect(res.status).toBe(403);
  });

  it("seed-admin: rejects request with wrong token (403)", async () => {
    const res = await fetch(`${BASE}/api/auth/seed-admin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@test.com", password: "password123", token: "wrong-token" }),
    });
    expect(res.status).toBe(403);
  });

  it("login: rejects missing credentials (400)", async () => {
    const res = await fetch(`${BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(400);
  });

  it("login: rejects wrong credentials (401)", async () => {
    const res = await fetch(`${BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "nobody@nowhere.com", password: "wrongpassword" }),
    });
    expect(res.status).toBe(401);
  });

  it("forgot-password: rejects missing email (400)", async () => {
    const res = await fetch(`${BASE}/api/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(400);
  });

  it("forgot-password: returns success for unknown email (anti-enumeration)", async () => {
    const res = await fetch(`${BASE}/api/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "nobody@nowhere.com" }),
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
  });
});
