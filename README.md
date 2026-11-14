# LearnForge — Simplified LMS

A full-stack Learning Management System developed as part of the DataPollex Ltd. Industrial Training recruitment assessment.

Admins manage courses and video lectures; students browse courses and watch lectures.

**Stack (PERN):** React 19 + Vite + TypeScript + Tailwind CSS v4 · Node.js + Express 5 + TypeScript · PostgreSQL + Prisma ORM · JWT auth + bcrypt · Zod validation

| | |
|---|---|
| **Live demo** | https://learnforge-eight-bay.vercel.app/ |
| **API** |https://learnforge-backend-z8iw.onrender.com
| **Admin login** | `admin@lms.com` / `admin123` |

---

## Features

### Student panel (public)
- Course catalogue with thumbnail, title, description, price and lecture count
- Search courses by title/description (server-side, case-insensitive)
- Course details page: info, price card, and full "Course content" lecture list
- Lecture player with embedded video, curriculum sidebar, and previous/next navigation
- Supports **YouTube** (incl. `?t=` start times), **Vimeo**, and direct **.mp4/.webm** files

### Admin dashboard (protected)
- Admin login with JWT; session is restored on refresh and cleared when the token expires
- Course CRUD: create, edit and delete courses (card/table view with stats and filter)
- Lecture CRUD: add lectures to a selected course, edit and delete them
- Live thumbnail and video previews in the forms
- Confirmation dialogs before deleting; deleting a course also deletes its lectures (DB cascade)

### UI/UX
- Responsive on desktop and mobile (table → cards, collapsible nav, stacked layouts)
- Loading skeletons/spinners, empty states, error states with retry, 404 pages
- Inline field-level validation errors (client-side and server-side) and toast notifications

The student interface is designed to provide a familiar course marketplace experience, featuring course cards, a dark-themed course hero section with a price card, a curriculum list, and a video player with a sidebar.
---

## Project structure

```
lms/
├── server/                     # Express API (MVC)
│   ├── prisma/
│   │   ├── schema.prisma       # Admin, Course, Lecture models
│   │   ├── migrations/         # SQL migrations
│   │   └── seed.ts             # Admin user + 5 sample courses / 17 lectures
│   └── src/
│       ├── config/             # env loading, Prisma client
│       ├── models/             # Data-access layer (all Prisma queries live here)
│       ├── controllers/        # Request handlers (auth, course, lecture)
│       ├── routes/             # Route definitions, auth + validation middleware wiring
│       ├── middleware/         # requireAdmin (JWT), validate (Zod), error handling
│       ├── validators/         # Zod schemas
│       ├── utils/              # ApiError
│       ├── app.ts              # Express app (helmet, CORS, JSON, routes)
│       └── server.ts           # Entry point
└── client/                     # React SPA
    └── src/
        ├── lib/                # API client, types, video URL parser, formatters
        ├── context/            # AuthContext (login/logout/session restore)
        ├── hooks/              # useAsync (loading / error / data)
        ├── layouts/            # PublicLayout (navbar/footer), AdminLayout (guarded)
        ├── components/         # CourseCard, VideoPlayer, Modal, Field, States, admin forms
        └── pages/              # Home, CourseDetails, Lecture, admin/Login, Dashboard, CourseLectures
```

**MVC on the backend:** *Models* (`src/models`) own all database access, *controllers* (`src/controllers`) handle HTTP and business rules, and *routes* (`src/routes`) map URLs to controllers with middleware. The "view" is the JSON response consumed by the React client.

---

## Getting started (local)

### Prerequisites
- Node.js 20+ (tested on 22)
- PostgreSQL 14+ running locally (or a hosted DB such as Neon / Supabase / Render Postgres)

### 1. Create the database
```bash
# psql / pgAdmin — any name works, it just has to match DATABASE_URL
CREATE DATABASE lms;
```

### 2. Backend
```bash
cd server
cp .env.example .env          # then edit DATABASE_URL and JWT_SECRET
npm install                   # also runs `prisma generate`
npm run db:deploy             # applies migrations (creates tables)
npm run db:seed               # creates the admin + sample courses
npm run dev                   # http://localhost:5000
```

### 3. Frontend
```bash
cd client
cp .env.example .env          # VITE_API_URL=http://localhost:5000/api
npm install
npm run dev                   # http://localhost:5173
```

Open http://localhost:5173. Log in at **/admin/login** with `admin@lms.com` / `admin123`.

> Windows (PowerShell): use `copy .env.example .env` instead of `cp`.

### Environment variables

**server/.env**

| Variable | Description | Example |
|---|---|---|
| `PORT` | API port | `5000` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@localhost:5432/lms?schema=public` |
| `JWT_SECRET` | Secret used to sign tokens (use a long random string) | — |
| `JWT_EXPIRES_IN` | Token lifetime | `1d` |
| `CLIENT_URL` | Allowed frontend origin(s), comma-separated | `http://localhost:5173` |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Credentials the seed script creates | `admin@lms.com` / `admin123` |

**client/.env**

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the API, including `/api` |

---

## Database

```
Admin   (id, name, email UNIQUE, password [bcrypt], createdAt)
Course  (id, title, description, price DECIMAL(10,2), thumbnailUrl, createdAt, updatedAt)
Lecture (id, title, description, videoUrl, order, courseId → Course.id ON DELETE CASCADE, createdAt, updatedAt)
```

`npm run db:seed` is safe to re-run: it upserts the admin, and only inserts sample courses when the database has none (so redeploys never wipe real data). Run `SEED_RESET=true npm run db:seed` to reset to the sample set.
All student-facing data comes from the database; nothing is hard-coded in the frontend.

Deployed Database: The production PostgreSQL database is already initialized with the required migrations and sample seed data. Evaluators can access the preloaded courses through the live application without setting up a separate database.

---

## API reference

Base URL: `/api` · All responses: `{ success, data?, message?, errors? }`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/login` | — | Log in → `{ token, admin }` |
| GET | `/auth/me` | Admin | Current admin |
| GET | `/courses?search=` | — | List courses (with lecture counts) |
| GET | `/courses/:id` | — | Course with ordered lectures |
| POST | `/courses` | Admin | Create course |
| PUT | `/courses/:id` | Admin | Update course (partial) |
| DELETE | `/courses/:id` | Admin | Delete course + its lectures |
| GET | `/courses/stats` | Admin | Course / lecture totals |
| GET | `/courses/:courseId/lectures` | — | Lectures of a course |
| POST | `/courses/:courseId/lectures` | Admin | Add lecture to course |
| GET | `/lectures/:id` | — | Single lecture (with course title) |
| PUT | `/lectures/:id` | Admin | Update lecture (partial) |
| DELETE | `/lectures/:id` | Admin | Delete lecture |

Admin endpoints need `Authorization: Bearer <token>`.

**Validation** (Zod, returned as `400 { errors: { field: message } }`):
- Course: title 3–150 chars, description ≥ 10 chars, price ≥ 0, thumbnail must be an http(s) URL
- Lecture: title 3–150 chars, description ≥ 5 chars, video must be an http(s) URL

**Error handling:** 401 for missing/invalid tokens, 404 for unknown routes and missing records, 400 for malformed JSON, 500 for anything else (details logged on the server only). Login returns the same message for an unknown email and a wrong password.

---

## Deployment (suggested)

**Database:** Neon or Render PostgreSQL → copy the connection string.

**Backend — Render (Web Service, root `server`)**
- Build: `npm install && npm run build && npm run db:deploy && npm run db:seed`
- Start: `npm start`
- Env: `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_URL=https://<your-frontend>`

**Frontend — Vercel or Netlify (root `client`)**
- Build: `npm run build` · Output: `dist`
- Env: `VITE_API_URL=https://<your-api>/api`
- SPA routing is handled by `vercel.json` / `public/_redirects`.

> Render's free tier sleeps after inactivity, so the first request can take ~30–50 s.

---

## Technical decisions

- **PostgreSQL + Prisma:** courses → lectures is a relational one-to-many, so foreign keys and `ON DELETE CASCADE` keep data consistent. Prisma gives typed queries and versioned migrations.
- **Prisma "client" engine + `@prisma/adapter-pg`:** uses Prisma's Rust-free query engine over node-postgres, so no native query-engine binary is needed at runtime.
- **Thin models layer:** controllers never call Prisma directly, so the data layer could be swapped (e.g. to MongoDB) without touching HTTP code.
- **Zod on the server, mirrored on the client:** the server is the source of truth; the client repeats the same rules for instant feedback, and also shows server field errors if they ever differ.
- **JWT in `localStorage` + Bearer header:** simple and stateless for a single admin role. For production I would move the token to an httpOnly cookie to reduce XSS exposure.
- **Video URL parsing on the client:** admins paste normal YouTube/Vimeo links; the app converts them to embeddable URLs (`youtube-nocookie.com`), keeping start times.

## Not implemented (out of scope per the brief)
Student registration, payments, enrollment, file uploads, and progress tracking were listed as not required. Lecture order follows creation order; drag-and-drop reordering is not implemented.
