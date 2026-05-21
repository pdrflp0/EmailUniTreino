/**
 * PROVEDOR — Rotas da API REST do microserviço de e-mail.
 *
 * POST   /api/emails          → envia um e-mail e registra no banco
 * GET    /api/emails          → lista todos os e-mails registrados
 * GET    /api/emails/stats    → retorna estatísticas (total, enviados, falhas)
 * GET    /api/emails/:id      → retorna um e-mail específico pelo ID
 * DELETE /api/emails/:id      → remove um registro do banco
 */

const express     = require("express");
const { v4: uuid} = require("uuid");
const router      = express.Router();
const db          = require("../database/db");
const { sendEmail } = require("../services/mailer");

// ── POST /api/emails ──────────────────────────────────────────────────────────
// Envia um e-mail e persiste o registro no banco.
router.post("/", async (req, res, next) => {
  try {
    const { to, subject, text, html } = req.body;

    // Validação mínima
    if (!to || !subject || (!text && !html)) {
      return res.status(400).json({
        error: "Campos obrigatórios: to, subject e text (ou html).",
      });
    }

    // Cria o registro no banco com status "pending"
    const record = db.insert({
      id:        uuid(),
      to,
      subject,
      text:      text || "",
      html:      html || "",
      status:    "pending",
      messageId: null,
      previewUrl:null,
      error:     null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Tenta enviar o e-mail
    const { messageId, previewUrl } = await sendEmail({ to, subject, text, html });

    // Atualiza o registro com sucesso
    const updated = db.updateStatus(record.id, "sent", { messageId, previewUrl });

    return res.status(201).json({
      message:    "E-mail enviado com sucesso.",
      email:      updated,
      previewUrl, // URL Ethereal para visualizar no browser
    });
  } catch (err) {
    // Mesmo com falha de envio, registra no banco como "failed"
    next(err);
  }
});

// ── GET /api/emails/stats ─────────────────────────────────────────────────────
router.get("/stats", (_req, res) => {
  res.json(db.stats());
});

// ── GET /api/emails ───────────────────────────────────────────────────────────
router.get("/", (_req, res) => {
  const emails = db.findAll();
  res.json({ total: emails.length, emails });
});

// ── GET /api/emails/:id ───────────────────────────────────────────────────────
router.get("/:id", (req, res) => {
  const email = db.findById(req.params.id);
  if (!email) return res.status(404).json({ error: "E-mail não encontrado." });
  res.json(email);
});

// ── DELETE /api/emails/:id ────────────────────────────────────────────────────
router.delete("/:id", (req, res) => {
  const removed = db.remove(req.params.id);
  if (!removed) return res.status(404).json({ error: "E-mail não encontrado." });
  res.json({ message: "Registro removido com sucesso." });
});

module.exports = router;
