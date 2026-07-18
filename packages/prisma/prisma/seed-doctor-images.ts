/* eslint-disable no-console */
/**
 * Update doctor profiles with images from Amal Tamara website.
 * Image URLs sourced from https://test.amaltamara.com/expertise/
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const doctorImages: Record<string, string> = {
  'alvin@amaltamara.com': 'https://test.amaltamara.com/wp-content/uploads/2025/09/IMG_8237-scaled.jpg',
  'haripriya@amaltamara.com': 'https://test.amaltamara.com/wp-content/uploads/2021/11/Amal_Tamara_Expertice_Doctors4.jpg',
  'karthika@amaltamara.com': 'https://test.amaltamara.com/wp-content/uploads/2024/07/2I4A1168-scaled.jpg',
  'devi.krishna@amaltamara.com': 'https://test.amaltamara.com/wp-content/uploads/2024/07/2I4A1214-scaled.jpg',
  'atul.vivek@amaltamara.com': 'https://test.amaltamara.com/wp-content/uploads/2021/11/Amal_Tamara_Expertice_Doctors5.jpg',
  'deepesh@amaltamara.com': 'https://test.amaltamara.com/wp-content/uploads/2024/07/2I4A1258-scaled.jpg',
  'reji.raj@amaltamara.com': 'https://test.amaltamara.com/wp-content/uploads/2021/11/Amal_Tamara_Expertice_Doctors1.jpg',
  'ajitha@amaltamara.com': 'https://test.amaltamara.com/wp-content/uploads/2021/11/Amal_Tamara_Expertice_Doctors3.jpg',
};

async function main() {
  console.log('🌿  Updating doctor profile images…');

  for (const [email, imageUrl] of Object.entries(doctorImages)) {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { doctorProfile: true },
    });

    if (!user) {
      console.log(`   ⚠️  User not found: ${email}`);
      continue;
    }

    if (!user.doctorProfile) {
      console.log(`   ⚠️  No doctor profile for: ${email}`);
      continue;
    }

    await prisma.doctorProfile.update({
      where: { id: user.doctorProfile.id },
      data: { avatarUrl: imageUrl },
    });
    console.log(`   ✅ ${email} → avatar updated`);
  }

  console.log('\n✅  All doctor images updated.');
}

main()
  .catch((e) => {
    console.error('❌', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
