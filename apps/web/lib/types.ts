/**
 * Cross-package shape definitions. We re-export a small set of types that
 * the UI relies on. The canonical API contract lives in
 * `@amalyatri/types` (re-exported for app-side convenience).
 */

export type RetreatType =
  | 'PANCHAKARMA' | 'WELLNESS' | 'DETOX' | 'YOGA' | 'MEDITATION'
  | 'WEIGHT_MANAGEMENT' | 'STRESS_MANAGEMENT' | 'CORPORATE';

export type TimelineEventType =
  | 'RETREAT' | 'PANCHAKARMA_STAGE' | 'ASSESSMENT' | 'GOAL'
  | 'YOGA_SESSION' | 'MEDITATION_SESSION' | 'MEAL' | 'MEDICINE'
  | 'DOCTOR_NOTE' | 'LIFESTYLE' | 'ACHIEVEMENT' | 'WEIGHT';

export interface Retreat {
  id: string;
  title: string;
  type: RetreatType;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  startDate: string;
  endDate: string;
  locationCity?: string;
  notes?: string;
}

export interface TimelineEvent {
  id?: string;
  kind?: 'EVENT' | 'RETREAT';
  type?: TimelineEventType;
  title: string;
  description?: string;
  occurredAt: string;
  metricName?: string;
  metricValue?: number;
  metricUnit?: string;
  tags?: string[];
}

export interface WellnessGoal {
  id: string;
  title: string;
  category?: string;
  metric?: string;
  targetValue?: number;
  currentValue?: number;
  unit?: string;
  status: 'ACTIVE' | 'COMPLETED' | 'ABANDONED';
}

export interface Conversation {
  otherId: string;
  lastMessage: { body?: string; kind?: string; createdAt: string; readAt?: string | null };
  unread: number;
}

export interface Community {
  id: string;
  slug: string;
  name: string;
  description?: string;
  category: string;
  memberCount: number;
  isPrivate: boolean;
}

export interface Doctor {
  id: string;             // DoctorProfile.id
  userId: string;
  firstName: string;
  lastName: string;
  qualifications: string;
  specialties: string[];
  yearsOfPractice: number;
  avatarUrl?: string;
  availableForChat: boolean;
}

export interface KnowledgeItem {
  id: string;
  kind: ContentKind;
  title: string;
  slug: string;
  summary?: string;
  bodyMarkdown?: string;
  mediaUrl?: string;
  durationSec?: number;
  tags: string[];
  publishedAt?: string;
  viewCount: number;
  likeCount: number;
}

export type ContentKind =
  | 'ARTICLE'
  | 'VIDEO'
  | 'PODCAST'
  | 'RECIPE'
  | 'YOGA_SESSION'
  | 'MEDITATION_SESSION'
  | 'FAQ'
  | 'STORY'
  | 'DOCTOR_TALK';

export interface EventItem {
  id: string;
  kind: 'LIVE_SESSION' | 'WORKSHOP' | 'WEBINAR' | 'DOCTOR_QA' | 'RETREAT_EVENT';
  title: string;
  description?: string;
  startsAt: string;
  endsAt: string;
  hostName?: string;
  capacity?: number;
  isPublished: boolean;
}

export interface Notification {
  id: string;
  channel: 'IN_APP' | 'EMAIL' | 'PUSH';
  title: string;
  body?: string;
  link?: string;
  readAt?: string | null;
  createdAt: string;
}
