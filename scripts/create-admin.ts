/**
 * Create or reset admin accounts for the NITAI Skill Academy admin panel.
 *
 * Idempotent: creates the user if missing, or resets password/role if it exists.
 * Role is always set to ADMIN, so the account can use /admin.
 *
 * IMPORTANT: pass credentials via CLI args (NEVER hardcode passwords here — repo is public).
 *
 * Usage:
 *   npx tsx scripts/create-admin.ts "<Name>" <email> "<password>"
 *
 * Example:
 *   npx tsx scripts/create-admin.ts "Tech Admin" techadmin@nitaigroup.com "@Skillacademy2026"
 *
 * Add the email to ADMIN_EMAILS (site env on Netlify) so the /admin UI + APIs accept it.
 */

import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function fail(msg: string): never {
  console.error(`✗ ${msg}`)
  console.error('Usage: npx tsx scripts/create-admin.ts "<Name>" <email> "<password>"')
  process.exit(1)
}

async function main() {
  const [name, email, password] = process.argv.slice(2)

  if (!name || !email || !password) {
    fail('Missing arguments: need name, email, and password')
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fail(`Invalid email: ${email}`)
  }
  if (password.length < 8) {
    fail('Password must be at least 8 characters')
  }

  const normalizedEmail = email.toLowerCase()
  const hashed = await bcrypt.hash(password, 12)

  const user = await prisma.user.upsert({
    where: { email: normalizedEmail },
    update: { password: hashed, role: 'ADMIN', provider: 'LOCAL' },
    create: {
      name,
      email: normalizedEmail,
      password: hashed,
      role: 'ADMIN',
      provider: 'LOCAL',
      credits: { create: { balance: 0, totalEarned: 0 } },
    },
  })

  // Safety net in case the account pre-existed without a credits wallet.
  await prisma.userCredit.upsert({
    where: { userId: user.id },
    update: {},
    create: { userId: user.id, balance: 0, totalEarned: 0 },
  })

  console.log('✓ Admin account ready:')
  console.log(`  name:  ${user.name}`)
  console.log(`  email: ${user.email}`)
  console.log(`  role:  ${user.role} (provider: ${user.provider})`)
  console.log('  → let them log in at /admin with the password passed on the CLI')
}

main()
  .catch(err => {
    console.error('✗ Failed:', err instanceof Error ? err.message : err)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
