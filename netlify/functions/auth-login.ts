import type { NetlifyHandler } from './lib/types'
import prisma from './lib/prisma'
import { comparePassword, generateToken } from './lib/auth'
import { successResponse, errorResponse, getCorsHeaders } from './lib/cors'

export const handler: NetlifyHandler = async (event) => {
  const origin = event.headers.origin

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: getCorsHeaders(origin), body: '' }
  }

  if (event.httpMethod !== 'POST') {
    return errorResponse('Method not allowed', 405, origin)
  }

  try {
    const body = JSON.parse(event.body || '{}')
    const { email, password } = body

    if (!email || !password) {
      return errorResponse('Email and password are required', 400, origin)
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { credits: true },
    })

    if (!user) {
      return errorResponse('Invalid email or password', 401, origin)
    }

    if (!user.password) {
      return errorResponse('This account uses Google sign-in. Please use Google to log in.', 401, origin)
    }

    const isValidPassword = await comparePassword(password, user.password)
    if (!isValidPassword) {
      return errorResponse('Invalid email or password', 401, origin)
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    return successResponse({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        credits: user.credits?.balance || 0,
      },
    }, 200, origin)
  } catch (error) {
    console.error('Login error:', error)
    return errorResponse('Internal server error', 500, origin)
  }
}