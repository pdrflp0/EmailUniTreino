/**
 * Serviço de envio de e-mail usando Nodemailer.
 *
 * Em desenvolvimento usa o Ethereal (https://ethereal.email):
 *   → cria uma conta de teste automaticamente sem precisar cadastro.
 *   → gera uma URL de preview para visualizar o e-mail enviado no navegador.
 *
 * Em produção basta trocar as variáveis no .env para um SMTP real
 * (Gmail, SendGrid, Resend, etc.).
 */

const nodemailer = require("nodemailer");

let transporter = null;
let testAccount = null;

async function initMailer() {
  // Se .env tiver SMTP configurado, usa ele; senão cria conta Ethereal de teste
  if (process.env.SMTP_HOST) {
    transporter = nodemailer.createTransport({
      host:   process.env.SMTP_HOST,
      port:   Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    console.log("📧  Mailer configurado via SMTP do .env");
  } else {
    testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host:   "smtp.ethereal.email",
      port:   587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log("📧  Mailer configurado com conta Ethereal de teste");
    console.log(`    Usuário : ${testAccount.user}`);
    console.log(`    Senha   : ${testAccount.pass}`);
    console.log(`    Preview : https://ethereal.email/messages\n`);
  }
}

/**
 * Envia um e-mail e retorna { messageId, previewUrl }.
 * @param {object} options - { to, subject, text, html }
 */
async function sendEmail({ to, subject, text, html }) {
  if (!transporter) throw new Error("Mailer não inicializado. Chame initMailer() primeiro.");

  const from = process.env.EMAIL_FROM || (testAccount ? testAccount.user : "noreply@email-ms.local");

  const info = await transporter.sendMail({ from, to, subject, text, html });

  // Ethereal gera URL de preview para visualizar o e-mail no browser
  const previewUrl = nodemailer.getTestMessageUrl(info) || null;

  return { messageId: info.messageId, previewUrl };
}

module.exports = { initMailer, sendEmail };
