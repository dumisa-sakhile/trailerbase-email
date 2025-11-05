# Trailerbase Email Service

A small API that sends welcome emails for TrailerBase using the Resend email service.

## Table of contents
- Project overview
- Prerequisites
- Installation
- Environment variables
- Run (development & production)
- API endpoints
- Examples
- Deployment
- Troubleshooting


## Project overview

This repository contains a lightweight Express.js API that uses the Resend SDK to send welcome emails for TrailerBase users. The service exposes a single email endpoint and a couple of health checks.

Key files:
- `server.js` – main Express server and middleware (CORS, rate limiting, helmet, morgan).
- `routes/emailRoutes.js` – email sending route (POST `/email/api/send-email`).


## Prerequisites

- Node.js 18+ (or any Node version compatible with the packages listed in `package.json`)
- An API key for Resend (set as `RESEND_API_KEY` in your environment)


## Installation

1. Clone the repository.
2. Install dependencies:

```powershell
npm install
```


## Environment variables

Create a `.env` file in the project root or provide environment variables by your chosen method. At minimum provide:

- `RESEND_API_KEY` – required. If this is missing the server will exit on startup.
- `PORT` – optional (default: `3000`).

Example `.env`:

```
RESEND_API_KEY=your_resend_api_key_here
PORT=3000
```


## Run

- Development (auto-restart on changes):

```powershell
npm run dev
```

- Production / simple start:

```powershell
npm start
```


## API endpoints

- Health checks
  - `GET /` – returns a small JSON message confirming the API is running.
  - `GET /health` – returns `status: OK` and uptime.

- Send welcome email
  - `POST /email/api/send-email`
  - Required body (JSON):
    - `to` (string) – recipient email address
    - `userName` (string) – recipient or display name used inside the message
    - `from` (string, optional) – defaults to `welcome@api.trailerbase.tech` and the server rejects any other `from` value for safety

  - Responses:
    - `200` – email sent successfully (Resend response included)
    - `400` – bad request / validation failure
    - `5xx` – server or Resend error


## Examples

Curl example:

```powershell
curl -X POST http://localhost:3000/email/api/send-email \
  -H "Content-Type: application/json" \
  -d '{"to":"user@example.com","userName":"User"}'
```

Node (fetch) example:

```javascript
fetch('http://localhost:3000/email/api/send-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ to: 'user@example.com', userName: 'User' })
});
```


## Deployment

This project is compatible with Vercel and other Node hosts. There's a `vercel.json` in the repo — if deploying to Vercel, set the `RESEND_API_KEY` environment variable in the Vercel project settings.


## Dependencies

See `package.json` for the full list. Notable dependencies include `express`, `resend`, `dotenv`, `helmet`, `morgan`, and `express-rate-limit`.


## Troubleshooting

- If the server exits immediately: ensure `RESEND_API_KEY` is set. The server intentionally exits when the Resend client cannot be initialized.
- If emails fail to send, check the response in the returned JSON `data` from Resend and confirm your Resend account and API key are valid.
- For CORS issues, check `server.js` CORS `origin` list — add your origin if necessary.


## License

ISC
