import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const session = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const isMaintenanceMode = process.env.MAINTENANCE_MODE === 'true'
  const isMaintenancePage = pathname === '/maintenance'
  const isAdminRoute = pathname.startsWith('/admin')
  const isLoginPage = pathname === '/admin/login'

  // 🔒 Proteção de admin
  if (isAdminRoute && !isLoginPage && !session) {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }

  // 🚧 Bloqueio com manutenção ativada
  if (
    isMaintenanceMode &&
    !isMaintenancePage &&
    !isAdminRoute &&
    !pathname.startsWith('/api')
  ) {
    return NextResponse.redirect(new URL('/maintenance', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|.*\\..*).*)'],
}
