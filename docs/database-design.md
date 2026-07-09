# Amal Yatri — Database Design

> Reference for the Prisma schema at `packages/prisma/prisma/schema.prisma`.
> All models are `cuid()` keyed. Conventions: `createdAt`, `updatedAt`,
> `deletedAt` (soft-delete) on every entity where appropriate.

## 1. ERD (text-form)

```
users ─┬─ yatri_profile
       ├─ doctor_profile     ─┐
       ├─ therapist_profile  │
       ├─ wellness_guide_profile
       ├─ sessions
       ├─ refresh_tokens
       ├─ timeline_events  ──→ retreats ──→ panchakarma_programs
       │                  └─→ assessments
       ├─ wellness_goals
       ├─ wellness_plans  ──→ medicine_reminders
       ├─ doctor_messages
       ├─ consultations  ──→ doctor_profile
       ├─ community_posts ──→ communities ──→ community_memberships
       │           ├─→ comments
       │           └─→ likes
       ├─ ai_conversations ──→ ai_messages
       ├─ notifications
       ├─ media_assets
       └─ audit_logs

knowledge_items (independent, ordered by publishedAt desc)
events           (independent, ordered by startsAt asc)
```

## 2. Models (~30)

| Domain        | Models |
|---------------|--------|
| Identity      | `User`, `Session`, `RefreshToken`, `PasswordResetToken`, `EmailVerificationToken` |
| Profiles      | `YatriProfile`, `DoctorProfile`, `TherapistProfile`, `WellnessGuideProfile` |
| Retreats      | `Retreat`, `PanchakarmaProgram` |
| Wellness      | `WellnessAssessment`, `WellnessGoal`, `WellnessPlan`, `MedicineReminder`, `TimelineEvent` |
| Doctor Connect| `DoctorMessage`, `Consultation` |
| Community     | `Community`, `CommunityMembership`, `CommunityPost`, `Comment`, `Like` |
| Knowledge     | `KnowledgeItem` |
| Events        | `Event`, `EventRegistration` |
| AI            | `AiConversation`, `AiMessage` |
| Cross-cutting | `Notification`, `MediaAsset`, `AuditLog` |

## 3. Key enums

- `UserRole` — YATRI, DOCTOR, THERAPIST, WELLNESS_GUIDE, ADMIN, CONTENT_MODERATOR, SUPER_ADMIN
- `RetreatType` — PANCHAKARMA, WELLNESS, DETOX, YOGA, MEDITATION, WEIGHT_MANAGEMENT, STRESS_MANAGEMENT, CORPORATE
- `PanchakarmaStage` — PURVAKARMA, PRADHANAKARMA, PASHCHATKARMA
- `PlanKind` — YOGA, MEDITATION, DIET, CURE_CUISINE, LIFESTYLE, DAILY_ROUTINE, SEASONAL
- `ReminderKind` — MEDICINE, YOGA, MEDITATION, FOLLOW_UP, HABIT
- `ContentKind` — ARTICLE, VIDEO, PODCAST, RECIPE, YOGA_SESSION, MEDITATION_SESSION, FAQ, STORY, DOCTOR_TALK

## 4. Indexes (most important)

- `(users.email)` — unique
- `(users.role, users.status)` — admin filter
- `(timeline_events.yatriUserId, occurredAt DESC)` — dashboard feed
- `(doctor_messages.senderId, recipientId, createdAt DESC)` + `(doctor_messages.recipientId, readAt)` — threads
- `(community_posts.communityId, createdAt DESC)` — circle feeds
- `(knowledge_items.kind, publishedAt DESC)` — library listings
- `(events.startsAt)` — calendar listings
- `(ai_conversations.userId, lastMsgAt DESC)` — assistant inbox
- `(notifications.userId, readAt, createdAt DESC)` — notifications list

## 5. Naming + column conventions

- Snake_case columns (`yatri_user_id`), camelCase fields in the Prisma client.
- Soft delete via `deletedAt` (`@map("users")`, `users` SQL table).
- Boolean flags are positive-stated (`availableForChat`, not `isNotAvailable`).
- All money-shaped values are `Int` minor units (paise) — never floats. v0.2 introduces payments.

## 6. Privacy + retention

- All personal data lives behind RBAC: `UsersService.getPublicProfile` is the only PII surface for non-self users.
- Refresh tokens are SHA-256 hashed; raw tokens never leave client memory after issuance.
- Soft delete keeps PII recoverable for 30 days, after which a scheduled job (v0.2) hard-deletes.
- Audit log records every actor × action × entity × diff.

## 7. Seed data

`packages/prisma/prisma/seed.ts` creates a credible Amal Tamara demo world:

- 2 doctors (Dr Devi Nair, Dr Arjun Menon) with full bios + specialties
- 2 wellness guides
- 3 demo Yatris (Aarti in Mumbai, Ravi in Bengaluru, Lena in Zurich)
- 2 retreats + 6 panchakarma stages each
- All 12 spec communities pre-seeded with welcome posts by the doctors
- 6 knowledge items
- 4 upcoming events
- Sample AI conversation
- Notifications

Password for every seeded user: **`amalwell2026`**.
