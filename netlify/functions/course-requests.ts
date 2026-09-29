import type { NetlifyHandler } from './lib/types'
import prisma from './lib/prisma'
import { verifyToken, extractToken } from './lib/auth'
import { successResponse, errorResponse, getCorsHeaders } from './lib/cors'

export const handler: NetlifyHandler = async (event) => {
  const origin = event.headers.origin

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: getCorsHeaders(origin), body: '' }
  }

  const token = extractToken(event.headers.authorization)
  if (!token) {
    return errorResponse('Unauthorized', 401, origin)
  }
  const payload = verifyToken(token)
  if (!payload) {
    return errorResponse('Invalid token', 401, origin)
  }

  // ── GET /api/course-requests/my → my requests with status ──
  if (event.httpMethod === 'GET') {
    try {
      const requests = await prisma.courseRequest.findMany({
        where: { userId: payload.userId },
        include: { course: { select: { id: true, slug: true, title: true, shortTitle: true, icon: true, accentColor: true } } },
        orderBy: { createdAt: 'desc' },
      })

      return successResponse({
        requests: requests.map(r => ({
          id: r.id,
          courseId: r.courseId,
          mobile: r.mobile,
          email: r.email,
          message: r.message,
          status: r.status,
          adminNotes: r.adminNotes,
          createdAt: r.createdAt.toISOString(),
          course: r.course,
        })),
      }, 200, origin)
    } catch (error) {
      console.error('Get my course requests error:', error)
      return errorResponse('Internal server error', 500, origin)
    }
  }

  // ── POST /api/course-requests { courseId, mobile, email, message } ──
  if (event.httpMethod === 'POST') {
    try {
      const body = JSON.parse(event.body || '{}')
      const { courseId, mobile, email, message } = body

      if (!courseId) {
        return errorResponse('courseId is required', 400, origin)
      }
      if (!mobile || mobile.trim().length < 6) {
        return errorResponse('A valid mobile number is required', 400, origin)
      }
      if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        return errorResponse('A valid email is required', 400, origin)
      }

      const course = await prisma.course.findUnique({ where: { id: courseId } })
      if (!course || !course.isActive) {
        return errorResponse('Course not found', 404, origin)
      }

      // Already enrolled? Nothing to request.
      const enrollment = await prisma.userCourseEnrollment.findUnique({
        where: { userId_courseId: { userId: payload.userId, courseId } },
      })
      if (enrollment) {
        return successResponse({ message: 'Already enrolled', status: 'ENROLLED', id: enrollment.id }, 200, origin)
      }

      const existing = await prisma.courseRequest.findUnique({
        where: { userId_courseId: { userId: payload.userId, courseId } },
      })
      if (existing) {
        return successResponse({
          message: `Request already submitted (${existing.status.toLowerCase()})`,
          status: existing.status,
          id: existing.id,
        }, 200, origin)
      }

      const request = await prisma.courseRequest.create({
        data: {
          userId: payload.userId,
          courseId,
          mobile: mobile.trim(),
          email: email.trim(),
          message: message?.trim() || null,
        },
      })

      return successResponse({
        message: 'Request submitted. Our team will review and contact you soon.',
        status: request.status,
        id: request.id,
      }, 201, origin)
    } catch (error) {
      console.error('Create course request error:', error)
      return errorResponse('Internal server error', 500, origin)
    }
  }

  return errorResponse('Method not allowed', 405, origin)
}