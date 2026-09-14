import type { NetlifyHandler } from './lib/types'
import prisma from './lib/prisma'
import { verifyToken, extractToken } from './lib/auth'
import { successResponse, errorResponse, getCorsHeaders } from './lib/cors'

export const handler: NetlifyHandler = async (event) => {
  const origin = event.headers.origin

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: getCorsHeaders(origin), body: '' }
  }

  if (event.httpMethod !== 'GET') {
    return errorResponse('Method not allowed', 405, origin)
  }

  try {
    const token = extractToken(event.headers.authorization)
    if (!token) {
      return errorResponse('No token provided', 401, origin)
    }

    const payload = verifyToken(token)
    if (!payload) {
      return errorResponse('Invalid or expired token', 401, origin)
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: { credits: true },
    })

    if (!user) {
      return errorResponse('User not found', 404, origin)
    }

    return successResponse({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        credits: user.credits?.balance || 0,
        totalEarned: user.credits?.totalEarned || 0,
        createdAt: user.createdAt,
      },
    }, 200, origin)
  } catch (error) {
    console.error('Auth-me error:', error)
    return errorResponse('Internal server error', 500, origin)
  }
}