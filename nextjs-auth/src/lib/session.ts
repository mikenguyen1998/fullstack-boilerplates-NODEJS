import 'server-only';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function requireSession(): Promise<{ email: string }> {
  const token = (await cookies()).get('app_session')?.value;
  if (!token) redirect('/login');
  const response = await fetch(
    `${process.env.AUTH_BACKEND_URL ?? 'http://127.0.0.1:8000'}/api/auth/session`,
    {
      headers: { Cookie: `app_session=${encodeURIComponent(token)}` },
      cache: 'no-store',
      signal: AbortSignal.timeout(15_000),
    },
  );
  if (response.status === 401) redirect('/login');
  if (!response.ok) throw new Error('Authentication service unavailable');
  return response.json();
}
