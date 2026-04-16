import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerCustomAuthRoutes } from "./customAuth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // Custom auth: email/password with admin-only user creation
  registerCustomAuthRoutes(app);

  // ── Standalone login page override ──────────────────────────────────────────
  // The deployed static bundle may be stale. This server-side route serves a
  // fresh standalone login page that does NOT depend on the React bundle.
  // It calls /api/auth/login directly and redirects to /dashboard on success.
  app.get("/login", (_req, res) => {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");
    res.send(`<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AwareCam Partner Portal</title>
  <link rel="icon" type="image/png" href="/favicon.png" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Inter', sans-serif; background: #0a0f1e; color: #fff; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 1rem; }
    .wrap { width: 100%; max-width: 420px; }
    .logo-area { text-align: center; margin-bottom: 2rem; }
    .logo-area img { width: 52px; height: 52px; border-radius: 50%; object-fit: contain; }
    .logo-area p { color: #22d3ee; font-size: 0.8rem; margin-top: 0.5rem; letter-spacing: 0.05em; }
    .card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 1rem; padding: 2rem; }
    h1 { font-size: 1.25rem; font-weight: 600; margin-bottom: 0.25rem; }
    .sub { color: #94a3b8; font-size: 0.875rem; margin-bottom: 1.5rem; }
    .err { background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.4); color: #fca5a5; border-radius: 0.5rem; padding: 0.75rem 1rem; font-size: 0.875rem; margin-bottom: 1rem; display: none; }
    label { display: block; font-size: 0.875rem; color: #cbd5e1; margin-bottom: 0.375rem; }
    input { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.12); color: #fff; border-radius: 0.5rem; padding: 0.625rem 0.75rem; font-size: 0.875rem; outline: none; transition: border-color 0.15s; margin-bottom: 1rem; }
    input:focus { border-color: #22d3ee; }
    input::placeholder { color: #475569; }
    .forgot { display: block; text-align: right; color: #22d3ee; font-size: 0.75rem; text-decoration: none; margin-top: -0.75rem; margin-bottom: 1rem; }
    .forgot:hover { color: #67e8f9; }
    button { width: 100%; background: #06b6d4; color: #0a0f1e; font-weight: 700; border: none; border-radius: 0.5rem; padding: 0.7rem; font-size: 0.875rem; cursor: pointer; transition: background 0.15s; margin-top: 0.5rem; }
    button:hover { background: #22d3ee; }
    button:disabled { background: #164e63; color: #94a3b8; cursor: not-allowed; }
    .footer { text-align: center; color: #334155; font-size: 0.7rem; margin-top: 1.5rem; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="logo-area">
      <img src="https://cdn.manus.im/webdev/awarecamhub-7vq3kth4/1744574481-awarecam-logo.png" alt="AwareCam" onerror="this.style.display='none'" />
      <p>Partner Portal</p>
    </div>
    <div class="card">
      <h1>Sign in to your account</h1>
      <p class="sub">Enter your credentials to access the partner portal.</p>
      <div class="err" id="err"></div>
      <form id="loginForm">
        <label for="email">Email address</label>
        <input id="email" type="email" name="email" placeholder="you@company.com" autocomplete="email" required />
        <label for="password">Password</label>
        <input id="password" type="password" name="password" placeholder="••••••••" autocomplete="current-password" required />
        <a href="/forgot-password" class="forgot">Forgot password?</a>
        <button type="submit" id="btn">Sign in</button>
      </form>
    </div>
    <p class="footer">&copy; ${new Date().getFullYear()} AwareCam &middot; Partner Portal</p>
  </div>
  <script>
    document.getElementById('loginForm').addEventListener('submit', async function(e) {
      e.preventDefault();
      const btn = document.getElementById('btn');
      const errEl = document.getElementById('err');
      btn.disabled = true;
      btn.textContent = 'Signing in\u2026';
      errEl.style.display = 'none';
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            email: document.getElementById('email').value.trim(),
            password: document.getElementById('password').value
          })
        });
        const data = await res.json();
        if (res.ok) {
          window.location.href = '/dashboard';
        } else {
          errEl.textContent = data.error || 'Invalid email or password';
          errEl.style.display = 'block';
          btn.disabled = false;
          btn.textContent = 'Sign in';
        }
      } catch (err) {
        errEl.textContent = 'Network error. Please try again.';
        errEl.style.display = 'block';
        btn.disabled = false;
        btn.textContent = 'Sign in';
      }
    });
  </script>
</body>
</html>`);
  });
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
