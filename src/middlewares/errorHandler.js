/**
 * Middleware global de tratamento de erros.
 * Garante que qualquer erro não tratado retorne JSON padronizado.
 */
function errorHandler(err, req, res, _next) {
  console.error(`[ERROR] ${req.method} ${req.path} →`, err.message);
  res.status(err.status || 500).json({
    error:   err.message || "Erro interno no servidor.",
    service: "email-microservice",
  });
}

module.exports = errorHandler;
