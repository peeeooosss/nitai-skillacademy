import type { NetlifyHandler } from './lib/types'
import prisma from './lib/prisma'
import { successResponse, errorResponse, getCorsHeaders } from './lib/cors'

export const handler: NetlifyHandler = async (event) => {
  const origin = event.headers.origin

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: getCorsHeaders(origin), body: '' }
  }

  const params = event.queryStringParameters || {}
  const slug = params.slug

  // ── GET /api/public/courses → public course catalog (no auth) ──
  if (event.httpMethod === 'GET' && !slug) {
    try {
      const courses = await prisma.course.findMany({
        where: { isActive: true },
        orderBy: { position: 'asc' },
        select: {
          id: true,
          slug: true,
          index: true,
          title: true,
          shortTitle: true,
          tagline: true,
          description: true,
          trackName: true,
          audience: true,
          category: true,
          outcomes: true,
          duration: true,
          icon: true,
          accentColor: true,
          moduleCount: true,
          totalXp: true,
          isOpenEnrollment: true,
          position: true,
        },
      })

      return successResponse({ courses }, 200, origin)
    } catch (error) {
      console.error('Public courses error:', error)
      return errorResponse('Internal server error', 500, origin)
    }
  }

  // ── GET /api/public/courses?slug=xxx → public course detail (no auth) ──
  if (event.httpMethod === 'GET' && slug) {
    try {
      const course = await prisma.course.findUnique({
        where: { slug },
        include: { modules: { orderBy: { missionNumber: 'asc' } } },
      })
      if (!course || !course.isActive) {
        return errorResponse('Course not found', 404, origin)
      }

      const missions = course.modules
        .filter(m => m.missionNumber != null)
        .map(m => {
          const rawSubmodules = ((m.submodules as { index: number; title: string }[] | null) || [])
            .slice()
            .sort((a, b) => a.index - b.index)
          return {
            id: m.id,
            missionNumber: m.missionNumber as number,
            title: m.title,
            description: m.description,
            sessionType: m.sessionType,
            creditsReward: m.creditsReward,
            submodules: rawSubmodules.map(s => ({ index: s.index, title: s.title })),
          }
        })

      return successResponse({
        course: {
          id: course.id,
          slug: course.slug,
          index: course.index,
          title: course.title,
          shortTitle: course.shortTitle,
          tagline: course.tagline,
          description: course.description,
          trackName: course.trackName,
          audience: course.audience,
          category: course.category,
          outcomes: course.outcomes,
          duration: course.duration,
          icon: course.icon,
          accentColor: course.accentColor,
          moduleCount: course.moduleCount,
          totalXp: course.totalXp,
          isOpenEnrollment: course.isOpenEnrollment,
          position: course.position,
        },
        missions,
      }, 200, origin)
    } catch (error) {
      console.error('Public course detail error:', error)
      return errorResponse('Internal server error', 500, origin)
    }
  }

  return errorResponse('Method not allowed', 405, origin)
}