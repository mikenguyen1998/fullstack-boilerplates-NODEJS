'use client';

import { useState } from 'react';

export function Logout() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  return (
    <>
      {error && <p role="alert">{error}</p>}
      <button
        className="button"
        disabled={pending}
        onClick={async () => {
          setPending(true);
          setError('');
          try {
            const response = await fetch('/api/auth/logout', {
              method: 'POST',
              headers: { 'X-CSRF-Protection': '1' },
              signal: AbortSignal.timeout(15_000),
            });
            if (!response.ok) throw new Error('Logout failed');
            window.location.replace('/login');
          } catch {
            setError('Could not log out. Please try again.');
            setPending(false);
          }
        }}
      >
        {pending ? 'Logging out…' : 'Log out'}
      </button>
    </>
  );
}
