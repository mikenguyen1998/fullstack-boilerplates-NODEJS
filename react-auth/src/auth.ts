export interface User {
  email: string;
}

export async function authRequest(path: string, body?: object): Promise<Response> {
  const response = await fetch(`/api/auth/${path}`, {
    method: body ? 'POST' : 'GET',
    credentials: 'same-origin',
    cache: 'no-store',
    headers: body ? { 'Content-Type': 'application/json', 'X-CSRF-Protection': '1' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok && response.status !== 401) {
    throw new Error(
      response.status === 429
        ? 'Too many attempts. Try again in a minute.'
        : 'Authentication service unavailable. Please try again.',
    );
  }
  return response;
}
