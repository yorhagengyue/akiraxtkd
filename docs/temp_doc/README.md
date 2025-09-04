# Temporary Notes – Akira X Taekwondo

Last updated: 2025-09-04

## Build & Database Status
- Build: next build succeeded (Next.js 14)
- Dev server: running at http://localhost:3001
- D1 DB (test): schema and seed applied successfully
- API sanity check: /api/env-info OK; mock endpoints responding in dev

## Frontend – Empty Links/Buttons Audit and Actions

- Footer (components/Footer.tsx)
  - Beginners / Youth Classes / Adult Programs / Competition Team → change to:
    - /classes?audience=beginner | youth | adult | competition

- About (app/about/page.tsx)
  - Get Directions → open Google Maps with address
  - Schedule a Trial Class → WhatsApp deep link
  - Contact Our Team → mailto link

- Team (components/TeamSection.tsx)
  - Learn More → /about#team or /coaches/jasterfer-kellen (recommended new route)
  - Schedule a Trial Class / Contact Our Team → same as About CTA

- Classes Overview (components/ClassesSection.tsx)
  - Card “Learn More” → /classes#<class-anchor> (or future /classes/<slug>)
  - View All Classes → /classes (or scroll to #classes)

- Classes Page (app/classes/page.tsx)
  - Register for This Class →
    - Unauth: /login?next=/classes&class=<slug>
    - Auth (student): call /api/classes/{id}/enroll or route to /dashboard/student?enroll=<id>

- Why Section (components/WhySection.tsx)
  - Discover Our Programs → /classes

- Awards (components/AwardsSection.tsx)
  - MORE AWARDS → /about#awards or /news?tag=awards
  - View Certificates → /about#certificates (or assets gallery later)

- Header Search (components/Header.tsx)
  - On submit → /search?q=<keyword> (add app/search/page.tsx)

- Contact Form (components/ContactSection.tsx)
  - Submit → POST /api/contact (add endpoint); add success/fail toast + rate-limit

- Students (app/students/page.tsx)
  - Delete Selected → confirm + PUT /api/students bulk status update (or hide for now)

- Student Detail (app/students/[id]/page.tsx)
  - Edit Student → open StudentForm drawer or /students/[id]/edit

- Admin Classes (app/admin/classes/page.tsx)
  - Delete Selected → confirm + DELETE /api/classes/[id] per selection (or hide for now)

- News (app/news/page.tsx)
  - Read More → /news/[slug] (or external social links)

## Suggested Implementation Order
1) Link-only changes (Footer, Why, Awards, Team/About CTAs, ClassesSection, Header search route)
2) Classes register flow (login redirect + enroll)
3) Contact form API + UI
4) Management actions (bulk delete/status; edit drawers)

## Notes
- All external links should use rel="noopener noreferrer" and target="_blank" where appropriate.
- Add simple URL param-based filtering on /classes for audience.
- Keep mock data in dev; wire to D1 in prod env.
