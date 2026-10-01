import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`${name} environment variable is required`)
  }
  return value
}

const JWT_SECRET = requireEnv('JWT_SECRET')
const JWT_EXPIRY = '7d'

export interface JwtPayload {
  userId: string
  email: string
  role: string
}

export function generateToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY })
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload
  } catch {
    return null
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function extractToken(authorization: string | undefined): string | null {
  if (!authorization) return null
  const parts = authorization.split(' ')
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null
  return parts[1]
}

export function getAdminEmails(): string[] {
  const emails = process.env.ADMIN_EMAILS || ''
  return emails.split(',').map(e => e.trim().toLowerCase()).filter(Boolean)
}