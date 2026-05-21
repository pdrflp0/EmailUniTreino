require("dotenv").config();
const express    = require("express");
const cors       = require("cors");
const path       = require("path");
const emailRoutes    = require("./src/routes/emails");
const errorHandler   = require("./src/middlewares/errorHandler");
const { initMailer } = require("./src/services/mailer");

const app  = express();
const PORT = process.env.PORT || 3001;

// ── Middlewares ──────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Consumidor: serve o frontend estático ────────────────────────────────────
app.use(express.static(path.join(__dirname, "public")));

// ── Provedor: rotas da API REST ───────────────────────────────────────────────
app.use("/api/emails", emailRoutes);

// ── Health check ─────────────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "email-microservice", timestamp: new Date() });
});

// ── Handler de erros ─────────────────────────────────────────────────────────
app.use(errorHandler);

// ── Inicializa o mailer (cria conta Ethereal) e sobe o servidor ───────────────
initMailer().then(() => {
  app.listen(PORT, () => {
    console.log(`\n✅  Email Microservice rodando em http://localhost:${PORT}`);
    console.log(`📬  Interface web:   http://localhost:${PORT}`);
    console.log(`🔌  API REST:        http://localhost:${PORT}/api/emails`);
    console.log(`💊  Health check:    http://localhost:${PORT}/api/health\n`);
  });
});
