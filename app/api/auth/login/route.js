import { createSessionToken, SESSION_COOKIE_NAME } from '../../../../lib/auth';

export async function POST(request) {
  const body = await request.json();
  const password = body?.password || '';

  if (password !== process.env.DASHBOARD_PASSWORD) {
    return Response.json({ error: 'Incorrect password' }, { status: 401 });
  }

  const token = await createSessionToken();
  const response = Response.json({ ok: true });
  response.headers.set(
    'Set-Cookie',
    `${SESSION_COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000${
      process.env.NODE_ENV === 'production' ? '; Secure' : ''
    }`
  );
  return response;
}
