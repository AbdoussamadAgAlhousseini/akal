import 'server-only';

import {createHmac, timingSafeEqual} from 'node:crypto';
import {cookies} from 'next/headers';

const COOKIE = 'akal_admin';

/**
 * Stateless session token = HMAC(fixed, ADMIN_PASSWORD). It cannot be forged
 * without the password, and no session store is needed. Returns null when no
 * password is configured (admin is then locked).
 */
function expectedToken(): string | null {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return null;
  return createHmac('sha256', pw).update('akal-admin-v1').digest('hex');
}

export function checkPassword(input: string): boolean {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw || !input) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(pw);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Set the admin session cookie (call only from a Server Action / Route). */
export function setSession() {
  const token = expectedToken();
  if (!token) return;
  cookies().set(COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7
  });
}

export function clearSession() {
  cookies().delete(COOKIE);
}

export function isAuthed(): boolean {
  const token = expectedToken();
  if (!token) return false;
  return cookies().get(COOKIE)?.value === token;
}
