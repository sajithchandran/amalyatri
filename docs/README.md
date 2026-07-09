# Amal Yatri — Product Specification (v0.1)

> The lifelong digital wellness companion for every guest of Amal Tamara Ayurveda.

## 1. Problem

Amal Tamara offers a transformational wellness journey. Today, that journey largely ends when a guest checks out. Guests return home and re-enter the same urban rhythm that brought them to Kerala. The follow-up is fragmented — a WhatsApp message here, an email there — and the slow shift back to dysregulated life goes unobserved.

The result: most guests drift. The therapeutic momentum of a 14-day Panchakarma rarely converts into a long-term lifestyle change, and the lifetime value of the relationship between Amal Tamara and its guests is left on the table.

## 2. Mission

**When an Amal Tamara guest checks out, they should not feel that treatment has ended. They should feel — “I have become an Amal Yatri, and Amal Tamara will continue guiding my wellness journey for the rest of my life.”**

## 3. Who

### 3.1 Yatri (primary user)
The guest of Amal Tamara, during and after any program — Panchakarma, wellness, weight, stress, corporate, detox, yoga, meditation. Often health-aware but busy; comfortable with digital tools; sensitive to clinical aesthetics.

### 3.2 Doctor
Amal Tamara doctor (BAMS/MD Ayurveda, Marma specialist, etc.). A clinical expert but also a long-term relationship-holder. Wants to be able to stay gently involved without being on-call 24/7.

### 3.3 Wellness Guide
Yoga, meditation, breathwork instructors. Want to publish practices, drop into live sessions, and be present for ongoing classes.

### 3.4 Community Moderator
A senior Yatri or wellness team member who holds the cultural tone of the circles — quietly.

### 3.5 Admin
Platform admin — onboarding doctors, moderating content, watching health metrics.

## 4. Outcomes we optimise for

1. **Patient engagement after treatment** — measured in 30/60/90-day active rate.
2. **Repeat retreat bookings** — measured as second retreats within 18 months.
3. **Doctor–Yatri communication continuity** — measured in messages per active Yatri per quarter.
4. **Wellness journey preservation** — % of Yatris with a populated wellness timeline.
5. **Trusted wellness community participation** — replies + posts per active community member.
6. **AI-assisted wellness guidance** — daily conversation count, never at the cost of escalation to a doctor.

## 5. Non-goals (equally important)

- We are **not** a hospital EMR.
- We are **not** a patient portal.
- We are **not** a social media application.
- We are **not** a WhatsApp replacement.
- We never diagnose, ever.

## 6. Modules (12)

| # | Module | What it is |
|---|--------|-----------|
| 1 | Landing website | Premium marketing site introducing Amal Yatri |
| 2 | Authentication | Login, registration, password reset, profile |
| 3 | Yatri dashboard | Personalised home with score, today's plan, inspiration |
| 4 | Wellness timeline | Lifelong story: retreats, assessments, goals, weights, achievements |
| 5 | Doctor Connect | Secure messaging + consultation requests + AI assist |
| 6 | Wellness plans | Personalised yoga, meditation, diet, lifestyle |
| 7 | Community | 12 moderated circles, posts, comments, likes, expert answers |
| 8 | Knowledge library | Articles, recipes, podcasts, yoga, meditation, doctor talks |
| 9 | AI wellness assistant | Calm, escorts to a doctor when needed |
| 10 | Events | Live sessions, workshops, webinars, doctor Q&A, retreats |
| 11 | Notifications | In-app, email, push |
| 12 | Admin & doctor portals | Operate the platform and respond to Yatris |

## 7. Design philosophy

Every feature must answer one question:

> *Will this strengthen the lifelong relationship between Amal Tamara and the Amal Yatri?*

**The aesthetic is calm.** Earthy greens, warm clay, sunrise cream. Cormorant Garamond for display, Inter for body. Soft shadows, generous whitespace, animations that breathe (slow). Never noisy.

## 8. Operating model

- **Storage:** local now; AWS S3/Azure Blob/MinIO later.
- **AI:** pluggable provider (stub / OpenAI / Anthropic / local), always behind an `AiProvider` interface, always with the platform safety disclaimer.
- **Auth:** JWT access + refresh, rotating refresh tokens, hashed in DB.
- **Data:** PostgreSQL + Prisma, soft-delete where appropriate.
- **Roles:** `YATRI`, `DOCTOR`, `THERAPIST`, `WELLNESS_GUIDE`, `ADMIN`, `CONTENT_MODERATOR`, `SUPER_ADMIN`.

## 9. Roadmap

- **v0.1** — Monorepo, schema, all 12 modules scaffolded, core UX flows.
- **v0.2** — Real OpenAI/Anthropic providers, push notifications, payments for retreats.
- **v0.3** — Wearable integration (Apple Health, Google Fit), offline mode shell, mobile.
- **v1.0** — Multi-language, marketplace, online consultations.
