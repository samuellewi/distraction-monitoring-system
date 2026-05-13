# Distraction Monitoring Backend

Node.js, TypeScript, Express, Prisma, and SQLite backend API for the distraction monitoring system.

## Local Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a local environment file:

   ```bash
   cp .env.example .env
   ```

   Set `JWT_SECRET` to a long random value. The default local database URL is:

   ```env
   DATABASE_URL="file:./dev.db"
   ```

3. Run the database migration:

   ```bash
   npm run prisma:migrate -- --name init
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

The API listens on `http://localhost:4000` by default. Health check:

```bash
curl http://localhost:4000/health
```

## API Response Format

Successful responses use:

```json
{
  "success": true,
  "data": {}
}
```

Errors use:

```json
{
  "success": false,
  "error": {
    "message": "Readable error message"
  }
}
```

## Frontend Integration Notes

The current frontend uses local mock data. It can consume these endpoints with a Bearer token stored client-side after login/register:

- Dashboard cards: `GET /api/dashboard/summary`
- Productivity chart: `GET /api/dashboard/category-breakdown`
- Recent activity: `GET /api/activities?limit=5`
- App classification: `GET /api/categories`
- Reports: `GET /api/dashboard/daily`, `GET /api/dashboard/top-apps`, and `GET /api/dashboard/category-breakdown`

All protected endpoints require:

```http
Authorization: Bearer <token>
```

## Scripts

- `npm run dev`: start the API in watch mode.
- `npm run build`: compile TypeScript to `dist`.
- `npm start`: run the compiled API.
- `npm run typecheck`: typecheck without emitting files.
- `npm run prisma:generate`: generate Prisma Client.
- `npm run prisma:migrate`: run Prisma migrations locally.
- `npm run prisma:studio`: open Prisma Studio.

## Example Requests

Register:

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Demo User","email":"demo@example.com","password":"password123"}'
```

Login:

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"password123"}'
```

Create category:

```bash
curl -X POST http://localhost:4000/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"name":"VSCode","type":"PRODUCTIVE"}'
```

Create activity:

```bash
curl -X POST http://localhost:4000/api/activities \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"appName":"VSCode","windowTitle":"distraction-monitoring-system","startedAt":"2026-05-12T09:00:00.000Z","endedAt":"2026-05-12T10:15:00.000Z","categoryId":"<categoryId>"}'
```

Dashboard summary:

```bash
curl http://localhost:4000/api/dashboard/summary \
  -H "Authorization: Bearer <token>"
```
