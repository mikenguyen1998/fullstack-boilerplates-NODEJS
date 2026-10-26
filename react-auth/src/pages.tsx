import { useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router';
import { authRequest, type User } from './auth';

export function Login() {
  const navigate = useNavigate();
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
            const response = await authRequest('login', {
              email: data.get('email'),
              password: data.get('password'),
            });
            if (response.status === 401) setError('Invalid email or password.');
            else await navigate('/dashboard', { replace: true });
          } catch (error) {
            setError(error instanceof Error ? error.message : 'Could not log in.');
          } finally {
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

export function Dashboard() {
  const user = useLoaderData() as User;
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  return (
    <>
      <h1>Dashboard</h1>
      <p>Signed in as {user.email}.</p>
      {error && <p role="alert">{error}</p>}
      <button
        className="button"
        disabled={pending}
        onClick={async () => {
          setPending(true);
          setError('');
          try {
            await authRequest('logout', {});
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
