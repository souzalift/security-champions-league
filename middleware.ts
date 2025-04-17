import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const session = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const isAdminRoute = pathname.startsWith('/admin')
  const isLoginPage = pathname.startsWith('/admin/login')

  // Evitar proteger a própria página de login
  if (isAdminRoute && !isLoginPage && !session) {
    const loginUrl = new URL('/admin/login', req.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'], // Protege tudo em /admin exceto login
}
