# AI Email Summarizer

A small full-stack app to manage emails, summarize them using OpenAI, and export results as CSV.

---

## Setup

### 1 `)` Install
```bash
cd server
npm install

cd client
npm install
```

### 2 `)` Environment

#### Client (`client/.env`)
```env
VITE_API_BASE_URL=your_backend_url
```

#### Server (`server/.env`)
```env
DATABASE_URL=your_neon_postgres_url
OPENAI_API_KEY=your_openai_key
PORT=your_port_address
NODE_ENV=development/live
```

---

## Scripts (server/package.json)

```json
{
  "dev": "tsx watch src/index.ts",
  "build": "tsc",
  "start": "node dist/index.js",
  "db:generate": "drizzle-kit generate",
  "db:migrate": "drizzle-kit migrate"
}
```

---

## Run Project

### Backend
```bash
cd server
npm run dev
```

### Frontend
```bash
cd client
npm run dev
```

---

## API Configuration

### GET /emails
Supports filters + pagination.

Query params:
- `search`
- `category`
- `sort` = `newest | oldest | count`
- `page` (default 1)
- `limit` (default 10)

Example:
```http
GET /emails?search=test&page=1&limit=10
```

### GET /emails/:id
Fetch single email.

### POST /emails/summarize
Summarize selected emails.
```json
{ "ids": ["uuid1", "uuid2"] }
```

### POST /emails/:id/resummarize
Re-summarize one email.

### DELETE /emails/:id
Delete email.

---

## Design Decisions

- **Drizzle + Postgres (Neon):** simple + typed DB queries
- **OpenAI summarization:** summary + category + keywords
- **Pagination default 10:** faster UI + lower DB load
- **Set for selection:** fast select/unselect in table
