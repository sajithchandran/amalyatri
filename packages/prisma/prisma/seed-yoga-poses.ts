/* eslint-disable no-console */
/**
 * Seed the Yoga Pose master catalog with real yoga poses and images.
 *
 * Run:
 *   DATABASE_URL="..." npx ts-node --transpile-only packages/prisma/prisma/seed-yoga-poses.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const yogaPoses = [
  {
    title: 'Sun Salutation (Surya Namaskar)',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
    description: 'A flowing sequence of 12 poses coordinated with breath. Great for warming up the entire body.',
    durationMin: 15,
    difficulty: 'beginner',
    tags: ['morning', 'full-body', 'warm-up', 'breathwork'],
  },
  {
    title: 'Downward-Facing Dog (Adho Mukha Svanasana)',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
    description: 'An inverted pose that stretches the hamstrings, calves, and spine while building upper body strength.',
    durationMin: 5,
    difficulty: 'beginner',
    tags: ['stretch', 'strength', 'back', 'hamstrings'],
  },
  {
    title: 'Tree Pose (Vrikshasana)',
    imageUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&q=80',
    description: 'A balancing pose that strengthens the legs and improves focus and stability.',
    durationMin: 5,
    difficulty: 'beginner',
    tags: ['balance', 'legs', 'focus', 'standing'],
  },
  {
    title: 'Warrior II (Virabhadrasana II)',
    imageUrl: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=800&q=80',
    description: 'A powerful standing pose that strengthens the legs, opens the hips, and builds stamina.',
    durationMin: 5,
    difficulty: 'beginner',
    tags: ['strength', 'legs', 'hips', 'standing'],
  },
  {
    title: "Child's Pose (Balasana)",
    imageUrl: 'https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=800&q=80',
    description: 'A gentle resting pose that stretches the back, hips, and thighs while calming the mind.',
    durationMin: 3,
    difficulty: 'beginner',
    tags: ['rest', 'back', 'hips', 'calming'],
  },
  {
    title: 'Cat-Cow Stretch (Marjaryasana-Bitilasana)',
    imageUrl: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=800&q=80',
    description: 'A gentle spinal warm-up that improves flexibility and relieves back tension.',
    durationMin: 5,
    difficulty: 'beginner',
    tags: ['spine', 'back', 'warm-up', 'flexibility'],
  },
  {
    title: 'Corpse Pose (Savasana)',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
    description: 'Final relaxation pose. Lie still, breathe naturally, and let the body integrate the practice.',
    durationMin: 10,
    difficulty: 'beginner',
    tags: ['rest', 'meditation', 'calming', 'cool-down'],
  },
  {
    title: 'Bridge Pose (Setu Bandhasana)',
    imageUrl: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=800&q=80',
    description: 'A gentle backbend that strengthens the back, glutes, and opens the chest and shoulders.',
    durationMin: 5,
    difficulty: 'intermediate',
    tags: ['back', 'chest', 'strength', 'hips'],
  },
  {
    title: 'Seated Forward Fold (Paschimottanasana)',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
    description: 'A calming seated pose that stretches the entire back body and hamstrings.',
    durationMin: 5,
    difficulty: 'beginner',
    tags: ['stretch', 'hamstrings', 'back', 'calming'],
  },
  {
    title: 'Cobra Pose (Bhujangasana)',
    imageUrl: 'https://images.unsplash.com/photo-1588286840104-8957b019727f?w=800&q=80',
    description: 'A gentle backbend that strengthens the spine and opens the chest and shoulders.',
    durationMin: 3,
    difficulty: 'beginner',
    tags: ['back', 'chest', 'spine', 'strength'],
  },
  {
    title: 'Triangle Pose (Trikonasana)',
    imageUrl: 'https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=800&q=80',
    description: 'A lateral stretch that opens the hips, hamstrings, and side body while building leg strength.',
    durationMin: 5,
    difficulty: 'intermediate',
    tags: ['stretch', 'hips', 'legs', 'balance'],
  },
  {
    title: 'Shoulderstand (Sarvangasana)',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
    description: 'An inversion that stimulates the thyroid, improves circulation, and calms the nervous system.',
    durationMin: 5,
    difficulty: 'advanced',
    tags: ['inversion', 'thyroid', 'circulation', 'calming'],
  },
  {
    title: 'Headstand (Sirsasana)',
    imageUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&q=80',
    description: 'The king of asanas. Builds core strength, improves focus, and increases blood flow to the brain.',
    durationMin: 3,
    difficulty: 'advanced',
    tags: ['inversion', 'core', 'focus', 'strength'],
  },
  {
    title: 'Gentle Morning Flow',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
    description: 'A 20-minute gentle sequence combining Cat-Cow, Downward Dog, Child\'s Pose, and Seated Forward Fold. Perfect for starting the day with awareness.',
    durationMin: 20,
    difficulty: 'beginner',
    tags: ['morning', 'gentle', 'full-body', 'flow'],
  },
  {
    title: 'Evening Wind-Down',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
    description: 'A calming evening sequence with Seated Forward Fold, Legs-Up-The-Wall, and Corpse Pose. Release the day\'s tension.',
    durationMin: 15,
    difficulty: 'beginner',
    tags: ['evening', 'calming', 'rest', 'cool-down'],
  },
];

async function main() {
  console.log('🌿  Seeding yoga master catalog…');

  await prisma.yogaPose.deleteMany();
  console.log('   Cleared existing poses');

  for (const pose of yogaPoses) {
    await prisma.yogaPose.create({ data: pose });
    console.log(`   ✅ ${pose.title}`);
  }

  console.log(`\n✅  Done. ${yogaPoses.length} yoga poses added.`);
}

main()
  .catch((e) => {
    console.error('❌', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
