# 📬 Email Microservice

Microserviço de envio e gerenciamento de e-mails desenvolvido para a disciplina de **Arquitetura de Sistemas — UNIFOR**.

## Como executar

```bash
# 1. Instale as dependências
npm install

# 2. Copie o arquivo de variáveis de ambiente
cp .env.example .env

# 3. Inicie o servidor
npm start
```

Acesse: **http://localhost:3001**

## API — Endpoints (Provedor)

| Método   | Rota                  | Descrição                         | Auth |
|----------|-----------------------|-----------------------------------|------|
| `POST`   | `/api/emails`         | Envia um e-mail                   | Não  |
| `GET`    | `/api/emails`         | Lista todos os e-mails            | Não  |
| `GET`    | `/api/emails/stats`   | Estatísticas (total, enviados...) | Não  |
| `GET`    | `/api/emails/:id`     | Detalhe de um e-mail              | Não  |
| `DELETE` | `/api/emails/:id`     | Remove um registro                | Não  |
| `GET`    | `/api/health`         | Health check do serviço           | Não  |

## 📦 Tecnologias

- **Node.js + Express** — servidor e API REST
- **Nodemailer + Ethereal** — envio de e-mails com preview no browser
- **JSON file** — banco de dados local leve
