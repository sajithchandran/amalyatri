/* eslint-disable no-console */
/**
 * Amal Yatri — initial database seed.
 *
 * Creates a credible Amal Tamara-backed world:
 *  - 2 doctors, 2 wellness guides, 3 demo Yatris + 1 admin
 *  - 2 sample retreats (1 Panchakarma, 1 Wellness) with stages
 *  - Community catalogue with all 12 spec categories
 *  - 6 knowledge items (article, recipe, video, podcast, meditation, yoga)
 *  - 4 upcoming events
 *  - 1 sample AI conversation
 *
 * Demo password for every seeded user:   "amalwell2026"
 * Run via:  npm run db:seed
 */

import {
  PrismaClient,
  UserRole,
  UserStatus,
  RetreatType,
  RetreatStatus,
  PanchakarmaStage,
  AssessmentKind,
  GoalStatus,
  PlanKind,
  PlanStatus,
  ReminderKind,
  TimelineEventType,
  ContentKind,
  EventKind,
  NotificationChannel,
  AiRole,
  PostKind,
} from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const PASSWORD = 'amalwell2026';

async function main() {
  console.log('🌿  Seeding Amal Yatri database…');

  // Wipe existing data (safe for demo)
  await prisma.$transaction([
    prisma.refreshToken.deleteMany(),
    prisma.session.deleteMany(),
    prisma.like.deleteMany(),
    prisma.comment.deleteMany(),
    prisma.communityPost.deleteMany(),
    prisma.communityMembership.deleteMany(),
    prisma.community.deleteMany(),
    prisma.doctorMessage.deleteMany(),
    prisma.consultation.deleteMany(),
    prisma.aiMessage.deleteMany(),
    prisma.aiConversation.deleteMany(),
    prisma.notification.deleteMany(),
    prisma.eventRegistration.deleteMany(),
    prisma.event.deleteMany(),
    prisma.knowledgeItem.deleteMany(),
    prisma.medicineReminder.deleteMany(),
    prisma.wellnessPlan.deleteMany(),
    prisma.wellnessGoal.deleteMany(),
    prisma.wellnessAssessment.deleteMany(),
    prisma.timelineEvent.deleteMany(),
    prisma.panchakarmaProgram.deleteMany(),
    prisma.retreat.deleteMany(),
    prisma.yatriProfile.deleteMany(),
    prisma.therapistProfile.deleteMany(),
    prisma.wellnessGuideProfile.deleteMany(),
    prisma.doctorProfile.deleteMany(),
    prisma.passwordResetToken.deleteMany(),
    prisma.emailVerificationToken.deleteMany(),
    prisma.mediaAsset.deleteMany(),
    prisma.auditLog.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  const passwordHash = await bcrypt.hash(PASSWORD, 10);

  // ── Admin ──────────────────────────────────────────────────────────────────
  const admin = await prisma.user.create({
    data: {
      email: 'admin@amalyatri.com',
      passwordHash,
      role: UserRole.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
      emailVerified: true,
    },
  });

  // ── Doctors ────────────────────────────────────────────────────────────────
  const drDevi = await prisma.user.create({
    data: {
      email: 'devi@amaltamara.com',
      passwordHash,
      role: UserRole.DOCTOR,
      status: UserStatus.ACTIVE,
      emailVerified: true,
      doctorProfile: {
        create: {
          firstName: 'Dr. Devi',
          lastName: 'Nair',
          qualifications: 'BAMS, MD (Ayurveda) — 18 years',
          specialties: ['Panchakarma', 'Marma', "Women's Wellness"],
          bio: 'Chief Physician at Amal Tamara. Devi's clinical work focuses on classical Panchakarma and women’s hormonal balance.',
          yearsOfPractice: 18,
          languages: ['English', 'Malayalam', 'Hindi'],
          availableForChat: true,
        },
      },
    },
    include: { doctorProfile: true },
  });

  const drArjun = await prisma.user.create({
    data: {
      email: 'arjun@amaltamara.com',
      passwordHash,
      role: UserRole.DOCTOR,
      status: UserStatus.ACTIVE,
      emailVerified: true,
      doctorProfile: {
        create: {
          firstName: 'Dr. Arjun',
          lastName: 'Menon',
          qualifications: 'BAMS, Fellowship (Kayachikitsa)',
          specialties: ['Stress', 'Sleep', 'Metabolic Health'],
          bio: 'Focuses on chronic stress reversal and metabolic reset programs for guests returning from urban burnout.',
          yearsOfPractice: 11,
          languages: ['English', 'Malayalam', 'Tamil'],
          availableForChat: true,
        },
      },
    },
    include: { doctorProfile: true },
  });

  // ── Wellness Guides ────────────────────────────────────────────────────────
  await prisma.user.create({
    data: {
      email: 'maya@amaltamara.com',
      passwordHash,
      role: UserRole.WELLNESS_GUIDE,
      status: UserStatus.ACTIVE,
      emailVerified: true,
      guideProfile: {
        create: {
          firstName: 'Maya',
          lastName: 'Krishnan',
          speciality: 'Hatha Yoga',
          bio: 'Yoga teacher with 12 years of practice; gentle, breath-led style rooted in the Krishnamacharya lineage.',
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      email: 'siddharth@amaltamara.com',
      passwordHash,
      role: UserRole.WELLNESS_GUIDE,
      status: UserStatus.ACTIVE,
      emailVerified: true,
      guideProfile: {
        create: {
          firstName: 'Siddharth',
          lastName: 'Pillai',
          speciality: 'Mindfulness & Pranayama',
          bio: 'Vipassana practitioner; teaches morning meditation and breathwork across Amal retreats.',
        },
      },
    },
  });

  // ── Demo Yatris ────────────────────────────────────────────────────────────
  const yatriAarti = await prisma.user.create({
    data: {
      email: 'aarti@example.com',
      passwordHash,
      role: UserRole.YATRI,
      status: UserStatus.ACTIVE,
      emailVerified: true,
      yatriProfile: {
        create: {
          firstName: 'Aarti',
          lastName: 'Sharma',
          displayName: 'Aarti',
          bio: 'Mumbai · completed my first 14-day Panchakarma in 2023, here to keep the momentum alive.',
          city: 'Mumbai',
          country: 'India',
          preferredLanguage: 'en',
          timezone: 'Asia/Kolkata',
          wellnessScore: 78,
        },
      },
    },
    include: { yatriProfile: true },
  });

  const yatriRavi = await prisma.user.create({
    data: {
      email: 'ravi@example.com',
      passwordHash,
      role: UserRole.YATRI,
      status: UserStatus.ACTIVE,
      emailVerified: true,
      yatriProfile: {
        create: {
          firstName: 'Ravi',
          lastName: 'Iyer',
          displayName: 'Ravi',
          city: 'Bengaluru',
          country: 'India',
          preferredLanguage: 'en',
          timezone: 'Asia/Kolkata',
          wellnessScore: 64,
        },
      },
    },
    include: { yatriProfile: true },
  });

  const yatriLena = await prisma.user.create({
    data: {
      email: 'lena@example.com',
      passwordHash,
      role: UserRole.YATRI,
      status: UserStatus.ACTIVE,
      emailVerified: true,
      yatriProfile: {
        create: {
          firstName: 'Lena',
          lastName: 'Meier',
          displayName: 'Lena',
          city: 'Zurich',
          country: 'Switzerland',
          preferredLanguage: 'en',
          timezone: 'Europe/Zurich',
          wellnessScore: 81,
        },
      },
    },
    include: { yatriProfile: true },
  });

  const yatriProfileIds = [yatriAarti.yatriProfile!.id, yatriRavi.yatriProfile!.id, yatriLena.yatriProfile!.id];
  const yatriUserIds   = [yatriAarti.id, yatriRavi.id, yatriLena.id];

  // ── Retreats ───────────────────────────────────────────────────────────────
  const aartiRetreat = await prisma.retreat.create({
    data: {
      yatriId: yatriAarti.yatriProfile!.id,
      title: '14-day Panchakarma — January 2023',
      type: RetreatType.PANCHAKARMA,
      status: RetreatStatus.COMPLETED,
      startDate: new Date('2023-01-08'),
      endDate: new Date('2023-01-22'),
      notes: 'Classic Vamana followed by Virechana. Mild Kapha aggravation at start.',
    },
  });

  await prisma.retreat.create({
    data: {
      yatriId: yatriAarti.yatriProfile!.id,
      title: '7-day Wellness Reset — September 2024',
      type: RetreatType.WELLNESS,
      status: RetreatStatus.COMPLETED,
      startDate: new Date('2024-09-14'),
      endDate: new Date('2024-09-21'),
    },
  });

  const raviRetreat = await prisma.retreat.create({
    data: {
      yatriId: yatriRavi.yatriProfile!.id,
      title: '21-day Stress Recovery — March 2024',
      type: RetreatType.STRESS_MANAGEMENT,
      status: RetreatStatus.COMPLETED,
      startDate: new Date('2024-03-04'),
      endDate: new Date('2024-03-25'),
    },
  });

  // Panchakarma stages for Aarti's first retreat
  const stages: { stage: PanchakarmaStage; name: string; day: number }[] = [
    { stage: PanchakarmaStage.PURVAKARMA,   name: 'Snehana (Internal Oleation)', day: 1 },
    { stage: PanchakarmaStage.PURVAKARMA,   name: 'Swedana (Medicated Steam)',  day: 4 },
    { stage: PanchakarmaStage.PRADHANAKARMA, name: 'Vamana (Therapeutic Emesis)', day: 6 },
    { stage: PanchakarmaStage.PRADHANAKARMA, name: 'Virechana (Purgation)',     day: 9 },
    { stage: PanchakarmaStage.PRADHANAKARMA, name: 'Basti (Medicated Enema)',   day: 11 },
    { stage: PanchakarmaStage.PASHCHATKARMA, name: 'Rasayana (Rejuvenation)',   day: 14 },
  ];
  for (const s of stages) {
    await prisma.panchakarmaProgram.create({
      data: {
        retreatId: aartiRetreat.id,
        stage: s.stage,
        name: s.name,
        startDate: new Date(2023, 0, 7 + s.day),
        endDate:   new Date(2023, 0, 7 + s.day + 2),
      },
    });
  }

  // ── Wellness plan + reminders + timeline events for Aarti ─────────────────
  const yogaPlan = await prisma.wellnessPlan.create({
    data: {
      kind: PlanKind.YOGA,
      status: PlanStatus.ACTIVE,
      title: 'Daily 25-minute Hatha Routine',
      description: 'Breath-led sequence designed by Maya for Kapha balance.',
      assignedToUserId: yatriAarti.id,
      payload: {
        sessionsPerWeek: 6,
        averageMinutes: 25,
        focus: ['spine mobility', 'pranayama', 'gentle twists'],
      },
    },
  });

  await prisma.medicineReminder.createMany({
    data: [
      {
        yatriUserId: yatriAarti.id,
        planId: yogaPlan.id,
        kind: ReminderKind.YOGA,
        title: 'Morning Hatha',
        timesLocal: ['06:30'],
        timezone: 'Asia/Kolkata',
      },
      {
        yatriUserId: yatriAarti.id,
        planId: yogaPlan.id,
        kind: ReminderKind.MEDITATION,
        title: 'Sit. Breathe.',
        timesLocal: ['21:00'],
        timezone: 'Asia/Kolkata',
      },
      {
        yatriUserId: yatriAarti.id,
        kind: ReminderKind.HABIT,
        title: 'Warm lemon water',
        timesLocal: ['06:00'],
        timezone: 'Asia/Kolkata',
      },
    ],
  });

  // Timeline: 8 events scattered across the last 12 months
  const now = new Date();
  const events = [
    { d: -340, type: TimelineEventType.RETREAT,         title: 'Returned from 14-day Panchakarma' },
    { d: -270, type: TimelineEventType.ASSESSMENT,      title: 'Quarterly check-in with Dr Devi' },
    { d: -200, type: TimelineEventType.GOAL,            title: 'Set goal: sleep 7+ hours nightly' },
    { d: -160, type: TimelineEventType.YOGA_SESSION,    title: 'Completed 90-day Hatha streak' },
    { d: -110, type: TimelineEventType.MEDICINE,        title: 'Triphala churna — daily' },
    { d:  -60, type: TimelineEventType.WEIGHT,         title: 'Stable at 58 kg', metricName: 'weight_kg', metricValue: 58, metricUnit: 'kg' },
    { d:  -21, type: TimelineEventType.DOCTOR_NOTE,     title: 'Dr Devi: continue current pace' },
    { d:   -3, type: TimelineEventType.ACHIEVEMENT,    title: '180 consecutive days of morning yoga' },
  ];
  for (const e of events) {
    const date = new Date(now.getTime() + e.d * 24 * 3600 * 1000);
    await prisma.timelineEvent.create({
      data: {
        yatriUserId: yatriAarti.id,
        yatriProfileId: yatriAarti.yatriProfile!.id,
        type: e.type,
        title: e.title,
        occurredAt: date,
        metricName: e.metricName,
        metricValue: e.metricValue,
        metricUnit: e.metricUnit,
        tags: e.type === TimelineEventType.ACHIEVEMENT ? ['milestone', 'yoga'] : [],
      },
    });
  }

  // Goals
  await prisma.wellnessGoal.createMany({
    data: [
      {
        yatriUserId: yatriAarti.id,
        title: 'Sleep 7+ hours every night',
        category: 'sleep',
        metric: 'sleep_hours',
        targetValue: 7,
        currentValue: 6.4,
        unit: 'hrs',
        status: GoalStatus.ACTIVE,
      },
      {
        yatriUserId: yatriAarti.id,
        title: 'Daily 25-min yoga',
        category: 'fitness',
        metric: 'yoga_streak_days',
        targetValue: 365,
        currentValue: 180,
        unit: 'days',
        status: GoalStatus.ACTIVE,
      },
      {
        yatriUserId: raviI(yatriRavi.id, '6-min breathwork twice daily', 'breathwork', null, null, 14, GoalStatus.ACTIVE),
      },
    ].filter(Boolean) as any,
  });

  // ── Communities (all 12 categories from the brief) ────────────────────────
  const communityDefs = [
    { slug: 'panchakarma-alumni',  name: 'Panchakarma Alumni',         category: 'Panchakarma Alumni' },
    { slug: 'stress-management',   name: 'Stress Management',          category: 'Stress Management' },
    { slug: 'back-pain',           name: 'Back Pain & Spinal Care',     category: 'Back Pain' },
    { slug: 'cervical-care',       name: 'Cervical Care',              category: 'Cervical Care' },
    { slug: 'diabetes',            name: 'Living Well with Diabetes',   category: 'Diabetes' },
    { slug: 'healthy-ageing',      name: 'Healthy Ageing',             category: 'Healthy Ageing' },
    { slug: 'yoga',                name: 'Yoga',                       category: 'Yoga' },
    { slug: 'meditation',          name: 'Meditation',                 category: 'Meditation' },
    { slug: 'healthy-cooking',     name: 'Healthy Cooking',            category: 'Healthy Cooking' },
    { slug: 'womens-wellness',     name: "Women's Wellness",           category: "Women's Wellness" },
    { slug: 'weight-management',   name: 'Weight Management',          category: 'Weight Management' },
    { slug: 'corporate-wellness',  name: 'Corporate Wellness',         category: 'Corporate Wellness' },
  ];

  for (const c of communityDefs) {
    const community = await prisma.community.create({
      data: { ...c, description: `A calm, moderated space for ${c.name.toLowerCase()}.` },
    });
    // Auto-enrol seeded Yatris into all communities as MEMBER
    for (const userId of yatriUserIds) {
      await prisma.communityMembership.create({
        data: { communityId: community.id, userId, role: 'MEMBER' },
      });
    }
    await prisma.community.update({
      where: { id: community.id },
      data: { memberCount: yatriUserIds.length },
    });
  }

  // A pinned welcome post in the Panchakarma Alumni community by Dr Devi
  const alumni = await prisma.community.findUnique({ where: { slug: 'panchakarma-alumni' } });
  if (alumni) {
    const welcomePost = await prisma.communityPost.create({
      data: {
        communityId: alumni.id,
        authorId: drDevi.id,
        authorDoctorId: drDevi.doctorProfile!.id,
        kind: PostKind.STORY,
        title: 'Welcome, Yatris 🌿',
        body: 'This is your lifelong circle. Ask, share, reflect. I will drop in every Tuesday.',
        pinned: true,
        expertAnswered: true,
      },
    });
    await prisma.like.create({ data: { postId: welcomePost.id, userId: yatriAarti.id } });
    await prisma.comment.create({
      data: {
        postId: welcomePost.id,
        authorId: yatriAarti.id,
        body: 'Thank you, Doctor. So glad this exists.',
      },
    });
  }

  // ── Knowledge library ──────────────────────────────────────────────────────
  await prisma.knowledgeItem.createMany({
    data: [
      {
        kind: ContentKind.ARTICLE,
        title: 'Why Virechana feels like spring for your gut',
        slug: 'virechana-spring-cleanse',
        summary: 'A grounded explainer of how classical Virechana resets Pitta and digestion.',
        bodyMarkdown: '# Virechana\n\nVirechana is the **therapeutic purgation** procedure…',
        authorDoctorId: drDevi.doctorProfile!.id,
        tags: ['panchakarma', 'pitta', 'digestion'],
        publishedAt: new Date(now.getTime() - 14 * 86400000),
      },
      {
        kind: ContentKind.RECIPE,
        title: 'Kitchari — the healing one-pot meal',
        slug: 'kitchari-recipe',
        summary: 'Mung dal + basmati rice + gentle spices. Made for monsoons, recovery, and reset.',
        bodyMarkdown: '## Ingredients\n- 1 cup yellow mung dal…',
        tags: ['recipe', 'cure-cuisine'],
        publishedAt: new Date(now.getTime() - 30 * 86400000),
      },
      {
        kind: ContentKind.YOGA_SESSION,
        title: '25-minute Morning Hatha with Maya',
        slug: 'morning-hatha-maya',
        summary: 'A breath-led sequence to wake the spine gently.',
        mediaUrl: 'https://cdn.amalyatri.com/demo/morning-hatha.mp4',
        durationSec: 25 * 60,
        tags: ['hatha', 'morning', 'beginner-friendly'],
        publishedAt: new Date(now.getTime() - 7 * 86400000),
      },
      {
        kind: ContentKind.MEDITATION_SESSION,
        title: 'Body-scan in stillness (10 minutes)',
        slug: 'body-scan-10m',
        summary: 'A simple Vipassana-style body scan guided by Siddharth.',
        mediaUrl: 'https://cdn.amalyatri.com/demo/body-scan.mp3',
        durationSec: 10 * 60,
        tags: ['meditation', 'vipassana'],
        publishedAt: new Date(now.getTime() - 5 * 86400000),
      },
      {
        kind: ContentKind.PODCAST,
        title: 'Inside Panchakarma — a doctor’s perspective',
        slug: 'inside-panchakarma',
        summary: 'Dr Devi and Dr Arjun on what really happens during a 21-day Panchakarma.',
        mediaUrl: 'https://cdn.amalyatri.com/demo/inside-pk.mp3',
        durationSec: 42 * 60,
        tags: ['podcast', 'panchakarma'],
        publishedAt: new Date(now.getTime() - 21 * 86400000),
      },
      {
        kind: ContentKind.DOCTOR_TALK,
        title: 'Sleep and circadian rhythm',
        slug: 'sleep-circadian',
        summary: 'A live talk with Dr Arjun on resetting sleep architecture naturally.',
        tags: ['sleep', 'doctor-talk'],
        publishedAt: new Date(now.getTime() - 60 * 86400000),
      },
    ],
  });

  // ── Events ─────────────────────────────────────────────────────────────────
  await prisma.event.createMany({
    data: [
      {
        kind: EventKind.DOCTOR_QA,
        title: 'Live Q&A with Dr Devi — Hormones & Cycles',
        description: 'A monthly open hour. Bring questions.',
        startsAt: new Date(now.getTime() + 7 * 86400000),
        endsAt:   new Date(now.getTime() + 7 * 86400000 + 60 * 60 * 1000),
        hostName: 'Dr. Devi Nair',
        capacity: 200,
        isPublished: true,
      },
      {
        kind: EventKind.WORKSHOP,
        title: 'Workshop: Building a home yoga routine',
        startsAt: new Date(now.getTime() + 14 * 86400000),
        endsAt:   new Date(now.getTime() + 14 * 86400000 + 90 * 60 * 1000),
        hostName: 'Maya Krishnan',
        capacity: 50,
        isPublished: true,
      },
      {
        kind: EventKind.MEDITATION_SESSION,
        title: 'Sunday Sit — Guided Vipassana (45m)',
        startsAt: new Date(now.getTime() + 3 * 86400000),
        endsAt:   new Date(now.getTime() + 3 * 86400000 + 45 * 60 * 1000),
        hostName: 'Siddharth Pillai',
        isPublished: true,
      },
      {
        kind: EventKind.RETREAT_EVENT,
        title: 'Amal Tamara Reunion — Bangalore',
        startsAt: new Date(now.getTime() + 60 * 86400000),
        endsAt:   new Date(now.getTime() + 60 * 86400000 + 4 * 3600 * 1000),
        hostName: 'Amal Tamara',
        isPublished: true,
      },
    ],
  });

  // ── AI conversation snippet ────────────────────────────────────────────────
  const conv = await prisma.aiConversation.create({
    data: {
      userId: yatriAarti.id,
      title: 'Light evening yoga ideas',
      topic: 'yoga',
    },
  });
  await prisma.aiMessage.createMany({
    data: [
      { conversationId: conv.id, role: AiRole.USER,      content: 'I have 20 minutes tonight. Something calming?' },
      { conversationId: conv.id, role: AiRole.ASSISTANT, content: 'A gentle supine sequence with long holds and 4-7-8 breath would be a beautiful choice tonight. I can show the sequence — would you like that next?' },
    ],
  });

  // ── Notifications ──────────────────────────────────────────────────────────
  await prisma.notification.createMany({
    data: [
      { userId: yatriAarti.id, channel: NotificationChannel.IN_APP, title: 'Dr Devi replied to your message' },
      { userId: yatriAarti.id, channel: NotificationChannel.PUSH,    title: 'Evening meditation in 15 minutes' },
      { userId: raviI(yatriRavi.id, NotificationChannel.IN_APP, 'Your weekly wellness summary is ready'),
    ].filter(Boolean) as any,
  });

  console.log('✅  Seed complete.');
  console.log(`   Admin:    admin@amalyatri.com      /  ${PASSWORD}`);
  console.log(`   Doctor 1: devi@amaltamara.com     /  ${PASSWORD}`);
  console.log(`   Doctor 2: arjun@amaltamara.com    /  ${PASSWORD}`);
  console.log(`   Yatri 1:  aarti@example.com       /  ${PASSWORD}`);
  console.log(`   Yatri 2:  ravi@example.com        /  ${PASSWORD}`);
  console.log(`   Yatri 3:  lena@example.com        /  ${PASSWORD}`);
}

// Helper that returns either an object or null so we can interleave safely
function raviI<T extends Record<string, unknown>>(
  userId: string,
  title: string,
  category?: string,
  metric?: string | null,
  unit?: string | null,
  targetValue?: number,
  status?: GoalStatus,
): T | null {
  if (!userId) return null;
  return {
    yatriUserId: userId,
    title,
    category: category ?? 'habit',
    metric: metric ?? null,
    targetValue: targetValue ?? null,
    unit: unit ?? null,
    status: status ?? GoalStatus.ACTIVE,
  } as T;
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
