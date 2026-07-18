/* eslint-disable no-console */
/**
 * Amal Yatri — seed real doctors from Amal Tamara's website.
 *
 * Source: https://test.amaltamara.com/expertise/
 *
 * Run after the main seed:
 *   DATABASE_URL="..." npx ts-node --transpile-only packages/prisma/prisma/seed-doctors.ts
 */

import { PrismaClient, UserRole, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const PASSWORD = 'amalwell2026';

const doctors = [
  {
    email: 'alvin@amaltamara.com',
    firstName: 'Alvin',
    lastName: '',
    qualifications: 'BAMS, MBA (Health & Hospitality)',
    specialties: ['Panchakarma', 'Spa Therapies', 'Wellness Management'],
    bio: 'Dr. Alvin holds a B.A.M.S. degree from Government Ayurveda College, Kannur, and an MBA in Health and Hospitality. With over 17 years of experience in wellness and holistic health, he has trained in Thai Holistic Treatments in Thailand. He was part of the pre-opening teams of Svaastha Spa at Mahindra Holidays & Resorts, Coorg, and Sofitel Hotel, Phuket.',
    yearsOfPractice: 17,
    languages: ['English', 'Malayalam', 'Hindi'],
  },
  {
    email: 'haripriya@amaltamara.com',
    firstName: 'Haripriya',
    lastName: 'S Bonsalay',
    qualifications: 'BAMS, Fellowship in Sports Rehabilitation',
    specialties: ['Panchakarma', 'Pain Management', 'Cosmetology', 'Obesity Management'],
    bio: 'Dr. Haripriya holds a BAMS from SCSVMV, SJS Ayurveda College Chennai and a Fellowship in sports rehabilitation from Apollo Medvarsity. She has completed certificate courses in yoga, naturopathy, and varmalogy. She has over 9 years of experience at Somatheeram Ayurveda Resort, CVN Kalari, and The Leela Raviz, Kovalam.',
    yearsOfPractice: 9,
    languages: ['English', 'Malayalam', 'Tamil'],
  },
  {
    email: 'karthika@amaltamara.com',
    firstName: 'Karthika',
    lastName: 'S',
    qualifications: 'BAMS, MD',
    specialties: ['Panchakarma', 'Ayurvedic Consultations', 'Research'],
    bio: 'Dr. Karthika S holds a BAMS from MVR Ayurveda Medical College, Kerala, and an MD from KVG Ayurveda Medical College. She holds a Smriti Meditation Counsellor certificate and has worked at the National Research Institute of Panchakarma under the Govt. of India. She has over 14 years of experience at ITC Raviz Ashtamudi and Zuri Kumarakom.',
    yearsOfPractice: 14,
    languages: ['English', 'Malayalam', 'Hindi'],
  },
  {
    email: 'devi.krishna@amaltamara.com',
    firstName: 'Devi',
    lastName: 'Krishna',
    qualifications: 'BAMS',
    specialties: ['Ayurvedic Consultations', 'Panchakarma', 'Spa Management'],
    bio: 'Dr. Devi Krishna holds her BAMS from Vidyaratnam Ayurveda College, Thrissur. She began her career at Illom Ayurveda Hospital as a medical officer. With 9 years of experience, she has been associated with Vasundhara Sarovar Premier and Ramada by Wyndham as Spa Manager.',
    yearsOfPractice: 9,
    languages: ['English', 'Malayalam'],
  },
  {
    email: 'atul.vivek@amaltamara.com',
    firstName: 'Atul',
    lastName: 'Vivek',
    qualifications: 'BNYS',
    specialties: ['Therapy Yoga', 'Diet Therapy', 'Hydro Therapy'],
    bio: 'Dr. Atul Vivek is a graduate of Rajiv Gandhi University of Health Science and SDM College of Naturopathy and Yogic Science. He has over 8 years of experience at Pranava Yoga & Naturopathy Centre, Mangalore and Arogyamantra Integrated Healing, Kottayam.',
    yearsOfPractice: 8,
    languages: ['English', 'Malayalam', 'Hindi'],
  },
  {
    email: 'deepesh@amaltamara.com',
    firstName: 'Deepesh',
    lastName: 'NP',
    qualifications: 'BNYS',
    specialties: ['Acupuncture', 'Pulse Diagnosis', 'Yoga Therapy', 'Aquatic Yoga'],
    bio: 'Dr. Deepesh holds his BNYS from SDM College of Naturopathy and Yogic Sciences, Rajiv Gandhi University of Health Sciences. He specializes in acupuncture, pulse diagnosis, herbal medicines, and naturopathic treatments. He is well known for yoga sessions, shiatsu, aquatic yoga, and laughter yoga.',
    yearsOfPractice: 10,
    languages: ['English', 'Malayalam', 'Hindi'],
  },
  {
    email: 'reji.raj@amaltamara.com',
    firstName: 'Reji',
    lastName: 'Raj',
    qualifications: 'BAMS, PG Diploma in Health Administration',
    specialties: ['Panchakarma', 'Wellness Programs', 'Ayurvedic Toxicology', 'Raktamokshana', 'Obesity Management'],
    bio: 'Dr. Reji Raj is the Resort Manager and Senior Ayurveda Physician at Amal Tamara. He holds a BAMS and a PG Diploma in Health Administration from Apollo Hospitals. With over 19 years of experience at Taj Hotels and other world-renowned properties, his expertise spans Panchakarma, wellness programs, Ayurvedic management for cancer, Visha Chikitsa, Raktamokshana, and obesity management.',
    yearsOfPractice: 19,
    languages: ['English', 'Malayalam', 'Hindi', 'Tamil'],
  },
  {
    email: 'ajitha@amaltamara.com',
    firstName: 'Ajitha',
    lastName: 'Sunil Babu',
    qualifications: 'BAMS, Reiki (3rd Degree), Pranic Healing',
    specialties: ['Panchakarma', 'Ayurvedic Ophthalmology', 'Pediatrics', 'Gynecology', 'Reiki'],
    bio: 'Dr. Ajitha Babu is the Chief Medical Officer at Amal Tamara. She holds a BAMS from Rajiv Gandhi University and KVG Ayurveda Medical College. She is trained in Reiki (3rd degree) and Pranic Healing. With over 14 years of experience at Sreedhareeyam Ayurvedic Eye Hospital and Carnoustie Ayurveda & Wellness Resort, she specializes in Panchakarma, Ayurvedic ophthalmology, pediatrics, gynecology, and assistive healing therapies.',
    yearsOfPractice: 14,
    languages: ['English', 'Malayalam', 'Hindi'],
  },
];

async function main() {
  console.log('🌿  Seeding Amal Tamara doctors…');

  const passwordHash = await bcrypt.hash(PASSWORD, 10);

  // Delete old fictional doctors if they exist (Devi Nair, Arjun Menon)
  for (const email of ['devi@amaltamara.com', 'arjun@amaltamara.com']) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      await prisma.user.delete({ where: { email } });
      console.log(`   Removed old doctor: ${email}`);
    }
  }

  // Create all 8 real doctors
  for (const doc of doctors) {
    // Check if already exists
    const existing = await prisma.user.findUnique({ where: { email: doc.email } });
    if (existing) {
      console.log(`   Skipped (already exists): ${doc.email}`);
      continue;
    }

    await prisma.user.create({
      data: {
        email: doc.email,
        passwordHash,
        role: UserRole.DOCTOR,
        status: UserStatus.ACTIVE,
        emailVerified: true,
        doctorProfile: {
          create: {
            firstName: doc.firstName,
            lastName: doc.lastName,
            qualifications: doc.qualifications,
            specialties: doc.specialties,
            bio: doc.bio,
            yearsOfPractice: doc.yearsOfPractice,
            languages: doc.languages,
            availableForChat: true,
          },
        },
      },
    });
    console.log(`   Created: ${doc.firstName} ${doc.lastName} (${doc.email})`);
  }

  // Assign existing patients to the new doctors
  const patients = await prisma.user.findMany({
    where: { role: UserRole.YATRI },
    include: { yatriProfile: true },
  });

  const allDoctors = await prisma.user.findMany({
    where: { role: UserRole.DOCTOR },
    include: { doctorProfile: true },
  });

  // Assign each patient to at least 2 doctors for realistic data
  for (let i = 0; i < patients.length; i++) {
    const patient = patients[i];
    // Assign to doctor at index i (modulo) and i+1 (modulo)
    const doc1 = allDoctors[i % allDoctors.length];
    const doc2 = allDoctors[(i + 1) % allDoctors.length];

    if (doc1?.doctorProfile) {
      const existing = await prisma.doctorPatientAssignment.findUnique({
        where: { doctorId_patientUserId: { doctorId: doc1.doctorProfile.id, patientUserId: patient.id } },
      });
      if (!existing) {
        await prisma.doctorPatientAssignment.create({
          data: { doctorId: doc1.doctorProfile.id, patientUserId: patient.id, notes: 'Auto-assigned from migration' },
        });
        console.log(`   Assigned ${patient.email} → ${doc1.firstName || ''} ${doc1.lastName || ''}`);
      }
    }

    if (doc2?.doctorProfile && doc1?.doctorProfile?.id !== doc2?.doctorProfile?.id) {
      const existing = await prisma.doctorPatientAssignment.findUnique({
        where: { doctorId_patientUserId: { doctorId: doc2.doctorProfile.id, patientUserId: patient.id } },
      });
      if (!existing) {
        await prisma.doctorPatientAssignment.create({
          data: { doctorId: doc2.doctorProfile.id, patientUserId: patient.id, notes: 'Auto-assigned from migration' },
        });
        console.log(`   Assigned ${patient.email} → ${doc2.firstName || ''} ${doc2.lastName || ''}`);
      }
    }
  }

  console.log('\n✅  Seeding complete.');
  console.log(`   ${doctors.length} real doctors from Amal Tamara website`);
  console.log(`   Patients assigned to multiple doctors`);
}

main()
  .catch((e) => {
    console.error('❌', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
