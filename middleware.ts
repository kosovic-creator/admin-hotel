import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const { pathname } = new URL(request.url);
  // Proveri da li ruta počinje sa /korisnik
  if (pathname.startsWith('/korisnici')) {
    // Pročitaj token iz cookie-ja
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    // Ako nema tokena, preusmeri na login
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    // Ako rola nije ADMIN, zabrani pristup
    if (token.role !== 'ADMIN') {
      return new NextResponse('Pristup stranici /korisnici je zabranjen.', { status: 403 });
    }
  }
  return NextResponse.next();
}
export const config = {
  matcher: [ '/korisnici', '/korisnici/:path*'],
}
