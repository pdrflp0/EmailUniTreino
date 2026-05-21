/**
 * Banco de dados do microserviço de e-mail.
 * Utiliza um arquivo JSON local como persistência leve.
 * Cada registro representa um e-mail enviado ou com falha.
 */

const fs   = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "emails.json");

// Garante que o arquivo existe ao iniciar
if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify({ emails: [] }, null, 2));
}

function readDB() {
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(raw);
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// ── Operações CRUD ────────────────────────────────────────────────────────────

function findAll() {
  const db = readDB();
  return db.emails.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function findById(id) {
  const db = readDB();
  return db.emails.find((e) => e.id === id) || null;
}

function insert(email) {
  const db = readDB();
  db.emails.push(email);
  writeDB(db);
  return email;
}

function updateStatus(id, status, extra = {}) {
  const db = readDB();
  const idx = db.emails.findIndex((e) => e.id === id);
  if (idx === -1) return null;
  db.emails[idx] = { ...db.emails[idx], status, ...extra, updatedAt: new Date().toISOString() };
  writeDB(db);
  return db.emails[idx];
}

function remove(id) {
  const db = readDB();
  const before = db.emails.length;
  db.emails = db.emails.filter((e) => e.id !== id);
  writeDB(db);
  return db.emails.length < before;
}

function stats() {
  const db  = readDB();
  const all = db.emails;
  return {
    total:  all.length,
    sent:   all.filter((e) => e.status === "sent").length,
    failed: all.filter((e) => e.status === "failed").length,
    pending:all.filter((e) => e.status === "pending").length,
  };
}

module.exports = { findAll, findById, insert, updateStatus, remove, stats };
