# Amal Yatri — REST API Reference (v0.1)

> Canonical API reference. The full Swagger UI is available at
> `GET /api/docs` once the NestJS server is running.

**Base URL:** `http://localhost:3001/api/v1`
**Auth header:** `Authorization: Bearer <jwt-access-token>`

Unless noted, every endpoint requires a valid access token. Pagination uses `limit` / `offset` query parameters.

## Auth (`/auth`)

| Method | Path                | Body                              | Returns                       |
|--------|---------------------|-----------------------------------|-------------------------------|
| POST   | `/auth/register`    | `{ email, password, firstName, lastName, role, displayName?, phone? }` | AuthResponse |
| POST   | `/auth/login`       | `{ email, password }`             | AuthResponse                  |
| POST   | `/auth/refresh`     | `{ refreshToken }`                | AuthResponse (rotated tokens) |
| POST   | `/auth/logout`      | `{ refreshToken }`                | 204                           |
| POST   | `/auth/forgot-password` | `{ email }`                  | 204                           |
| POST   | `/auth/reset-password`  | `{ token, newPassword }`     | 204                           |
| GET    | `/auth/me`          | —                                 | CurrentUser                   |

`AuthResponse` = `{ user, accessToken, refreshToken, accessExpiresInSec }`.

## Users (`/users`)

| Method | Path          | Notes                                  |
|--------|---------------|----------------------------------------|
| GET    | `/users/me`   | Full profile for any role              |
| PATCH  | `/users/me`   | Update profile (role-aware update)     |
| GET    | `/users/:id`  | Public profile (within community)      |

## Wellness timeline (`/wellness-timeline`)

| Method | Path                              | Notes                                |
|--------|-----------------------------------|--------------------------------------|
| GET    | `/wellness-timeline/retreats`     | My retreats                          |
| POST   | `/wellness-timeline/retreats`     | Record a retreat                     |
| GET    | `/wellness-timeline/assessments`  | My assessments                       |
| POST   | `/wellness-timeline/assessments`  | Record an assessment                 |
| GET    | `/wellness-timeline/goals`        | My goals                             |
| POST   | `/wellness-timeline/goals`        | New goal                             |
| PATCH  | `/wellness-timeline/goals/:id`    | Update goal progress                 |
| GET    | `/wellness-timeline?limit=&type=` | Merged timeline feed (retreats+events)|
| POST   | `/wellness-timeline/events`       | Add a custom event                   |

## Doctor Connect (`/doctor-connect`)

| Method | Path                                | Notes                                 |
|--------|-------------------------------------|---------------------------------------|
| GET    | `/doctor-connect/doctors`           | Available doctors                     |
| GET    | `/doctor-connect/conversations`     | My conversations + unread             |
| GET    | `/doctor-connect/threads/:otherId`  | Full thread (oldest first), marks read|
| POST   | `/doctor-connect/messages`          | `{ recipientId, kind, body?, mediaUrl?, durationSec? }` |
| POST   | `/doctor-connect/consultations`     | `{ doctorProfileId, mode?, scheduledFor?, patientNote? }` |
| GET    | `/doctor-connect/consultations`     | My consultation history               |

Domain rule: a Yatri can only message a Doctor/Admin; a Doctor can only message Yatris or other Doctors. Enforced in `DoctorConnectService`.

## Communities (`/communities`)

| Method | Path                                | Notes                                 |
|--------|-------------------------------------|---------------------------------------|
| GET    | `/communities`                      | List all (with member + post counts)  |
| GET    | `/communities/mine`                 | Joined                                |
| GET    | `/communities/:slug`                | Single                                |
| POST   | `/communities/:slug/join`           | Join                                  |
| POST   | `/communities/:slug/leave`          | Leave                                 |
| GET    | `/communities/:slug/posts`          | Posts in the circle                   |
| POST   | `/communities/:slug/posts`          | Create a discussion (title?, body)    |
| POST   | `/communities/posts/:id/comments`   | Comment                               |
| POST   | `/communities/posts/:id/like`       | Toggle like                           |

## Knowledge (`/knowledge`)

| Method | Path                       | Notes                          |
|--------|----------------------------|--------------------------------|
| GET    | `/knowledge?kind=&tag=`    | List (filter by kind/tag/paged)|
| GET    | `/knowledge/featured`      | Most-liked (top 6)             |
| GET    | `/knowledge/:slug`         | Single item (+1 view counter)  |

## Events (`/events`)

| Method | Path                          | Notes                            |
|--------|-------------------------------|----------------------------------|
| GET    | `/events?upcoming=`           | List published, optionally only future |
| GET    | `/events/mine`                | My registered                    |
| POST   | `/events/:id/register`        | Register (with capacity check)   |
| POST   | `/events/:id/cancel`          | Cancel                           |

## Notifications (`/notifications`)

| Method | Path                              | Notes                          |
|--------|-----------------------------------|--------------------------------|
| GET    | `/notifications?onlyUnread=`      | List                           |
| PATCH  | `/notifications/:id/read`         | Mark one                       |
| PATCH  | `/notifications/read-all`         | Mark all                       |

## AI Assistant (`/ai-assistant`)

| Method | Path                                                | Notes                  |
|--------|-----------------------------------------------------|------------------------|
| GET    | `/ai-assistant/conversations`                       | My conversation list   |
| POST   | `/ai-assistant/conversations`                       | Create                 |
| GET    | `/ai-assistant/conversations/:id`                   | Full thread            |
| POST   | `/ai-assistant/conversations/:id/messages`          | Send → replies sync    |

Provider: `AI_PROVIDER=stub|openai|anthropic|local`. Always carries `SAFETY_DISCLAIMER`.

## Admin (`/admin`) — ADMIN, SUPER_ADMIN only

| Method | Path                                    | Notes                       |
|--------|-----------------------------------------|-----------------------------|
| GET    | `/admin/kpis`                           | Top-line metrics            |
| GET    | `/admin/users?role=&status=&limit=&offset=` | List users               |
| PATCH  | `/admin/users/:id/status`               | Update user status          |

## Health (`/health`)

| Method | Path                | Notes                              |
|--------|---------------------|------------------------------------|
| GET    | `/health`           | Liveness                           |
| GET    | `/health/ready`     | Readiness — pings the DB           |

## Error envelope

```json
{
  "statusCode": 400,
  "method": "POST",
  "path": "/api/v1/auth/login",
  "timestamp": "2026-07-09T12:00:00.000Z",
  "message": "Invalid credentials",
  "error": "Unauthorized"
}
```
