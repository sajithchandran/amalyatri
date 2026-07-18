/* eslint-disable no-console */
/**
 * Amal Yatri — seed patients data against doctors.
 *
 * Creates:
 *  - DoctorMessages: patient-doctor conversations with back-and-forth
 *  - Consultations: scheduled and completed consultations
 *  - Wellness goals + timeline events for richer patient profiles
 *
 * Run after the main seed:
 *   DATABASE_URL="..." npx ts-node --transpile-only packages/prisma/prisma/seed-patients.ts
 */

import { PrismaClient, ConsultationStatus, ConsultationMode, GoalStatus, TimelineEventType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌿  Seeding patient-doctor data…');

  // ── Fetch existing users ────────────────────────────────────────────────
  const drDevi = await prisma.user.findUniqueOrThrow({
    where: { email: 'devi@amaltamara.com' },
    include: { doctorProfile: true },
  });

  const drArjun = await prisma.user.findUniqueOrThrow({
    where: { email: 'arjun@amaltamara.com' },
    include: { doctorProfile: true },
  });

  const aarti = await prisma.user.findUniqueOrThrow({
    where: { email: 'aarti@example.com' },
    include: { yatriProfile: true },
  });

  const ravi = await prisma.user.findUniqueOrThrow({
    where: { email: 'ravi@example.com' },
    include: { yatriProfile: true },
  });

  const lena = await prisma.user.findUniqueOrThrow({
    where: { email: 'lena@example.com' },
    include: { yatriProfile: true },
  });

  // ══════════════════════════════════════════════════════════════════════════
  // Assign patients to doctors
  // ══════════════════════════════════════════════════════════════════════════
  // Aarti is assigned to both Dr. Devi and Dr. Arjun
  await prisma.doctorPatientAssignment.create({
    data: { doctorId: drDevi.doctorProfile!.id, patientUserId: aarti.id, assignedBy: drDevi.id, notes: 'Primary: post-Panchakarma follow-up' },
  });
  await prisma.doctorPatientAssignment.create({
    data: { doctorId: drArjun.doctorProfile!.id, patientUserId: aarti.id, assignedBy: drArjun.id, notes: 'Secondary: stress & shoulder tension' },
  });

  // Ravi is assigned to Dr. Arjun
  await prisma.doctorPatientAssignment.create({
    data: { doctorId: drArjun.doctorProfile!.id, patientUserId: ravi.id, assignedBy: drArjun.id, notes: 'Stress management & gut health' },
  });

  // Lena is assigned to Dr. Devi
  await prisma.doctorPatientAssignment.create({
    data: { doctorId: drDevi.doctorProfile!.id, patientUserId: lena.id, assignedBy: drDevi.id, notes: 'Post-retreat long-distance care' },
  });

  // Helper: create a message
  async function msg(senderId: string, recipientId: string, body: string, kind: 'TEXT' | 'VOICE' | 'IMAGE' | 'DOCUMENT' = 'TEXT', read = true, minutesAgo = 60) {
    return prisma.doctorMessage.create({
      data: {
        senderId,
        recipientId,
        kind,
        body,
        readAt: read ? new Date(Date.now() - minutesAgo * 60 * 1000 + 60000) : null,
        createdAt: new Date(Date.now() - minutesAgo * 60 * 1000),
      },
    });
  }

  // ══════════════════════════════════════════════════════════════════════════
  // Aarti ↔ Dr. Devi — post-retreat follow-up
  // ══════════════════════════════════════════════════════════════════════════
  await msg(aarti.id, drDevi.id, 'Good morning Dr. Devi — my sleep has been restless the past few nights. Waking up around 3am and struggling to get back.', 'TEXT', true, 1440);
  await msg(drDevi.id, aarti.id, 'Good morning Aarti. That sounds like a mild Vata spike — common after a cleanse. Try a warm foot massage with sesame oil before bed and a cup of warm milk with a pinch of nutmeg.', 'TEXT', true, 1380);
  await msg(aarti.id, drDevi.id, 'Thank you — the foot massage helped last night. I slept through till 5:30am. Should I continue the Ashwagandha?', 'TEXT', true, 600);
  await msg(drDevi.id, aarti.id, 'Yes, continue the Ashwagandha (500mg after dinner) for another 2 weeks, then we will reassess. Let me know if the 3am waking returns.', 'TEXT', true, 540);
  await msg(aarti.id, drDevi.id, 'Will do. Also, the constipation has eased significantly — thank you for adjusting the Triphala dosage.', 'TEXT', true, 120);
  await msg(drDevi.id, aarti.id, 'Wonderful. That is a good sign your Agni is stabilising. Keep me posted.', 'TEXT', false, 30);

  // Aarti ↔ Dr. Arjun — stress management
  await msg(aarti.id, drArjun.id, 'Hello Dr. Arjun — I have been feeling some tension in my shoulders again. The exercises you gave me help but the relief is temporary.', 'TEXT', true, 4320);
  await msg(drArjun.id, aarti.id, 'Hi Aarti. Shoulder tension can be stubborn. Let us add a 5-minute neck release before your morning practice — I will share a video.', 'TEXT', true, 4260);
  await msg(aarti.id, drArjun.id, 'That would be great, thank you.', 'TEXT', true, 4200);
  await msg(drArjun.id, aarti.id, 'Here is the link: https://amaltamara.com/videos/neck-release. 3 rounds each side, slow breath.', 'DOCUMENT', true, 4140);
  await msg(aarti.id, drArjun.id, 'Just did the neck release routine — it really helps. I feel the difference already.', 'TEXT', true, 60);

  // ══════════════════════════════════════════════════════════════════════════
  // Ravi ↔ Dr. Arjun — chronic stress & sleep
  // ══════════════════════════════════════════════════════════════════════════
  await msg(ravi.id, drArjun.id, 'Dr. Arjun — my stress levels have been high this week. Work deadlines. Feeling it in my gut again.', 'TEXT', true, 2880);
  await msg(drArjun.id, ravi.id, 'Ravi, I am sorry to hear that. Gut is often the first to speak. Stick to the kitchari meal plan and avoid cold drinks. Can we schedule a check-in?', 'TEXT', true, 2820);
  await msg(ravi.id, drArjun.id, 'Yes please. How about Friday afternoon?', 'TEXT', true, 2760);
  await msg(drArjun.id, ravi.id, 'Friday at 4pm works. I will send a calendar invite.', 'TEXT', true, 2700);
  await msg(ravi.id, drArjun.id, 'Thank you. The kitchari helped today — I had it for lunch and felt much calmer after.', 'TEXT', true, 2400);
  await msg(drArjun.id, ravi.id, 'Good. Kitchari is grounding. Stick with it for 3 more days and let us talk Friday.', 'TEXT', true, 2340);
  await msg(ravi.id, drArjun.id, 'Update: feeling much better today. Sleep has improved and the bloating is gone.', 'TEXT', true, 60);
  await msg(drArjun.id, ravi.id, 'Excellent news. Your body is responding. We will still do the check-in Friday to plan the next phase.', 'TEXT', false, 30);

  // ══════════════════════════════════════════════════════════════════════════
  // Lena ↔ Dr. Devi — post-retreat recovery (long-distance)
  // ══════════════════════════════════════════════════════════════════════════
  await msg(lena.id, drDevi.id, 'Dr. Devi — I have been feeling low energy since returning to Zurich. The winter is heavy here.', 'TEXT', true, 7200);
  await msg(drDevi.id, lena.id, 'Lena, seasonal transition is real. Your body went from tropical Kerala to Swiss winter. Increase your morning sun exposure and take 1 tsp of Chyawanprash daily.', 'TEXT', true, 7140);
  await msg(lena.id, drDevi.id, 'I got the Chyawanprash from an Indian store here. How long until I feel the difference?', 'TEXT', true, 6000);
  await msg(drDevi.id, lena.id, 'Usually 7-10 days. Also, consider a warm sesame oil self-massage (Abhyanga) before your shower — it will help ground the Vata.', 'TEXT', true, 5940);
  await msg(lena.id, drDevi.id, 'Tried the Abhyanga today — wow, it was exactly what I needed. My skin feels alive again.', 'TEXT', true, 1440);
  await msg(lena.id, drDevi.id, 'Also — I have been getting headaches in the afternoon. Could it be related?', 'TEXT', true, 720);
  await msg(drDevi.id, lena.id, 'Afternoon headaches can indicate heat build-up (Pitta). Try a cooling diet — cucumber, coconut water, mint. And avoid hot yoga for now.', 'TEXT', true, 660);
  await msg(lena.id, drDevi.id, 'That makes sense. I was doing hot yoga 3x a week. I will switch to gentle Hatha.', 'TEXT', true, 360);
  await msg(drDevi.id, lena.id, 'Good call. Let me know how you feel in a week.', 'TEXT', false, 60);

  // ══════════════════════════════════════════════════════════════════════════
  // Consultations
  // ══════════════════════════════════════════════════════════════════════════

  // Aarti completed consultation with Dr. Devi
  await prisma.consultation.create({
    data: {
      patientUserId: aarti.id,
      doctorProfileId: drDevi.doctorProfile!.id,
      status: ConsultationStatus.COMPLETED,
      mode: ConsultationMode.VIDEO,
      scheduledFor: new Date('2026-07-10T10:00:00Z'),
      startedAt: new Date('2026-07-10T10:05:00Z'),
      endedAt: new Date('2026-07-10T10:35:00Z'),
      patientNote: 'Discussed sleep issues and Triphala dosage adjustment.',
      doctorNote: 'Patient responding well to adjusted dosage. Continue current protocol for 2 more weeks.',
      aiSummary: 'Follow-up consultation for post-Panchakarma recovery. Sleep disturbance resolved. Constipation improved. Plan: continue Ashwagandha, reassess in 2 weeks.',
    },
  });

  // Ravi completed consultation with Dr. Arjun
  await prisma.consultation.create({
    data: {
      patientUserId: ravi.id,
      doctorProfileId: drArjun.doctorProfile!.id,
      status: ConsultationStatus.COMPLETED,
      mode: ConsultationMode.VIDEO,
      scheduledFor: new Date('2026-07-08T16:00:00Z'),
      startedAt: new Date('2026-07-08T16:05:00Z'),
      endedAt: new Date('2026-07-08T16:40:00Z'),
      patientNote: 'Stress management and gut health review.',
      doctorNote: 'Significant improvement in sleep and digestion. Recommending gradual return to normal diet.',
      aiSummary: 'Stress management follow-up. Patient reported work-related stress affecting digestion. Kitchari diet showed good results. Plan: continue diet modification, schedule next check-in 2 weeks.',
    },
  });

  // Lena scheduled consultation with Dr. Devi
  await prisma.consultation.create({
    data: {
      patientUserId: lena.id,
      doctorProfileId: drDevi.doctorProfile!.id,
      status: ConsultationStatus.SCHEDULED,
      mode: ConsultationMode.VIDEO,
      scheduledFor: new Date('2026-07-22T14:00:00Z'),
      patientNote: 'Post-retreat recovery, low energy, afternoon headaches.',
      doctorNote: '',
    },
  });

  // Aarti scheduled consultation with Dr. Arjun
  await prisma.consultation.create({
    data: {
      patientUserId: aarti.id,
      doctorProfileId: drArjun.doctorProfile!.id,
      status: ConsultationStatus.SCHEDULED,
      mode: ConsultationMode.VIDEO,
      scheduledFor: new Date('2026-07-25T11:00:00Z'),
      patientNote: 'Follow-up on shoulder tension and neck release routine.',
      doctorNote: '',
    },
  });

  // ══════════════════════════════════════════════════════════════════════════
  // Wellness Goals for patients (to show in admin dashboard)
  // ══════════════════════════════════════════════════════════════════════════
  const goalData = [
    { userId: aarti.id, title: 'Improve sleep quality', detail: 'Reduce 3am waking episodes', category: 'sleep', target: 7, unit: 'hours', status: GoalStatus.ACTIVE },
    { userId: aarti.id, title: 'Daily yoga practice', detail: 'Complete 25-min Hatha routine', category: 'fitness', target: 6, unit: 'sessions/week', status: GoalStatus.ACTIVE },
    { userId: ravi.id, title: 'Reduce stress levels', detail: 'Practice 10-min meditation daily', category: 'mindfulness', target: 7, unit: 'days/week', status: GoalStatus.ACTIVE },
    { userId: ravi.id, title: 'Gut health recovery', detail: 'Follow kitchari-based meal plan', category: 'nutrition', target: 14, unit: 'days', status: GoalStatus.COMPLETED },
    { userId: lena.id, title: 'Boost energy levels', detail: 'Establish morning sun exposure + Chyawanprash', category: 'nutrition', target: 21, unit: 'days', status: GoalStatus.ACTIVE },
    { userId: lena.id, title: 'Cooling diet transition', detail: 'Reduce hot yoga, incorporate cooling foods', category: 'nutrition', target: 14, unit: 'days', status: GoalStatus.ACTIVE },
  ];

  for (const g of goalData) {
    await prisma.wellnessGoal.create({
      data: {
        yatriUserId: g.userId,
        title: g.title,
        detail: g.detail,
        category: g.category,
        targetValue: g.target,
        unit: g.unit,
        status: g.status,
        currentValue: g.status === GoalStatus.COMPLETED ? g.target : Math.floor(g.target * 0.6),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        completedAt: g.status === GoalStatus.COMPLETED ? new Date() : undefined,
      },
    });
  }

  // ══════════════════════════════════════════════════════════════════════════
  // Timeline events for a richer patient profile
  // ══════════════════════════════════════════════════════════════════════════
  const timelineData = [
    { userId: aarti.id, type: TimelineEventType.MEDITATION_SESSION, title: 'Morning meditation — 15 min', occurredAt: new Date(Date.now() - 1 * 60 * 60 * 1000) },
    { userId: aarti.id, type: TimelineEventType.YOGA_SESSION, title: 'Hatha Yoga — 30 min', occurredAt: new Date(Date.now() - 3 * 60 * 60 * 1000) },
    { userId: aarti.id, type: TimelineEventType.MEAL, title: 'Kitchari lunch', occurredAt: new Date(Date.now() - 6 * 60 * 60 * 1000) },
    { userId: aarti.id, type: TimelineEventType.WEIGHT, title: 'Weight measurement', metricName: 'weight', metricValue: 62.5, metricUnit: 'kg', occurredAt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    { userId: ravi.id, type: TimelineEventType.MEDITATION_SESSION, title: 'Breathwork — 10 min', occurredAt: new Date(Date.now() - 2 * 60 * 60 * 1000) },
    { userId: ravi.id, type: TimelineEventType.DOCTOR_NOTE, title: 'Dr. Arjun noted: digestion improving', occurredAt: new Date(Date.now() - 12 * 60 * 60 * 1000) },
    { userId: ravi.id, type: TimelineEventType.MEAL, title: 'Kitchari dinner', occurredAt: new Date(Date.now() - 14 * 60 * 60 * 1000) },
    { userId: lena.id, type: TimelineEventType.YOGA_SESSION, title: 'Gentle Hatha — 20 min (Swiss winter routine)', occurredAt: new Date(Date.now() - 4 * 60 * 60 * 1000) },
    { userId: lena.id, type: TimelineEventType.MEAL, title: 'Cooling lunch: cucumber salad + coconut water', occurredAt: new Date(Date.now() - 7 * 60 * 60 * 1000) },
    { userId: lena.id, type: TimelineEventType.LIFESTYLE, title: 'Abhyanga self-massage (sesame oil)', occurredAt: new Date(Date.now() - 10 * 60 * 60 * 1000) },
  ];

  for (const t of timelineData) {
    await prisma.timelineEvent.create({
      data: {
        yatriUserId: t.userId,
        type: t.type,
        title: t.title,
        metricName: (t as any).metricName,
        metricValue: (t as any).metricValue,
        metricUnit: (t as any).metricUnit,
        occurredAt: t.occurredAt,
        tags: ['seed-data'],
      },
    });
  }

  console.log('✅  Patient data seeded.');
  console.log('   Messages:      Aarti ↔ Dr. Devi (6), Aarti ↔ Dr. Arjun (5), Ravi ↔ Dr. Arjun (8), Lena ↔ Dr. Devi (9)');
  console.log('   Consultations: 2 completed, 2 scheduled');
  console.log('   Goals:         6 wellness goals');
  console.log('   Assignments:   Aarti → Dr. Devi & Dr. Arjun, Ravi → Dr. Arjun, Lena → Dr. Devi');
  console.log('   Timeline:      10 timeline events');
}

main()
  .catch((e) => {
    console.error('❌', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
