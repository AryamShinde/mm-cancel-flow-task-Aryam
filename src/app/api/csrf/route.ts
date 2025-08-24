import { NextResponse } from 'next/server';
import { generateCsrfToken } from '@/lib/security';

// GET /api/csrf -> sets a httpOnly CSRF cookie and returns token for client fetch usage
export async function GET() {
  const token = generateCsrfToken();
  const res = NextResponse.json({ csrfToken: token });
  // Set cookie attributes for security
  res.cookies.set('csrf_token', token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 // 1 hour
  });
  return res;
}
