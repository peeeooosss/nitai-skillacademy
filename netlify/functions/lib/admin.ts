import { verifyToken, extractToken } from './auth'
import type { JwtPayload } from './auth'

export function requireAdmin(authorization: string | undefined): JwtPayload | null {
  const token = extractToken(authorization)
  if (!token) return null
  const payload = verifyToken(token)
  if (!payload || payload.role !== 'ADMIN') return null
  return payload
}