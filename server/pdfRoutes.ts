/**
 * PDF Download Routes
 *
 * GET /api/documents/:id/pdf?lang=en|he
 *   — Generates a real PDF from the document's markdown content and streams it to the client
 *   — Requires a valid session cookie (same auth as tRPC)
 */
import type { Express, Request, Response } from "express";
import PDFDocument from "pdfkit";
import { getDocumentById } from "./db";
import { sdk } from "./_core/sdk";

async function getSessionUser(req: Request) {
  try {
    await sdk.authenticateRequest(req);
    return true;
  } catch {
    return null;
  }
}

// Strip markdown syntax to plain text for PDF
function markdownToPlainText(md: string): string {
  return md
    .replace(/^#{1,6}\s+/gm, "")          // headings
    .replace(/\*\*(.+?)\*\*/g, "$1")       // bold
    .replace(/\*(.+?)\*/g, "$1")           // italic
    .replace(/`(.+?)`/g, "$1")             // inline code
    .replace(/```[\s\S]*?```/g, "")        // code blocks
    .replace(/^\s*[-*+]\s+/gm, "• ")       // unordered lists
    .replace(/^\s*\d+\.\s+/gm, "")         // ordered lists
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // links → text only
    .replace(/^>\s+/gm, "")               // blockquotes
    .replace(/\|[^\n]+\|/g, "")           // tables (strip)
    .replace(/^[-=]{3,}$/gm, "")          // horizontal rules
    .replace(/\n{3,}/g, "\n\n")           // collapse blank lines
    .trim();
}

export function registerPdfRoutes(app: Express) {
  app.get("/api/documents/:id/pdf", async (req: Request, res: Response) => {
    // Auth check
    const user = await getSessionUser(req);
    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid document ID" });
      return;
    }

    const lang = (req.query.lang as string) === "he" ? "he" : "en";

    const doc = await getDocumentById(id);
    if (!doc) {
      res.status(404).json({ error: "Document not found" });
      return;
    }

    const title = lang === "he" && doc.titleHe ? doc.titleHe : doc.title;
    const rawContent = lang === "he" && doc.contentHe ? doc.contentHe : (doc.contentEn || doc.contentHe || "");
    const content = markdownToPlainText(rawContent);
    const isRtl = lang === "he";

    // Build PDF
    const pdfDoc = new PDFDocument({
      size: "A4",
      margins: { top: 60, bottom: 60, left: 60, right: 60 },
      info: {
        Title: title,
        Author: "AwareCam Partner Portal",
        Subject: doc.category.replace(/_/g, " "),
      },
    });

    const safeName = title.replace(/[^a-z0-9א-ת\s]/gi, "_").replace(/\s+/g, "_");
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${safeName}.pdf"`);

    pdfDoc.pipe(res);

    // ── Header bar ──────────────────────────────────────────────────────────
    pdfDoc
      .rect(0, 0, pdfDoc.page.width, 50)
      .fill("#0a0f1e");

    pdfDoc
      .fillColor("#06b6d4")
      .fontSize(16)
      .font("Helvetica-Bold")
      .text("AwareCam Partner Portal", 60, 16);

    pdfDoc
      .fillColor("#94a3b8")
      .fontSize(9)
      .font("Helvetica")
      .text(new Date().toLocaleDateString("en-GB"), pdfDoc.page.width - 120, 20);

    // ── Title ───────────────────────────────────────────────────────────────
    pdfDoc.moveDown(2);
    pdfDoc
      .fillColor("#0a0f1e")
      .fontSize(22)
      .font("Helvetica-Bold")
      .text(title, { align: isRtl ? "right" : "left" });

    pdfDoc
      .moveDown(0.3)
      .strokeColor("#06b6d4")
      .lineWidth(2)
      .moveTo(60, pdfDoc.y)
      .lineTo(pdfDoc.page.width - 60, pdfDoc.y)
      .stroke();

    pdfDoc.moveDown(1);

    // ── Body — parse markdown sections ──────────────────────────────────────
    const lines = rawContent.split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) {
        pdfDoc.moveDown(0.4);
        continue;
      }
      if (/^# (.+)/.test(trimmed)) {
        pdfDoc.moveDown(0.5)
          .fillColor("#0a0f1e")
          .fontSize(16)
          .font("Helvetica-Bold")
          .text(trimmed.replace(/^# /, ""), { align: isRtl ? "right" : "left" });
        pdfDoc.moveDown(0.3);
      } else if (/^## (.+)/.test(trimmed)) {
        pdfDoc.moveDown(0.5)
          .fillColor("#1e293b")
          .fontSize(13)
          .font("Helvetica-Bold")
          .text(trimmed.replace(/^## /, ""), { align: isRtl ? "right" : "left" });
        pdfDoc.moveDown(0.2);
      } else if (/^### (.+)/.test(trimmed)) {
        pdfDoc.moveDown(0.4)
          .fillColor("#334155")
          .fontSize(11)
          .font("Helvetica-Bold")
          .text(trimmed.replace(/^### /, ""), { align: isRtl ? "right" : "left" });
        pdfDoc.moveDown(0.2);
      } else if (/^\s*[-*+] (.+)/.test(line)) {
        const text = line.replace(/^\s*[-*+] /, "");
        const plain = text.replace(/\*\*(.+?)\*\*/g, "$1").replace(/\*(.+?)\*/g, "$1");
        pdfDoc
          .fillColor("#374151")
          .fontSize(10)
          .font("Helvetica")
          .text(`• ${plain}`, { indent: 15, align: isRtl ? "right" : "left" });
      } else if (/^\s*\d+\. (.+)/.test(line)) {
        const plain = trimmed.replace(/^\d+\. /, "").replace(/\*\*(.+?)\*\*/g, "$1");
        pdfDoc
          .fillColor("#374151")
          .fontSize(10)
          .font("Helvetica")
          .text(plain, { indent: 15, align: isRtl ? "right" : "left" });
      } else if (/^> (.+)/.test(trimmed)) {
        const text = trimmed.replace(/^> /, "");
        pdfDoc
          .rect(60, pdfDoc.y, 3, 14)
          .fill("#06b6d4");
        pdfDoc
          .fillColor("#475569")
          .fontSize(10)
          .font("Helvetica-Oblique")
          .text(text, 70, pdfDoc.y - 14, { align: isRtl ? "right" : "left" });
        pdfDoc.moveDown(0.3);
      } else if (/^[-=]{3,}$/.test(trimmed)) {
        pdfDoc.moveDown(0.3)
          .strokeColor("#e2e8f0")
          .lineWidth(0.5)
          .moveTo(60, pdfDoc.y)
          .lineTo(pdfDoc.page.width - 60, pdfDoc.y)
          .stroke();
        pdfDoc.moveDown(0.3);
      } else if (/^\|/.test(trimmed)) {
        // Skip table separator rows
        if (/^\|[-| :]+\|$/.test(trimmed)) continue;
        const cells = trimmed.split("|").filter(Boolean).map((c: string) => c.trim());
        const cellWidth = (pdfDoc.page.width - 120) / Math.max(cells.length, 1);
        let x = 60;
        pdfDoc.fontSize(9).font("Helvetica").fillColor("#374151");
        for (const cell of cells) {
          pdfDoc.text(cell, x, pdfDoc.y, { width: cellWidth - 4, align: "left" });
          x += cellWidth;
        }
        pdfDoc.moveDown(0.2);
      } else {
        // Normal paragraph text — strip inline markdown
        const plain = trimmed
          .replace(/\*\*(.+?)\*\*/g, "$1")
          .replace(/\*(.+?)\*/g, "$1")
          .replace(/`(.+?)`/g, "$1")
          .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
        pdfDoc
          .fillColor("#374151")
          .fontSize(10)
          .font("Helvetica")
          .text(plain, { align: isRtl ? "right" : "left" });
      }
    }

    // ── Footer ───────────────────────────────────────────────────────────────
    const pageCount = (pdfDoc as any)._pageBuffer?.length ?? 1;
    pdfDoc
      .fillColor("#94a3b8")
      .fontSize(8)
      .font("Helvetica")
      .text(
        `AwareCam Partner Portal — ${title} — Page 1 of ${pageCount}`,
        60,
        pdfDoc.page.height - 40,
        { align: "center" }
      );

    pdfDoc.end();
  });
}
