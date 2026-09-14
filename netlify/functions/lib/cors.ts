const ALLOWED_ORIGINS = [
  process.env.FRONTEND_URL || 'https://nitai-skillacademy.netlify.app',
  'https://nitai-skillacademy.netlify.app',
  'http://localhost:3000',
  'http://localhost:8888',
]

// Netlify preview/branch deploys get random `*-<site>.netlify.app` subdomains.
function isAllowedOrigin(origin: string | undefined): boolean {
  if (!origin) return false
  if (ALLOWED_ORIGINS.includes(origin)) return true
  return /^https:\/\/([a-z0-9-]+\.)*nitai-skillacademy\.netlify\.app$/.test(origin)
}

export function getCorsHeaders(origin: string | undefined): Record<string, string> {
  const allowedOrigin = isAllowedOrigin(origin) ? origin : ALLOWED_ORIGINS[0]

  return {
    'Access-Control-Allow-Origin': allowedOrigin || '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400',
  }
}

export function successResponse(data: unknown, statusCode = 200, origin?: string) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      ...getCorsHeaders(origin),
    },
    body: JSON.stringify(data),
  }
}

export function errorResponse(message: string, statusCode = 400, origin?: string) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      ...getCorsHeaders(origin),
    },
    body: JSON.stringify({ error: message }),
  }
}