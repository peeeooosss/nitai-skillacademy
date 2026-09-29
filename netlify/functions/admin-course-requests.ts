import type { NetlifyHandler } from './lib/types'
import prisma from './lib/prisma'
import { requireAdmin } from './lib/admin'
import { successResponse, errorResponse, getCorsHeaders } from './lib/cors'

export const handler: NetlifyHandler = async (event) => {
  const origin = event.headers.origin

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: getCorsHeaders(origin), body: '' }
  }

  const admin = requireAdmin(event.headers.authorization)
  if (!admin) {
    return errorResponse('Unauthorized', 401, origin)
  }

  const params = event.queryStringParameters || {}

  // ── GET /api/admin/course-requests?status=&courseSlug= → list requests ──
  if (event.httpMethod === 'GET') {
    try {
      const status = params.status
      const courseSlug = params.courseSlug

      const where: Record<string, unknown> = {}
      if (status && status !== 'ALL') where.status = status
      if (courseSlug) {
        const course = await prisma.course.findUnique({ where: { slug: courseSlug } })
        if (course) where.courseId = course.id
      }

      const requests = await prisma.courseRequest.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true } },
          course: { select: { id: true, slug: true, title: true, shortTitle: true, icon: true, accentColor: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 200,
      })

      const [courses, counts] = await Promise.all([
        prisma.course.findMany({ where: { isActive: true }, orderBy: { position: 'asc' }, select: { slug: true, title: true, shortTitle: true } }),
        prisma.courseRequest.groupBy({ by: ['status'], _count: { _all: true } }),
      ])

      return successResponse({
        requests: requests.map(r => ({
          id: r.id,
          userId: r.userId,
          user: r.user,
          courseId: r.courseId,
          course: r.course,
          mobile: r.mobile,
          email: r.email,
          message: r.message,
          status: r.status,
          adminNotes: r.adminNotes,
          reviewedAt: r.reviewedAt?.toISOString() ?? null,
          reviewedBy: r.reviewedBy,
          createdAt: r.createdAt.toISOString(),
          updatedAt: r.updatedAt.toISOString(),
        })),
        courses,
        counts: counts.reduce((acc, c) => ({ ...acc, [c.status]: c._count._all }), {} as Record<string, number>),
      }, 200, origin)
    } catch (error) {
      console.error('List course requests error:', error)
      return errorResponse('Internal server error', 500, origin)
    }
  }

  // ── PUT /api/admin/course-requests/{id} { status, adminNotes } ──
  if (event.httpMethod === 'PUT') {
    try {
      const body = JSON.parse(event.body || '{}')
      const { status, adminNotes } = body
      const pathSegments = (event.headers['x-netlify-original-path'] || event.path || '').split('/').filter(Boolean)
      const id = params.id || pathSegments[pathSegments.length - 1]

      if (!id || id === 'admin-course-requests') {
        return errorResponse('Request id required', 400, origin)
      }

      if (!['PENDING', 'APPROVED', 'REJECTED', 'WAITLISTED'].includes(status)) {
        return errorResponse('Invalid status', 400, origin)
      }

      const existing = await prisma.courseRequest.findUnique({ where: { id } })
      if (!existing) {
        return errorResponse('Request not found', 404, origin)
      }

      const updated = await prisma.courseRequest.update({
        where: { id },
        data: {
          status,
          adminNotes: adminNotes?.trim() || null,
          reviewedAt: new Date(),
          reviewedBy: admin.userId,
        },
        include: {
          user: { select: { id: true, name: true, email: true } },
          course: { select: { id: true, slug: true, title: true, shortTitle: true } },
        },
      })

      // Auto-enroll when approved.
      if (status === 'APPROVED') {
        await prisma.userCourseEnrollment.upsert({
          where: { userId_courseId: { userId: existing.userId, courseId: existing.courseId } },
          update: {},
          create: { userId: existing.userId, courseId: existing.courseId },
        })
      }

      return successResponse({
        message: status === 'APPROVED' ? 'Request approved and student enrolled.' : `Request marked ${status.toLowerCase()}.`,
        request: {
          id: updated.id,
          userId: updated.userId,
          user: updated.user,
          courseId: updated.courseId,
          course: updated.course,
          mobile: updated.mobile,
          email: updated.email,
          status: updated.status,
          adminNotes: updated.adminNotes,
          reviewedAt: updated.reviewedAt?.toISOString() ?? null,
          reviewedBy: updated.reviewedBy,
        },
      }, 200, origin)
    } catch (error) {
      console.error('Review course request error:', error)
      return errorResponse('Internal server error', 500, origin)
    }
  }

  return errorResponse('Method not allowed', 405, origin)
}