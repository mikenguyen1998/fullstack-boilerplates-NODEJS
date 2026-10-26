import type { NextRequest } from 'next/server';

// Expose only these auth operations, not an arbitrary backend URL.
async function forward(request: NextRequest, action: string) {
  const allowed = request.method === 'GET' ? ['session'] : ['login', 'logout'];
  if (!allowed.includes(action)) return new Response(null, { status: 404 });
  const headers = new Headers({ 'Content-Type': 'application/json' });
  for (const name of ['origin', 'x-csrf-protection']) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }
  const token = request.cookies.get('app_session')?.value;
  if (token) headers.set('Cookie', `app_session=${encodeURIComponent(token)}`);
  try {
    const upstream = await fetch(
      `${process.env.AUTH_BACKEND_URL ?? 'http://127.0.0.1:8000'}/api/auth/${action}`,
      {
        method: request.method,
        headers,
        body: request.method === 'POST' ? await request.text() : undefined,
        cache: 'no-store',
        redirect: 'error',
        signal: AbortSignal.timeout(15_000),
      },
    );
    const responseHeaders = new Headers({ 'Cache-Control': 'no-store' });
    const contentType = upstream.headers.get('content-type');
    if (contentType) responseHeaders.set('Content-Type', contentType);
    for (const cookie of upstream.headers.getSetCookie())
      responseHeaders.append('Set-Cookie', cookie);
    return new Response(upstream.body, { status: upstream.status, headers: responseHeaders });
  } catch {
    return Response.json(
      { detail: 'Authentication service unavailable' },
      {
        status: 502,
        headers: { 'Cache-Control': 'no-store' },
      },
    );
  }
}

type Context = { params: Promise<{ action: string }> };
export async function GET(request: NextRequest, context: Context) {
  return forward(request, (await context.params).action);
}
export async function POST(request: NextRequest, context: Context) {
  return forward(request, (await context.params).action);
}
