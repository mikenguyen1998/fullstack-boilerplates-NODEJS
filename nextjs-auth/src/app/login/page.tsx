'use client';

import { useState } from 'react';

export default function Login() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  return (
    <>
      <h1>Log in</h1>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          setPending(true);
          setError('');
          try {
            const response = await fetch('/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'X-CSRF-Protection': '1' },
              body: JSON.stringify({ email: data.get('email'), password: data.get('password') }),
              signal: AbortSignal.timeout(15_000),
            });
            if (!response.ok) {
              setError(
                response.status === 401
                  ? 'Invalid email or password.'
                  : response.status === 429
                    ? 'Too many attempts. Try again in a minute.'
                    : 'Authentication service unavailable. Please try again.',
              );
              setPending(false);
              return;
            }
            window.location.replace('/dashboard');
          } catch {
            setError('Authentication service unavailable. Please try again.');
            setPending(false);
          }
        }}
      >
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          maxLength={254}
        />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          maxLength={1024}
        />
        {error && <p role="alert">{error}</p>}
        <button className="button" disabled={pending}>
          {pending ? 'Logging in…' : 'Log in'}
        </button>
      </form>
    </>
  );
}
