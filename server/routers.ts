import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  getUsers, getUserById, updateUserRole, updateUserStatus,
  getDocuments, getDocumentById,
  getAccessLogs, logAccess,
  getChatMessages, saveChatMessage, clearChatSession,
} from "./db";
import { invokeLLM } from "./_core/llm";
import { nanoid } from "nanoid";

// Admin guard middleware
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // User management
  users: router({
    list: adminProcedure.query(async () => {
      return await getUsers();
    }),
    updateRole: adminProcedure
      .input(z.object({
        userId: z.number(),
        portalRole: z.enum(["reseller", "integrator", "end_user", "admin"]),
      }))
      .mutation(async ({ input }) => {
        await updateUserRole(input.userId, input.portalRole);
        return { success: true };
      }),
    updateStatus: adminProcedure
      .input(z.object({ userId: z.number(), isActive: z.boolean() }))
      .mutation(async ({ input }) => {
        await updateUserStatus(input.userId, input.isActive);
        return { success: true };
      }),
    updateLanguage: protectedProcedure
      .input(z.object({ language: z.enum(["en", "he"]) }))
      .mutation(async ({ ctx, input }) => {
        const { updateUserLanguage } = await import("./db");
        await updateUserLanguage(ctx.user.id, input.language);
        return { success: true };
      }),
  }),

  // Document library
  documents: router({
    list: protectedProcedure
      .input(z.object({
        category: z.enum(["legal", "setup_guides", "sales_training", "technical_reference", "all"]).optional(),
        language: z.enum(["en", "he"]).optional(),
      }).optional())
      .query(async ({ ctx, input }) => {
        const portalRole = (ctx.user as any).portalRole || "end_user";
        return await getDocuments({ category: input?.category, portalRole });
      }),
    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await getDocumentById(input.id);
      }),
    logView: protectedProcedure
      .input(z.object({ documentId: z.number(), title: z.string() }))
      .mutation(async ({ ctx, input }) => {
        await logAccess({
          userId: ctx.user.id,
          action: "view_doc",
          resourceType: "document",
          resourceId: String(input.documentId),
          resourceTitle: input.title,
        });
        return { success: true };
      }),
  }),

  // Access logs
  activity: router({
    list: adminProcedure
      .input(z.object({ userId: z.number().optional(), limit: z.number().default(50) }))
      .query(async ({ input }) => {
        return await getAccessLogs(input.userId, input.limit);
      }),
  }),

  // AI Assistant chat
  chat: router({
    history: protectedProcedure
      .input(z.object({ sessionId: z.string() }))
      .query(async ({ ctx, input }) => {
        return await getChatMessages(ctx.user.id, input.sessionId);
      }),
    send: protectedProcedure
      .input(z.object({
        sessionId: z.string(),
        message: z.string().min(1).max(4000),
        language: z.enum(["en", "he"]).default("en"),
      }))
      .mutation(async ({ ctx, input }) => {
        const portalRole = (ctx.user as any).portalRole || "end_user";
        const history = await getChatMessages(ctx.user.id, input.sessionId);

        // Save user message
        await saveChatMessage({
          userId: ctx.user.id,
          sessionId: input.sessionId,
          role: "user",
          content: input.message,
        });

        // Build system prompt
        const systemPrompt = buildSystemPrompt(portalRole, input.language);

        // Build messages for LLM
        const messages = [
          { role: "system" as const, content: systemPrompt },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ...(history as any[]).slice(-20).map((m: { role: string; content: string }) => ({
            role: m.role as "user" | "assistant",
            content: m.content,
          })),
          { role: "user" as const, content: input.message },
        ];

        const response = await invokeLLM({ messages });
        const rawContent = response.choices[0]?.message?.content;
        const assistantContent = typeof rawContent === "string" ? rawContent : "I'm sorry, I couldn't generate a response.";

        // Save assistant message
        await saveChatMessage({
          userId: ctx.user.id,
          sessionId: input.sessionId,
          role: "assistant",
          content: assistantContent,
        });

        // Log activity
        await logAccess({
          userId: ctx.user.id,
          action: "chat_message",
          resourceType: "chat",
          resourceId: input.sessionId,
          resourceTitle: input.message.slice(0, 80),
        });

        return { content: assistantContent };
      }),
    newSession: protectedProcedure.mutation(() => {
      return { sessionId: nanoid(12) };
    }),
    clearSession: protectedProcedure
      .input(z.object({ sessionId: z.string() }))
      .mutation(async ({ ctx, input }) => {
        await clearChatSession(ctx.user.id, input.sessionId);
        return { success: true };
      }),
  }),
});

function buildSystemPrompt(portalRole: string, language: string): string {
  const lang = language === "he" ? "Hebrew" : "English";
  return `You are the AwareCam AI Assistant — a knowledgeable, professional support agent for the AwareCam partner portal. AwareCam is an AI-powered video intelligence platform that turns standard IP cameras into smart security systems using computer vision (YOLO11 models) running on edge devices.

RESPOND IN: ${lang}

YOUR ROLE: You assist ${portalRole === "admin" ? "administrators" : portalRole === "integrator" ? "integrators and technicians" : "resellers and partners"} with:

1. ONBOARDING & PRODUCT KNOWLEDGE
   - Explain AwareCam's platform: edge AI processing, cloud dashboard, mobile alerts
   - Describe deployment options: Raspberry Pi Kiosk, Intel N100 Mini-PC (30-40 cameras), Direct RTSP
   - Explain AI agents: Person Detection, Vehicle Detection, Fire/Smoke Detection, LPR (License Plate Recognition), Crowd Detection

2. CAMERA COMPATIBILITY
   - AwareCam works with any IP camera that supports RTSP streaming (H.264/H.265)
   - Supported brands: Dahua, Hikvision, Reolink, Axis, Uniview, Amcrest, Vivotek, Bosch, Hanwha, Sony
   - RTSP URL formats by brand (provide when asked)
   - Recommend using Sub Stream (640x480 or 720p, 10-15 FPS) for AI processing

3. SUBSCRIPTION PLANS & PRICING
   Plan tiers:
   - ESSENTIAL: Core AI detection (person, vehicle, fire/smoke), 30-day cloud storage, mobile alerts, standard support
   - PRO: All Essential features + LPR, crowd analytics, 120-day storage, priority support, API access
   
   Pricing (per camera/month):
   - Essential: $29/camera/month (partner price — 25% off retail), retail $39/camera/month
   - Pro: $44/camera/month (partner price — 25% off retail), retail $59/camera/month
   
   Add-ons:
   - LPR (License Plate Recognition): +$11/camera/month partner price, retail +$15/camera/month (Pro plan only)
   - Extended Storage (360 days): +$7.50/camera/month partner price, retail +$10/camera/month
   
   Important: Pricing is indicative and not yet finalized. For confirmed pricing, direct partners to contact sales@awarecam.com.

4. QUOTE GENERATION
   When asked for a quote, gather: camera count, plan tier (Essential or Pro), add-ons (LPR, extended storage), and storage duration.
   
   Format quotes as:
   ## Custom Quote — AwareCam [Plan] Plan
   | Item | Cameras | Unit Price | Monthly Total |
   |------|---------|------------|---------------|
   | [Plan] Plan | [count] | $[price]/cam | $[total] |
   | [Add-on] | [count] | $[price]/cam | $[total] |
   **Partner Monthly Total: $[total]**
   **Retail Monthly Total: $[total] (at 25% margin)**
   **Annual Contract Value (partner): $[total]**
   *Note: Final pricing subject to confirmation with sales@awarecam.com*

5. INSTALLATION GUIDANCE
   - Walk through kiosk setup, Windows edge device setup, or direct RTSP configuration
   - Help troubleshoot connectivity issues, RTSP stream problems, VPN connection issues

TONE: Professional, concise, helpful. Use markdown formatting for structured responses. Never fabricate pricing or specs not listed above. If unsure, say so and suggest contacting support@awarecam.com.`;
}

export type AppRouter = typeof appRouter;
