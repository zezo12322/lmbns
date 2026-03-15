import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  const demoPasswordHash = await hash('password123', 12)

  // 1. Create default branch
  const branch = await prisma.branch.upsert({
    where: { id: 'branch-bns-01' },
    update: {},
    create: {
      id: 'branch-bns-01',
      nameArabic: 'فرع بني سويف',
      nameEnglish: 'Beni Suef Branch',
      settings: {
        address: 'شارع كورنيش النيل، بني سويف',
        phones: ['01012345678', '01112345678'],
        emails: ['info@bns.lifemakers.org'],
        donationChannels: ['Bank Transfer', 'Vodafone Cash', 'InstaPay'],
      },
    },
  })
  console.log(`Created Branch: ${branch.nameArabic}`)

  // 2. Create demo user (hashed "password" for all)
  // Since we are using Auth.js with credentials, we don't have a specific hash here yet,
  // but let's assume standard bcrypt/salt if we implemented it. For now just clear text to avoid bcrypt dependency.
  // Actually, we need to add bcryptjs or just simple string matching for the demo.
  const admin = await prisma.user.upsert({
    where: { email: 'admin@bns.life' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@bns.life',
      hashedPassword: demoPasswordHash,
      role: 'SUPER_ADMIN',
      branchId: branch.id,
    },
  })
  console.log(`Created Admin User: ${admin.email}`)

  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
