# Amal Yatri — Product Specification

> See [`README.md`](./README.md) for the executive overview. This document
> expands the **12 modules** into concrete user stories, success criteria,
> edge cases, and explicit non-goals. Living document.

---

## Module 1 — Landing website (`/`)
**Goal:** convert landing-page visitors into registered Yatris.

**Sections**
- Sticky header with brand mark + 4 nav links + sign-in / CTA buttons
- Hero with editorial title, Kerala-mist CSS scene, primary CTA to `/register`
- Philosophy — 3 calm pillars (healing / continuity / companionship)
- Features grid — 8 features, animated icons (`breathe` keyframe)
- Doctor introductions — 2 doctor cards with bios + specialties
- Testimonials — 3 short quotes from seeded Yatris
- Full-width brand-gradient CTA panel
- Editorial footer with brand block, nav, copyright

**Out of scope for v0.1:** licensed photography (uses CSS scene); analytics; A/B tests.

## Module 2 — Authentication (`/login`, `/register`, `/forgot-password`, `/profile`)
**Stories**
- As a new visitor I can become an Amal Yatri by providing my name, email, password, and self-identified role.
- As a returning Yatri I can sign in with email + password.
- As a Yatri who forgot my password, I can request a reset link.

**Backend contract:** see [API documentation](./api.md). JWT access (15m) + refresh (30d, opaque, SHA-256-hashed, rotated).

## Module 3 — Yatri dashboard (`/dashboard`)
**Greeting + score + 7 supporting cards.** Each card is independently data-bound and degrades gracefully:
- `WellnessScore` — circular progress, derived from `/users/me`
- `TodayPlan` — placeholder rendering, server-wired in v0.2
- `DailyInspiration` — quote rotating by day-of-month
- `RecentTimeline` — last 4 events from `/wellness-timeline`
- `UpcomingEvents` — next 3 from `/events?upcoming=true`
- `MessagesPreview` — last 3 from `/doctor-connect/conversations`
- `CommunityChips` — joined circles from `/communities/mine`
- `LibraryPick` — featured item from `/knowledge/featured`
- `QuietReminders` — unread notifications

## Module 4 — Wellness timeline (`/timeline`)
**Two views:**
1. Top — 3 stat cards (active goals, completed goals, retreat count) + active-goals progress bars.
2. Year-grouped timeline feed (vertical, dot rail). Each event has type-aware icon + calm label.

**Backend:** `GET /wellness-timeline?limit=200` returns retreats + events merged and sorted.

## Module 5 — Doctor Connect (`/doctor`, `/doctor/[otherId]`)
- **List page** — directory of available doctors, recent conversations sidebar.
- **Thread page** — chronological bubbles (oldest first), real-time polling every 8s, voice/image/document attachments, AI-assisted replies hint, persistent input with Enter-to-send and Shift+Enter for newline.

## Module 6 — Wellness plans (`/timeline`)
Plans live in `WellnessPlan` + `MedicineReminder`. Rendered on the dashboard "Today, gently" card and on the timeline as events.

## Module 7 — Community (`/community`, `/community/[slug]`)
- 12 seeded communities, all 6 verbiage categories from the brief.
- Membership model, role flags (MEMBER / MODERATOR / EXPERT / GUEST).
- Discussion feed: new-post box + card list with like + comment counts.

## Module 8 — Knowledge library (`/knowledge`, `/knowledge/[slug]`)
- Filter chips (All / Articles / Recipes / Yoga / Meditation / Podcasts / Doctor talks).
- Tag search (v0.1 heuristic).
- Detail page renders `bodyMarkdown` as semantic blocks, supports mediaUrl for video/audio.

## Module 9 — AI Wellness assistant (`/assistant`)
- Conversation list + conversation view (chat scroll, auto-scroll on new).
- Provider failover to `StubProvider` whenever keys are absent.
- Safety: `SAFETY_DISCLAIMER` is always appended to non-error replies.

## Module 10 — Events (`/events`)
- "Upcoming" filter, register button (mutation), card layout.

## Module 11 — Notifications (`/notifications`)
- List with mark-one / mark-all; "New" badge for unread.

## Module 12 — Admin & doctor portals
- Admin: KPIs endpoint, user-management endpoints (RBAC-guarded, ADMIN+ only).
- Doctor portal: surfaces the same `doctor-connect` endpoints but role-gated to view patient timelines.
