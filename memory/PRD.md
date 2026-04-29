# Be Dental Paradise — Product Requirements Document

## Original Problem Statement
Build a modern & elegant dental-clinic React website using the "Be Dental Paradise" logo, inspired by bracesbydrlaw.com, dentopiadentalja.com, yanetsyorthodontics.com. Include an admin portal to manage users with scheduled appointments and payments. Use modern dental-care images and graphics.

## User Choices (Feb 2026)
- Admin auth: **JWT-based custom auth**
- Payments: **Mocked / manual tracking** (no real charges)
- Public booking flow: **Anyone can book (no signup required)**
- Services: General dentistry, cleanings, braces/orthodontics, whitening, implants, pediatric, emergency
- Design: **Hybrid** — elegant professional base with tropical color accents

## Architecture
- **Backend**: FastAPI + MongoDB (Motor), JWT (PyJWT) + bcrypt, httpOnly cookies (SameSite=None, Secure).
- **Frontend**: React 19 + React Router 7, shadcn/ui, Tailwind (Cormorant Garamond + Outfit fonts), axios with `withCredentials: true`, sonner toasts.

## User Personas
- **Prospective patient** — books appointment, reads about services, sends contact message.
- **Clinic admin** — logs in, reviews/confirms appointments, records & updates payments, reads inbox.

## Implemented (2026-02-24)
- Public marketing pages (Hero, Services grid, About, Testimonials, Booking form, Contact, Footer).
- Public endpoints: `POST /api/appointments`, `POST /api/contact`.
- JWT auth: `/api/auth/login`, `/logout`, `/me`, `/refresh` with httpOnly cookies; admin seeded from env on startup.
- Admin portal (protected): Dashboard (stats widgets, recent appointments), Appointments CRUD w/ search + status filter, Payments CRUD w/ add-payment dialog & revenue summary (MOCKED), Messages inbox.
- `/api/admin/stats` aggregated counts + revenue.
- Test credentials at `/app/memory/test_credentials.md`.
- Backend: 24/24 pytest tests passing. Frontend: 100% of critical flows passing.

## Backlog (Prioritized)
- **P1**: Email notifications on booking (Resend/SendGrid), replace MOCKED payments with Stripe.
- **P1**: Tighten CORS to explicit origin list; add brute-force lockout on login.
- **P2**: Patient self-service portal (view own appointments), SMS reminders (Twilio).
- **P2**: Treatment plan uploads (object storage), before/after gallery.
- **P3**: Google Calendar sync for admin, multi-language (EN/ES), dark admin theme.

## Next Tasks
- Let the user review the UI/UX
- Decide whether to swap mocked payments for real Stripe (test mode) next.
